SET search_path TO techManager, public;

CREATE OR REPLACE VIEW vw_historico_equipamentos AS
SELECT
  ('S-' || h.id)::text                    AS id_evento,
  h.data_alteracao                        AS data_evento,
  e.id                                    AS equipamento_id,
  e.numero_serie,
  me.marca,
  me.modelo,
  NULL::int                               AS funcionario_id,
  NULL::text                              AS funcionario_nome,
  NULL::text                              AS tipo_uso,
  s.nome                                  AS status_evento,
  'STATUS'                                AS tipo_evento,
  COALESCE(h.observacoes,'')              AS observacoes
FROM historico_status h
JOIN equipamento e           ON e.id = h.equipamento_id
JOIN modelo_equipamento me   ON me.id = e.modelo_equipamento_id
JOIN status_equipamento s    ON s.id = h.status_id

UNION ALL
SELECT
  ('UR-' || u.id)::text,
  u.data_retirada::timestamp,
  e.id,
  e.numero_serie,
  me.marca,
  me.modelo,
  f.id,
  f.nome,
  tu.codigo,
  NULL::text,
  'RETIRADA',
  COALESCE(u.observacoes,'')
FROM uso_equipamento u
JOIN equipamento e           ON e.id = u.equipamento_id
JOIN modelo_equipamento me   ON me.id = e.modelo_equipamento_id
JOIN funcionario f           ON f.id = u.funcionario_id
JOIN tipo_uso tu             ON tu.id = u.tipo_uso_id

UNION ALL
SELECT
  ('UD-' || u.id)::text,
  u.data_devolucao::timestamp,
  e.id,
  e.numero_serie,
  me.marca,
  me.modelo,
  f.id,
  f.nome,
  tu.codigo,
  NULL::text,
  'DEVOLUCAO',
  COALESCE(u.observacoes,'')
FROM uso_equipamento u
JOIN equipamento e           ON e.id = u.equipamento_id
JOIN modelo_equipamento me   ON me.id = e.modelo_equipamento_id
JOIN funcionario f           ON f.id = u.funcionario_id
JOIN tipo_uso tu             ON tu.id = u.tipo_uso_id
WHERE u.data_devolucao IS NOT NULL;
