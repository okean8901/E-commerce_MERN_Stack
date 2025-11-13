import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orderAPI } from '../services/api'
import { toast } from 'react-toastify'

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getOrderById(id)
        setOrder(response.data)
      } catch (error) {
        toast.error('Lỗi: Không thể tải chi tiết đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Đơn hàng không tìm thấy</div>
  }

  const statusSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
  const currentStepIndex = statusSteps.indexOf(order.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Chi tiết đơn hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Trạng thái đơn hàng</h2>
            <div className="flex justify-between">
              {statusSteps.map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      index <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm mt-2 text-center">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Sản phẩm</h2>
            <div className="space-y-4">
              {order.orderDetails.map((item) => (
                <div key={item._id} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-gray-600 text-sm">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-blue-600">
                    {item.subtotal.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Địa chỉ giao hàng</p>
                <p className="font-semibold">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Số điện thoại</p>
                <p className="font-semibold">{order.phoneNumber}</p>
              </div>
              {order.note && (
                <div>
                  <p className="text-gray-600 text-sm">Ghi chú</p>
                  <p className="font-semibold">{order.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 sticky top-4">
            <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b">
                <span>Mã đơn hàng:</span>
                <span className="font-semibold">#{order._id}</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span>Ngày đặt:</span>
                <span className="font-semibold">
                  {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span>Phương thức thanh toán:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span>Trạng thái thanh toán:</span>
                <span
                  className={`font-semibold ${
                    order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t-2">
                <span className="font-bold">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {order.totalAmount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
