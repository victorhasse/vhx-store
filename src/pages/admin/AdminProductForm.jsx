import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { useTranslation } from "react-i18next";

const CATEGORIES = ["camisetas", "calcas", "moletons", "acessorios", "tenis"];

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "camisetas",
  stock: "",
  weight: "",
  width: "",
  height: "",
  length: "",
  badge: "",
  image_url: "",
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { t } = useTranslation();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    productService
      .getById(id)
      .then((res) =>
        setForm({
          name: res.data.name ?? "",
          description: res.data.description ?? "",
          price: res.data.price ?? "",
          category: res.data.category ?? "camisetas",
          stock: res.data.stock ?? "",
          weight: res.data.weight ?? "",
          width: res.data.width ?? "",
          height: res.data.height ?? "",
          length: res.data.length ?? "",
          badge: res.data.badge ?? "",
          image_url: res.data.image_url ?? "",
        }),
      )
      .catch(() => setError(t("products.error")))
      .finally(() => setLoading(false));
  }, [id, isEditing, t]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      setError(t("admin.error_all_fields"));
      return;
    }

    const shippingMeasurements = [
      form.weight,
      form.width,
      form.height,
      form.length,
    ];

    const hasInvalidMeasurement = shippingMeasurements.some(
      (value) => value !== "" && Number(value) <= 0,
    );

    if (hasInvalidMeasurement) {
      setError(t("admin.error_shipping_measurements"));
      return;
    }

    setSaving(true);
    try {
      const optionalNumber = (value) => (value === "" ? null : Number(value));

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        weight: optionalNumber(form.weight),
        width: optionalNumber(form.width),
        height: optionalNumber(form.height),
        length: optionalNumber(form.length),
        badge: form.badge || null,
        image_url: form.image_url || null,
      };
      if (isEditing) {
        await productService.update(id, payload);
      } else {
        await productService.create(payload);
      }
      navigate("/admin/produtos");
    } catch (err) {
      setError(err.response?.data?.error || t("admin.error_save"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/admin/produtos"
            className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3 block hover:opacity-70"
          >
            {t("admin.back_products")}
          </Link>
          <h1
            style={{ fontFamily: '"Bebas Neue",sans-serif' }}
            className="text-5xl tracking-widest text-white"
          >
            {isEditing ? t("admin.edit_product") : t("admin.new_product_title")}
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider px-4 py-3 rounded-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
              {t("profile.name")} *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Oversized Tee VHX"
              className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
              {t("admin.description")}
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrição do produto..."
              rows={3}
              className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20 resize-none"
            />
          </div>

          {/* Preço e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
                {t("admin.price")} (R$) *
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                step="0.01"
                placeholder="149.00"
                className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
                {t("admin.stock")}
              </label>
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                placeholder="10"
                className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Peso e dimensões para frete */}
          <div className="border border-white/10 bg-[#0d0d0d] p-5">
            <div className="mb-5">
              <h2 className="text-xs tracking-widest uppercase text-white/60">
                {t("admin.shipping_dimensions")}
              </h2>

              <p className="mt-2 text-[11px] leading-relaxed text-white/25">
                {t("admin.shipping_optional")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] tracking-widest uppercase text-white/30">
                  {t("admin.weight")}
                </label>

                <input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  type="number"
                  min="0.001"
                  step="0.001"
                  placeholder="0.350"
                  className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] tracking-widest uppercase text-white/30">
                  {t("admin.width")}
                </label>

                <input
                  name="width"
                  value={form.width}
                  onChange={handleChange}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="20.00"
                  className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] tracking-widest uppercase text-white/30">
                  {t("admin.height")}
                </label>

                <input
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="10.00"
                  className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] tracking-widest uppercase text-white/30">
                  {t("admin.length")}
                </label>

                <input
                  name="length"
                  value={form.length}
                  onChange={handleChange}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="30.00"
                  className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
              {t("admin.category")} *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`admin.categories_create.${cat}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
              {t("admin.badge")}{" "}
              <span className="text-white/20">(opcional)</span>
            </label>
            <input
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="Ex: Novo, Drop, Sale"
              className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
              {t("admin.image_url")}{" "}
              <span className="text-white/20">(Cloudinary)</span>
            </label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://res.cloudinary.com/..."
              className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
            />
            {form.image_url && (
              <div className="mt-3 w-24 h-24 rounded-sm overflow-hidden bg-[#1a1a1a]">
                <img
                  src={form.image_url}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving
                ? t("admin.saving")
                : isEditing
                  ? t("admin.save")
                  : t("admin.create")}
            </button>
            <Link
              to="/admin/produtos"
              className="px-6 border border-white/10 text-white/40 text-xs tracking-widest uppercase flex items-center hover:border-white/30 transition-colors"
            >
              {t("admin.cancel")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
