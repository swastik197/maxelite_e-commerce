'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import productsData from '@/config/products.json'
import categoriesData from '@/config/categories.json'
import { useAuth } from '@/context/AuthContext'

const Hero = () => {
  const scrollRef = useRef(null)
  const { openAuthModal } = useAuth()

  // Get featured products
  const featuredProducts = productsData.slice(0, 8)

  // Get categories for promotional sections
  const promotionalCategories = categoriesData.slice(0, 3)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Hero Banner Section */}
      <section className='lg:h-screen bg-[#001D39] p-3 py-6  sm:p-4 lg:p-6 lg:py-10 flex flex-col gap-3 sm:gap-4'>
        <div className='w-full flex-1 grid sm:grid-cols-3 grid-cols-1 gap-3 sm:gap-4 min-h-0'>
          <div style={{ backgroundImage: "url('/Gemini_Generated_Image_m6og39m6og39m6og.png')" }} className='col-span-1 sm:col-span-2 bg-cover bg-center rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[200px] sm:min-h-0'>
            <div className='absolute inset-0 bg-black/40 '></div>
            <div className='relative z-10 text-center text-white p-5 sm:p-8'>
              <p className='text-purple-200 text-xs sm:text-sm mb-1 sm:mb-2'>New Arrivals</p>
              <h2 className='text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4'>Modern Furniture Collection</h2>
              <p className='text-purple-200 text-sm sm:text-base mb-4 sm:mb-6'>Discover our latest styles up to 40% off</p>
              <Link href='/category?slug=living-room' className='bg-white text-purple-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-purple-100 transition-colors'>
                Shop Now
              </Link>
            </div>
          </div>
          <div style={{ backgroundImage: "url('/Gemini_Generated_Image_hx8i9jhx8i9jhx8i.png')" }} className='bg-cover bg-center rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[160px] sm:min-h-0'>
            <div className='absolute inset-0 bg-black/40 '></div>
            <div className='relative z-10 text-center text-white p-4 sm:p-6'>
              <p className='text-pink-200 text-xs mb-1 sm:mb-2'>Limited Time</p>
              <h3 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-3'>Flash Sale</h3>
              <p className='text-3xl sm:text-4xl font-bold mb-1 sm:mb-2'>30% OFF</p>
              <p className='text-pink-200 text-xs sm:text-sm'>On all decor items</p>
            </div>
          </div>
        </div>

        <div className='hidden md:grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
          <div className='bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 overflow-hidden'>
            <div className='text-white'>
              <p className='text-amber-100 text-xs sm:text-sm'>Free Shipping</p>
              <h3 className='text-base sm:text-xl font-bold'>On Orders Over $500</h3>
              <Link href='/category?slug=bedroom' className='text-xs sm:text-sm underline hover:text-amber-100'>Shop Bedroom →</Link>
            </div>
            <div className='text-4xl sm:text-6xl opacity-100'>🚚</div>
          </div>
          <div className='bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 overflow-hidden'>
            <div className='text-white'>
              <p className='text-emerald-100 text-xs sm:text-sm'>Member Exclusive</p>
              <h3 className='text-base sm:text-xl font-bold'>Extra 15% Off</h3>
              <button onClick={openAuthModal} className='text-xs sm:text-sm underline hover:text-emerald-100'>Join Now →</button>
            </div>
            <div className='text-4xl sm:text-6xl opacity-100'>🎁</div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className='my-0.5 relative py-8 bg-[#001D39]'>
        <h2 className='text-2xl font-bold text-white mx-10 mb-6'>Featured Products</h2>

        <button
          onClick={scrollLeft}
          className='absolute left-0 top-1/2 mx-4 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-10'
        >
          {featuredProducts.map((product) => (
            <Link
              href={`/product/${product.slug}`}
              key={product.id}
              className='md:min-w-[260px] min-w-[200px] z-20 bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300'
            >
              <div className='h-48 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                {!product.inStock && (
                  <span className='absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full'>
                    Out of Stock
                  </span>
                )}
                <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <button className='bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-purple-100 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16'></div>
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-1 mb-2'>
                  <div className='flex items-center gap-0.5'>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className='text-xs text-gray-500 ml-1'>({product.rating})</span>
                </div>
                <h3 className='font-semibold text-gray-800 truncate text-sm mb-2'>{product.name}</h3>
                <div className='flex items-center justify-between'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-xl font-bold text-purple-600'>${product.price}</span>
                    <span className='text-sm text-gray-400 line-through'>${Math.round(product.price * 1.25)}</span>
                  </div>
                  <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full'>-20%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className='absolute right-0 top-1/2 mx-4 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Category Showcase */}
      <section className='my-0.5 bg-[#001D39] p-4'>
        <h2 className='text-2xl font-bold text-white mx-2 mb-6'>Shop by Category</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {promotionalCategories.map((category, index) => {
            const bgColors = [
              'from-purple-500 to-indigo-600',
              'from-emerald-500 to-teal-600',
              'from-orange-500 to-red-500'
            ]
            return (
                <Link
                key={category.id}
                href={`/category?slug=${category.slug}`}
                  style={category.image ? { backgroundImage: `url('${category.image}')` } : undefined}
                  className={`h-52 rounded-xl relative overflow-hidden group bg-cover bg-center ${category.image ? '' : `bg-gradient-to-br ${bgColors[index]}`}`}
              >
                  <div className='absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors'></div>
                <div className='relative z-10 h-full flex flex-col justify-end p-6 text-white'>
                  <h3 className='text-2xl font-bold mb-1'>{category.name}</h3>
                  <p className='text-white/80 text-sm mb-3'>{category.description}</p>
                  <span className='text-sm font-medium underline'>Explore Collection →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className='mx-4 my-8'>
        <div className='bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 rounded-xl p-8 md:p-12 text-white text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Join Our Membership Program</h2>
          <p className='text-purple-200 mb-6 max-w-2xl mx-auto'>
            Get exclusive access to new collections, special discounts, and personalized recommendations.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button onClick={openAuthModal} className='bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors'>
              Sign Up Free
            </button>
            <Link href='/category?slug=decor' className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors'>
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero