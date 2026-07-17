import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'vhx_cart'

function getColorIdentifier(item) {
  if (!item.selectedColor) {
    return 'default'
  }

  if (
    typeof item.selectedColor === 'object'
  ) {
    return (
      item.selectedColor.id ||
      item.selectedColor.value ||
      item.selectedColor.name ||
      'default'
    )
  }

  return item.selectedColor
}

export function createCartItemKey(item) {
  const productId = item.id
  const variantId =
    item.variantId || 'default'
  const color = getColorIdentifier(item)
  const size =
    item.selectedSize || 'default'

  return [
    productId,
    variantId,
    color,
    size,
  ].join(':')
}

function normalizeStoredItem(item) {
  const quantity = Number(item.quantity)

  return {
    ...item,
    cartItemKey:
      item.cartItemKey ||
      createCartItemKey(item),
    quantity:
      Number.isInteger(quantity) &&
      quantity > 0
        ? quantity
        : 1,
  }
}

function loadInitialState() {
  try {
    const storedCart =
      localStorage.getItem(
        CART_STORAGE_KEY
      )

    if (!storedCart) {
      return {
        items: [],
      }
    }

    const parsedCart =
      JSON.parse(storedCart)

    if (!Array.isArray(parsedCart)) {
      return {
        items: [],
      }
    }

    return {
      items: parsedCart
        .filter(item => item?.id)
        .map(normalizeStoredItem),
    }
  } catch {
    localStorage.removeItem(
      CART_STORAGE_KEY
    )

    return {
      items: [],
    }
  }
}

export function cartReducer(
  state,
  action
) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = {
        ...action.payload,
        cartItemKey:
          createCartItemKey(
            action.payload
          ),
      }

      const existing =
        state.items.find(
          currentItem =>
            currentItem.cartItemKey ===
            item.cartItemKey
        )

      if (existing) {
        return {
          ...state,
          items: state.items.map(
            currentItem =>
              currentItem.cartItemKey ===
              item.cartItemKey
                ? {
                    ...currentItem,
                    quantity:
                      currentItem.quantity +
                      1,
                  }
                : currentItem
          ),
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...item,
            quantity: 1,
          },
        ],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          item =>
            item.cartItemKey !==
            action.payload
        ),
      }

    case 'UPDATE_QUANTITY': {
      const {
        cartItemKey,
        quantity,
      } = action.payload

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            item =>
              item.cartItemKey !==
              cartItemKey
          ),
        }
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemKey ===
          cartItemKey
            ? {
                ...item,
                quantity,
              }
            : item
        ),
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }

    default:
      return state
  }
}

export function CartProvider({
  children,
}) {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    loadInitialState
  )

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(state.items)
    )
  }, [state.items])

  const addItem = product =>
    dispatch({
      type: 'ADD_ITEM',
      payload: product,
    })

  const removeItem = cartItemKey =>
    dispatch({
      type: 'REMOVE_ITEM',
      payload: cartItemKey,
    })

  const updateQty = (
    cartItemKey,
    quantity
  ) =>
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        cartItemKey,
        quantity,
      },
    })

  const clearCart = () =>
    dispatch({
      type: 'CLEAR_CART',
    })

  const totalItems =
    state.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  const totalPrice =
    state.items.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,
      0
    )

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context =
    useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart deve ser usado dentro de <CartProvider>'
    )
  }

  return context
}