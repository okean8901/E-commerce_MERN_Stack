import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { removeFromCart, updateQuantity, initializeCart } from '../store/slices/cartSlice'
import { cartAPI } from '../services/api'
import { toast } from 'react-toastify'

function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize cart from localStorage on mount
    dispatch(initializeCart())
  }, [dispatch])

  const handleRemove = async (productId) => {
    try {
      dispatch(removeFromCart(productId))
      await cartAPI.removeFromCart({ productId })
      toast.success('Xóa sản phẩm thành công')
    } catch (error) {
      toast.error('Lỗi: Không thể xóa sản phẩm')
    }
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemove(productId)
      return
    }
    dispatch(updateQuantity({ productId, quantity }))
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {items.map((item) => (
                <div key={item.productId} className="border-b p-4 flex gap-4">
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Giá: {item.price.toLocaleString('vi-VN')}₫
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <label>Số lượng:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                        className="border rounded w-16 px-2 py-1"
                      />
                    </div>
                    <p className="font-semibold text-blue-600">
                      Tổng: {(item.quantity * item.price).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full mb-3"
              >
                Tiếp tục thanh toán
              </button>
              <Link to="/products" className="btn btn-secondary w-full text-center">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Giỏ hàng của bạn trống</p>
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      )}
    </div>
  )
}

export default Cart
