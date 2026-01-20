"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ShareIcon from '@mui/icons-material/Share'
import AddIcon from '@mui/icons-material/Add'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import VerifiedIcon from '@mui/icons-material/Verified'
import StorefrontIcon from '@mui/icons-material/Storefront'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Sample product data
  const product = {
    name: "This Ben Hogan Men's Solid Ottoman Golf Polo Shirt",
    price: 187500,
    originalPrice: 250000,
    discount: 25,
    sold: "10K+",
    rating: 4.8,
    reviews: 188,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: [
      { name: 'Black', hex: '#1a1a1a', image: '/images/product-black.jpg' },
      { name: 'White', hex: '#ffffff', image: '/images/product-white.jpg' },
    ],
    images: [
      '/images/product-1.jpg',
      '/images/product-2.jpg',
      '/images/product-3.jpg',
      '/images/product-4.jpg',
      '/images/product-5.jpg',
    ],
    description: "This Ben Hogan Men's Solid Ottoman Golf Polo Shirt makes for versatile casual wear or golf apparel. Built-in moisture wicking and sun protection keep you feeling dry while blocking out harmful UV rays. Durable textured Ottoman fabric and a ribbed collar with three-button placket give it classic polo style. The solid color makes this golf top easy to pair up with any pants or shorts for style that looks great both on and off the course.",
    specifications: {
      'Package Dimensions': '27.3 x 24.8 x 4.9 cm; 180 g',
      'Specification': 'Moisture Wicking, Stretchy, SPF/UV Protection, Easy Care',
      'Date First Available': 'August 08, 2023',
      'Department': 'Mens'
    },
    store: {
      name: 'Barudak Disaster Mall',
      isVerified: true,
      rating: 96,
      location: 'Tulungagung',
      chatReply: 98
    }
  }

  // Styling ideas data
  const stylingIdeas = [
    { id: 1, name: "George Men's and Big Men's 100% Cotton R...", price: 220000, originalPrice: 300000, image: '/images/styling-1.jpg' },
    { id: 2, name: "Men's Easy Reader Date Black/Silver/W...", price: 450000, originalPrice: 745000, image: '/images/styling-2.jpg' },
    { id: 3, name: "Sport Running Shoes for Men Mesh Breath...", price: 330000, originalPrice: 450000, image: '/images/styling-3.jpg' },
  ]

  // Reviews data
  const reviews = [
    {
      id: 1,
      user: 'Anonymous',
      rating: 5,
      date: '08 August 2023',
      title: 'His favorite shirts!',
      color: 'Black',
      size: 'XL',
      content: 'They are scoundrels, do not buy this garbage, they give you poor quality rags, do not buy more clothes in Aiyexpress, on top of that you want to return it and they block you, the miserable',
      likes: 22,
      dislikes: 0
    },
    {
      id: 2,
      user: 'Anonymous',
      rating: 5,
      date: '12 July 2023',
      title: 'Cool as a cucumber',
      color: 'Gray',
      size: 'L',
      content: 'This shirt is made of polyester and I wasn\'t sure how that would go for me, but when I received it and tried it on, I realized that the weave is quite different from the polyester shirts of my childhood. There was nothing uncomfortable about it. It had a certain sheen to it, which looked nice. The gray color is great for me, not too dark or light.',
      likes: 34,
      dislikes: 0
    },
    {
      id: 3,
      user: 'Anonymous',
      rating: 5,
      date: '12 July 2023',
      title: 'My Son inLaw likes these shirts',
      color: 'Black',
      size: '2XL',
      content: 'This is the perfect shirt for my husband who works county fairs, home shows and the state fair, often outside under a canopy as a vendor marketing his product. light weight fabric that is cooler than most polo shirts with a looser weave that allows air flow, colors are lighter hues for summer weather and the fit is just right with a little extra room for air and long enough to allow you to bend over comfortably.',
      likes: 21,
      dislikes: 0
    },
    {
      id: 4,
      user: 'Anonymous',
      rating: 5,
      date: '08 Jun 2023',
      title: 'Best comfortable polo shirt for everyday',
      color: 'Black',
      size: '2XL',
      content: 'The best comfortable and practical polo shorts for summer wear. And you definitely can\'t beat the price for Hanes. I love it so much, I bought three shades of red, black, and heather gray before the prices started going up.',
      likes: 18,
      dislikes: 1
    }
  ]

  // Best sellers data
  const bestSellers = [
    { id: 1, rank: 1, name: "UrbanEdge Men's Jeans Collection", rating: 4.9, sold: "10K+", price: 253000, originalPrice: 370000, image: '/images/bestseller-1.jpg' },
    { id: 2, rank: 2, name: "SIMANLAN Men's Slip on Shoes Cloth Shoes Dec...", rating: 4.9, sold: "10K+", price: 179000, originalPrice: 226000, image: '/images/bestseller-2.jpg' },
    { id: 3, rank: 3, name: "Mafcose Adult Male Distressed Cap Men Co...", rating: 4.9, sold: "8K+", price: 125000, originalPrice: 180000, image: '/images/bestseller-3.jpg' },
    { id: 4, rank: 4, name: "SCODI Mens Flannel Hoodie Shirts Long Slee...", rating: 4.9, sold: "5K+", price: 325000, originalPrice: null, image: '/images/bestseller-4.jpg' },
  ]

  // Review statistics
  const reviewStats = {
    average: 4.8,
    total: 98,
    totalReviews: 125,
    satisfaction: 95,
    breakdown: [
      { stars: 5, count: 136 },
      { stars: 4, count: 33 },
      { stars: 3, count: 9 },
      { stars: 2, count: 10 },
      { stars: 1, count: 2 }
    ],
    filters: ['All (196)', 'Pic Review (12)', 'Fast Shipping (12)', '5 Stars (136)', '4 Stars (33)', '3 Stars (9)', '2 Stars (10)', '1 Stars (2)', 'Good Quality (12)']
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price)
  }

  const renderStars = (rating, size = 'small') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white px-4 py-3 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/results" className="hover:text-purple-600">Product</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-9xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 border-2 rounded-lg cursor-pointer overflow-hidden ${
                      selectedImage === index ? 'border-purple-500' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 relative">
                <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="text-gray-400 text-lg">Product Image {selectedImage + 1}</div>
                  <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
                    <CameraAltOutlinedIcon className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-gray-800">{product.name}</h1>
              
              {/* Rating & Sold */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{product.sold} Sold</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-gray-600 ml-1">{product.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{product.reviews} Reviews</span>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-800">
                  Rp{formatPrice(product.price)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">
                    Rp{formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-red-500 text-sm font-medium">
                    {product.discount}% off
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Select Color</span>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-12 h-12 rounded-lg border-2 overflow-hidden ${
                        selectedColor === index ? 'border-purple-500' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Select Size</span>
                  <button className="text-sm text-purple-600 hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                        selectedSize === size
                          ? 'border-purple-500 bg-purple-50 text-purple-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition">
                  Buy this Item
                </button>
                <button className="w-full border border-gray-800 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                  Add to Bag
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-center gap-8 pt-4 border-t">
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <span className="text-sm">Chat</span>
                </button>
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
                >
                  {isWishlisted ? (
                    <FavoriteIcon fontSize="small" className="text-red-500" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                  <span className="text-sm">Wishlist</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                  <ShareIcon fontSize="small" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="mt-6 pt-6 border-t flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <StorefrontIcon className="text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{product.store.name}</span>
                  {product.store.isVerified && (
                    <VerifiedIcon fontSize="small" className="text-blue-500" />
                  )}
                </div>
                <span className="text-sm text-green-500">Online</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Follow
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Visit Store
              </button>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <StarIcon fontSize="small" className="text-yellow-400" />
                <span>Rating Store: <strong>{product.store.rating}%</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <LocalShippingOutlinedIcon fontSize="small" />
                <span>Location Store: <strong>{product.store.location}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <ChatBubbleOutlineIcon fontSize="small" />
                <span>Chat Reply: <strong>{product.store.chatReply}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
          <div className="flex gap-4 border-b">
            {['Description', 'Styling Ideas', 'Review', 'Best Seller'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.toLowerCase().replace(' ', '-')
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="ml-auto text-sm text-gray-500 hover:text-purple-600 transition">
              Report Product
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="w-48 text-gray-500 text-sm">{key}</span>
                  <span className="text-gray-500 text-sm mr-2">:</span>
                  <span className="text-gray-800 text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

       

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Customer Reviews</h2>
          
          <div className="flex flex-wrap gap-8 mb-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-800">{reviewStats.average}</div>
                <div className="flex mt-1">{renderStars(reviewStats.average)}</div>
                <div className="text-sm text-gray-500 mt-1">{reviewStats.total} rating · {reviewStats.totalReviews} Reviews</div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <div className="text-2xl">😊</div>
                <div>
                  <div className="font-semibold text-green-600">{reviewStats.satisfaction}% of buyers are satisfied</div>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 min-w-[200px]">
              {reviewStats.breakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-2 text-sm">
                  <span className="w-4">{item.stars}</span>
                  <StarIcon fontSize="small" className="text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(item.count / 136) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-500">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {reviewStats.filters.map((filter, index) => (
              <button
                key={index}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  index === 0 
                    ? 'bg-purple-50 border-purple-500 text-purple-600' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{review.title}</h4>
                <div className="text-sm text-gray-500 mb-2">
                  Color: {review.color} · Size: {review.size}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-purple-600 transition">
                    <ThumbUpOutlinedIcon fontSize="small" />
                    <span>{review.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-purple-600 transition">
                    <ThumbDownOutlinedIcon fontSize="small" />
                    <span>{review.dislikes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              See All Reviews
            </button>
          </div>
        </div>

        {/* Best Seller Section */}
        <div className="bg-white rounded-xl shadow-sm mt-6 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Best Seller</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
                <ArrowBackIosIcon fontSize="small" className="text-gray-600" />
              </button>
              <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
                <ArrowForwardIosIcon fontSize="small" className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative">
                  <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400">Product {item.rank}</span>
                  </div>
                  {/* Rank Badge */}
                  <div className={`absolute bottom-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    item.rank === 1 ? 'bg-yellow-500' :
                    item.rank === 2 ? 'bg-gray-400' :
                    item.rank === 3 ? 'bg-amber-600' :
                    'bg-purple-500'
                  }`}>
                    {item.rank}
                  </div>
                  {/* Wishlist Button */}
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <FavoriteBorderIcon fontSize="small" className="text-gray-600" />
                  </button>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <div className="flex items-center gap-0.5">
                      <StarIcon style={{ fontSize: 14 }} className="text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                    <span>·</span>
                    <span>{item.sold} Sold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">Rp{formatPrice(item.price)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">Rp{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <div className="w-24 h-10 bg-purple-600 rounded mb-4 flex items-center justify-center text-white text-sm">
                Logo
              </div>
              <p className="text-sm text-gray-500">"Let's Shop Beyond Boundaries"</p>
              <div className="flex gap-3 mt-4">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">MaxElite</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-purple-600">About MaxElite</a></li>
                <li><a href="#" className="hover:text-purple-600">Career</a></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
                <li><a href="#" className="hover:text-purple-600">B2B Digital</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Buy</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-purple-600">Bill & Top Up</a></li>
                <li><a href="#" className="hover:text-purple-600">COD</a></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
                <li><a href="#" className="hover:text-purple-600">Promo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Sell</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-purple-600">Seller Education Center</a></li>
                <li><a href="#" className="hover:text-purple-600">Brand Index</a></li>
                <li><a href="#" className="hover:text-purple-600">Register Official Store</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Guide and Help</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-purple-600">Care</a></li>
                <li><a href="#" className="hover:text-purple-600">Term and Condition</a></li>
                <li><a href="#" className="hover:text-purple-600">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2001 - 2026, MaxElite.com
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductPage
