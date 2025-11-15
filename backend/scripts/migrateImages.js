import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'

dotenv.config()

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected for migration')

    const products = await Product.find({ $or: [ { images: { $exists: false } }, { images: { $size: 0 } } ] })
    console.log(`Found ${products.length} products to check`)

    let updated = 0
    for (const p of products) {
      if (p.images && p.images.length > 0) continue
      const imageField = p.imageUrl || p.image || ''
      if (!imageField) continue

      // If imageField contains comma-separated URLs, split into array
      const parts = imageField.split(',').map(s => s.trim()).filter(Boolean)
      if (parts.length > 1) {
        p.images = parts
        await p.save()
        updated++
        console.log(`Updated product ${p._id} with ${parts.length} images`)
      }
    }

    console.log(`Migration complete. ${updated} products updated.`)
    await mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error('Migration error:', err)
    await mongoose.connection.close()
    process.exit(1)
  }
}

migrate()
