-- =============================
-- SCHEMA: techManager (gestao_ti)
-- =============================
CREATE SCHEMA IF NOT EXISTS techManager;
SET search_path TO techManager, public;

-- ========================================
-- Tabelas de domínio (valores padronizados)
-- ========================================

CREATE TABLE tipo_equipamento (
  id SERIAL PRIMARY KEY,
  nome TEXT UNIQUE NOT NULL  -- Ex: notebook, mouse, teclado, fone, monitor, outro
);

CREATE TABLE tipo_uso (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL CHECK (codigo IN ('emprestimo', 'cedido')),
  descricao TEXT NOT NULL
);

CREATE TABLE categoria_uso (
  id SERIAL PRIMARY KEY,
  codigo CHAR(1) UNIQUE NOT NULL CHECK (codigo IN ('A','B','C','D','E')),
  descricao TEXT NOT NULL
  -- A - Dev especialista / notebook robusto
  -- B - Dev sênior / notebook rápido
  -- C - Dev pleno / notebook médio
  -- D - Dev júnior / notebook mínimo
  -- E - Periféricos de uso geral
);

CREATE TABLE cargo (
  id SERIAL PRIMARY KEY,
  nome TEXT UNIQUE NOT NULL
);

CREATE TABLE status_equipamento (
  id SERIAL PRIMARY KEY,
  nome TEXT UNIQUE NOT NULL   -- Em estoque, Em uso, Em manutenção, Descartado
);

-- =========================
-- Tabelas principais
-- =========================

CREATE TABLE funcionario (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  numero_registro TEXT UNIQUE NOT NULL,
  cargo_id INT REFERENCES cargo(id),
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  data_criacao TIMESTAMP DEFAULT now()
);

CREATE TABLE modelo_equipamento (
  id SERIAL PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  tipo_equipamento_id INT NOT NULL REFERENCES tipo_equipamento(id),
  UNIQUE (marca, modelo)
);

CREATE TABLE equipamento (
  id SERIAL PRIMARY KEY,
  numero_serie TEXT UNIQUE NOT NULL,
  modelo_equipamento_id INT REFERENCES modelo_equipamento(id),
  categoria_id INT REFERENCES categoria_uso(id),
  data_compra DATE,
  data_fim_garantia DATE,
  preco_compra NUMERIC(12,2),
  observacoes TEXT,
  data_criacao TIMESTAMP DEFAULT now()
);

CREATE TABLE historico_status (
  id SERIAL PRIMARY KEY,
  equipamento_id INT NOT NULL REFERENCES equipamento(id),
  status_id INT NOT NULL REFERENCES status_equipamento(id),
  data_alteracao TIMESTAMP DEFAULT now(),
  observacoes TEXT
);

CREATE TABLE uso_equipamento (
  id SERIAL PRIMARY KEY,
  funcionario_id INT NOT NULL REFERENCES funcionario(id),
  equipamento_id INT NOT NULL REFERENCES equipamento(id),
  tipo_uso_id INT NOT NULL REFERENCES tipo_uso(id), -- emprestimo/cedido
  data_retirada DATE NOT NULL,
  data_devolucao DATE,
  data_limite DATE,   -- preenchido por gatilho p/ 'emprestimo'
  observacoes TEXT,
  CHECK (data_devolucao IS NULL OR data_devolucao >= data_retirada)
);

-- ===========================================
-- Índices e Regras
-- ===========================================

-- No máximo 1 uso ATIVO por equipamento (devolução NULL)
CREATE UNIQUE INDEX unq_equipamento_ativo
  ON uso_equipamento (equipamento_id)
  WHERE data_devolucao IS NULL;

CREATE INDEX ix_uso_funcionario ON uso_equipamento (funcionario_id, data_devolucao);
CREATE INDEX ix_uso_equipamento ON uso_equipamento (equipamento_id, data_devolucao);

-- ===========================================
-- Gatilhos (Triggers)
-- ===========================================

-- Regra dos 7 dias para 'emprestimo': data_limite = data_retirada + 7 dias
CREATE OR REPLACE FUNCTION trg_set_data_limite()
RETURNS trigger AS $$
DECLARE
  v_codigo TEXT;
BEGIN
  SELECT codigo INTO v_codigo FROM tipo_uso WHERE id = NEW.tipo_uso_id;

  IF v_codigo = 'emprestimo' THEN
    IF NEW.data_limite IS NULL THEN
      NEW.data_limite := NEW.data_retirada + INTERVAL '7 days';
    END IF;
  ELSE
    -- Para 'cedido', não há data_limite automática
    NEW.data_limite := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_data_limite_biur
BEFORE INSERT OR UPDATE ON uso_equipamento
FOR EACH ROW EXECUTE FUNCTION trg_set_data_limite();

-- ===========================================
-- Seeds (dados iniciais)
-- ===========================================

-- Domínios
INSERT INTO tipo_uso (codigo, descricao) VALUES
('emprestimo','Empréstimo'),
('cedido','Cedido')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO categoria_uso (codigo, descricao) VALUES
('A','Dev especialista / notebook robusto'),
('B','Dev sênior / notebook rápido'),
('C','Dev pleno / notebook médio'),
('D','Dev júnior / notebook mínimo'),
('E','Periféricos de uso geral')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO status_equipamento (nome) VALUES
('Em estoque'), ('Em uso'), ('Em manutenção'), ('Descartado')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipo_equipamento (nome) VALUES
('notebook'), ('mouse'), ('teclado'), ('fone'), ('monitor'), ('outro')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO cargo (nome) VALUES
('Desenvolvedor Sênior'),
('Desenvolvedor Pleno'),
('Desenvolvedor Júnior'),
('Analista de Suporte'),
('Estagiário')
ON CONFLICT (nome) DO NOTHING;

-- Funcionários
INSERT INTO funcionario (nome, numero_registro, cargo_id, email, telefone)
VALUES
('Ana Souza',   'FUNC001', (SELECT id FROM cargo WHERE nome='Desenvolvedor Sênior'), 'ana.souza@empresa.com',   '(21) 90000-0001'),
('Bruno Lima',  'FUNC002', (SELECT id FROM cargo WHERE nome='Desenvolvedor Pleno'), 'bruno.lima@empresa.com',  '(21) 90000-0002'),
('Carla Reis',  'FUNC003', (SELECT id FROM cargo WHERE nome='Desenvolvedor Júnior'),'carla.reis@empresa.com',  '(21) 90000-0003'),
('Diego Nunes', 'FUNC004', (SELECT id FROM cargo WHERE nome='Analista de Suporte'), 'diego.nunes@empresa.com', '(21) 90000-0004'),
('Eva Melo',    'FUNC005', (SELECT id FROM cargo WHERE nome='Estagiário'),          'eva.melo@empresa.com',    '(21) 90000-0005');

-- Modelos (marca + modelo + tipo)
INSERT INTO modelo_equipamento (marca, modelo, tipo_equipamento_id) VALUES
('Lenovo',   'ThinkPad T14', (SELECT id FROM tipo_equipamento WHERE nome='notebook')),
('Dell',     'Latitude 7420', (SELECT id FROM tipo_equipamento WHERE nome='notebook')),
('Logitech', 'MX Master 3S',  (SELECT id FROM tipo_equipamento WHERE nome='mouse')),
('Redragon', 'Magic-Wand',    (SELECT id FROM tipo_equipamento WHERE nome='teclado')),
('JBL',      'Tune 510BT',    (SELECT id FROM tipo_equipamento WHERE nome='fone')),
('LG',       '27UL500',       (SELECT id FROM tipo_equipamento WHERE nome='monitor'))
ON CONFLICT (marca, modelo) DO NOTHING;

-- Equipamentos
INSERT INTO equipamento (numero_serie, modelo_equipamento_id, categoria_id, data_compra, data_fim_garantia, preco_compra, observacoes)
VALUES
('NB-LEN-001', (SELECT id FROM modelo_equipamento WHERE marca='Lenovo'   AND modelo='ThinkPad T14'), (SELECT id FROM categoria_uso WHERE codigo='A'), '2024-02-10', '2027-02-10', 12500.00, 'Notebook topo'),
('NB-DEL-001', (SELECT id FROM modelo_equipamento WHERE marca='Dell'     AND modelo='Latitude 7420'), (SELECT id FROM categoria_uso WHERE codigo='B'), '2024-05-15', '2027-05-15', 11000.00, 'Notebook rápido'),
('MO-LOG-001', (SELECT id FROM modelo_equipamento WHERE marca='Logitech' AND modelo='MX Master 3S'),  (SELECT id FROM categoria_uso WHERE codigo='E'), '2025-01-20', '2026-01-20',    450.00, 'Mouse sem fio'),
('TE-RED-001', (SELECT id FROM modelo_equipamento WHERE marca='Redragon' AND modelo='Magic-Wand'),    (SELECT id FROM categoria_uso WHERE codigo='E'), '2025-03-02', '2026-03-02',    300.00, 'Teclado mecânico'),
('FO-JBL-001', (SELECT id FROM modelo_equipamento WHERE marca='JBL'      AND modelo='Tune 510BT'),    (SELECT id FROM categoria_uso WHERE codigo='E'), '2025-04-10', '2026-04-10',    200.00, 'Fone Bluetooth'),
('MO-LG-27U1', (SELECT id FROM modelo_equipamento WHERE marca='LG'       AND modelo='27UL500'),       (SELECT id FROM categoria_uso WHERE codigo='E'), '2024-09-01', '2026-09-01',   1600.00, 'Monitor 27" 4K');

-- Status inicial (Em estoque) para todos
INSERT INTO historico_status (equipamento_id, status_id, observacoes)
SELECT e.id, (SELECT id FROM status_equipamento WHERE nome='Em estoque'), 'Entrada no estoque'
FROM equipamento e;

-- ============================
-- Alocações / Usos de exemplo
-- ============================

-- 1) Ceder notebook Lenovo (NB-LEN-001) para Ana (cedido)
INSERT INTO uso_equipamento (funcionario_id, equipamento_id, tipo_uso_id, data_retirada, observacoes)
VALUES (
  (SELECT id FROM funcionario WHERE numero_registro='FUNC001'),
  (SELECT id FROM equipamento WHERE numero_serie='NB-LEN-001'),
  (SELECT id FROM tipo_uso WHERE codigo='cedido'),
  CURRENT_DATE - 30,
  'Notebook para dev sênior'
);

-- Atualiza status -> Em uso
INSERT INTO historico_status (equipamento_id, status_id, observacoes)
VALUES (
  (SELECT id FROM equipamento WHERE numero_serie='NB-LEN-001'),
  (SELECT id FROM status_equipamento WHERE nome='Em uso'),
  'Cedido à Ana Souza'
);

-- 2) Empréstimo do notebook Dell (NB-DEL-001) para Bruno (7 dias)
INSERT INTO uso_equipamento (funcionario_id, equipamento_id, tipo_uso_id, data_retirada, observacoes)
VALUES (
  (SELECT id FROM funcionario WHERE numero_registro='FUNC002'),
  (SELECT id FROM equipamento WHERE numero_serie='NB-DEL-001'),
  (SELECT id FROM tipo_uso WHERE codigo='emprestimo'),
  CURRENT_DATE - 5,
  'Empréstimo para tarefa urgente'
);

-- Atualiza status -> Em uso
INSERT INTO historico_status (equipamento_id, status_id, observacoes)
VALUES (
  (SELECT id FROM equipamento WHERE numero_serie='NB-DEL-001'),
  (SELECT id FROM status_equipamento WHERE nome='Em uso'),
  'Empréstimo para Bruno Lima'
);

-- 3) Devolver o mouse (MO-LOG-001) após empréstimo concluído
-- Primeiro criar um empréstimo antigo e já devolver
INSERT INTO uso_equipamento (funcionario_id, equipamento_id, tipo_uso_id, data_retirada, data_devolucao, observacoes)
VALUES (
  (SELECT id FROM funcionario WHERE numero_registro='FUNC003'),
  (SELECT id FROM equipamento WHERE numero_serie='MO-LOG-001'),
  (SELECT id FROM tipo_uso WHERE codigo='emprestimo'),
  CURRENT_DATE - 20,
  CURRENT_DATE - 12,
  'Empréstimo concluído'
);

-- Após devolução, status volta a Em estoque
INSERT INTO historico_status (equipamento_id, status_id, observacoes)
VALUES (
  (SELECT id FROM equipamento WHERE numero_serie='MO-LOG-001'),
  (SELECT id FROM status_equipamento WHERE nome='Em estoque'),
  'Devolvido por Carla Reis'
);

-- 4) Teclado Redragon em manutenção
INSERT INTO historico_status (equipamento_id, status_id, observacoes)
VALUES (
  (SELECT id FROM equipamento WHERE numero_serie='TE-RED-001'),
  (SELECT id FROM status_equipamento WHERE nome='Em manutenção'),
  'Teclas falhando — enviado para RMA'
);

-- 5) Fone JBL descartado (exemplo de ciclo de vida)
INSERT INTO historico_status (equipamento_id, status_id, observacoes)
VALUES (
  (SELECT id FROM equipamento WHERE numero_serie='FO-JBL-001'),
  (SELECT id FROM status_equipamento WHERE nome='Descartado'),
  'Bateria danificada fora de garantia'
);

-- 6) Monitor LG cedido ao Diego
INSERT INTO uso_equipamento (funcionario_id, equipamento_id, tipo_uso_id, data_retirada, observacoes)
VALUES (
  (SELECT id FROM funcionario WHERE numero_registro='FUNC004'),
  (SELECT id FROM equipamento WHERE numero_serie='MO-LG-27U1'),
  (SELECT id FROM tipo_uso WHERE codigo='cedido'),
  CURRENT_DATE - 2,
  'Setup estação de trabalho'
);

INSERT INTO historico_status (equipamento_id, status_id, observacoes)
VALUES (
  (SELECT id FROM equipamento WHERE numero_serie='MO-LG-27U1'),
  (SELECT id FROM status_equipamento WHERE nome='Em uso'),
  'Cedido ao Diego Nunes'
);

-- ============================
-- Views úteis (opcionais)
-- ============================

-- Equipamentos ainda em garantia
CREATE OR REPLACE VIEW equipamentos_em_garantia AS
SELECT
  e.id,
  e.numero_serie,
  e.data_fim_garantia,
  (e.data_fim_garantia IS NOT NULL AND e.data_fim_garantia >= CURRENT_DATE) AS em_garantia
FROM equipamento e;

-- Status atual (última ocorrência no histórico)
CREATE OR REPLACE VIEW status_atual_equipamento AS
SELECT DISTINCT ON (h.equipamento_id)
  h.equipamento_id,
  s.nome AS status_atual,
  h.data_alteracao,
  h.observacoes
FROM historico_status h
JOIN status_equipamento s ON s.id = h.status_id
ORDER BY h.equipamento_id, h.data_alteracao DESC;

-- Equipamentos em uso (alocação ativa)
CREATE OR REPLACE VIEW equipamentos_em_uso AS
SELECT
  f.nome AS funcionario,
  e.numero_serie,
  tu.codigo AS tipo_uso,
  u.data_retirada,
  u.data_limite
FROM uso_equipamento u
JOIN equipamento e  ON e.id = u.equipamento_id
JOIN funcionario f  ON f.id = u.funcionario_id
JOIN tipo_uso tu    ON tu.id = u.tipo_uso_id
WHERE u.data_devolucao IS NULL;
