import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'

dotenv.config()

const addVariantsToProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    // Update iPhone 12 with variants
    const updated = await Product.findOneAndUpdate(
      { name: 'iphone 12' },
      {
        variants: [
          {
            type: 'Storage',
            name: 'Dung lượng',
            options: [
              { value: '64GB', priceAdjustment: 0 },
              { value: '128GB', priceAdjustment: 500000 },
              { value: '256GB', priceAdjustment: 1000000 }
            ]
          },
          {
            type: 'Color',
            name: 'Màu sắc',
            options: [
              { value: 'Đen', priceAdjustment: 0 },
              { value: 'Trắng', priceAdjustment: 0 },
              { value: 'Xanh dương', priceAdjustment: 200000 },
              { value: 'Đỏ', priceAdjustment: 300000 }
            ]
          }
        ]
      },
      { new: true }
    )

    if (updated) {
      console.log('✅ Updated iPhone 12 with variants')
      console.log(JSON.stringify(updated.variants, null, 2))
    } else {
      console.log('⚠️ iPhone 12 not found')
    }

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
  }
}

addVariantsToProducts()
