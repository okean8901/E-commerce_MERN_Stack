import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaShoppingCart, FaChevronUp, FaChevronDown, FaArrowLeft, FaBox, FaStar, FaUser, FaCalendar, FaCheck, FaClock, FaTimes } from 'react-icons/fa'
import { productAPI, reviewAPI } from '../services/api'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [showSpecModal, setShowSpecModal] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProductById(id)
        setProduct(response.data)
      } catch (error) {
        toast.error('Lỗi: Không thể tải sản phẩm')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await reviewAPI.getProductReviews(id)
        setReviews(response.data.reviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchProduct()
    fetchReviews()
  }, [id, navigate])

  const handleAddToCart = () => {
    if (quantity <= 0) {
      toast.error('Vui lòng chọn số lượng hợp lệ')
      return
    }

    dispatch(addToCart({
      productId: product._id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    }))
    toast.success('Thêm vào giỏ hàng thành công')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-800 text-lg mb-6">Sản phẩm không tìm thấy</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <FaArrowLeft /> Quay lại
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section - CellphoneS Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Product Image & Description */}
          <div className="lg:col-span-2">
            {/* Product Image */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 overflow-hidden flex items-center justify-center min-h-80">
              <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name}
                className="w-4/5 h-auto max-h-80 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Thông số kỹ thuật</h2>
                <button
                  onClick={() => setShowSpecModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                >
                  Xem tất cả →
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-32">Tên sản phẩm</td>
                      <td className="px-6 py-4 text-gray-800">{product.name}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Danh mục</td>
                      <td className="px-6 py-4 text-gray-800">{product.categoryId?.name || 'Không có'}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Giá</td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">{product.price.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Kho hàng</td>
                      <td className="px-6 py-4 text-gray-800">{product.stockQuantity} sản phẩm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Price & Options Card */}
          <div className="space-y-4">
            {/* Title & Rating */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <div className="text-yellow-500">⭐</div>
                  <span className="font-bold text-gray-800">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-600 text-sm">({product.reviewCount} đánh giá)</span>
                </div>
              )}

              {/* Stock Status */}
              {product.stockQuantity > 0 ? (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <FaCheck className="text-lg" />
                  <span className="font-semibold">Còn hàng</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <FaClock className="text-lg" />
                  <span className="font-semibold">Hết hàng</span>
                </div>
              )}
            </div>

            {/* Price Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6">
              <p className="text-gray-600 text-sm mb-2">Giá sản phẩm</p>
              <div className="text-4xl font-bold text-blue-600 mb-3">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá gốc</span>
                  <span className="line-through text-gray-500">{product.price.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="text-red-600 font-semibold">Trợ giá đến 2.000.000đ</div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stockQuantity > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Số lượng</label>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-200 rounded transition duration-200"
                    >
                      <FaChevronDown className="text-gray-700" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stockQuantity}
                      className="w-12 text-center bg-transparent text-lg font-bold text-gray-800 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-2 hover:bg-gray-200 rounded transition duration-200"
                    >
                      <FaChevronUp className="text-gray-700" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Tối đa: {product.stockQuantity} sản phẩm</p>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaShoppingCart />
                  Mua ngay
                </button>
              </div>
            )}

            {product.stockQuantity === 0 && (
              <button disabled className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl cursor-not-allowed opacity-75">
                Sản phẩm hết hàng
              </button>
            )}

            {/* Benefits Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <FaCheck className="text-lg" />
                  <span className="text-sm font-medium">Hàng chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <FaCheck className="text-lg" />
                  <span className="text-sm font-medium">Giao hàng nhanh</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <FaCheck className="text-lg" />
                  <span className="text-sm font-medium">Bảo hành an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaStar className="text-yellow-500" />
            Đánh giá sản phẩm
          </h2>

          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-3"></div>
              <p className="text-gray-600">Đang tải đánh giá...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review._id} className="border-b last:border-b-0 pb-5 last:pb-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {(review.userId?.fullName || review.userId?.username || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{review.userId?.fullName || review.userId?.username || 'Ẩn danh'}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendar className="text-gray-400" />
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <div className="text-yellow-500 text-sm font-medium">
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FaStar className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">Chưa có đánh giá nào</p>
              <p className="text-gray-400 text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này</p>
            </div>
          )}

          {isAuthenticated && (
            <div className="mt-8 pt-8 border-t">
              <button
                onClick={() => navigate(`/products/${id}#review-form`)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              >
                ✍️ Viết đánh giá của bạn
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Specifications Modal */}
      {showSpecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Thông số kỹ thuật đầy đủ</h2>
              <button
                onClick={() => setShowSpecModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-40">Tên sản phẩm</td>
                    <td className="px-6 py-4 text-gray-800">{product.name}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Danh mục</td>
                    <td className="px-6 py-4 text-gray-800">{product.categoryId?.name || 'Không có'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Giá</td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">{product.price.toLocaleString('vi-VN')}₫</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Kho hàng</td>
                    <td className="px-6 py-4 text-gray-800">{product.stockQuantity} sản phẩm</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 align-top">Mô tả chi tiết</td>
                    <td className="px-6 py-4 text-gray-800 whitespace-pre-wrap break-words">{product.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
