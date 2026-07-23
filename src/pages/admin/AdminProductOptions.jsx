import { useCallback, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { productService } from "../../services/productService";

const EMPTY_COLOR = {
  name: "",
  hex_code: "#000000",
};

const EMPTY_VARIANT = {
  product_color_id: "",
  sku: "",
  size: "",
  stock: 0,
  price_override: "",
};

const EMPTY_IMAGE = {
  product_color_id: "",
  image_url: "",
  alt_text: "",
  sort_order: "0",
  is_primary: false,
};

export default function AdminProductOptions() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [colorForm, setColorForm] = useState(EMPTY_COLOR);

  const [variantForm, setVariantForm] = useState(EMPTY_VARIANT);

  const [imageForm, setImageForm] = useState(EMPTY_IMAGE);

  const [editingVariantId, setEditingVariantId] = useState(null);

  const [editVariantForm, setEditVariantForm] = useState(EMPTY_VARIANT);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    try {
      setError("");

      const response = await productService.getById(id);

      setProduct(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível carregar o produto",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  async function handleCreateColor(event) {
    event.preventDefault();

    if (!colorForm.name.trim()) {
      setError("Informe o nome da cor");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await productService.createColor(id, {
        name: colorForm.name.trim(),
        hex_code: colorForm.hex_code,
      });

      setColorForm(EMPTY_COLOR);
      await loadProduct();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error || "Não foi possível criar a cor",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteColor(color) {
    const accepted = window.confirm(
      `Desativar a cor "${color.name}" e suas variantes?`,
    );

    if (!accepted) return;

    setError("");

    try {
      await productService.deleteColor(id, color.id);

      await loadProduct();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível desativar a cor",
      );
    }
  }

  function handleVariantChange(event) {
    const { name, value } = event.target;

    setVariantForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleCreateVariant(event) {
    event.preventDefault();

    if (!variantForm.sku.trim()) {
      setError("Informe o SKU da variante");
      return;
    }

    if (product.colors?.length > 0 && !variantForm.product_color_id) {
      setError("Selecione uma cor");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await productService.createVariant(id, {
        product_color_id: variantForm.product_color_id
          ? Number(variantForm.product_color_id)
          : null,

        sku: variantForm.sku.trim(),

        size: variantForm.size.trim() || null,

        stock: Number(variantForm.stock),

        price_override:
          variantForm.price_override === ""
            ? null
            : Number(variantForm.price_override),
      });

      setVariantForm(EMPTY_VARIANT);
      await loadProduct();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível criar a variante",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleStartEditVariant(variant) {
    setEditingVariantId(variant.id);

    setEditVariantForm({
      product_color_id: variant.product_color_id
        ? String(variant.product_color_id)
        : "",

      sku: variant.sku || "",
      size: variant.size || "",
      stock: String(variant.stock ?? 0),

      price_override: variant.price_override ?? "",
    });

    setError("");
  }

  function handleCancelEditVariant() {
    setEditingVariantId(null);
    setEditVariantForm(EMPTY_VARIANT);
    setError("");
  }

  function handleEditVariantChange(event) {
    const { name, value } = event.target;

    setEditVariantForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleUpdateVariant(event) {
    event.preventDefault();

    if (!editVariantForm.sku.trim()) {
      setError("Informe o SKU da variante");
      return;
    }

    const stock = Number(editVariantForm.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      setError("O estoque deve ser um número inteiro positivo ou zero");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await productService.updateVariant(id, editingVariantId, {
        product_color_id: editVariantForm.product_color_id
          ? Number(editVariantForm.product_color_id)
          : null,

        sku: editVariantForm.sku.trim(),

        size: editVariantForm.size.trim() || null,

        stock,

        price_override:
          editVariantForm.price_override === ""
            ? null
            : Number(editVariantForm.price_override),
      });

      setEditingVariantId(null);
      setEditVariantForm(EMPTY_VARIANT);

      await loadProduct();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível atualizar a variante",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVariant(variant) {
    const accepted = window.confirm(`Desativar a variante "${variant.sku}"?`);

    if (!accepted) return;

    setError("");

    try {
      await productService.deleteVariant(id, variant.id);

      await loadProduct();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível desativar a variante",
      );
    }
  }

  function handleImageChange(event) {
    const { name, value, type, checked } = event.target;

    setImageForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  async function handleCreateImage(event) {
    event.preventDefault();

    if (!imageForm.image_url.trim()) {
      setError("Informe a URL da imagem");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await productService.createImage(id, {
        product_color_id: imageForm.product_color_id
          ? Number(imageForm.product_color_id)
          : null,

        image_url: imageForm.image_url.trim(),

        alt_text: imageForm.alt_text.trim() || null,

        sort_order: Number(imageForm.sort_order),

        is_primary: imageForm.is_primary,
      });

      setImageForm(EMPTY_IMAGE);
      await loadProduct();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível adicionar a imagem",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteImage(image) {
    const accepted = window.confirm(
      `Remover esta imagem "${image.image_url}"?`,
    );

    if (!accepted) return;

    setError("");

    try {
      await productService.deleteImage(id, image.id);

      await loadProduct();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível remover a imagem",
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-widest uppercase">
          Carregando...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-400 text-sm">
          {error || "Produto não encontrado"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            to="/admin/produtos"
            className="text-[11px] tracking-widest uppercase text-[#C8F135] hover:opacity-70"
          >
            ← Voltar aos produtos
          </Link>

          <h1
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
            }}
            className="text-5xl tracking-widest text-white mt-4"
          >
            Opções do produto
          </h1>

          <p className="text-white/40 mt-2">{product.name}</p>
        </div>

        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <section className="bg-[#111] border border-white/5 p-6 mt-6">
          <div className="mb-6">
            <h2
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
              }}
              className="text-3xl tracking-widest text-white"
            >
              Variantes
            </h2>

            <p className="text-white/30 text-xs mt-1">
              Combine cor, tamanho, SKU, estoque e preço específico.
            </p>
          </div>

          <form
            onSubmit={handleCreateVariant}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Cor
              </label>

              <select
                name="product_color_id"
                value={variantForm.product_color_id}
                onChange={handleVariantChange}
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              >
                <option value="">Sem cor</option>

                {product.colors?.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                SKU *
              </label>

              <input
                name="sku"
                value={variantForm.sku}
                onChange={handleVariantChange}
                placeholder="VHX-TEE-PRETO-M"
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Tamanho
              </label>

              <input
                name="size"
                value={variantForm.size}
                onChange={handleVariantChange}
                placeholder="P, M, G, 40..."
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Estoque *
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={variantForm.stock}
                onChange={handleVariantChange}
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Preço específico
              </label>

              <input
                name="price_override"
                type="number"
                min="0"
                step="0.01"
                value={variantForm.price_override}
                onChange={handleVariantChange}
                placeholder="Deixe vazio para usar o preço do produto"
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Adicionar variante"}
              </button>
            </div>
          </form>
          {editingVariantId && (
            <form
              onSubmit={handleUpdateVariant}
              className="mb-8 border border-[#C8F135]/30 bg-[#C8F135]/5 p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm tracking-widest uppercase text-[#C8F135]">
                  Editar variante
                </p>

                <button
                  type="button"
                  onClick={handleCancelEditVariant}
                  className="text-white/40 hover:text-white text-xs uppercase tracking-widest"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                    Cor
                  </label>

                  <select
                    name="product_color_id"
                    value={editVariantForm.product_color_id}
                    onChange={handleEditVariantChange}
                    className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
                  >
                    <option value="">Sem cor</option>

                    {product.colors?.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                    SKU *
                  </label>

                  <input
                    name="sku"
                    value={editVariantForm.sku}
                    onChange={handleEditVariantChange}
                    className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                    Tamanho
                  </label>

                  <input
                    name="size"
                    value={editVariantForm.size}
                    onChange={handleEditVariantChange}
                    className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                    Estoque
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={editVariantForm.stock}
                    onChange={handleEditVariantChange}
                    className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                    Preço específico
                  </label>

                  <input
                    name="price_override"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editVariantForm.price_override}
                    onChange={handleEditVariantChange}
                    placeholder="Vazio = preço padrão"
                    className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
                  />
                </div>

                <div className="flex items-end gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-12 bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase disabled:opacity-50"
                  >
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEditVariant}
                    className="h-12 border border-white/10 text-white/50 px-4 text-xs tracking-widest uppercase"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}

          {product.variants?.length > 0 ? (
            <div className="space-y-2">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="grid grid-cols-2 md:grid-cols-[1fr_100px_100px_120px_auto] gap-3 items-center border border-white/5 bg-[#0d0d0d] p-4"
                >
                  <div>
                    <p className="text-white text-sm">{variant.sku}</p>

                    <p className="text-white/30 text-xs">
                      {variant.color?.name || "Sem cor"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/20">
                      Tamanho
                    </p>

                    <p className="text-white/70">{variant.size || "Único"}</p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/20">
                      Estoque
                    </p>

                    <p
                      className={
                        Number(variant.stock) > 0
                          ? "text-white/70"
                          : "text-red-400"
                      }
                    >
                      {variant.stock}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/20">
                      Preço
                    </p>

                    <p className="text-[#C8F135]">
                      {variant.price_override !== null
                        ? `R$ ${Number(variant.price_override)
                            .toFixed(2)
                            .replace(".", ",")}`
                        : "Padrão"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditVariant(variant)}
                      className="border border-white/10 text-white/50 px-3 py-2 text-[10px] tracking-widest uppercase hover:border-[#C8F135] hover:text-[#C8F135]"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(variant)}
                      className="border border-red-500/20 text-red-400 px-3 py-2 text-[10px] tracking-widest uppercase hover:border-red-500/60"
                    >
                      Desativar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm">
              Nenhuma variante cadastrada.
            </p>
          )}
        </section>

        <section className="bg-[#111] border border-white/5 p-6">
          <div className="mb-6">
            <h2
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
              }}
              className="text-3xl tracking-widest text-white"
            >
              Cores
            </h2>

            <p className="text-white/30 text-xs mt-1">
              Cadastre as cores disponíveis para este produto.
            </p>
          </div>

          <form
            onSubmit={handleCreateColor}
            className="grid grid-cols-1 md:grid-cols-[1fr_100px_auto] gap-3 mb-8"
          >
            <input
              value={colorForm.name}
              onChange={(event) =>
                setColorForm((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              placeholder="Nome da cor"
              className="bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 outline-none focus:border-[#C8F135]"
            />

            <input
              type="color"
              value={colorForm.hex_code}
              onChange={(event) =>
                setColorForm((previous) => ({
                  ...previous,
                  hex_code: event.target.value,
                }))
              }
              aria-label="Código da cor"
              className="w-full h-12 bg-[#0a0a0a] border border-white/10 p-1"
            />

            <button
              type="submit"
              disabled={saving}
              className="bg-[#C8F135] text-black px-5 py-3 text-xs font-medium tracking-widest uppercase disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Adicionar cor"}
            </button>
          </form>

          {product.colors?.length > 0 ? (
            <div className="space-y-2">
              {product.colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center gap-4 border border-white/5 bg-[#0d0d0d] p-4"
                >
                  <span
                    className="w-10 h-10 border border-white/10"
                    style={{
                      backgroundColor: color.hex_code,
                    }}
                  />

                  <div className="flex-1">
                    <p className="text-white">{color.name}</p>

                    <p className="text-white/30 text-xs uppercase tracking-wider">
                      {color.slug} · {color.hex_code}
                    </p>
                  </div>

                  <div className="text-right text-xs text-white/30">
                    <p>{color.images?.length || 0} imagens</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteColor(color)}
                    className="border border-red-500/20 text-red-400 px-3 py-2 text-[10px] tracking-widest uppercase hover:border-red-500/60"
                  >
                    Desativar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm">Nenhuma cor cadastrada.</p>
          )}
        </section>

        <section className="bg-[#111] border border-white/5 p-6 mt-6">
          <div className="mb-6">
            <h2
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
              }}
              className="text-3xl tracking-widest text-white"
            >
              Imagens
            </h2>

            <p className="text-white/30 text-xs mt-1">
              Associe imagens gerais ou específicas para cada cor.
            </p>
          </div>

          <form
            onSubmit={handleCreateImage}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Cor
              </label>

              <select
                name="product_color_id"
                value={imageForm.product_color_id}
                onChange={handleImageChange}
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              >
                <option value="">Imagem geral</option>

                {product.colors?.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                URL da imagem *
              </label>

              <input
                name="image_url"
                value={imageForm.image_url}
                onChange={handleImageChange}
                placeholder="https://res.cloudinary.com/..."
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Texto alternativo
              </label>

              <input
                name="alt_text"
                value={imageForm.alt_text}
                onChange={handleImageChange}
                placeholder="Camiseta preta — frente"
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-white/30 mb-2">
                Ordem
              </label>

              <input
                name="sort_order"
                type="number"
                min="0"
                step="1"
                value={imageForm.sort_order}
                onChange={handleImageChange}
                className="w-full h-12 bg-[#0a0a0a] border border-white/10 text-white/80 px-4 outline-none focus:border-[#C8F135]"
              />
            </div>

            <label className="flex items-center gap-3 text-white/60 text-sm">
              <input
                name="is_primary"
                type="checkbox"
                checked={imageForm.is_primary}
                onChange={handleImageChange}
                className="accent-[#C8F135] w-4 h-4"
              />
              Definir como imagem principal
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Adicionar imagem"}
              </button>
            </div>
          </form>

          {product.images?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.images.map((image) => {
                const imageColor = product.colors?.find(
                  (color) =>
                    Number(color.id) === Number(image.product_color_id),
                );

                return (
                  <div
                    key={image.id}
                    className="flex gap-4 border border-white/5 bg-[#0d0d0d] p-3"
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      className="w-24 h-24 object-cover bg-black"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm">
                        {imageColor?.name || "Imagem geral"}
                      </p>

                      <p className="text-white/30 text-xs mt-1">
                        Ordem: {image.sort_order}
                      </p>

                      {image.is_primary && (
                        <span className="inline-block mt-2 bg-[#C8F135] text-black text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                          Principal
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="self-start border border-red-500/20 text-red-400 px-3 py-2 text-[10px] tracking-widest uppercase hover:border-red-500/60"
                    >
                      Remover
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/30 text-sm">
              Nenhuma imagem adicional cadastrada.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
