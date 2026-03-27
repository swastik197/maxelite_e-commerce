import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, index: true },
    description: String,
    price: Number,
    image: String,
    category: String,
    rating: Number,
    numReviews: Number,
    stock: Number,
    isFeatured: Boolean,
    isNew: Boolean,
    isSale: Boolean,
    salePrice: Number,
    discountPercentage: Number,
    brand: String,
    color: String,
    size: String,
    material: String,
    weight: Number,
    dimensions: String,
    warranty: String,
    sku: String,
    barcode: String,
    tags: [String],
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: String,
            rating: Number,
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
