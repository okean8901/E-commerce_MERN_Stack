import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products
      state.totalPages = action.payload.totalPages || 1
      state.currentPage = action.payload.currentPage || 1
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setProducts, setCategories, setLoading, setError } = productSlice.actions
export default productSlice.reducer
