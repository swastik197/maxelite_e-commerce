"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import VerifiedIcon from '@mui/icons-material/Verified'
import StorefrontIcon from '@mui/icons-material/Storefront'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import SecurityIcon from '@mui/icons-material/Security'
import CachedIcon from '@mui/icons-material/Cached'

const NAV = '#001e3a'
const ACCENT = '#0f3c4c'

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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)

      try {
        const searchQuery = decodeURIComponent(slug || '').replace(/-/g, ' ')
        const searchUrl = new URL('/api/product/search/result', window.location.origin)
        searchUrl.searchParams.set('slug', slug)
        searchUrl.searchParams.set('q', searchQuery)
        searchUrl.searchParams.set('limit', '20')
        searchUrl.searchParams.set('sort', 'relevance')

        const res = await fetch(searchUrl.toString(), { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load product')

        const products = Array.isArray(data.products) ? data.products : []
        const slugBase = String(slug || '').replace(/-\d+$/, '')
        const exactMatch = products.find((item) => String(item.slug) === String(slug))
          || products.find((item) => String(item.slug) === slugBase)
          || products[0] || null

        if (!exactMatch) {
          setProduct(null)
          setRelatedProducts([])
          return
        }

        const mappedProduct = {
          id: String(exactMatch._id || exactMatch.id),
          name: exactMatch.name || '',
          slug: exactMatch.slug || '',
          description: exactMatch.description || '',
          price: Number(exactMatch.salePrice || exactMatch.price || 0),
          originalPrice: Number(exactMatch.price || 0),
          image: exactMatch.image || '',
          category: exactMatch.category || '',
          rating: Number(exactMatch.rating || 0),
          stock: Number(exactMatch.stock || 0),
          inStock: Number(exactMatch.stock || 0) > 0,
          isSale: Boolean(exactMatch.isSale),
        }

        setProduct(mappedProduct)

        const relatedUrl = new URL('/api/product/search/result', window.location.origin)
        relatedUrl.searchParams.set('q', mappedProduct.category || searchQuery)
        relatedUrl.searchParams.set('category', mappedProduct.category || searchQuery)
        relatedUrl.searchParams.set('limit', '8')
        relatedUrl.searchParams.set('sort', 'rating')

        const relatedRes = await fetch(relatedUrl.toString(), { cache: 'no-store' })
        const relatedData = await relatedRes.json()
        if (relatedRes.ok) {
          const related = (Array.isArray(relatedData.products) ? relatedData.products : [])
            .filter((item) => String(item._id || item.id) !== mappedProduct.id)
            .slice(0, 4)
            .map((item) => ({
              id: String(item._id || item.id),
              name: item.name || '',
              slug: item.slug || '',
              description: item.description || '',
              price: Number(item.salePrice || item.price || 0),
              originalPrice: Number(item.price || 0),
              image: item.image || '',
              category: item.category || '',
              rating: Number(item.rating || 0),
              stock: Number(item.stock || 0),
              inStock: Number(item.stock || 0) > 0,
            }))
          setRelatedProducts(related)
        }
      } catch {
        setProduct(null)
        setRelatedProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  useEffect(() => {
    if (!product) return

    const syncWishlistState = async () => {
      try {
        const res = await fetch('/api/user/wishlist', { cache: 'no-store' })
        if (!res.ok) return

        const data = await res.json()
        const wishlist = Array.isArray(data.wishlist) ? data.wishlist : []
        setIsWishlisted(wishlist.some((item) => String(item.id) === String(product.id)))
      } catch {
        // Keep the UI usable if the user is not authenticated yet.
      }
    }

    syncWishlistState()
  }, [product])

  const getCategoryName = () => {
    return product?.category || 'Unknown'
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const addToCart = async () => {
    if (!product?.id) return

    try {
      const res = await fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add to cart')

      showNotification(`${product.name} added to cart!`)
    } catch {
      showNotification('Unable to add to cart', 'error')
    }
  }

  const toggleWishlist = async () => {
    if (!product?.id) return

    const shouldAdd = !isWishlisted

    try {
      const res = await fetch('/api/user/wishlist', {
        method: shouldAdd ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update wishlist')

      setIsWishlisted(shouldAdd)
      showNotification(shouldAdd ? 'Added to wishlist!' : 'Removed from wishlist')
    } catch {
      showNotification('Unable to update wishlist', 'error')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const num = parseFloat(rating)
    const full = Math.floor(num)
    const half = num % 1 >= 0.5
    for (let i = 0; i < full; i++) stars.push(<StarIcon key={i} sx={{ fontSize: 18 }} className="text-amber-400" />)
    if (half) stars.push(<StarHalfIcon key="h" sx={{ fontSize: 18 }} className="text-amber-400" />)
    for (let i = stars.length; i < 5; i++) stars.push(<StarBorderIcon key={`e${i}`} sx={{ fontSize: 18 }} className="text-amber-400" />)
    return stars
  }

  const reviews = [
    { id: 1, user: 'John D.', rating: 5, date: 'January 15, 2026', title: 'Excellent quality!', content: 'This product exceeded my expectations. The quality is outstanding and it looks exactly like the pictures. Would definitely recommend!', likes: 24, dislikes: 1 },
    { id: 2, user: 'Sarah M.', rating: 4, date: 'January 10, 2026', title: 'Great value for money', content: 'Very happy with this purchase. Good quality materials and fast shipping. Only giving 4 stars because the color was slightly different from what I expected.', likes: 18, dislikes: 0 },
    { id: 3, user: 'Michael K.', rating: 5, date: 'January 5, 2026', title: 'Perfect addition to my home', content: 'Absolutely love this! It fits perfectly in my living room and the quality is top-notch. Customer service was also very helpful.', likes: 32, dislikes: 2 },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: NAV }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/60">Loading product...</p>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#001e3a] mb-3">Product Not Found</h1>
        <p className="text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
        <Link href="/" className="bg-[#001e3a] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-[#0f3c4c] transition-colors inline-flex items-center gap-2">
          Back to Home <ArrowOutwardIcon sx={{ fontSize: 18 }} />
        </Link>
      </div>
    </div>
  )

  const productImages = [
    product.image,
    product.image ? product.image.replace('text=', 'text=Side+View+') : '',
    product.image ? product.image.replace('text=', 'text=Back+View+') : '',
    product.image ? product.image.replace('text=', 'text=Detail+') : '',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Toast */}
      {notification && (
        <div className={`fixed top-16 right-4 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transition-all duration-300 ${notification.type === 'success' ? 'bg-[#001e3a]' : 'bg-red-600'} text-white`}>
          <CheckCircleIcon sx={{ fontSize: 18 }} />
          {notification.message}
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAV} 0%, ${ACCENT} 100%)`, minHeight: 160 }}>
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[8%] w-2 h-2 bg-white/20 rounded-full animate-[floatParticle_8s_ease-in-out_infinite]" />
          <div className="absolute top-[55%] left-[75%] w-3 h-3 bg-blue-300/10 rounded-full animate-[floatParticle_10s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[35%] left-[50%] w-1.5 h-1.5 bg-white/15 rounded-full animate-[floatParticle_6s_ease-in-out_infinite_2s]" />
        </div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 relative z-10">
          <div className={`flex items-center gap-2 text-white/50 text-sm transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
            <Link href={`/results/${encodeURIComponent(product.category || '')}`} className="hover:text-white transition-colors">
              {getCategoryName()}
            </Link>
            <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
            <span className="text-white/80 truncate max-w-xs">{product.name}</span>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 56 L0 28 Q360 0 720 28 Q1080 56 1440 28 L1440 56 Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px- sm:px-6 lg:px-8 py-8 -mt-2">

        {/* ── Main Product Card ── */}
        <div className={`bg-white rounded-3xl border border-gray-100 shadow- overflow-hidden mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Images */}
            <div className="flex flex-col-reverse md:flex-row gap-4 p-6 bg-gray-50/50">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-[#001e3a] shadow-md scale-105' : 'border-transparent hover:border-[#001e3a]/30'}`}
                  >
                    <img src={img || product.image || ''} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1 relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner relative group">
                  <img
                    src={productImages[selectedImage] || product.image || ''}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold">Out of Stock</span>
                    </div>
                  )}
                  {/* Wishlist FAB */}
                  <button
                    onClick={toggleWishlist}
                    className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${isWishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
                  >
                    {isWishlisted ? <FavoriteIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ fontSize: 20 }} />}
                  </button>
                  {/* 20% OFF badge */}
                  <div className="absolute top-4 left-4 bg-[#001e3a] text-white text-xs font-bold px-3 py-1 rounded-full">
                    20% OFF
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 lg:p-8 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Category + name */}
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase text-[#001e3a]/50">{getCategoryName()}</span>
                  <h1 className="text-2xl lg:text-3xl font-light text-[#001e3a] mt-1 leading-snug">
                    {product.name.split(' ').slice(0, -1).join(' ')}{' '}
                    <span className="font-bold">{product.name.split(' ').slice(-1)}</span>
                  </h1>
                </div>

                {/* Rating row */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-[#001e3a] font-bold ml-1">{product.rating}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-400">128 Reviews</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-emerald-500 font-semibold">500+ Sold</span>
                </div>

                {/* Price box */}
                <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${NAV}08, ${NAV}14)`, border: `1px solid ${NAV}18` }}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#001e3a]">${product.price}</span>
                    <span className="text-lg text-gray-300 line-through">${Math.round(product.price * 1.25)}</span>
                    <span className="text-emerald-500 text-sm font-semibold">Save ${Math.round(product.price * 0.25)}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 flex items-center gap-1.5">
                    <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
                    Free shipping on orders over $500
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed text-sm">{product.description}</p>

                {/* Stock status */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm font-medium">Quantity</span>
                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2.5 hover:bg-[#001e3a] hover:text-white transition-colors text-gray-500"
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </button>
                    <span className="px-5 font-bold text-[#001e3a] text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2.5 hover:bg-[#001e3a] hover:text-white transition-colors text-gray-500"
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">= <span className="text-[#001e3a] font-bold">${(product.price * quantity).toFixed(2)}</span></span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group ${product.inStock ? 'text-white hover:opacity-90 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  style={product.inStock ? { background: `linear-gradient(135deg, ${NAV}, ${ACCENT})` } : {}}
                >
                  <ShoppingCartIcon sx={{ fontSize: 20 }} />
                  Add to Cart
                  <ArrowOutwardIcon sx={{ fontSize: 16 }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={toggleWishlist}
                    className={`flex-1 py-3 rounded-2xl font-semibold border-2 transition-all flex items-center justify-center gap-2 ${isWishlisted ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-[#001e3a] hover:text-[#001e3a]'}`}
                  >
                    {isWishlisted ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                  <button className="px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-[#001e3a] hover:text-[#001e3a] transition-all">
                    <ShareIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-5 grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
                {[
                  { icon: <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />, label: 'Free Shipping' },
                  { icon: <SecurityIcon sx={{ fontSize: 20 }} />, label: 'Secure Pay' },
                  { icon: <CachedIcon sx={{ fontSize: 20 }} />, label: 'Easy Returns' },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 text-center">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#001e3a]" style={{ background: `${NAV}10` }}>
                      {b.icon}
                    </div>
                    <span className="text-xs text-gray-400">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Store */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${NAV}12` }}>
                    <StorefrontIcon sx={{ fontSize: 22 }} style={{ color: NAV }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[#001e3a] text-sm">MaxElite Official Store</span>
                      <VerifiedIcon sx={{ fontSize: 16 }} className="text-blue-500" />
                    </div>
                    <span className="text-xs text-emerald-500 font-medium">● Active Now</span>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl border-2 border-[#001e3a]/20 text-[#001e3a] text-sm font-semibold hover:bg-[#001e3a] hover:text-white transition-all">
                  Visit Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md mb-8 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 overflow-x-auto" style={{ background: `${NAV}04` }}>
            {['Description', 'Specifications', 'Reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-7 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab.toLowerCase()
                  ? 'border-[#001e3a] text-[#001e3a] bg-white'
                  : 'border-transparent text-gray-400 hover:text-[#001e3a]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <div className="mb-2">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#001e3a]/40 mb-1">About this product</p>
                  <h3 className="text-2xl font-light text-[#001e3a]">Product <span className="font-bold">Description</span></h3>
                </div>
                <p className="text-gray-500 leading-relaxed">{product.description}</p>
                <p className="text-gray-500 leading-relaxed">
                  This premium quality item is designed to enhance your living space with its elegant design
                  and superior craftsmanship. Made with carefully selected materials, it combines durability
                  with aesthetic appeal. Perfect for modern homes looking to add a touch of sophistication.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {['Premium Materials', 'Modern Design', '1 Year Warranty'].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${NAV}07` }}>
                      <CheckCircleIcon sx={{ fontSize: 20 }} style={{ color: NAV }} />
                      <span className="text-sm font-medium text-[#001e3a]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <div className="mb-5">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#001e3a]/40 mb-1">Technical details</p>
                  <h3 className="text-2xl font-light text-[#001e3a]">Product <span className="font-bold">Specifications</span></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100">
                  {[
                    ['Product ID', product.id],
                    ['Category', getCategoryName()],
                    ['Currency', product.currency || 'USD'],
                    ['Rating', `${product.rating} / 5.0`],
                    ['Availability', product.inStock ? 'In Stock' : 'Out of Stock'],
                    ['Warranty', '1 Year'],
                  ].map(([label, value], i) => (
                    <div key={i} className={`flex justify-between items-center px-5 py-4 ${i % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'} border-b border-gray-100`}>
                      <span className="text-gray-400 text-sm">{label}</span>
                      <span className={`font-semibold text-sm ${label === 'Availability' ? (product.inStock ? 'text-emerald-600' : 'text-red-500') : 'text-[#001e3a]'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-[#001e3a]/40 mb-1">What people say</p>
                    <h3 className="text-2xl font-light text-[#001e3a]">Customer <span className="font-bold">Reviews</span></h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-gray-400 text-sm">{product.rating} out of 5 (128 reviews)</span>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90" style={{ background: NAV }}>
                    Write a Review
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-5 rounded-2xl border border-gray-100 hover:border-[#001e3a]/20 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: NAV }}>
                              {review.user[0]}
                            </div>
                            <span className="font-semibold text-[#001e3a]">{review.user}</span>
                            <VerifiedIcon sx={{ fontSize: 15 }} className="text-emerald-500" />
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 ml-10">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-[#001e3a] mb-1">{review.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{review.content}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#001e3a] transition-colors text-sm">
                          <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} /> {review.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-sm">
                          <ThumbDownOutlinedIcon sx={{ fontSize: 16 }} /> {review.dislikes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-5 py-3 rounded-2xl border-2 border-[#001e3a]/10 text-[#001e3a] font-semibold text-sm hover:bg-[#001e3a] hover:text-white transition-all">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="mb-5">
              <p className="text-xs font-bold tracking-widest uppercase text-[#001e3a]/40 mb-1">Same collection</p>
              <h2 className="text-2xl font-light text-[#001e3a]">Related <span className="font-bold">Products</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link
                  href={`/product/${item.slug}`}
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {!item.inStock && (
                      <span className="absolute top-2 left-2 bg-[#001e3a] text-white text-xs px-2 py-0.5 rounded-full">Sold Out</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#001e3a] text-sm truncate">{item.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <StarIcon sx={{ fontSize: 13 }} className="text-amber-400" />
                      <span className="text-xs text-gray-400">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-[#001e3a]">${item.price}</span>
                      <span className="text-xs text-gray-300 line-through">${Math.round(item.price * 1.25)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── You May Also Like ── */}
        <div className="mb-12">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest uppercase text-[#001e3a]/40 mb-1">Hand-picked for you</p>
            <h2 className="text-2xl font-light text-[#001e3a]">You May Also <span className="font-bold">Like</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {relatedProducts.slice(0, 6).map((item) => (
              <Link
                href={`/product/${item.slug}`}
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-[#001e3a] truncate">{item.name}</h3>
                    <p className="text-[#001e3a] font-bold text-sm mt-1">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(8px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-8px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(4px); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

export default ProductDetailPage
