# &lt;VHX&gt; Store — Frontend

E-commerce de roupas e acessórios streetwear, desenvolvido como projeto de portfólio.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black&style=flat-square)

<p align="center">
  <a href="../README.md">🇺🇸 English</a> | 🇧🇷 Português
</p>

## 🔗 Links

- 🌐 **Demo ao vivo:** [victorhasse.github.io/vhx-store](https://victorhasse.github.io/vhx-store)
- 🔧 **Repositório Backend:** [github.com/victorhasse/vhx-api](https://github.com/victorhasse/vhx-api)

## 🛠 Tech Stack

| Tecnologia | Uso |
|---|---|
| React 18 + Vite | Framework e bundler |
| Tailwind CSS v4 | Estilização |
| React Router v6 | Navegação |
| Context API | Gerenciamento de estado (carrinho e auth) |
| Axios | Requisições HTTP |

## ✨ Funcionalidades

- 🏠 Homepage com hero, categorias e produtos em destaque
- 🛍️ Listagem de produtos com filtro por categoria e busca em tempo real
- 📦 Página de produto individual com seleção de tamanho
- 🛒 Carrinho completo (adicionar, remover, alterar quantidade)
- 🔐 Autenticação completa (cadastro + login com JWT)
- 📱 Layout responsivo (mobile e desktop)
- 🎨 Design system próprio (dark mode, tipografia Bebas Neue + DM Sans)

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Repositório [vhx-api](https://github.com/victorhasse/vhx-api) rodando localmente

```bash
# Clone o repositório
git clone https://github.com/victorhasse/vhx-store.git
cd vhx-store

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL da API

# Rode em desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   └── ui/            # Componentes reutilizáveis
├── context/           # CartContext, AuthContext
├── hooks/             # Custom hooks
├── pages/             # Home, Products, Detail, Cart, Auth
├── services/          # Integração com a API (axios)
└── utils/             # Funções utilitárias
```

## 🌐 Deploy

O frontend está hospedado no **GitHub Pages** com deploy automatizado via `gh-pages`.

```bash
npm run deploy
```

## 📸 Screenshots

> Em Breve

## 👨‍💻 Créditos

Desenvolvido por **Victor Hasse**

[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

Projeto para portfólio — 2026

---

## 📄 Licença

Este projeto está sob a licença MIT.