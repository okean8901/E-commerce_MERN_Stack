import React from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      productName: product.name,
      price: product.price,
      imageUrl: (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl,
      quantity: 1,
    }))
    toast.success('Thêm vào giỏ hàng thành công')
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={(product.images && product.images.length > 0) ? product.images[0] : (product.imageUrl || '/placeholder.png')}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      </Link>
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        <Link to={`/products/${product._id}`} className="hover:text-blue-600">
          {product.name}
        </Link>
      </h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-blue-600">
          {product.price.toLocaleString('vi-VN')}₫
        </span>
        {product.stockQuantity > 0 ? (
          <button
            onClick={handleAddToCart}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaShoppingCart />
            Thêm
          </button>
        ) : (
          <button
            disabled
            className="btn bg-gray-400 text-white cursor-not-allowed"
          >
            Hết hàng
          </button>
        )}
      </div>
      {product.rating > 0 && (
        <div className="mt-2 text-sm text-yellow-500">
          ⭐ {product.rating.toFixed(1)} ({product.reviewCount} đánh giá)
        </div>
      )}
    </div>
  )
}

export default ProductCard
