# &lt;VHX&gt; Store — Frontend

Streetwear clothing and accessories e-commerce, developed as a portfolio project.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black&style=flat-square)

<p align="center">
  🇺🇸 English | <a href="docs/README_PT.md">🇧🇷 Português</a>
</p>

## 🔗 Links

- 🌐 **Live Demo:** [victorhasse.github.io/vhx-store](https://victorhasse.github.io/vhx-store)
- 🔧 **Backend Repository:** [github.com/victorhasse/vhx-api](https://github.com/victorhasse/vhx-api)

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| React 18 + Vite | Framework and bundler |
| Tailwind CSS v4 | Styling |
| React Router v6 | Navigation |
| Context API | State management (cart and auth) |
| Axios | HTTP Requests |

## ✨ Features

- 🏠 Homepage with hero section, categories, and featured products
- 🛍️ Product listing with category filters and real-time search
- 📦 Individual product page with size selection
- 🛒 Full shopping cart functionality (add, remove, change quantity)
- 🔐 Complete authentication (sign up + login with JWT)
- 📱 Responsive layout (mobile and desktop)
- 🎨 Custom design system (dark mode, Bebas Neue + DM Sans typography)

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- [vhx-api](https://github.com/victorhasse/vhx-api) repository running locally

```bash
# Clone the repository
git clone https://github.com/victorhasse/vhx-store.git
cd vhx-store

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API URL

# Run in development mode
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   └── ui/            # Reusable components
├── context/           # CartContext, AuthContext
├── hooks/             # Custom hooks
├── pages/             # Home, Products, Detail, Cart, Auth
├── services/          # API integration (axios)
└── utils/             # Utility functions
```

## 🌐 Deploy

The frontend is hosted on **GitHub Pages** with automated deployment by `gh-pages`.

```bash
npm run deploy
```

## 📸 Screenshots

> Coming soon

## 👨‍💻 Credits

Developed by **Victor Hasse**

[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

Portfolio project — 2026

---

## 📄 License

This project is licensed under the MIT License.