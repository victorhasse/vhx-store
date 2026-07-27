import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { couponService } from "../../services/couponService";

const initialForm = {
  code: "",
  discount_type: "percentage",
  discount_value: "",
  minimum_order_amount: "0",
  starts_at: "",
  expires_at: "",
  usage_limit: "",
  active: true,
};

function formatDateForInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function buildPayload(form) {
  return {
    code: form.code.trim(),
    discount_type: form.discount_type,
    discount_value: Number(
      form.discount_value,
    ),
    minimum_order_amount: Number(
      form.minimum_order_amount || 0,
    ),
    starts_at: form.starts_at
      ? new Date(form.starts_at).toISOString()
      : null,
    expires_at: form.expires_at
      ? new Date(form.expires_at).toISOString()
      : null,
    usage_limit:
      form.usage_limit === ""
        ? null
        : Number(form.usage_limit),
    active: form.active,
  };
}

export default function AdminCouponForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [form, setForm] =
    useState(initialForm);
  const [loading, setLoading] =
    useState(isEditing);
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    async function loadCoupon() {
      setLoading(true);
      setError("");

      try {
        const response =
          await couponService.getAll();

        const coupon = response.data.find(
          (item) =>
            String(item.id) === String(id),
        );

        if (!coupon) {
          setError("Cupom não encontrado.");
          return;
        }

        setForm({
          code: coupon.code || "",
          discount_type:
            coupon.discount_type ||
            "percentage",
          discount_value:
            coupon.discount_value ?? "",
          minimum_order_amount:
            coupon.minimum_order_amount ?? "0",
          starts_at: formatDateForInput(
            coupon.starts_at,
          ),
          expires_at: formatDateForInput(
            coupon.expires_at,
          ),
          usage_limit:
            coupon.usage_limit ?? "",
          active: Boolean(coupon.active),
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.error ||
            "Não foi possível carregar o cupom.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCoupon();
  }, [id, isEditing]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function validateForm() {
    if (!form.code.trim()) {
      return "Informe o código do cupom.";
    }

    const discountValue = Number(
      form.discount_value,
    );

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      return "Informe um desconto maior que zero.";
    }

    if (
      form.discount_type === "percentage" &&
      discountValue > 100
    ) {
      return "O desconto percentual não pode ultrapassar 100%.";
    }

    const minimumAmount = Number(
      form.minimum_order_amount || 0,
    );

    if (
      !Number.isFinite(minimumAmount) ||
      minimumAmount < 0
    ) {
      return "O valor mínimo do pedido é inválido.";
    }

    if (
      form.usage_limit !== "" &&
      (
        !Number.isInteger(
          Number(form.usage_limit),
        ) ||
        Number(form.usage_limit) < 1
      )
    ) {
      return "O limite de usos deve ser um número inteiro positivo.";
    }

    if (
      form.starts_at &&
      form.expires_at &&
      new Date(form.starts_at) >=
        new Date(form.expires_at)
    ) {
      return "A data final deve ser posterior à data inicial.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = buildPayload(form);

      if (isEditing) {
        await couponService.update(
          id,
          payload,
        );
      } else {
        await couponService.create(
          payload,
        );
      }

      navigate("/admin/cupons");
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível salvar o cupom.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClassName =
    "mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#C8F135]";

  const labelClassName =
    "block text-[10px] uppercase tracking-widest text-white/40";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="animate-pulse text-xs uppercase tracking-widest text-white/20">
            Carregando cupom...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <Link
            to="/admin/cupons"
            className="mb-3 block text-[11px] uppercase tracking-widest text-[#C8F135] hover:opacity-70"
          >
            ← Voltar aos cupons
          </Link>

          <h1
            style={{
              fontFamily:
                '"Bebas Neue",sans-serif',
            }}
            className="text-5xl tracking-widest text-white sm:text-6xl"
          >
            {isEditing
              ? "Editar cupom"
              : "Novo cupom"}
          </h1>

          <p className="mt-2 text-xs text-white/30">
            Configure o desconto e as regras
            de utilização.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs tracking-wider text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-[#111] p-6 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClassName}>
              Código
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="VHX10"
                maxLength={50}
                className={`${inputClassName} uppercase`}
                required
              />
            </label>

            <label className={labelClassName}>
              Tipo de desconto
              <select
                name="discount_type"
                value={form.discount_type}
                onChange={handleChange}
                className={inputClassName}
              >
                <option value="percentage">
                  Percentual
                </option>

                <option value="fixed">
                  Valor fixo
                </option>
              </select>
            </label>

            <label className={labelClassName}>
              {form.discount_type ===
              "percentage"
                ? "Desconto (%)"
                : "Desconto (R$)"}

              <input
                type="number"
                name="discount_value"
                value={form.discount_value}
                onChange={handleChange}
                min="0.01"
                max={
                  form.discount_type ===
                  "percentage"
                    ? "100"
                    : undefined
                }
                step="0.01"
                placeholder={
                  form.discount_type ===
                  "percentage"
                    ? "10"
                    : "25,00"
                }
                className={inputClassName}
                required
              />
            </label>

            <label className={labelClassName}>
              Pedido mínimo (R$)
              <input
                type="number"
                name="minimum_order_amount"
                value={
                  form.minimum_order_amount
                }
                onChange={handleChange}
                min="0"
                step="0.01"
                className={inputClassName}
                required
              />
            </label>

            <label className={labelClassName}>
              Início da validade
              <input
                type="datetime-local"
                name="starts_at"
                value={form.starts_at}
                onChange={handleChange}
                className={inputClassName}
              />
            </label>

            <label className={labelClassName}>
              Fim da validade
              <input
                type="datetime-local"
                name="expires_at"
                value={form.expires_at}
                onChange={handleChange}
                className={inputClassName}
              />
            </label>

            <label className={labelClassName}>
              Limite total de usos
              <input
                type="number"
                name="usage_limit"
                value={form.usage_limit}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="Sem limite"
                className={inputClassName}
              />
            </label>

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center justify-between border border-white/10 bg-[#0a0a0a] px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Cupom ativo
                  </p>

                  <p className="mt-1 text-xs text-white/25">
                    Disponível conforme as
                    datas configuradas
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#C8F135]"
                />
              </label>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/20">
              Prévia
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                style={{
                  fontFamily:
                    '"Bebas Neue",sans-serif',
                }}
                className="text-2xl uppercase tracking-widest text-white"
              >
                {form.code || "CÓDIGO"}
              </span>

              <span className="text-sm text-[#C8F135]">
                {form.discount_type ===
                "percentage"
                  ? `${form.discount_value || 0}% OFF`
                  : `R$ ${Number(
                      form.discount_value || 0,
                    )
                      .toFixed(2)
                      .replace(".", ",")} OFF`}
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/admin/cupons"
              className="border border-white/10 px-6 py-3 text-center text-xs uppercase tracking-widest text-white/40 transition-colors hover:border-white/30 hover:text-white"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#C8F135] px-6 py-3 text-xs font-medium uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Criar cupom"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}