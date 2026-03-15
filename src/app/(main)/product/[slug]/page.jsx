"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ShareIcon from '@mui/icons-material/Share'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import VerifiedIcon from '@mui/icons-material/Verified'
import StorefrontIcon from '@mui/icons-material/Storefront'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

// Import data from config
import productsData from '@/config/products.json'
import categoriesData from '@/config/categories.json'
import reviewsData from '@/config/reviews.json'

const ProductDetailPage = () => {
  const params = useParams()
  const slug = params.slug
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find product by slug
    const foundProduct = productsData.find(p => p.slug === slug)
    
    if (foundProduct) {
      setProduct(foundProduct)
      
      // Get related products from same category
      const related = productsData
        .filter(p => p.categoryId === foundProduct.categoryId && p.id !== foundProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)
    }
    setLoading(false)
  }, [slug])

  const getCategoryName = (categoryId) => {
    const category = categoriesData.find(cat => cat.id === categoryId)
    return category?.name || 'Unknown'
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const addToCart = () => {
    showNotification(`${product.name} added to cart!`)
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showNotification(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  const renderStars = (rating, size = 'small') => {
    const stars = []
    const numRating = parseFloat(rating)
    const fullStars = Math.floor(numRating)
    const hasHalfStar = numRating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} fontSize={size} className="text-yellow-400" />)
    }
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" fontSize={size} className="text-yellow-400" />)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<StarBorderIcon key={i} fontSize={size} className="text-yellow-400" />)
    }
    return stars
  }

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      date: 'January 15, 2026',
      title: 'Excellent quality!',
      content: 'This product exceeded my expectations. The quality is outstanding and it looks exactly like the pictures. Would definitely recommend!',
      likes: 24,
      dislikes: 1
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      date: 'January 10, 2026',
      title: 'Great value for money',
      content: 'Very happy with this purchase. Good quality materials and fast shipping. Only giving 4 stars because the color was slightly different from what I expected.',
      likes: 18,
      dislikes: 0
    },
    {
      id: 3,
      user: 'Michael K.',
      rating: 5,
      date: 'January 5, 2026',
      title: 'Perfect addition to my home',
      content: 'Absolutely love this! It fits perfectly in my living room and the quality is top-notch. Customer service was also very helpful.',
      likes: 32,
      dislikes: 2
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Generate multiple images for display
  const productImages = [
    product.image,
    product.image.replace('text=', 'text=Side%20View%20'),
    product.image.replace('text=', 'text=Back%20View%20'),
    product.image.replace('text=', 'text=Detail%20'),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-green-500 text-white">
          <CheckCircleIcon className="w-5 h-5" />
          {notification}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white px-4 py-3 text-sm text-gray-500 border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <ArrowForwardIosIcon className="w-3 h-3" />
          <Link href={`/category?slug=${categoriesData.find(c => c.id === product.categoryId)?.slug}`} className="hover:text-purple-600">
            {getCategoryName(product.categoryId)}
          </Link>
          <ArrowForwardIosIcon className="w-3 h-3" />
          <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-colors ${
                      selectedImage === index ? 'border-purple-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 relative">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                  <img 
                    src={productImages[selectedImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">Out of Stock</span>
                    </div>
                  )}
                  {/* Wishlist button */}
                  <button
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    {isWishlisted ? (
                      <FavoriteIcon className="text-red-500" />
                    ) : (
                      <FavoriteBorderIcon className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-purple-600 font-medium mb-2">{getCategoryName(product.categoryId)}</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-gray-600 ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600">128 Reviews</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-green-600 font-medium">500+ Sold</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-purple-600">${product.price}</span>
                  <span className="text-xl text-gray-400 line-through">${Math.round(product.price * 1.25)}</span>
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">20% OFF</span>
                </div>
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <LocalShippingOutlinedIcon className="w-4 h-4" />
                  Free shipping on orders over $500
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Availability:</span>
                {product.inStock ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircleIcon className="w-5 h-5" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                    product.inStock
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCartIcon />
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`px-6 py-4 rounded-xl font-semibold border-2 transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'
                  }`}
                >
                  {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </button>
                <button className="px-6 py-4 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors">
                  <ShareIcon />
                </button>
              </div>

              {/* Store Info */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                      <StorefrontIcon className="text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">MaxElite Official Store</span>
                        <VerifiedIcon className="text-blue-500 w-5 h-5" />
                      </div>
                      <span className="text-sm text-green-500">Active Now</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-purple-500 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                    Visit Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex border-b overflow-x-auto">
            {['Description', 'Specifications', 'Reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                <p className="text-gray-600 leading-relaxed">
                  This premium quality item is designed to enhance your living space with its elegant design 
                  and superior craftsmanship. Made with carefully selected materials, it combines durability 
                  with aesthetic appeal. Perfect for modern homes looking to add a touch of sophistication.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-500">Product ID</span>
                    <span className="text-gray-800 font-medium">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-800 font-medium">{getCategoryName(product.categoryId)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-500">Currency</span>
                    <span className="text-gray-800 font-medium">{product.currency}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-500">Rating</span>
                    <span className="text-gray-800 font-medium">{product.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-500">Availability</span>
                    <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-500">Warranty</span>
                    <span className="text-gray-800 font-medium">1 Year</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-gray-600">{product.rating} out of 5 (128 reviews)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Write a Review
                  </button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{review.user}</span>
                            <VerifiedIcon className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-800 mt-3">{review.title}</h4>
                      <p className="text-gray-600 mt-2">{review.content}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors">
                          <ThumbUpOutlinedIcon className="w-5 h-5" />
                          <span className="text-sm">{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors">
                          <ThumbDownOutlinedIcon className="w-5 h-5" />
                          <span className="text-sm">{review.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link 
                  href={`/product/${item.slug}`} 
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!item.inStock && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-purple-600">${item.price}</span>
                      <span className="text-sm text-gray-400 line-through">${Math.round(item.price * 1.25)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* You May Also Like */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {productsData.slice(0, 6).map((item) => (
              <Link 
                href={`/product/${item.slug}`} 
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                  <p className="text-purple-600 font-bold mt-1">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
