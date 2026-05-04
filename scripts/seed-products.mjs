import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import mongoose from 'mongoose'

import { connectDB } from '../src/utils/dbconnect.js'
import Product from '../src/models/productModel.js'

const currentFile = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFile)
const productsFile = path.join(currentDir, '..', 'src', 'config', 'products.json')

function toBoolean(value) {
  return Boolean(value)
}

async function main() {
  const raw = await readFile(productsFile, 'utf8')
  const products = JSON.parse(raw)

  if (!Array.isArray(products) || products.length === 0) {
    console.log('No products found in src/config/products.json')
    return
  }

  await connectDB(process.env.MONGO_URI)

  await Product.deleteMany({})

  const docs = products.map((item) => ({
    legacyId: String(item._id || item.id || ''),
    name: item.name || '',
    slug: item.slug || '',
    description: item.description || '',
    price: Number(item.price || 0),
    salePrice: Number(item.salePrice || 0),
    image: item.image || '',
    category: item.category || '',
    categoryId: item.categoryId || '',
    rating: Number(item.rating || 0),
    numReviews: Number(item.numReviews || 0),
    stock: Number(item.stock || 0),
    isFeatured: toBoolean(item.isFeatured),
    isNew: toBoolean(item.isNew),
    isSale: toBoolean(item.isSale),
    discountPercentage: Number(item.discountPercentage || 0),
    brand: item.brand || '',
    color: item.color || '',
    size: item.size || '',
    material: item.material || '',
    weight: item.weight,
    dimensions: item.dimensions || '',
    warranty: item.warranty || '',
    sku: item.sku || '',
    barcode: item.barcode || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
  }))

  const inserted = await Product.insertMany(docs, { ordered: false })

  console.log(`Seeded ${inserted.length} products into MongoDB.`)
}

main()
  .then(async () => {
    await mongoose.disconnect()
  })
  .catch(async (error) => {
    console.error('Failed to seed products:', error)
    await mongoose.disconnect().catch(() => {})
    process.exitCode = 1
  })