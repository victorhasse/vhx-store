import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  findSelectedVariant,
  getAvailableSizes,
  getColorImages,
  getPrimaryImage,
  getVariantPrice,
  getVariantsForColor,
} from './productVariants.js'

const product = {
  id: 10,
  price: '100.00',
  image_url: '/legacy.webp',
  colors: [
    {
      id: 2,
      name: 'Preto',
      images: [
        {
          id: 2,
          image_url: '/preto-2.webp',
          sort_order: 2,
          is_primary: false,
        },
        {
          id: 1,
          image_url: '/preto-1.webp',
          sort_order: 1,
          is_primary: true,
        },
      ],
    },
  ],
  variants: [
    {
      id: 20,
      product_color_id: 2,
      size: 'M',
      stock: 5,
      price_override: null,
      active: true,
    },
    {
      id: 21,
      product_color_id: 2,
      size: 'G',
      stock: 0,
      price_override: '119.90',
      active: true,
    },
  ],
}

describe('productVariants', () => {
  it('filtra variantes pela cor', () => {
    expect(
      getVariantsForColor(product, 2)
    ).toHaveLength(2)
  })

  it('não libera variantes antes de selecionar a cor', () => {
    expect(
      getVariantsForColor(product, null)
    ).toEqual([])
  })

  it('retorna somente tamanhos com estoque', () => {
    expect(
      getAvailableSizes(product.variants)
    ).toEqual(['M'])
  })

  it('encontra a variante pelo tamanho', () => {
    expect(
      findSelectedVariant(
        product.variants,
        'M'
      )?.id
    ).toBe(20)
  })

  it('usa o preço específico da variante', () => {
    expect(
      getVariantPrice(
        product,
        product.variants[1]
      )
    ).toBe(119.9)
  })

  it('usa o preço do produto como fallback', () => {
    expect(
      getVariantPrice(
        product,
        product.variants[0]
      )
    ).toBe(100)
  })

  it('ordena imagens e encontra a principal', () => {
    expect(
      getColorImages(product, 2)
        .map(image => image.id)
    ).toEqual([1, 2])

    expect(
      getPrimaryImage(product, 2)
    ).toBe('/preto-1.webp')
  })

  it('usa a imagem legada como fallback', () => {
    expect(
      getPrimaryImage(
        {
          image_url: '/legacy.webp',
        },
        null
      )
    ).toBe('/legacy.webp')
  })
})