import React, { useEffect, useState } from 'react'
import { productAPI, categoryAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaPlus, FaBox } from 'react-icons/fa'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imagesString: '', // comma-separated image URLs
    variants: [], // array of variant groups
  })
  const [newVariant, setNewVariant] = useState({ type: 'Storage', name: '', options: [] })
  const [newOption, setNewOption] = useState({ value: '', priceAdjustment: 0, hex: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAllProducts(1, 100),
          categoryAPI.getAllCategories(),
        ])
        setProducts(productsRes.data.products)
        setCategories(categoriesRes.data)
      } catch (error) {
        toast.error('Lỗi: Không thể tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // convert imagesString to images array
      const images = formData.imagesString
        ? formData.imagesString.split(',').map((s) => s.trim()).filter(Boolean)
        : []

      const payload = { ...formData, images }

      if (editingId) {
        await productAPI.updateProduct(editingId, payload)
        toast.success('Cập nhật sản phẩm thành công')
      } else {
        await productAPI.createProduct(payload)
        toast.success('Tạo sản phẩm thành công')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        imagesString: '',
        variants: [],
      })
      setNewVariant({ type: 'Storage', name: '', options: [] })
      setNewOption({ value: '', priceAdjustment: 0, hex: '' })
      // Refresh
      const res = await productAPI.getAllProducts(1, 100)
      setProducts(res.data.products)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await productAPI.deleteProduct(id)
        toast.success('Xóa sản phẩm thành công')
        const res = await productAPI.getAllProducts(1, 100)
        setProducts(res.data.products)
      } catch (error) {
        toast.error('Lỗi: Không thể xóa sản phẩm')
      }
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId?._id || '',
      imagesString: (product.images && product.images.length > 0) ? product.images.join(', ') : (product.imageUrl || ''),
      variants: product.variants || [],
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📦 Quản lý sản phẩm</h1>
            <p className="text-gray-600">Tạo, chỉnh sửa và quản lý sản phẩm trong cửa hàng</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                name: '',
                description: '',
                price: '',
                stockQuantity: '',
                categoryId: '',
                imagesString: '',
                variants: [],
              })
              setNewVariant({ type: 'Storage', name: '', options: [] })
              setNewOption({ value: '', priceAdjustment: 0 })
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition shadow hover:shadow-md"
          >
            <FaPlus /> Thêm sản phẩm
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="VD: iPhone 15 Pro"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá bán <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="VD: 1000000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tồn kho <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="VD: 50"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none cursor-pointer"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả <span className="text-red-500">*</span></label>
                  <textarea
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none resize-none"
                    rows={4}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URLs ảnh (phân tách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    value={formData.imagesString}
                    onChange={(e) => setFormData({ ...formData, imagesString: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                  />
                </div>

                {/* Variants Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Phiên bản (Variants)</label>
                  
                  {/* Existing Variants */}
                  {formData.variants && formData.variants.length > 0 && (
                    <div className="mb-4 space-y-3 p-3 bg-gray-50 rounded-lg">
                      {formData.variants.map((variant, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-700">{variant.name} ({variant.type})</p>
                              <p className="text-sm text-gray-600">{variant.options.length} tùy chọn</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.variants.filter((_, i) => i !== idx)
                                setFormData({ ...formData, variants: updated })
                              }}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Xóa
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {variant.options.map((opt, oidx) => (
                              <span key={oidx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                {opt.value} {opt.priceAdjustment > 0 && `(+${opt.priceAdjustment}₫)`}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Variant */}
                  <div className="border-2 border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Loại phiên bản</label>
                        <select
                          value={newVariant.type}
                          onChange={(e) => setNewVariant({ ...newVariant, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="Storage">Dung lượng</option>
                          <option value="Color">Màu sắc</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tên phiên bản</label>
                        <input
                          type="text"
                          placeholder="VD: Dung lượng, Màu sắc"
                          value={newVariant.name}
                          onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>

                    {/* Add Option to Variant */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-100 p-3 rounded">
                      <input
                        type="text"
                        placeholder="VD: 64GB, Đen"
                        value={newOption.value}
                        onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Giá cộng (0 nếu không)"
                        value={newOption.priceAdjustment}
                        onChange={(e) => setNewOption({ ...newOption, priceAdjustment: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Hex color (e.g. #ff0000)"
                        value={newOption.hex}
                        onChange={(e) => setNewOption({ ...newOption, hex: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newOption.value.trim()) {
                            toast.error('Vui lòng nhập giá trị tùy chọn')
                            return
                          }
                          setNewVariant({
                            ...newVariant,
                            options: [...newVariant.options, newOption]
                          })
                          setNewOption({ value: '', priceAdjustment: 0, hex: '' })
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm"
                      >
                        + Thêm tùy chọn
                      </button>
                    </div>

                    {/* Current Options for New Variant */}
                    {newVariant.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-blue-50 rounded">
                        {newVariant.options.map((opt, idx) => (
                          <span key={idx} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-2">
                            {opt.hex ? (
                              <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: opt.hex }} />
                            ) : null}
                            <span>{opt.value} {opt.priceAdjustment > 0 && `(+${opt.priceAdjustment}₫)`}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewVariant({
                                  ...newVariant,
                                  options: newVariant.options.filter((_, i) => i !== idx)
                                })
                              }}
                              className="ml-1 font-bold hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Save New Variant */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!newVariant.name.trim() || newVariant.options.length === 0) {
                          toast.error('Vui lòng nhập tên phiên bản và ít nhất 1 tùy chọn')
                          return
                        }
                        setFormData({
                          ...formData,
                          variants: [...formData.variants, newVariant]
                        })
                        setNewVariant({ type: 'Storage', name: '', options: [] })
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                    >
                      Thêm phiên bản này
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition shadow hover:shadow-md"
                >
                  <FaBox /> {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      stockQuantity: '',
                      categoryId: '',
                      imagesString: '',
                      variants: [],
                    })
                    setNewVariant({ type: 'Storage', name: '', options: [] })
                    setNewOption({ value: '', priceAdjustment: 0 })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition shadow hover:shadow-md"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách sản phẩm</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{products.length}</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">📭 Chưa có sản phẩm nào</p>
              <p className="text-gray-400">Tạo sản phẩm đầu tiên để bắt đầu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên sản phẩm</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tồn kho</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{product.price.toLocaleString('vi-VN')}₫</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                          ${product.stockQuantity > 20 ? 'bg-green-100 text-green-800' : product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                        `}>
                          {product.stockQuantity} {product.stockQuantity === 0 ? '(Hết)' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.categoryId?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition text-sm shadow hover:shadow-md"
                          >
                            <FaEdit /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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
    </div>
  )
}

export default AdminProducts
