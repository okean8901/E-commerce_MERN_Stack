import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
}

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cart = JSON.parse(savedCart)
      // Validate cart structure
      if (cart.items && Array.isArray(cart.items)) {
        return cart
      }
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error)
    localStorage.removeItem('cart')
  }
  return initialState
}

// Save cart to localStorage
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      totalPrice: state.totalPrice,
      totalItems: state.totalItems,
    }))
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload
      const existingItem = state.items.find(item => item.productId === payload.productId)
      
      if (existingItem) {
        existingItem.quantity += payload.quantity
      } else {
        state.items.push({
          productId: payload.productId,
          productName: payload.productName,
          price: payload.price,
          imageUrl: payload.imageUrl,
          quantity: payload.quantity,
        })
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      saveCartToStorage(state)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload)
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      saveCartToStorage(state)
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.productId === action.payload.productId)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      saveCartToStorage(state)
    },
    clearCart: (state) => {
      state.items = []
      state.totalPrice = 0
      state.totalItems = 0
      saveCartToStorage(state)
    },
    setCart: (state, action) => {
      state.items = action.payload.items || []
      state.totalPrice = action.payload.totalPrice || 0
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      saveCartToStorage(state)
    },
    initializeCart: (state) => {
      const savedCart = loadCartFromStorage()
      state.items = savedCart.items
      state.totalPrice = savedCart.totalPrice
      state.totalItems = savedCart.totalItems
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart, initializeCart } = cartSlice.actions
export default cartSlice.reducer
