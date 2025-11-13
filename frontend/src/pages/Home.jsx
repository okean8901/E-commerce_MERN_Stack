import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import { setProducts } from '../store/slices/productSlice'
import { FaShoppingCart, FaCheckCircle, FaHeadset } from 'react-icons/fa'

function Home() {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAllProducts(1, 8)
        dispatch(setProducts({
          products: response.data.products,
          totalPages: response.data.pagination.pages,
          currentPage: 1,
        }))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                🎉 Chào mừng đến Okean Mobile
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Khám phá bộ sưu tập các sản phẩm điện thoại, phụ kiện và máy tính bảng chất lượng cao với giá tốt nhất
              </p>
              <div className="flex gap-4">
                <Link to="/products" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg">
                  🛍️ Khám phá ngay
                </Link>
                <Link to="/products" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition">
                  📱 Xem sản phẩm
                </Link>
              </div>
            </div>
            <div className="hidden md:block text-6xl text-center animate-bounce">
              📱
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">⭐ Sản phẩm nổi bật</h2>
          <p className="text-gray-600 text-lg">Những sản phẩm bán chạy nhất tháng này</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4">Đang tải sản phẩm...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/products"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg hover:shadow-xl inline-block"
              >
                ➡️ Xem tất cả {products.length}+ sản phẩm
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-lg">😕 Không có sản phẩm nào</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">🌟 Tại sao chọn chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fast Delivery */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center border-t-4 border-blue-600">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Giao hàng nhanh</h3>
              <p className="text-gray-600 leading-relaxed">
                Giao hàng miễn phí cho đơn hàng từ 100k và đảm bảo đến tay bạn trong 2-5 ngày
              </p>
              <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold">
                ⚡ Nhanh nhất thị trường
              </div>
            </div>

            {/* Quality Guarantee */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center border-t-4 border-green-600">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Chất lượng đảm bảo</h3>
              <p className="text-gray-600 leading-relaxed">
                Tất cả sản phẩm đều là hàng chính hãng 100%, có bảo hành chính hãng từ nhà sản xuất
              </p>
              <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold">
                ✓ Chứng chỉ xác thực
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center border-t-4 border-purple-600">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Hỗ trợ 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                Đội hỗ trợ khách hàng chuyên nghiệp sẵn sàng giúp bạn giải quyết mọi vấn đề bất kỳ lúc nào
              </p>
              <div className="mt-4 inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-semibold">
                📞 Trợ giúp ngay lập tức
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">🎯 Bắt đầu mua sắm ngay hôm nay</h2>
          <p className="text-xl text-blue-100 mb-8">
            Hàng ngàn sản phẩm chất lượng cao đang chờ bạn. Tìm kiếm, so sánh và mua sắm dễ dàng!
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 font-bold py-4 px-10 rounded-lg hover:bg-gray-100 transition shadow-lg inline-block"
          >
            🛒 Bắt đầu mua sắm
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
