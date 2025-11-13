import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from 'react-icons/fa'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats()
        setStats(response.data)
      } catch (error) {
        toast.error('Lỗi: Không thể tải thống kê')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4">Đang tải thống kê...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Dashboard</h1>
          <p className="text-gray-600">Tổng quan về hoạt động của cửa hàng</p>
        </div>

      {stats && (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Users Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">👥 Người dùng</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
                </div>
                <FaUsers className="text-4xl text-blue-100" />
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">📦 Sản phẩm</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalProducts}</p>
                </div>
                <FaBox className="text-4xl text-green-100" />
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">🛍️ Đơn hàng</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalOrders}</p>
                </div>
                <FaShoppingCart className="text-4xl text-purple-100" />
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-orange-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">💰 Doanh thu</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalRevenue.toLocaleString('vi-VN')}₫</p>
                </div>
                <FaDollarSign className="text-4xl text-orange-100" />
              </div>
            </div>
          </div>

          {/* Order Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">⏳ Đơn hàng chờ xử lý</h3>
                  <p className="text-gray-600">Cần được xác nhận</p>
                </div>
                <p className="text-5xl font-bold text-yellow-500">{stats.pendingOrders}</p>
              </div>
              <div className="mt-4 bg-yellow-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-yellow-800">🔔 Hành động cần thiết</p>
              </div>
            </div>

            {/* Confirmed Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">✅ Đơn hàng đã xác nhận</h3>
                  <p className="text-gray-600">Đang chuẩn bị giao hàng</p>
                </div>
                <p className="text-5xl font-bold text-blue-500">{stats.confirmedOrders}</p>
              </div>
              <div className="mt-4 bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-800">📦 Đang xử lý</p>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  )
}

export default AdminDashboard
