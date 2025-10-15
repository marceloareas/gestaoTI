# TechManager
Sistema de gestão de equipamentos de TI

## Passo a passo desde clonagem do repositório até execução do frontend:
### ABra o terminal e digite os comandos abaixo:
```bash
git clone -b Develop https://github.com/marceloareas/gestaoTI.git
```

```bash
cd .\gestaoTI\
```

```bash
cd .\frontend\
```

```bash
npm i
```

```bash
npm run dev
```


## 🚩 Início do desenvolvimento





Sgutestões de **dependências primordiais**:

-   `React Router Dom` para o roteamento
-   `Iconify` para os ícones
-   `Stitches` para a estilização

```bash
npm install react-router-dom @iconify/react @stitches/react
```

Com isso, o projeto estará pronto para ser desenvolvido.

```bash
npm run dev
```

```
│    │    ├── 📁 Header
│    │    │    ├── index.jsx
│    │    │    └── styles.js
│    │    │
│    │    ├── 📁 Componente1
│    │    │    ├── index.jsx
│    │    │    └── styles.js
│    │    │
│    │    └── 📁 Componente2
│    │         ├── index.jsx
│    │         └── styles.js
│    │
│    ├── 📁 pages
│    │    ├── 📁 Home
│    │    │    ├── index.jsx
│    │    │    └── styles.js
│    │    │
│    │    └── 📁 Login
│    │         ├── index.jsx
│    │         └── styles.js
│    │
│    ├── App.jsx
│    │
│    ├── index.css
│    │
│    ├── main.jsx
│    │
│    └── Routes.jsx
│
├── .gitignore
│
├── .prettierrc
│
├── index.html
│
├── package.json
│
└── vite.config.js
```

---

## 📦 Componentes

Existem diversas formas de organizar os componentes. A forma com a qual eu me adaptei melhor, e é mais organizada para futuras alterações é a seguinte:

```bash
📁 components
 └── 📁 NomeDoComponente
      ├── index.jsx
      └── style.js
```

## Subir docker(banco, adminer e back)
```bash
cd infra
```

```bash
docker compose build backend
```

```bash
docker compose up -d
```
