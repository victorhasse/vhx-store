<div align="center">

<img width="200" height="200" alt="favicon" src="https://github.com/user-attachments/assets/3b896291-a76e-4e08-a7ad-8d2b93f4cfc9" />

# &lt;VHX&gt; Store — Frontend

E-commerce de roupas e acessórios streetwear, desenvolvido como projeto de portfólio.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black&style=flat-square)
![i18n](https://img.shields.io/badge/i18n-PT%2FEN-green?style=flat-square)
![Stripe](https://img.shields.io/badge/Stripe-Sandbox-635BFF?logo=stripe&logoColor=white&style=flat-square)

</div>
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
| react-i18next | Internacionalização (PT/EN) |
| Stripe.js | Processamento de pagamentos (sandbox) |

## ✨ Funcionalidades

- 🏠 Homepage com hero, categorias e produtos em destaque
- 🛍️ Listagem de produtos com filtro por categoria e busca em tempo real
- 📦 Página de produto individual com seleção de tamanho
- 🛒 Carrinho completo (adicionar, remover, alterar quantidade)
- 💳 Finaliza a compra com a integração de pagamento do Stripe em ambiente de teste
- 📋 Página de histórico e confirmação de pedidos
- 🔐 Autenticação completa (cadastro + login com JWT)
- 👤 Página de perfil do usuário com informações da conta
- 🛠️ Painel de administração — criar, editar e excluir produtos
- 🌍 Interface bilíngue (PT/EN) com detecção do idioma do navegador
- 💀 Carregamento gradual na listagem de produtos e pedidos
- ✨ Animações baseadas na rolagem e efeitos de fade-in
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

### Environment Variables

```env
VITE_API_URL=http://localhost:3333/api
VITE_STRIPE_PUBLIC_KEY=pk_teste_sua_chave_aqui
```

## 📁 Estrutura do Projeto

```
src/
├── assets/            # Imagens, logo, favicon
├── components/
│   ├── layout/        # Navbar, Footer
│   └── ui/            # ProductCard, Carregamento gradual, troca de idioma
├── context/           # CartContext, AuthContext
├── hooks/             # Custom hooks
├── i18n/              # PT/EN arquivos de tradução
├── pages/             
│   ├── admin/         # AdminPage, AdminProducts, AdminProductForm
│   └── ...            # Página principal, Produtos, Carrinho, Finalizar compra, Pedidos, Autenticação
├── services/          # Integração com a API (axios)
└── utils/             # Funções utilitárias
```

## 💳 Stripe Cartão de Teste
````
Número do cartão: 4242 4242 4242 4242
Data de vencimento: Qualquer data futura
CVC: Qualquer 3 dígitos
````

## 🌐 Deploy

O frontend está hospedado no **GitHub Pages** com deploy automatizado via `gh-pages`.

```bash
npm run deploy
```

## 📸 Screenshots

| Página Principal | Página de Produtos |
| :---: | :---: |
| <img width="1512" height="860" alt="Homepage" src="https://github.com/user-attachments/assets/17c1c007-819b-4401-b0b9-f7900358f1fd" /> | <img width="1512" height="860" alt="ProductsPage" src="https://github.com/user-attachments/assets/bf3cc72a-6164-4c32-81d3-d39b2911c3da" /> |
| Carrinho | Carrinho - Pagamento |
| <img width="1512" height="860" alt="Cart" src="https://github.com/user-attachments/assets/2b3d7927-9090-4b48-9016-306e6fcea8db" /> | <img width="1512" height="860" alt="Cart - payment" src="https://github.com/user-attachments/assets/e77e484b-da65-44dc-9eaa-73171ea6047f" /> |
| Finalização de Compra | Pedido Confirmado |
| <img width="1512" height="860" alt="Checkout" src="https://github.com/user-attachments/assets/e6518a6b-eda1-457c-9993-f77550c6311e" /> | <img width="1512" height="860" alt="Order confirmed" src="https://github.com/user-attachments/assets/57a583d6-edbe-4371-ab9a-f1cf5e6575d1" /> |

## 👨‍💻 Créditos

Desenvolvido por **Victor Hasse**

[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

Projeto para portfólio — 2026

---

## 📄 Licença

Este projeto está sob a licença MIT.
