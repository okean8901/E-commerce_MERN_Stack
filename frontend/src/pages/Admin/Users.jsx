import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { FaSearch, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaUser } from 'react-icons/fa'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getAllUsers(1, 50, '', search)
      setUsers(res.data.users || res.users || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tải người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search])

  const handleToggleActive = async (id, isActive) => {
    try {
      await adminAPI.updateUserStatus(id, isActive)
      toast.success('Cập nhật trạng thái thành công')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return
    try {
      await adminAPI.deleteUser(id)
      toast.success('Xóa người dùng thành công')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xóa người dùng')
    }
  }

  // Edit user modal
  const [editingUser, setEditingUser] = useState(null)
  const [editFullName, setEditFullName] = useState('')
  const [editRole, setEditRole] = useState('')

  const openEdit = (u) => {
    setEditingUser(u)
    setEditFullName(u.fullName || u.username || '')
    setEditRole(u.role || 'Customer')
  }

  const closeEdit = () => {
    setEditingUser(null)
    setEditFullName('')
    setEditRole('')
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    if (!editingUser) return
      try {
      setLoading(true)
      // update isActive handled separately; here update fullName and role
      await adminAPI.updateUser(editingUser._id, { fullName: editFullName, role: editRole })
      toast.success('Cập nhật người dùng thành công')
      closeEdit()
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật người dùng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👥 Quản lý người dùng</h1>
          <p className="text-gray-600">Quản lý tài khoản, vai trò và trạng thái người dùng</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
              <input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
              />
            </div>
            <button onClick={fetchUsers} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition shadow hover:shadow-md">
              Tìm
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách người dùng</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{users.length}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 mt-4">Đang tải danh sách người dùng...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">👤 Chưa có người dùng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vai trò</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {(u.fullName || u.username || u.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{u.fullName || u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                          ${u.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                        `}>
                          {u.role === 'Admin' ? '👑 ' : '👤 '}{u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                          ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        `}>
                          {u.isActive ? '✓ Hoạt động' : '⊘ Bị khóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleToggleActive(u._id, !u.isActive)}
                            className={`flex items-center gap-1 font-medium py-2 px-3 rounded-lg transition text-sm shadow hover:shadow-md
                              ${u.isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}
                            `}
                            title={u.isActive ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
                          >
                            {u.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          <button
                            onClick={() => openEdit(u)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition text-sm shadow hover:shadow-md"
                          >
                            <FaEdit /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition text-sm shadow hover:shadow-md"
                          >
                            <FaTrash /> Xóa
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b-2 border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-600 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">Chỉnh sửa người dùng</h3>
              </div>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition">✕</button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ & tên</label>
                <input
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  placeholder="Nhập tên người dùng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none cursor-pointer"
                >
                  <option value="Customer">👤 Customer</option>
                  <option value="Admin">👑 Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition shadow hover:shadow-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center gap-2 shadow hover:shadow-md"
                >
                  <FaEdit /> Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
