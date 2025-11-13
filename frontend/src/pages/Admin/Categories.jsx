import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getAllCategories()
      setCategories(res.data || res)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await adminAPI.createCategory({ name, description })
      toast.success('Tạo danh mục thành công')
      setName('')
      setDescription('')
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi tạo danh mục')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return
    try {
      await adminAPI.deleteCategory(id)
      toast.success('Xóa danh mục thành công')
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xóa danh mục')
    }
  }

  // Edit modal
  const [editingCategory, setEditingCategory] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const openEdit = (c) => {
    setEditingCategory(c)
    setEditName(c.name || '')
    setEditDescription(c.description || '')
  }

  const closeEdit = () => {
    setEditingCategory(null)
    setEditName('')
    setEditDescription('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingCategory) return
    try {
      setLoading(true)
      await adminAPI.updateCategory(editingCategory._id, { name: editName, description: editDescription })
      toast.success('Cập nhật danh mục thành công')
      closeEdit()
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi cập nhật danh mục')
    } finally {
      setLoading(false)
    }
  }

  // Client-side pagination
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage))
  const paginated = categories.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  // Export CSV
  const exportCSV = () => {
    if (!categories || categories.length === 0) {
      toast.info('Không có dữ liệu để xuất')
      return
    }
    const headers = ['_id', 'name', 'description']
    const rows = categories.map((c) => [c._id, `"${(c.name || '').replace(/"/g, '""')}"`, `"${(c.description || '').replace(/"/g, '""')}"`])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `categories_export_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📂 Quản lý danh mục</h1>
          <p className="text-gray-600">Tạo, chỉnh sửa và quản lý danh mục sản phẩm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Create */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <FaPlus className="text-blue-600 text-lg" />
                <h2 className="text-xl font-semibold text-gray-800">Tạo danh mục mới</h2>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục <span className="text-red-500">*</span></label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Điện thoại"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả danh mục..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none resize-none"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !name}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FaPlus /> {loading ? 'Đang xử lý...' : 'Tạo danh mục'}
                </button>
              </form>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-800">Danh sách danh mục</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{categories.length}</span>
                </div>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  <FaDownload /> Xuất CSV
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 mt-4">Đang tải danh mục...</p>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">📭 Chưa có danh mục nào</p>
                  <p className="text-gray-400">Tạo danh mục đầu tiên để bắt đầu</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên danh mục</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((c) => (
                          <tr key={c._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                            <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
                            <td className="px-6 py-4 text-gray-600">{c.description ? c.description.substring(0, 50) + (c.description.length > 50 ? '...' : '') : '—'}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => openEdit(c)}
                                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition text-sm shadow hover:shadow-md"
                                >
                                  <FaEdit /> Sửa
                                </button>
                                <button
                                  onClick={() => handleDelete(c._id)}
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 font-medium">
                        Trang {page} / {totalPages} ({categories.length} danh mục)
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => gotoPage(page - 1)}
                          disabled={page === 1}
                          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-medium py-2 px-3 rounded-lg transition"
                        >
                          <FaChevronLeft /> Trước
                        </button>
                        <div className="px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg">{page}</div>
                        <button
                          onClick={() => gotoPage(page + 1)}
                          disabled={page === totalPages}
                          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-medium py-2 px-3 rounded-lg transition"
                        >
                          Sau <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b-2 border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <FaEdit className="text-blue-600 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">Chỉnh sửa danh mục</h3>
              </div>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition">✕</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none resize-none"
                  rows={4}
                />
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

export default AdminCategories
