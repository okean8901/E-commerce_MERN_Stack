import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaShoppingCart, FaChevronUp, FaChevronDown, FaArrowLeft, FaStar, FaUser, FaCalendar, FaCheck, FaClock, FaTimes } from 'react-icons/fa'
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState({})

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProductById(id)
        setProduct(response.data)
        console.debug('[ProductDetail] fetched product:', response.data)
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

  useEffect(() => {
    if (product) {
      console.debug('[ProductDetail] product state updated:', product)
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) {
      toast.error('Lỗi: Không thể tải sản phẩm')
      return
    }

    if (quantity <= 0) {
      toast.error('Vui lòng chọn số lượng hợp lệ')
      return
    }

    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (!selectedVariants[variant.name]) {
          toast.error(`Vui lòng chọn ${variant.name}`)
          return
        }
      }
    }

    let priceAdjustment = 0
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const selectedValue = selectedVariants[variant.name]
        const option = variant.options && variant.options.find(opt => opt.value === selectedValue)
        if (option && option.priceAdjustment) {
          priceAdjustment += option.priceAdjustment
        }
      }
    }

    dispatch(addToCart({
      productId: product._id,
      productName: product.name,
      price: product.price || 0,
      imageUrl: (product.images && product.images.length > 0) ? product.images[selectedImageIndex] : product.imageUrl,
      quantity,
      selectedVariants: selectedVariants,
      priceAdjustment: priceAdjustment,
    }))
    toast.success('Thêm vào giỏ hàng thành công')
  }

  const calculatePriceAdjustment = () => {
    if (!product) return 0
    let adjustment = 0
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const selectedValue = selectedVariants[variant.name]
        if (selectedValue) {
          const option = variant.options && variant.options.find(opt => opt.value === selectedValue)
          if (option && option.priceAdjustment) {
            adjustment += option.priceAdjustment
          }
        }
      }
    }
    return adjustment
  }

  const priceAdjustment = product ? calculatePriceAdjustment() : 0
  const finalPrice = product ? (product.price || 0) + priceAdjustment : 0

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 overflow-hidden flex flex-col items-center justify-center min-h-80">
              <div className="w-full flex items-center justify-center mb-4">
                <img
                  src={
                    (product.images && product.images.length > 0)
                      ? product.images[selectedImageIndex]
                      : (product.imageUrl || '/placeholder.png')
                  }
                  alt={product.name}
                  className="w-4/5 h-auto max-h-80 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {(product.images && product.images.length > 1) && (
                <div className="flex gap-3 overflow-x-auto px-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 rounded overflow-hidden border-2 ${selectedImageIndex === idx ? 'border-blue-600' : 'border-transparent'}`}
                    >
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                      <td className="px-6 py-4 text-gray-800">{product?.name || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Danh mục</td>
                      <td className="px-6 py-4 text-gray-800">{product?.categoryId?.name || 'Không có'}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Giá</td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">{(product?.price || 0).toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Kho hàng</td>
                      <td className="px-6 py-4 text-gray-800">{product?.stockQuantity || 0} sản phẩm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{product?.name || 'N/A'}</h1>
              
              {product?.rating && product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <div className="text-yellow-500">⭐</div>
                  <span className="font-bold text-gray-800">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-600 text-sm">({product.reviewCount || 0} đánh giá)</span>
                </div>
              )}

              {product && product.stockQuantity > 0 ? (
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

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <div className="text-3xl font-bold text-red-600">
                  {(finalPrice || 0).toLocaleString('vi-VN')}₫
                </div>
                {priceAdjustment > 0 && (
                  <div className="text-lg text-gray-500 line-through">
                    {(product?.price || 0).toLocaleString('vi-VN')}₫
                  </div>
                )}
              </div>
              
              {product && product.stockQuantity > 0 && (
                <p className="text-xs text-gray-600 mb-3">
                  ✓ Chọn phiên bản dã xem giá và chỉ nhân còn hàng
                </p>
              )}

              {/* Selected variants summary */}
              {product && product.variants && product.variants.length > 0 && (
                <div className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Chọn:</span>{' '}
                  <span>
                    {product.variants.map((v) => selectedVariants[v.name]).filter(Boolean).join(', ') || '—'}
                  </span>
                </div>
              )}
            </div>

            {product && product.stockQuantity > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {(product.variants && product.variants.length > 0) && (
                  <div className="space-y-6">
                    {/* Storage/Dung Lượng Variants Section - HÀNG TRÊN */}
                    {product.variants.filter(v => v.type === 'Storage').map((variant) => (
                      <div key={variant.name} className="pb-6 border-b-2 border-gray-200">
                        <div className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">💾 {variant.name}</div>
                        <div className="flex flex-wrap gap-3">
                          {variant.options && variant.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedVariants((prev) => {
                                  const copy = { ...prev }
                                  if (copy[variant.name] === option.value) {
                                    delete copy[variant.name]
                                  } else {
                                    copy[variant.name] = option.value
                                  }
                                  return copy
                                })
                              }}
                              title={`${option.value}${option.priceAdjustment > 0 ? ` (+${option.priceAdjustment.toLocaleString('vi-VN')}₫)` : ''}`}
                              className={`px-6 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                                selectedVariants[variant.name] === option.value
                                  ? 'border-blue-600 bg-blue-100 text-blue-700 shadow-md'
                                  : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-gray-50'
                              }`}
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Color/Màu Sắc Variants Section - HÀNG DƯỚI */}
                    {product.variants.filter(v => v.type === 'Color').map((variant) => (
                      <div key={variant.name}>
                        <div className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">🎨 {variant.name}</div>
                        <div className="flex flex-wrap gap-4">
                          {variant.options && variant.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedVariants((prev) => {
                                  const copy = { ...prev }
                                  if (copy[variant.name] === option.value) {
                                    delete copy[variant.name]
                                  } else {
                                    copy[variant.name] = option.value
                                  }
                                  return copy
                                })
                              }}
                              className={`w-12 h-12 rounded-full border-3 transition flex items-center justify-center ${
                                selectedVariants[variant.name] === option.value
                                  ? 'border-red-500 ring-2 ring-red-300 shadow-lg'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: option.hex || '#e5e7eb' }}
                              title={`${option.value}${option.priceAdjustment > 0 ? ` (+${option.priceAdjustment.toLocaleString('vi-VN')}₫)` : ''}`}
                            >
                              {selectedVariants[variant.name] === option.value && (
                                <span className="text-white font-bold text-lg">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(!product.variants || product.variants.length === 0) && (
                  <p className="text-sm text-gray-500">(Chưa có phiên bản/option cho sản phẩm này)</p>
                )}

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
                      max={product?.stockQuantity || 1}
                      className="w-12 text-center bg-transparent text-lg font-bold text-gray-800 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product?.stockQuantity || 1, quantity + 1))}
                      className="p-2 hover:bg-gray-200 rounded transition duration-200"
                    >
                      <FaChevronUp className="text-gray-700" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Tối đa: {product?.stockQuantity || 0} sản phẩm</p>
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

            {product && product.stockQuantity === 0 && (
              <button disabled className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl cursor-not-allowed opacity-75">
                Sản phẩm hết hàng
              </button>
            )}

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

      {showSpecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Thông số kỹ thuật đầy đủ</h2>
              <button
                onClick={() => setShowSpecModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 w-40">Tên sản phẩm</td>
                    <td className="px-6 py-4 text-gray-800">{product?.name || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Danh mục</td>
                    <td className="px-6 py-4 text-gray-800">{product?.categoryId?.name || 'Không có'}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Giá</td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">{(product?.price || 0).toLocaleString('vi-VN')}₫</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700">Kho hàng</td>
                    <td className="px-6 py-4 text-gray-800">{product?.stockQuantity || 0} sản phẩm</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 bg-gray-50 font-semibold text-gray-700 align-top">Mô tả chi tiết</td>
                    <td className="px-6 py-4 text-gray-800 whitespace-pre-wrap break-words">{product?.description || 'Không có'}</td>
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
