import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCog } from 'react-icons/fa'
import { logout } from '../store/slices/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    setUserMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          Okean Mobile
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Trang chủ
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Sản phẩm
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Đơn hàng
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          {isAuthenticated && user?.role !== 'Admin' && (
            <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Auth Links */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-medium text-gray-800"
              >
                <FaUser />
                {user?.fullName || user?.username}
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
                  {user?.role === 'Admin' ? (
                    <>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition border-b border-gray-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaCog /> Dashboard Admin
                      </Link>
                      <Link
                        to="/admin/products"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition border-b border-gray-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Quản lý sản phẩm
                      </Link>
                      <Link
                        to="/admin/categories"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition border-b border-gray-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Quản lý danh mục
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition border-b border-gray-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Quản lý đơn hàng
                      </Link>
                      <Link
                        to="/admin/users"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition border-b border-gray-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Quản lý người dùng
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition border-b border-gray-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaUser /> Hồ sơ cá nhân
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 w-full text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-primary">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 p-4 space-y-2">
          <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-blue-100 rounded transition">
            Trang chủ
          </Link>
          <Link to="/products" className="block py-2 px-4 text-gray-700 hover:bg-blue-100 rounded transition">
            Sản phẩm
          </Link>
          <Link to="/orders" className="block py-2 px-4 text-gray-700 hover:bg-blue-100 rounded transition">
            Đơn hàng
          </Link>
          {isAuthenticated && user?.role === 'Admin' && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <Link to="/admin" className="block py-2 px-4 text-blue-600 hover:bg-blue-100 rounded transition font-medium">
                🔧 Dashboard Admin
              </Link>
              <Link to="/admin/products" className="block py-2 px-4 text-gray-700 hover:bg-blue-100 rounded transition">
                Quản lý sản phẩm
              </Link>
              <Link to="/admin/categories" className="block py-2 px-4 text-gray-700 hover:bg-blue-100 rounded transition">
                Quản lý danh mục
              </Link>
              <Link to="/admin/orders" className="block py-2 px-4 text-gray-700 hover:bg-blue-100 rounded transition">
                Quản lý đơn hàng
              </Link>
              <Link to="/admin/users" className="block py-2 px-4 text-gray-700 hover:bg-blue-100 rounded transition">
                Quản lý người dùng
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header