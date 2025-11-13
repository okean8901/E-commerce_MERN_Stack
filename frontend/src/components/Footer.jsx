import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Okean Mobile</h3>
            <p className="text-gray-400">
              Chuyên cung cấp các sản phẩm điện thoại, phụ kiện và máy tính bảng chất lượng cao.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Trang chủ</a></li>
              <li><a href="/products" className="hover:text-white">Sản phẩm</a></li>
              <li><a href="/about" className="hover:text-white">Về chúng tôi</a></li>
              <li><a href="/contact" className="hover:text-white">Liên hệ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-white">Chính sách hoàn trả</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
            <p className="text-gray-400 mb-4">
              Email: info@okeanmobile.com<br />
              Phone: +84 123 456 789<br />
              Address: 123 Đường Trần Hưng Đạo, Q1, TP HCM
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Okean Mobile. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
