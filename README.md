<div align="center">

<img width="200" height="200" alt="VHX Store logo" src="https://github.com/user-attachments/assets/3b896291-a76e-4e08-a7ad-8d2b93f4cfc9" />

# &lt;VHX&gt; Store — Frontend

A full-featured streetwear e-commerce experience built as a portfolio project.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white&style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white&style=flat-square)
![Stripe](https://img.shields.io/badge/Stripe-Sandbox-635BFF?logo=stripe&logoColor=white&style=flat-square)

</div>

<p align="center">
  🇺🇸 English | <a href="docs/README_PT.md">🇧🇷 Português</a>
</p>

## Links

- **Live demo:** [victorhasse.github.io/vhx-store](https://victorhasse.github.io/vhx-store)
- **Backend repository:** [github.com/victorhasse/vhx-api](https://github.com/victorhasse/vhx-api)

## About the Project

VHX Store is the frontend of a complete e-commerce ecosystem for streetwear clothing and accessories. It connects to a dedicated REST API and covers the shopping journey from product discovery and regionalized prices to Stripe checkout, order tracking, wishlist, coupons, and cashback.

The project combines software development with a custom visual identity, responsive interfaces, and practical concerns found in real online stores.

> The application is a portfolio demonstration. Stripe and shipping integrations use test or sandbox environments. USD values are estimates; payments are processed in BRL.

## Features

### Shopping experience

- Product catalog with category filters and real-time search
- Product details with color, image, size, and stock variants
- Shopping cart with quantity management and stock validation
- Wishlist synchronized with the authenticated account
- Related-product recommendations
- Responsive skeleton loading and interface feedback

### Checkout and orders

- Address validation and shipping quotes through Melhor Envio
- Coupon validation and discount calculation
- Stripe Elements checkout in sandbox mode
- Secure order total calculated by the backend
- Order confirmation and customer order history
- Status tracking from payment confirmation to delivery
- Carrier, tracking code, tracking link, and shipping timestamps
- VHX Cash cashback balance and transaction history

### Regionalization

- Portuguese and English interfaces with browser-language detection
- Brazil and United States regional preferences
- BRL prices and estimated USD conversion
- Regionalized clothing sizes, measurements, and dates

### Account and administration

- Registration and login with JWT authentication
- User profile and persisted account session
- Protected customer and administrator routes
- Product, variant, color, and image management
- Coupon creation and management
- Administrative order management and shipment updates

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| Vite 8 | Development server and production build |
| React Router 7 | Client-side routing and protected pages |
| Tailwind CSS 4 | Utility-first styling |
| Context API | Authentication, cart, wishlist, region, and currency state |
| Axios | REST API communication |
| i18next | Portuguese and English localization |
| Stripe.js | Secure payment form and PaymentIntent confirmation |
| Vitest | Unit and context tests |

## Purchase Flow

1. The customer selects a product variant and adds it to the cart.
2. The app validates the address and requests available shipping services.
3. An optional coupon is validated by the API.
4. The backend revalidates products, prices, variants, and stock.
5. Stripe processes the test payment in BRL.
6. The order is confirmed and becomes available in the order history.
7. The administrator can add tracking details and update fulfillment status.
8. After delivery, eligible VHX Cash is released to the customer.

## Running Locally

### Prerequisites

- Node.js 22 or later
- npm
- The [VHX API](https://github.com/victorhasse/vhx-api) running locally
- Stripe test publishable key

### Installation

```bash
git clone https://github.com/victorhasse/vhx-store.git
cd vhx-store
npm install
cp .env.example .env
npm run dev
```

The development server is normally available at `http://localhost:5173/vhx-store/`.

### Environment variables

```env
VITE_API_URL=http://localhost:3333/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

Never commit real API keys or secrets.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint |
| `npm test` | Runs the Vitest suite once |
| `npm run test:watch` | Runs tests in watch mode |
| `npm run deploy` | Builds and publishes `dist` to GitHub Pages |

## Project Structure

```text
src/
├── assets/                 # Logo and visual assets
├── components/
│   ├── layout/             # Navbar and Footer
│   ├── products/           # Reusable product components
│   ├── profile/            # Profile and cashback sections
│   └── ui/                 # Shared interface components
├── context/                # Auth, cart, wishlist, region, and currency state
├── hooks/                  # Reusable UI hooks
├── i18n/                   # Configuration and PT/EN translations
├── pages/
│   ├── admin/              # Products, coupons, options, and orders
│   └── ...                 # Storefront, checkout, account, and orders
├── services/               # API and external-service clients
└── utils/                  # Product-variant utilities
```

## Stripe Test Payment

Use Stripe's standard test card in the sandbox checkout:

```text
Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any three digits
```

Do not use real card information.

## Screenshots

| Homepage | Products page |
|:---:|:---:|
| <img width="1512" height="860" alt="VHX Store homepage" src="https://github.com/user-attachments/assets/17c1c007-819b-4401-b0b9-f7900358f1fd" /> | <img width="1512" height="860" alt="VHX Store products page" src="https://github.com/user-attachments/assets/bf3cc72a-6164-4c32-81d3-d39b2911c3da" /> |
| Cart | Payment summary |
| <img width="1512" height="860" alt="VHX Store cart" src="https://github.com/user-attachments/assets/2b3d7927-9090-4b48-9016-306e6fcea8db" /> | <img width="1512" height="860" alt="VHX Store payment summary" src="https://github.com/user-attachments/assets/e77e484b-da65-44dc-9eaa-73171ea6047f" /> |
| Checkout | Order confirmation |
| <img width="1512" height="860" alt="VHX Store checkout" src="https://github.com/user-attachments/assets/e6518a6b-eda1-457c-9993-f77550c6311e" /> | <img width="1512" height="860" alt="VHX Store order confirmation" src="https://github.com/user-attachments/assets/57a583d6-edbe-4371-ab9a-f1cf5e6575d1" /> |

## Deployment

The frontend is hosted on GitHub Pages. The production bundle is generated by Vite and published from the `dist` directory.

## Author

Developed by **Victor Hasse** as a portfolio project.

[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

## License

This project is licensed under the [MIT License](LICENSE).
