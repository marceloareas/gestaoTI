## 🚩 Início do desenvolvimento

As **dependências primordiais**:

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
