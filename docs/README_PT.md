<div align="center">

<img width="200" height="200" alt="Logo da VHX Store" src="https://github.com/user-attachments/assets/3b896291-a76e-4e08-a7ad-8d2b93f4cfc9" />

# &lt;VHX&gt; Store — Frontend

Uma experiência completa de e-commerce streetwear desenvolvida como projeto de portfólio.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white&style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white&style=flat-square)
![Stripe](https://img.shields.io/badge/Stripe-Sandbox-635BFF?logo=stripe&logoColor=white&style=flat-square)

</div>

<p align="center">
  <a href="../README.md">🇺🇸 English</a> | 🇧🇷 Português
</p>

## Links

- **Demonstração:** [victorhasse.github.io/vhx-store](https://victorhasse.github.io/vhx-store)
- **Repositório do backend:** [github.com/victorhasse/vhx-api](https://github.com/victorhasse/vhx-api)

## Sobre o projeto

A VHX Store é o frontend de um ecossistema completo de e-commerce de roupas e acessórios streetwear. A aplicação se conecta a uma API REST própria e cobre toda a jornada de compra: descoberta de produtos, preços regionalizados, checkout com Stripe, acompanhamento de pedidos, wishlist, cupons e cashback.

O projeto combina desenvolvimento de software, identidade visual própria, interfaces responsivas e necessidades práticas encontradas em lojas virtuais reais.

> Esta aplicação é uma demonstração de portfólio. As integrações de pagamento e frete utilizam ambientes de teste ou sandbox. Os valores em USD são estimativas; os pagamentos são processados em BRL.

## Funcionalidades

### Experiência de compra

- Catálogo com filtros por categoria e busca em tempo real
- Detalhes do produto com variações de cor, imagem, tamanho e estoque
- Carrinho com controle de quantidade e validação de disponibilidade
- Wishlist sincronizada com a conta autenticada
- Recomendações de produtos relacionados
- Skeleton loading responsivo e feedbacks de interface

### Checkout e pedidos

- Validação de endereço e cálculo de frete pelo Melhor Envio
- Validação de cupons e cálculo de descontos
- Checkout com Stripe Elements em modo sandbox
- Total do pedido calculado com segurança pelo backend
- Confirmação e histórico de pedidos do cliente
- Acompanhamento do pagamento até a entrega
- Transportadora, código, link e datas de rastreamento
- Saldo e histórico de transações do cashback VHX Cash

### Regionalização

- Interface em português e inglês com detecção do idioma do navegador
- Preferências regionais para Brasil e Estados Unidos
- Preços em BRL e conversão estimada para USD
- Tamanhos, unidades de medida e datas regionalizados

### Conta e administração

- Cadastro e login com autenticação JWT
- Perfil do usuário e sessão persistente
- Rotas protegidas para clientes e administradores
- Gerenciamento de produtos, variações, cores e imagens
- Criação e gerenciamento de cupons
- Gerenciamento de pedidos e atualização de rastreamento pelo painel administrativo

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React 19 | Interface baseada em componentes |
| Vite 8 | Servidor de desenvolvimento e build de produção |
| React Router 7 | Navegação e páginas protegidas |
| Tailwind CSS 4 | Estilização baseada em classes utilitárias |
| Context API | Estados de autenticação, carrinho, wishlist, região e moeda |
| Axios | Comunicação com a API REST |
| i18next | Internacionalização em português e inglês |
| Stripe.js | Formulário seguro e confirmação do PaymentIntent |
| Vitest | Testes unitários e de contextos |

## Fluxo da compra

1. O cliente seleciona uma variação do produto e a adiciona ao carrinho.
2. A aplicação valida o endereço e solicita as opções de frete.
3. Um cupom opcional é validado pela API.
4. O backend revalida produtos, preços, variações e estoque.
5. O Stripe processa o pagamento de teste em BRL.
6. O pedido é confirmado e aparece no histórico do cliente.
7. O administrador adiciona o rastreamento e atualiza o andamento da entrega.
8. Após a entrega, o VHX Cash elegível é liberado para o cliente.

## Executando localmente

### Pré-requisitos

- Node.js 22 ou superior
- npm
- A [VHX API](https://github.com/victorhasse/vhx-api) executando localmente
- Chave pública de teste do Stripe

### Instalação

```bash
git clone https://github.com/victorhasse/vhx-store.git
cd vhx-store
npm install
cp .env.example .env
npm run dev
```

O servidor de desenvolvimento normalmente estará disponível em `http://localhost:5173/vhx-store/`.

### Variáveis de ambiente

```env
VITE_API_URL=http://localhost:3333/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

Nunca envie chaves reais ou segredos ao repositório.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Visualiza localmente a build de produção |
| `npm run lint` | Executa o ESLint |
| `npm test` | Executa uma vez a suíte do Vitest |
| `npm run test:watch` | Executa os testes em modo de observação |
| `npm run deploy` | Gera a build e publica `dist` no GitHub Pages |

## Estrutura do projeto

```text
src/
├── assets/                 # Logo e recursos visuais
├── components/
│   ├── layout/             # Navbar e Footer
│   ├── products/           # Componentes reutilizáveis de produtos
│   ├── profile/            # Perfil e seção de cashback
│   └── ui/                 # Componentes compartilhados de interface
├── context/                # Auth, carrinho, wishlist, região e moeda
├── hooks/                  # Hooks reutilizáveis de interface
├── i18n/                   # Configuração e traduções PT/EN
├── pages/
│   ├── admin/              # Produtos, cupons, opções e pedidos
│   └── ...                 # Loja, checkout, conta e pedidos
├── services/               # Clientes da API e serviços externos
└── utils/                  # Utilitários de variações de produtos
```

## Pagamento de teste do Stripe

Utilize o cartão padrão do Stripe no checkout sandbox:

```text
Número: 4242 4242 4242 4242
Validade: qualquer data futura
CVC: quaisquer três dígitos
```

Não utilize dados de cartões reais.

## Capturas de tela

| Página inicial | Página de produtos |
|:---:|:---:|
| <img width="1512" height="860" alt="Página inicial da VHX Store" src="https://github.com/user-attachments/assets/17c1c007-819b-4401-b0b9-f7900358f1fd" /> | <img width="1512" height="860" alt="Página de produtos da VHX Store" src="https://github.com/user-attachments/assets/bf3cc72a-6164-4c32-81d3-d39b2911c3da" /> |
| Carrinho | Resumo do pagamento |
| <img width="1512" height="860" alt="Carrinho da VHX Store" src="https://github.com/user-attachments/assets/2b3d7927-9090-4b48-9016-306e6fcea8db" /> | <img width="1512" height="860" alt="Resumo do pagamento da VHX Store" src="https://github.com/user-attachments/assets/e77e484b-da65-44dc-9eaa-73171ea6047f" /> |
| Checkout | Confirmação do pedido |
| <img width="1512" height="860" alt="Checkout da VHX Store" src="https://github.com/user-attachments/assets/e6518a6b-eda1-457c-9993-f77550c6311e" /> | <img width="1512" height="860" alt="Confirmação de pedido da VHX Store" src="https://github.com/user-attachments/assets/57a583d6-edbe-4371-ab9a-f1cf5e6575d1" /> |

## Deploy

O frontend está hospedado no GitHub Pages. O Vite gera o pacote de produção, que é publicado a partir do diretório `dist`.

## Autor

Desenvolvido por **Victor Hasse** como projeto de portfólio.

[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

## Licença

Este projeto está licenciado sob a [Licença MIT](../LICENSE).
