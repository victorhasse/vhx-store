import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem    = (product)      => dispatch({ type: 'ADD_ITEM',        payload: product })
  const removeItem = (id)           => dispatch({ type: 'REMOVE_ITEM',     payload: id })
  const updateQty  = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const clearCart  = ()             => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>')
  return ctx
}