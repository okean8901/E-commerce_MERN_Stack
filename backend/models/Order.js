import mongoose from 'mongoose';

const orderDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    shippingAddress: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ giao hàng'],
      maxlength: [200, 'Địa chỉ giao hàng không được vượt quá 200 ký tự']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      maxlength: [10, 'Số điện thoại không được vượt quá 10 ký tự']
    },
    note: {
      type: String,
      maxlength: [500, 'Ghi chú không được vượt quá 500 ký tự']
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'VNPay', 'Credit Card'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Failed'],
      default: 'Unpaid'
    },
    totalAmount: {
      type: Number,
      required: true
    },
    orderDetails: [orderDetailSchema],
    transactionId: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
