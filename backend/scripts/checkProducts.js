import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'

dotenv.config()

const checkProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    const products = await Product.find().limit(5)
    console.log(`Total products: ${await Product.countDocuments()}`)
    
    if (products.length > 0) {
      console.log('\nFirst product:')
      console.log(JSON.stringify(products[0], null, 2))
    } else {
      console.log('No products found')
    }

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkProducts()
