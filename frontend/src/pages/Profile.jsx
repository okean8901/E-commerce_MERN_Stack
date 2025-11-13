import React, { useEffect, useState } from 'react'
import { userAPI } from '../services/api'
import { toast } from 'react-toastify'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '' })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getUserById(
          JSON.parse(localStorage.getItem('user') || '{}').id
        )
        setUser(response.data)
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
        })
      } catch (error) {
        toast.error('Lỗi: Không thể tải thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await userAPI.updateUserProfile(formData)
      setUser(response.data.user)
      setEditMode(false)
      toast.success('Cập nhật hồ sơ thành công')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi cập nhật hồ sơ')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Đang tải...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Thông tin tài khoản</h2>
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Tên đăng nhập</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="w-full border rounded px-4 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Họ tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Vai trò</label>
                <input
                  type="text"
                  value={user?.role || ''}
                  disabled
                  className="w-full border rounded px-4 py-2 bg-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Tên đăng nhập</p>
                <p className="font-semibold">{user?.username}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Họ tên</p>
                <p className="font-semibold">{user?.fullName || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Vai trò</p>
                <p className="font-semibold">{user?.role}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Thành viên từ</p>
                <p className="font-semibold">
                  {new Date(user?.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-primary w-full"
              >
                Chỉnh sửa thông tin
              </button>
            </div>
          )}
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Trạng thái tài khoản</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded">
              <p className="text-green-700 font-semibold">✓ Tài khoản hoạt động</p>
            </div>
            <div className="p-4 border rounded">
              <p className="font-semibold mb-2">Quyền hạn</p>
              <p className="text-gray-600">
                {user?.role === 'Admin' 
                  ? 'Bạn có quyền quản lý hệ thống'
                  : 'Bạn có quyền khách hàng'}
              </p>
            </div>
            <div className="p-4 border rounded">
              <p className="font-semibold mb-2">Bảo mật</p>
              <p className="text-gray-600">Mật khẩu được mã hóa an toàn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
