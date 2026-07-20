import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  cartReducer,
  createCartItemKey,
} from './CartContext.jsx'

const product = {
  id: 10,
  name: 'Camiseta VHX',
  price: 99.9,
}

describe('createCartItemKey', () => {
  it('cria uma chave para produto sem variante', () => {
    expect(
      createCartItemKey(product)
    ).toBe(
      '10:default:default:default'
    )
  })

  it('diferencia tamanhos do mesmo produto', () => {
    const sizeM = createCartItemKey({
      ...product,
      selectedSize: 'M',
    })

    const sizeG = createCartItemKey({
      ...product,
      selectedSize: 'G',
    })

    expect(sizeM).not.toBe(sizeG)
  })

  it('diferencia cores do mesmo produto', () => {
    const black = createCartItemKey({
      ...product,
      selectedColor: 'black',
    })

    const white = createCartItemKey({
      ...product,
      selectedColor: 'white',
    })

    expect(black).not.toBe(white)
  })
})

describe('cartReducer', () => {
  it('adiciona um produto ao carrinho', () => {
    const state = cartReducer(
      {
        items: [],
      },
      {
        type: 'ADD_ITEM',
        payload: product,
      }
    )

    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(1)
  })

  it('aumenta a quantidade da mesma variante', () => {
    const firstState = cartReducer(
      {
        items: [],
      },
      {
        type: 'ADD_ITEM',
        payload: {
          ...product,
          selectedSize: 'M',
        },
      }
    )

    const secondState = cartReducer(
      firstState,
      {
        type: 'ADD_ITEM',
        payload: {
          ...product,
          selectedSize: 'M',
        },
      }
    )

    expect(secondState.items).toHaveLength(1)
    expect(
      secondState.items[0].quantity
    ).toBe(2)
  })

  it('mantém tamanhos diferentes separados', () => {
    const sizeMState = cartReducer(
      {
        items: [],
      },
      {
        type: 'ADD_ITEM',
        payload: {
          ...product,
          selectedSize: 'M',
        },
      }
    )

    const finalState = cartReducer(
      sizeMState,
      {
        type: 'ADD_ITEM',
        payload: {
          ...product,
          selectedSize: 'G',
        },
      }
    )

    expect(finalState.items).toHaveLength(2)
  })

  it('atualiza somente a variante selecionada', () => {
    const sizeM = {
      ...product,
      selectedSize: 'M',
      cartItemKey:
        '10:default:default:M',
      quantity: 1,
    }

    const sizeG = {
      ...product,
      selectedSize: 'G',
      cartItemKey:
        '10:default:default:G',
      quantity: 1,
    }

    const state = cartReducer(
      {
        items: [sizeM, sizeG],
      },
      {
        type: 'UPDATE_QUANTITY',
        payload: {
          cartItemKey:
            sizeM.cartItemKey,
          quantity: 3,
        },
      }
    )

    expect(state.items[0].quantity).toBe(3)
    expect(state.items[1].quantity).toBe(1)
  })

  it('remove somente o item selecionado', () => {
    const sizeM = {
      ...product,
      cartItemKey:
        '10:default:default:M',
      quantity: 1,
    }

    const sizeG = {
      ...product,
      cartItemKey:
        '10:default:default:G',
      quantity: 1,
    }

    const state = cartReducer(
      {
        items: [sizeM, sizeG],
      },
      {
        type: 'REMOVE_ITEM',
        payload:
          sizeM.cartItemKey,
      }
    )

    expect(state.items).toEqual([
      sizeG,
    ])
  })

  it('limpa todos os itens', () => {
    const state = cartReducer(
      {
        items: [
          {
            ...product,
            cartItemKey:
              '10:default:default:M',
            quantity: 2,
          },
        ],
      },
      {
        type: 'CLEAR_CART',
      }
    )

    expect(state.items).toEqual([])
  })
})