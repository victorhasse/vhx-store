import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { couponService } from "../services/couponService";
import { paymentService } from "../services/paymentService";
import { shippingService } from "../services/shippingService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const CASHBACK_RATE = 5;
const CASHBACK_MINIMUM_ORDER_AMOUNT = 100;

const CARD_STYLE = {
  style: {
    base: {
      color: "rgba(240,237,232,0.8)",
      fontFamily: '"DM Sans", sans-serif',
      fontSize: "14px",
      "::placeholder": {
        color: "rgba(240,237,232,0.2)",
      },
    },
    invalid: {
      color: "#ff4444",
    },
  },
};

function formatCurrency(value) {
  return Number(value).toFixed(2).replace(".", ",");
}

function VhxCashCard({
  appliedCoupon,
  productsTotal,
  eligibleAmount,
  estimatedCashback,
  hasPromotionalProducts,
}) {
  let message = "";

  if (appliedCoupon) {
    message = "Pedidos com cupom de desconto não acumulam VHX Cash.";
  } else if (productsTotal < CASHBACK_MINIMUM_ORDER_AMOUNT) {
    const missingAmount = CASHBACK_MINIMUM_ORDER_AMOUNT - productsTotal;

    message = `Faltam R$ ${formatCurrency(
      missingAmount,
    )} em produtos para acumular VHX Cash.`;
  } else if (eligibleAmount <= 0) {
    message = "Os produtos deste pedido não são elegíveis para VHX Cash.";
  } else {
    message =
      "O crédito será liberado após a entrega e terá validade de 30 dias.";
  }

  return (
    <div className="mt-6 border border-[#C8F135]/25 bg-[#C8F135]/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#C8F135]">
            VHX Cash
          </p>

          <p className="mt-1 text-xs leading-relaxed text-white/40">
            Receba {CASHBACK_RATE}% de volta em produtos elegíveis.
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-white/25">
            Você receberá
          </p>

          <p
            style={{
              fontFamily: '"Bebas Neue",sans-serif',
            }}
            className="mt-1 text-2xl tracking-wider text-[#C8F135]"
          >
            R$ {formatCurrency(estimatedCashback)}
          </p>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-[11px] leading-relaxed text-white/35">
        {message}
      </p>

      {hasPromotionalProducts &&
        !appliedCoupon &&
        productsTotal >= CASHBACK_MINIMUM_ORDER_AMOUNT && (
          <p className="mt-2 text-[10px] leading-relaxed text-white/25">
            Produtos promocionais foram desconsiderados do cálculo.
          </p>
        )}

      <button
        type="button"
        disabled
        className="mt-4 w-full cursor-not-allowed border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-white/25"
      >
        Usar saldo VHX Cash — em breve
      </button>
    </div>
  );
}

function CheckoutForm({
  items,
  totalPrice,
  address,
  setAddress,
  addressError,
  setAddressError,
  selectedShipping,
  shippingOptions,
  shippingLoading,
  shippingError,
  handleShippingQuote,
  setSelectedShipping,
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponLoading,
  couponError,
  handleApplyCoupon,
  handleRemoveCoupon,
  displayTotal,
  cashbackEligibleAmount,
  estimatedCashback,
  hasPromotionalProducts,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { clearCart } = useCart();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleAddressChange(event) {
    const { name, value } = event.target;

    setAddress((previousAddress) => ({
      ...previousAddress,
      [name]: value,
    }));

    if (name === "zipcode") {
      setSelectedShipping(null);
    }

    setAddressError("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (
      !address.street ||
      !address.number ||
      !address.city ||
      !address.state ||
      !address.zipcode
    ) {
      setAddressError(t("checkout.error_address"));
      return;
    }

    if (!selectedShipping) {
      setError("Calcule o frete e selecione uma modalidade de entrega.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * O frontend envia somente os dados necessários
       * para identificar os produtos. O backend busca
       * e valida os preços verdadeiros no banco.
       */
      const checkoutItems = items.map((item) => ({
        productId: item.id,
        variantId: item.variantId || null,
        quantity: item.quantity,
      }));

      const normalizedZipcode = address.zipcode.replace(/\D/g, "");

      const intentResponse = await paymentService.createIntent({
        items: checkoutItems,
        address,
        shippingServiceId: selectedShipping.id,
        destinationPostalCode: normalizedZipcode,
        couponCode: appliedCoupon?.code || null,
      });

      const { clientSecret, orderId } = intentResponse.data;

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setError("Não foi possível acessar os dados do cartão.");
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        try {
          await paymentService.cancel({
            orderId,
          });
        } catch (cancelError) {
          console.error("Falha ao cancelar o pedido:", cancelError);
        }

        setError(stripeError.message || t("checkout.error_payment"));
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await paymentService.confirm({
          orderId,
        });

        clearCart();
        navigate(`/pedido/${orderId}`);
        return;
      }

      setError(t("checkout.error_payment"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          t("checkout.error_payment"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Endereço */}
      <p
        style={{
          fontFamily: '"Bebas Neue",sans-serif',
        }}
        className="text-2xl tracking-widest text-white mb-4"
      >
        {t("checkout.delivery")}
      </p>

      {addressError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider px-4 py-3 rounded-sm">
          {addressError}
        </div>
      )}

      {/* CEP e cálculo do frete */}
      <div>
        <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
          {t("checkout.zipcode")} *
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            name="zipcode"
            value={address.zipcode}
            onChange={handleAddressChange}
            placeholder="00000-000"
            maxLength={9}
            onInput={(event) => {
              event.target.value = event.target.value
                .replace(/\D/g, "")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .slice(0, 9);
            }}
            className="w-full sm:w-48 bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />

          <button
            type="button"
            onClick={handleShippingQuote}
            disabled={shippingLoading}
            className="border border-[#C8F135]/50 text-[#C8F135] text-[11px] tracking-widest uppercase px-5 py-3 hover:bg-[#C8F135] hover:text-black transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {shippingLoading ? "Calculando..." : "Calcular frete"}
          </button>
        </div>

        {shippingError && (
          <p className="text-red-400 text-xs mt-2">{shippingError}</p>
        )}
      </div>

      {/* Modalidades de entrega */}
      {shippingOptions.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] tracking-widest uppercase text-white/30">
            Escolha a entrega *
          </p>

          {shippingOptions.map((option) => {
            const isSelected = selectedShipping?.id === option.id;

            const minimumDays =
              option.deliveryRange?.min ?? option.deliveryTime;

            const maximumDays =
              option.deliveryRange?.max ?? option.deliveryTime;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedShipping(option)}
                className={`w-full flex items-center justify-between border px-4 py-4 text-left transition-colors ${
                  isSelected
                    ? "border-[#C8F135] bg-[#C8F135]/5"
                    : "border-white/10 bg-[#111] hover:border-white/30"
                }`}
              >
                <div>
                  <p className="text-sm text-white/80">
                    {option.company?.name ? `${option.company.name} — ` : ""}
                    {option.name}
                  </p>

                  <p className="text-[11px] text-white/30 mt-1">
                    {minimumDays === maximumDays
                      ? `Entrega em até ${maximumDays} dias úteis`
                      : `Entrega entre ${minimumDays} e ${maximumDays} dias úteis`}
                  </p>
                </div>

                <span className="text-sm text-[#C8F135] ml-4 flex-shrink-0">
                  R$ {formatCurrency(option.price)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Rua e número */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
            {t("checkout.street")} *
          </label>

          <input
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            placeholder="Nome da rua"
            maxLength={80}
            className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
            {t("checkout.number")} *
          </label>

          <input
            name="number"
            value={address.number}
            onChange={handleAddressChange}
            placeholder="123"
            maxLength={6}
            onInput={(event) => {
              event.target.value = event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);
            }}
            className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Complemento e bairro */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
            {t("checkout.complement")}
          </label>

          <input
            name="complement"
            value={address.complement}
            onChange={handleAddressChange}
            placeholder="Apto, bloco..."
            maxLength={40}
            className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
            {t("checkout.neighborhood")}
          </label>

          <input
            name="neighborhood"
            value={address.neighborhood}
            onChange={handleAddressChange}
            placeholder="Bairro"
            maxLength={50}
            className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Cidade e estado */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
            {t("checkout.city")} *
          </label>

          <input
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            placeholder="Sua cidade"
            maxLength={50}
            onInput={(event) => {
              event.target.value = event.target.value.replace(
                /[^a-zA-ZÀ-ÿ\s]/g,
                "",
              );
            }}
            className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
            {t("checkout.state")} *
          </label>

          <input
            name="state"
            value={address.state}
            onChange={handleAddressChange}
            placeholder="SC"
            maxLength={2}
            onInput={(event) => {
              event.target.value = event.target.value
                .replace(/[^a-zA-Z]/g, "")
                .toUpperCase()
                .slice(0, 2);
            }}
            className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Cupom */}
      <div className="pt-4">
        <p
          style={{
            fontFamily: '"Bebas Neue",sans-serif',
          }}
          className="mb-4 text-2xl tracking-widest text-white"
        >
          Cupom de desconto
        </p>

        {appliedCoupon ? (
          <div className="flex items-center justify-between border border-[#C8F135]/30 bg-[#C8F135]/5 px-4 py-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30">
                Cupom aplicado
              </p>

              <p className="mt-1 text-sm font-medium uppercase tracking-widest text-[#C8F135]">
                {appliedCoupon.code}
              </p>

              <p className="mt-1 text-xs text-white/40">
                Você economizou R${" "}
                {formatCurrency(appliedCoupon.discountAmount)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-[10px] uppercase tracking-widest text-red-400 transition-opacity hover:opacity-70"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={couponCode}
              onChange={(event) => {
                setCouponCode(event.target.value.toUpperCase());
              }}
              placeholder="Digite o código"
              maxLength={50}
              className="w-full border border-white/10 bg-[#111] px-4 py-3 text-sm uppercase tracking-widest text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#C8F135]"
            />

            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="border border-[#C8F135]/50 px-5 py-3 text-[11px] uppercase tracking-widest text-[#C8F135] transition-colors hover:bg-[#C8F135] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {couponLoading ? "Aplicando..." : "Aplicar"}
            </button>
          </div>
        )}

        {couponError && (
          <p className="mt-2 text-xs text-red-400">{couponError}</p>
        )}
      </div>

      {/* Pagamento */}
      <div className="pt-4">
        <p
          style={{
            fontFamily: '"Bebas Neue",sans-serif',
          }}
          className="text-2xl tracking-widest text-white mb-4"
        >
          {t("checkout.payment")}
        </p>

        <div className="bg-[#111] border border-white/10 px-4 py-4 focus-within:border-[#C8F135] transition-colors">
          <CardElement options={CARD_STYLE} />
        </div>

        <p className="text-[10px] tracking-widest uppercase text-white/20 mt-2 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

          {t("checkout.secure")}
        </p>

        <div className="mt-3 bg-[#C8F135]/5 border border-[#C8F135]/20 px-4 py-3 rounded-sm">
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-1">
            {t("checkout.test_card")}
          </p>

          <p className="text-xs text-white/40 font-mono">4242 4242 4242 4242</p>

          <p className="text-xs text-white/30">{t("checkout.test_card_sub")}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading
          ? t("checkout.processing")
          : `${t("checkout.pay")} R$ ${formatCurrency(displayTotal)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  const [address, setAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [addressError, setAddressError] = useState("");

  const [shippingOptions, setShippingOptions] = useState([]);

  const [selectedShipping, setSelectedShipping] = useState(null);

  const [shippingLoading, setShippingLoading] = useState(false);

  const [shippingError, setShippingError] = useState("");

  const [couponCode, setCouponCode] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [couponLoading, setCouponLoading] = useState(false);

  const [couponError, setCouponError] = useState("");

  async function handleApplyCoupon() {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponError("Informe um código de cupom.");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const checkoutItems = items.map((item) => ({
        productId: item.id,
        variantId: item.variantId || null,
        quantity: item.quantity,
      }));

      const response = await couponService.validate({
        code: normalizedCode,
        items: checkoutItems,
      });

      setAppliedCoupon({
        code: response.data.code,
        discountType: response.data.discountType,
        discountValue: response.data.discountValue,
        discountAmount: Number(response.data.discountAmount || 0),
        subtotalAfterDiscount: Number(response.data.subtotalAfterDiscount || 0),
      });

      setCouponCode(response.data.code);
    } catch (requestError) {
      setAppliedCoupon(null);

      setCouponError(
        requestError.response?.data?.error ||
          "Não foi possível aplicar o cupom.",
      );
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  async function handleShippingQuote() {
    const normalizedZipcode = address.zipcode.replace(/\D/g, "");

    if (normalizedZipcode.length !== 8) {
      setShippingError("Informe um CEP válido para calcular o frete.");
      return;
    }

    setShippingLoading(true);
    setShippingError("");
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const checkoutItems = items.map((item) => ({
        productId: item.id,
        variantId: item.variantId || null,
        quantity: item.quantity,
      }));

      const response = await shippingService.quote({
        destinationPostalCode: normalizedZipcode,
        items: checkoutItems,
      });

      const options = response.data?.options || [];

      setShippingOptions(options);

      if (options.length === 0) {
        setShippingError(
          "Nenhuma modalidade de entrega foi encontrada para este CEP.",
        );
      }
    } catch (requestError) {
      setShippingError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Não foi possível calcular o frete.",
      );
    } finally {
      setShippingLoading(false);
    }
  }

  const shippingPrice = Number(selectedShipping?.price || 0);

  const discountAmount = Number(appliedCoupon?.discountAmount || 0);

  const displayTotal = Math.max(
    0,
    Number(totalPrice) - discountAmount + shippingPrice,
  );

  const hasPromotionalProducts = items.some((item) =>
    Boolean(item.is_promotional),
  );

  const cashbackEligibleAmount =
    appliedCoupon || Number(totalPrice) < CASHBACK_MINIMUM_ORDER_AMOUNT
      ? 0
      : items.reduce((total, item) => {
          if (item.is_promotional) {
            return total;
          }

          return total + Number(item.price) * Number(item.quantity);
        }, 0);

  const estimatedCashback =
    Math.round(cashbackEligibleAmount * CASHBACK_RATE) / 100;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <p
          style={{
            fontFamily: '"Bebas Neue",sans-serif',
          }}
          className="text-4xl tracking-widest text-white/10"
        >
          Faça login para continuar
        </p>

        <Link
          to="/login"
          className="bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase px-8 py-4"
        >
          Entrar
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <p
          style={{
            fontFamily: '"Bebas Neue",sans-serif',
          }}
          className="text-5xl tracking-widest text-white/10"
        >
          Carrinho vazio
        </p>

        <Link
          to="/produtos"
          className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70"
        >
          Explorar coleção
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">
            VHX Store
          </p>

          <h1
            style={{
              fontFamily: '"Bebas Neue",sans-serif',
            }}
            className="text-6xl tracking-widest text-white"
          >
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                items={items}
                /*
                 * O botão ainda apresenta somente o valor
                 * cobrado atualmente pelo backend.
                 */
                totalPrice={totalPrice}
                address={address}
                setAddress={setAddress}
                addressError={addressError}
                setAddressError={setAddressError}
                selectedShipping={selectedShipping}
                shippingOptions={shippingOptions}
                shippingLoading={shippingLoading}
                shippingError={shippingError}
                handleShippingQuote={handleShippingQuote}
                setSelectedShipping={setSelectedShipping}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                couponLoading={couponLoading}
                couponError={couponError}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                displayTotal={displayTotal}
                cashbackEligibleAmount={cashbackEligibleAmount}
                estimatedCashback={estimatedCashback}
                hasPromotionalProducts={hasPromotionalProducts}
              />
            </Elements>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] rounded-sm p-6 sticky top-24">
              <p
                style={{
                  fontFamily: '"Bebas Neue",sans-serif',
                }}
                className="text-2xl tracking-widest text-white mb-6"
              >
                Resumo
              </p>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId || "no-variant"}-${item.selectedSize || "no-size"}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-white/50 truncate mr-2">
                      {item.name}{" "}
                      {item.selectedSize && `(${item.selectedSize})`} ×{" "}
                      {item.quantity}
                    </span>

                    <span className="text-white/70 flex-shrink-0">
                      R$ {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal</span>

                  <span className="text-white/70">
                    R$ {formatCurrency(totalPrice)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">
                      Desconto ({appliedCoupon.code})
                    </span>

                    <span className="text-[#C8F135]">
                      − R$ {formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Frete</span>

                  <span className="text-white/70">
                    {selectedShipping
                      ? `R$ ${formatCurrency(shippingPrice)}`
                      : "A calcular"}
                  </span>
                </div>

                <div className="flex justify-between items-baseline border-t border-white/5 pt-4">
                  <span className="text-sm text-white/40 tracking-wider">
                    Total
                  </span>

                  <span
                    style={{
                      fontFamily: '"Bebas Neue",sans-serif',
                    }}
                    className="text-3xl tracking-wider text-[#C8F135]"
                  >
                    R$ {formatCurrency(displayTotal)}
                  </span>
                </div>
              </div>

              {selectedShipping && (
                <p className="text-[10px] tracking-widest uppercase text-white/20 mt-3">
                  {selectedShipping.company?.name
                    ? `${selectedShipping.company.name} — `
                    : ""}
                  {selectedShipping.name}
                </p>
              )}

              <VhxCashCard
                appliedCoupon={appliedCoupon}
                productsTotal={Number(totalPrice)}
                eligibleAmount={cashbackEligibleAmount}
                estimatedCashback={estimatedCashback}
                hasPromotionalProducts={hasPromotionalProducts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
