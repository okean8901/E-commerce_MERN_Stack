import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { orderAPI } from '../services/api'
import { clearCart, initializeCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

const validationSchema = Yup.object().shape({
  shippingAddress: Yup.string().required('Địa chỉ giao hàng là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Số điện thoại phải là 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  paymentMethod: Yup.string().required('Vui lòng chọn phương thức thanh toán'),
  note: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
})

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize cart from localStorage on mount
    dispatch(initializeCart())
    setIsLoading(false)
  }, [dispatch])

  useEffect(() => {
    // Redirect if cart is empty (after initialization)
    if (!isLoading && items.length === 0) {
      toast.warning('Giỏ hàng trống! Vui lòng thêm sản phẩm')
      navigate('/cart')
    }
  }, [items, isLoading, navigate])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true)
      
      // Validate items before sending
      if (!items || items.length === 0) {
        toast.error('Giỏ hàng trống!')
        setLoading(false)
        setSubmitting(false)
        return
      }

      const orderData = {
        ...values,
        totalAmount: totalPrice,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      }

      console.log('Sending order data:', orderData)
      
      const response = await orderAPI.createOrder(orderData)
      dispatch(clearCart())
      toast.success('Tạo đơn hàng thành công')
      navigate(`/orders/${response.data.order._id}`)
    } catch (error) {
      console.error('Order error:', error)
      toast.error(error.response?.data?.message || 'Lỗi tạo đơn hàng')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-8">
            <Formik
              initialValues={{
                shippingAddress: '',
                phoneNumber: '',
                paymentMethod: 'COD',
                note: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-2">Địa chỉ giao hàng</label>
                    <Field
                      as="textarea"
                      name="shippingAddress"
                      rows="3"
                      className="w-full border rounded px-4 py-2"
                      placeholder="Nhập địa chỉ giao hàng của bạn"
                    />
                    <ErrorMessage name="shippingAddress" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Số điện thoại</label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      className="w-full border rounded px-4 py-2"
                      placeholder="0123456789"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Phương thức thanh toán</label>
                    <Field
                      as="select"
                      name="paymentMethod"
                      className="w-full border rounded px-4 py-2"
                    >
                      <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                      <option value="VNPay">Thanh toán qua VNPay</option>
                      <option value="Credit Card">Thẻ tín dụng</option>
                    </Field>
                    <ErrorMessage name="paymentMethod" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Ghi chú (tùy chọn)</label>
                    <Field
                      as="textarea"
                      name="note"
                      rows="3"
                      className="w-full border rounded px-4 py-2"
                      placeholder="Ghi chú thêm về đơn hàng của bạn"
                    />
                    <ErrorMessage name="note" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-2 mb-4 pb-4 border-b">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productName} x{item.quantity}</span>
                  <span>{(item.quantity * item.price).toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-blue-600">{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
