<div align="center">

<img width="200" height="200" alt="favicon" src="https://github.com/user-attachments/assets/3b896291-a76e-4e08-a7ad-8d2b93f4cfc9" />

# &lt;VHX&gt; Store — Frontend

Streetwear clothing and accessories e-commerce, developed as a portfolio project.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black&style=flat-square)
![i18n](https://img.shields.io/badge/i18n-PT%2FEN-green?style=flat-square)
![Stripe](https://img.shields.io/badge/Stripe-Sandbox-635BFF?logo=stripe&logoColor=white&style=flat-square)

</div>

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
| react-i18next | Internationalization (PT/EN) |
| Stripe.js | Payment processing (sandbox) |

## ✨ Features

- 🏠 Homepage with hero section, categories, and featured products
- 🛍️ Product listing with category filters and real-time search
- 📦 Individual product page with size selection
- 🛒 Full shopping cart functionality (add, remove, change quantity)
- 💳 Checkout with Stripe sandbox payment integration
- 📋 Order history and order confirmation page
- 🔐 Complete authentication (sign up + login with JWT)
- 👤 User profile page with account info
- 🛠️ Admin panel — create, edit and delete products
- 🌍 Bilingual interface (PT/EN) with browser language detection
- 💀 Skeleton loading on product listing and orders
- ✨ Scroll-driven animations and fade-in effects
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

### Environment Variables

```env
VITE_API_URL=http://localhost:3333/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

## 📁 Estrutura do Projeto

```
src/
├── assets/            # Images, logo, favicon
├── components/
│   ├── layout/        # Navbar, Footer
│   └── ui/            # ProductCard, Skeleton, LanguageToggle
├── context/           # CartContext, AuthContext
├── hooks/             # useFadeIn, useScrollFadeIn
├── i18n/              # PT/EN translation files
├── pages/             
│   ├── admin/         # AdminPage, AdminProducts, AdminProductForm
│   └── ...            # Home, Products, Cart, Checkout, Orders, Auth
├── services/          # API integration (axios)
└── utils/             # Utility functions
```

## 💳 Stripe Test Card
````
Card number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
````

## 🌐 Deploy

The frontend is hosted on **GitHub Pages** with automated deployment via `gh-pages`.

```bash
npm run deploy
```

## 📸 Screenshots

| Homepage | Productspage |
| :---: | :---: |
| <img width="1512" height="860" alt="Homepage" src="https://github.com/user-attachments/assets/17c1c007-819b-4401-b0b9-f7900358f1fd" /> | <img width="1512" height="860" alt="ProductsPage" src="https://github.com/user-attachments/assets/bf3cc72a-6164-4c32-81d3-d39b2911c3da" /> |
| Cart | Cart - payment |
| <img width="1512" height="860" alt="Cart" src="https://github.com/user-attachments/assets/2b3d7927-9090-4b48-9016-306e6fcea8db" /> | <img width="1512" height="860" alt="Cart - payment" src="https://github.com/user-attachments/assets/e77e484b-da65-44dc-9eaa-73171ea6047f" /> |
| Checkout | Order confirmed |
| <img width="1512" height="860" alt="Checkout" src="https://github.com/user-attachments/assets/e6518a6b-eda1-457c-9993-f77550c6311e" /> | <img width="1512" height="860" alt="Order confirmed" src="https://github.com/user-attachments/assets/57a583d6-edbe-4371-ab9a-f1cf5e6575d1" /> |

## 👨‍💻 Credits

Developed by **Victor Hasse**

[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

Portfolio project — 2026

---

## 📄 License

This project is licensed under the MIT License.
