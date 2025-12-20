# 💻 TechManager
Sistema de gestão de equipamentos de TI
Este projeto será desenvolvido como trabalho da disciplina de Projeto e Construção de Sistema e ministrado pelo professor Marcelo Arêas.  

O projeto tem como objetivo facilitar a gestão de equipamentos de TI (notebooks e fones de ouvido) de uma empresa, substituindo o uso de planilhas manuais que podem gerar muitos erros e dificultam o controle de dados.


## 🎯 Objetivo
Facilitar a gestão do inventário de notebooks e fones de ouvido dos colaboradores da empresa:


## ✅🆙 Principais benefícios
- Organização centralizada

- Registro de movimentações

- Alertas de vencimento de garantia

- Automação da “escadinha” de troca de equipamentos



## ⚙️ Funcionalidades

- CRUD de equipamentos

  - Cadastro, edição, listagem e remoção de notebooks e fones de ouvido.

- Gestão de status

  - Controle do status de cada equipamento: `Em estoque`, `Em uso`, `Em manutenção` e `Descartado`

- Alertas de garantia

  - Notificações de equipamentos próximos do fim da garantia.

- Sugestões de equipamentos

  - Recomendação de equipamentos disponíveis em estoque para casos de extravio ou empréstimo.

- Escadinha de troca

  - Processo automático que distribui notebooks novos para colaboradores mais experientes, repassando os antigos para os menos experientes.



## 💻 Tecnologias utilizadas

- **Backend:** Java

- **Frontend:** JavaScript

- **Banco de Dados:** PostgreSQL



## Passo a passo desde clonagem do repositório até execução do frontend:
## Subir docker(banco, adminer e back)
```bash
git clone -b Develop https://github.com/marceloareas/gestaoTI.git
```

```bash
cd gestaoTI
```

```bash
cd infra
```

```bash
docker compose build backend
```

```bash
docker compose up -d
```

## Rodar backend
```bash
cd backend
```

```bash
./mvnw spring-boot:run
```


### Abra o terminal e digite os comandos abaixo:
```bash
cd .\frontend\
```

```bash
npm i
```

```bash
npm run dev
```