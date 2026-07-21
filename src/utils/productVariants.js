export function getProductVariants(product) {
  return Array.isArray(product?.variants)
    ? product.variants
    : []
}

export function getProductColors(product) {
  return Array.isArray(product?.colors)
    ? product.colors
    : []
}

export function getVariantsForColor(
  product,
  colorId
) {
  const variants = getProductVariants(product)
  const colors = getProductColors(product)

  if (colors.length === 0) {
    return variants
  }

  if (!colorId) {
    return []
  }

  return variants.filter(
    variant =>
      Number(variant.product_color_id) ===
      Number(colorId)
  )
}

export function getAvailableSizes(variants) {
  return [
    ...new Set(
      variants
        .filter(
          variant =>
            variant.active !== false &&
            Number(variant.stock) > 0 &&
            variant.size
        )
        .map(variant =>
          String(variant.size)
        )
    ),
  ]
}

export function findSelectedVariant(
  variants,
  selectedSize
) {
  if (!Array.isArray(variants)) {
    return null
  }

  /*
   * Produtos de tamanho único podem ter uma
   * variante sem o campo size.
   */
  if (!selectedSize) {
    const sizeLessVariants = variants.filter(
      variant => !variant.size
    )

    return sizeLessVariants.length === 1
      ? sizeLessVariants[0]
      : null
  }

  return (
    variants.find(
      variant =>
        String(variant.size) ===
        String(selectedSize)
    ) || null
  )
}

export function getVariantPrice(
  product,
  variant
) {
  if (
    variant?.price_override !== null &&
    variant?.price_override !== undefined
  ) {
    return Number(variant.price_override)
  }

  return Number(product?.price || 0)
}

export function getColorImages(
  product,
  colorId
) {
  const colors = getProductColors(product)

  if (colorId) {
    const color = colors.find(
      item =>
        Number(item.id) === Number(colorId)
    )

    if (Array.isArray(color?.images)) {
      return [...color.images].sort(
        (first, second) =>
          Number(first.sort_order) -
          Number(second.sort_order)
      )
    }
  }

  const generalImages = Array.isArray(
    product?.images
  )
    ? product.images.filter(
        image => !image.product_color_id
      )
    : []

  return [...generalImages].sort(
    (first, second) =>
      Number(first.sort_order) -
      Number(second.sort_order)
  )
}

export function getPrimaryImage(
  product,
  colorId
) {
  const images = getColorImages(
    product,
    colorId
  )

  const primaryImage =
    images.find(image => image.is_primary) ||
    images[0]

  return (
    primaryImage?.image_url ||
    product?.image_url ||
    null
  )
}