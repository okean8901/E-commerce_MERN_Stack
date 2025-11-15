import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
      maxlength: [100, 'Tên sản phẩm không được vượt quá 100 ký tự']
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả sản phẩm']
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá sản phẩm'],
      min: [0, 'Giá sản phẩm phải lớn hơn 0']
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng'],
      min: [0, 'Số lượng phải lớn hơn hoặc bằng 0'],
      default: 0
    },
    images: {
      type: [String],
      default: []
    },
    variants: [
      {
        type: {
          type: String,
          enum: ['Storage', 'Color'],
          required: true
        },
        name: {
          type: String,
          required: true
        },
        options: [
          {
            value: String,
            priceAdjustment: {
              type: Number,
              default: 0
            }
          }
        ]
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
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

const Product = mongoose.model('Product', productSchema);
export default Product;
