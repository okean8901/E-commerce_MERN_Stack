import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { authAPI } from '../../services/api'
import { loginSuccess } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: Yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
})

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true)
      const response = await authAPI.login(values)
      dispatch(loginSuccess(response.data))
      localStorage.setItem('user', JSON.stringify(response.data.user))
      toast.success('✓ Đăng nhập thành công')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi đăng nhập')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg mb-4">
              <FaSignInAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
            <p className="text-gray-600">Chào mừng quay lại Okean Mobile</p>
          </div>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
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
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
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
                      type="password"
                      name="password"
                      className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-lg transition outline-none ${
                        touched.password && errors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                      placeholder="••••••"
                    />
                  </div>
                  <ErrorMessage name="password">
                    {(msg) => <div className="text-red-500 text-sm mt-1.5 flex items-center gap-1">⚠️ {msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-600">Nhớ tôi</span>
                  </label>
                  <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FaSignInAlt /> {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700">
                Đăng ký ngay
              </Link>
            </p>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Quay lại trang chủ
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-xs text-gray-600 font-medium mb-2">💡 Tài khoản demo:</p>
            <p className="text-xs text-gray-600">Email: <span className="font-mono">admin@okeanmobile.com</span></p>
            <p className="text-xs text-gray-600">Pass: <span className="font-mono">123456</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
