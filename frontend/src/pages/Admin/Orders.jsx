import React, { useEffect, useState } from 'react'
import { adminAPI, orderAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { FaShoppingBag, FaEye, FaCopy, FaChevronUp, FaChevronDown } from 'react-icons/fa'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getAllOrders(1, 50)
      setOrders(res.data.orders || res.orders || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus)
      toast.success('Cập nhật trạng thái thành công')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái')
    }
  }

  // Order details modal
  const [editingOrder, setEditingOrder] = useState(null)
  const openOrder = async (id) => {
    try {
      setLoading(true)
      const res = await orderAPI.getOrderById(id)
      setEditingOrder(res.data || res)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi tải chi tiết đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const closeOrder = () => setEditingOrder(null)

  const handleSaveOrderStatus = async () => {
    if (!editingOrder) return
    try {
      await adminAPI.updateOrderStatus(editingOrder._id, editingOrder.status)
      toast.success('Cập nhật trạng thái đơn hàng thành công')
      closeOrder()
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🛍️ Quản lý đơn hàng</h1>
          <p className="text-gray-600">Xem, quản lý và cập nhật trạng thái đơn hàng</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách đơn hàng</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{orders.length}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 mt-4">Đang tải đơn hàng...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">📭 Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã đơn</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Người đặt</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="px-6 py-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-800 break-all">{o._id}</code>
                      </td>
                      <td className="px-6 py-4 text-gray-800">{o.userId?.email || o.userId?.username || '—'}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{(o.totalAmount || 0).toLocaleString('vi-VN')}₫</td>
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleChangeStatus(o._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg font-medium text-sm transition cursor-pointer border-2
                            ${o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                            ${o.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                            ${o.status === 'Shipped' ? 'bg-purple-100 text-purple-800 border-purple-300' : ''}
                            ${o.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                            ${o.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-300' : ''}
                          `}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openOrder(o._id)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition text-sm shadow hover:shadow-md"
                          >
                            <FaEye /> Xem
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(o._id)
                              toast.success('✓ Đã sao chép ID')
                            }}
                            className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition text-sm shadow hover:shadow-md"
                            title="Sao chép mã đơn hàng"
                          >
                            <FaCopy />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[85vh]">
            <div className="p-6 border-b-2 border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0">
              <div className="flex items-center gap-3">
                <FaShoppingBag className="text-blue-600 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">Chi tiết đơn hàng</h3>
              </div>
              <button onClick={closeOrder} className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition">✕</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">👤 Thông tin khách hàng</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Tên</p>
                      <p className="text-gray-800">{editingOrder.userId?.fullName || editingOrder.userId?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Email</p>
                      <p className="text-gray-800">{editingOrder.userId?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">📦 Thông tin giao hàng</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Địa chỉ</p>
                      <p className="text-gray-800">{editingOrder.shippingAddress || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Số điện thoại</p>
                      <p className="text-gray-800">{editingOrder.phoneNumber || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">📋 Sản phẩm đặt hàng</h4>
                <div className="space-y-3">
                  {(editingOrder.orderDetails || []).map((it) => (
                    <div key={it.productId?._id || it.productId} className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{it.productName || it.productId?.name || 'Sản phẩm'}</div>
                        <div className="text-sm text-gray-600">Số lượng: <span className="font-medium">{it.quantity}</span></div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-blue-600">{(it.price || 0).toLocaleString('vi-VN')}₫</div>
                        <div className="text-xs text-gray-500">mỗi sản phẩm</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary & Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-gray-800">Tổng cộng</div>
                  <div className="text-2xl font-bold text-blue-600">{(editingOrder.totalAmount || 0).toLocaleString('vi-VN')}₫</div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition cursor-pointer
                      ${editingOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                      ${editingOrder.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                      ${editingOrder.status === 'Shipped' ? 'bg-purple-100 text-purple-800 border-purple-300' : ''}
                      ${editingOrder.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                      ${editingOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-300' : ''}
                    `}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button onClick={handleSaveOrderStatus} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition shadow hover:shadow-md">
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
