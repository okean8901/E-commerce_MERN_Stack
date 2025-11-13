import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { authAPI } from '../../services/api'
import { loginSuccess } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaCheck } from 'react-icons/fa'

const validationSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Tên đăng nhập ít nhất 3 ký tự').required('Tên đăng nhập là bắt buộc'),
  fullName: Yup.string(),
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: Yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
})

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true)
      const response = await authAPI.register(values)
      dispatch(loginSuccess(response.data))
      localStorage.setItem('user', JSON.stringify(response.data.user))
      toast.success('✓ Đăng ký thành công! Chào mừng bạn')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi đăng ký')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-lg mb-4">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Đăng ký</h1>
            <p className="text-gray-600">Tạo tài khoản Okean Mobile của bạn</p>
          </div>

          <Formik
            initialValues={{
              username: '',
              fullName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Tên đăng nhập
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                    <Field
                      type="text"
                      name="username"
                      className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-lg transition outline-none ${
                        touched.username && errors.username
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      }`}
                      placeholder="username"
                    />
                  </div>
                  <ErrorMessage name="username">
                    {(msg) => <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">⚠️ {msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Họ và tên
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                    <Field
                      type="text"
                      name="fullName"
                      className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <ErrorMessage name="fullName">
                    {(msg) => <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">⚠️ {msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📧 Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                    <Field
                      type="email"
                      name="email"
                      className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-lg transition outline-none ${
                        touched.email && errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  <ErrorMessage name="email">
                    {(msg) => <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">⚠️ {msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🔐 Mật khẩu
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`w-full pl-11 pr-10 py-2.5 border-2 rounded-lg transition outline-none ${
                        touched.password && errors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      }`}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <ErrorMessage name="password">
                    {(msg) => <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">⚠️ {msg}</div>}
                  </ErrorMessage>

                  {/* Password Strength Indicator */}
                  {values.password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        <div
                          className={`h-1 flex-1 rounded ${
                            values.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                        <div
                          className={`h-1 flex-1 rounded ${
                            values.password.length >= 10 ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                        <div
                          className={`h-1 flex-1 rounded ${
                            values.password.length >= 14 ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {values.password.length < 6
                          ? 'Mật khẩu quá yếu'
                          : values.password.length < 10
                          ? 'Mật khẩu bình thường'
                          : 'Mật khẩu mạnh'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🔑 Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                    {values.password && values.confirmPassword && values.password === values.confirmPassword && (
                      <FaCheck className="absolute right-4 top-3.5 text-green-500" />
                    )}
                    <Field
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className={`w-full pl-11 pr-10 py-2.5 border-2 rounded-lg transition outline-none ${
                        touched.confirmPassword && errors.confirmPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : values.confirmPassword && values.password === values.confirmPassword
                          ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      }`}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword">
                    {(msg) => <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">⚠️ {msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-2 pt-2">
                  <input type="checkbox" id="terms" className="w-4 h-4 mt-1 rounded" />
                  <label htmlFor="terms" className="text-xs text-gray-600">
                    Tôi đồng ý với{' '}
                    <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Điều khoản dịch vụ
                    </Link>{' '}
                    và{' '}
                    <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
                >
                  <FaUserPlus /> {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                </button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700">
                Đăng nhập
              </Link>
            </p>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
