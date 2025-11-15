import mongoose from 'mongoose'
import 'dotenv/config.js'
import Product from '../models/Product.js'

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    const prod = await Product.findOne({ name: 'iphone 12' }).populate('categoryId')
    console.log('Product found:')
    console.log('ID:', prod._id)
    console.log('Name:', prod.name)
    console.log('Variants:', JSON.stringify(prod.variants, null, 2))
    await mongoose.disconnect()
  } catch(e) {
    console.error('Error:', e.message)
  }
})()
