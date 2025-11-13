import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productAPI, categoryAPI } from '../services/api'
import { setProducts, setCategories } from '../store/slices/productSlice'
import { FaSearch, FaFilter } from 'react-icons/fa'

function Products() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, totalPages, currentPage } = useSelector((state) => state.products)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAllCategories()
        dispatch(setCategories(response.data))
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [dispatch])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const page = searchParams.get('page') || 1
        const params = {}
        if (search) params.search = search
        if (selectedCategory) params.category = selectedCategory
        if (sort) params.sort = sort

        const response = await productAPI.getAllProducts(page, 12, params)
        dispatch(setProducts({
          products: response.data.products,
          totalPages: response.data.pagination.pages,
          currentPage: parseInt(page),
        }))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [dispatch, searchParams, selectedCategory, search, sort])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ search, page: 1 })
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    setSearchParams({ category: e.target.value, page: 1 })
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
    setSearchParams({ sort: e.target.value, page: 1 })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">📱 Cửa hàng sản phẩm</h1>
          <p className="text-blue-100">Tìm kiếm và khám phá hàng ngàn sản phẩm chất lượng</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none cursor-pointer"
              >
                <option value="">📂 Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sort}
                onChange={handleSortChange}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none cursor-pointer"
              >
                <option value="">📊 Sắp xếp</option>
                <option value="price_asc">💰 Giá từ thấp đến cao</option>
                <option value="price_desc">💸 Giá từ cao đến thấp</option>
                <option value="rating">⭐ Đánh giá cao nhất</option>
              </select>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition shadow hover:shadow-md"
              >
                <FaFilter className="inline mr-2" /> Tìm kiếm
              </button>
            </div>
          </form>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4">Đang tải sản phẩm...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h2>
                <p className="text-gray-600">Tìm thấy <span className="font-semibold text-blue-600">{products.length}</span> sản phẩm</p>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <p className="text-gray-600 mr-4">Trang {currentPage} / {totalPages}</p>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setSearchParams({ page, ...Object.fromEntries(searchParams) })}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        page === currentPage
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-xl">🔍 Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-400 mt-2">Hãy thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
