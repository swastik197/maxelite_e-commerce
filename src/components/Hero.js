'use client'
import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import productsData from '@/config/products.json'
import categoriesData from '@/config/categories.json'
import { useAuth } from '@/context/AuthContext'

// Custom hook for scroll-triggered visibility
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

const Hero = () => {
  const scrollRef = useRef(null)
  const { openAuthModal } = useAuth()

  const featuredProducts = productsData.slice(0, 8)
  const promotionalCategories = categoriesData.slice(0, 6)

  // Scroll reveal refs for each section
  const [bannerRef, bannerVisible] = useScrollReveal(0.1)
  const [promoRef, promoVisible] = useScrollReveal(0.2)
  const [carouselRef, carouselVisible] = useScrollReveal(0.1)
  const [categoryRef, categoryVisible] = useScrollReveal(0.15)
  const [ctaRef, ctaVisible] = useScrollReveal(0.2)

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <>
    {/* bg-[#001D39] */}
      <section ref={carouselRef} className='my-0.5 relative py-4  overflow-hidden'>
        <div className='mx-1 bg-[#4E8EA2] rounded-2xl py-2 pb-4 px-4'>
          <h2 className={`text-2xl font-bold text-white mx-10 mt-4 mb-4 transition-all duration-700 `}>
            Trending Products
            {/* Animated underline */}
            <div className={`h-1 bg-gradient-to-r from-purple-500 via-blue-400 to-transparent rounded-full mt-2 transition-all duration-1000 delay-300 ${carouselVisible ? 'w-40 opacity-100' : 'w-0 opacity-0'}`} />
          </h2>

          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 mx-4 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 active:scale-95'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-10'
          >
            {featuredProducts.map((product, i) => (
              <Link
                href={`/product/${product.slug}`}
                key={product.id}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`md:min-w-[260px] min-w-[200px] z-20 mt-4 bg-white rounded-md shadow-md overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-3 transition-all duration-500`}
              >
                <div className='h-58 md:h-48 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                  />
                  {!product.inStock && (
                    <span className='absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full'>
                      Out of Stock
                    </span>
                  )}
                  <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2'>
                    <button className='bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-purple-100 hover:scale-110 transition-all duration-200 active:scale-90'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16'></div>
                  <div className='absolute bottom-2 p-1.5 bg-white rounded-2xl left-2 flex items-center gap-1 mb-2'>
                    <div className='flex items-center gap-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'} transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className='text-xs text-gray-500 ml-1'>({product.rating})</span>
                  </div>
                </div>
                <div className='p-1 md:p-2'>

                  <h3 className='font-semibold text-gray-800 truncate text-lg mb-2 group-hover:text-purple-700 transition-colors duration-300'>{product.name}</h3>
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
            className='absolute right-0 top-1/2 mx-4 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 active:scale-95'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
      {/* ═══ Hero Banner Section ══════════════════════════════════ */}
      {/*bg-[#001D39]*/}
      <section ref={bannerRef} className='lg:h-screen  p-3 py-6 sm:p-4 lg:p-6 lg:py-10 flex flex-col gap-3 sm:gap-4'>
        <div className='w-full flex-1 grid sm:grid-cols-3 grid-cols-1 gap-3 sm:gap-4 min-h-0'>
          {/* Main Banner */}
          <div
            style={{ backgroundImage: "url('/Gemini_Generated_Image_m6og39m6og39m6og.png')" }}
            className={`col-span-1 sm:col-span-2 bg-cover bg-center rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[200px] sm:min-h-0 transition-all duration-1000 ease-out ${bannerVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-[0.97]'
              }`}
          >
            <div className='absolute inset-0 bg-black/40'></div>
            {/* Shimmer effect overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite] -skew-x-12' />
            <div className='relative z-10 text-center text-white p-5 sm:p-8'>
              <p className={`text-purple-200 text-xs sm:text-sm mb-1 sm:mb-2 transition-all duration-700 delay-300 ${bannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                New Arrivals
              </p>
              <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 transition-all duration-700 delay-500 ${bannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                Modern Furniture Collection
              </h2>
              <p className={`text-purple-200 text-sm sm:text-base mb-4 sm:mb-6 transition-all duration-700 delay-700 ${bannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Discover our latest styles up to 40% off
              </p>
              <Link
                href='/category?slug=living-room'
                className={`inline-block bg-white text-purple-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-purple-100 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 ${bannerVisible ? 'opacity-100 translate-y-0 delay-[900ms]' : 'opacity-0 translate-y-4'}`}
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Flash Sale Banner */}
          <div
            style={{ backgroundImage: "url('/Gemini_Generated_Image_hx8i9jhx8i9jhx8i.png')" }}
            className={`bg-cover bg-center rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[160px] sm:min-h-0 transition-all duration-1000 ease-out delay-300 ${bannerVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-[0.97]'
              }`}
          >
            <div className='absolute inset-0 bg-black/40'></div>
            <div className='relative z-10 text-center text-white p-4 sm:p-6'>
              <p className={`text-pink-200 text-xs mb-1 sm:mb-2 transition-all duration-500 delay-700 ${bannerVisible ? 'opacity-100' : 'opacity-0'}`}>Limited Time</p>
              <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 transition-all duration-500 delay-[800ms] ${bannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Flash Sale</h3>
              <p className={`text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-700 delay-[900ms] ${bannerVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                30% OFF
              </p>
              <p className={`text-pink-200 text-xs sm:text-sm transition-all duration-500 delay-[1000ms] ${bannerVisible ? 'opacity-100' : 'opacity-0'}`}>On all decor items</p>
            </div>
          </div>
        </div>

        {/* Promo strips */}
        <div ref={promoRef} className='hidden md:grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
          <div className={`bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 overflow-hidden group hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500 cursor-pointer ${promoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDuration: '700ms' }}>
            <div className='text-white'>
              <p className='text-amber-100 text-xs sm:text-sm'>Free Shipping</p>
              <h3 className='text-base sm:text-xl font-bold'>On Orders Over $500</h3>
              <Link href='/category?slug=bedroom' className='text-xs sm:text-sm underline hover:text-amber-100'>Shop Bedroom →</Link>
            </div>
            <div className='text-4xl sm:text-6xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500'>🚚</div>
          </div>
          <div className={`bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 cursor-pointer ${promoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDuration: '700ms', transitionDelay: '150ms' }}>
            <div className='text-white'>
              <p className='text-emerald-100 text-xs sm:text-sm'>Member Exclusive</p>
              <h3 className='text-base sm:text-xl font-bold'>Extra 15% Off</h3>
              <button onClick={openAuthModal} className='text-xs sm:text-sm underline hover:text-emerald-100'>Join Now →</button>
            </div>
            <div className='text-4xl sm:text-6xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500'>🎁</div>
          </div>
        </div>
      </section>

      {/* ═══ Featured Products Carousel ═══════════════════════════ */}
      <section ref={carouselRef} className='my-0.5 relative py-4 overflow-hidden'>
        <div className='mx-1 bg-[#49769F] rounded-2xl py-2 pb-4 px-4'>
          <h2 className={`text-2xl font-bold text-white mx-3 md:mx-10 mt-2 mb-4 transition-all duration-700 ${carouselVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            Featured Products
            {/* Animated underline */}
            <div className={`h-1 bg-gradient-to-r from-purple-500 via-blue-400 to-transparent rounded-full mt-2 transition-all duration-1000 delay-300 ${carouselVisible ? 'w-40 opacity-100' : 'w-0 opacity-0'}`} />
          </h2>

          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 mx-4 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 active:scale-95'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-10'
          >
            {featuredProducts.map((product, i) => (
              <Link
                href={`/product/${product.slug}`}
                key={product.id}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`md:min-w-[260px] min-w-[200px] z-20 mt-4 bg-white rounded-md shadow-md overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-3 transition-all duration-500 ${carouselVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}
              >
                <div className='h-58 md:h-48 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                  />
                  {!product.inStock && (
                    <span className='absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full'>
                      Out of Stock
                    </span>
                  )}
                  <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2'>
                    <button className='bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-purple-100 hover:scale-110 transition-all duration-200 active:scale-90'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16'></div>
                  <div className='absolute bottom-2 p-1.5 bg-white rounded-2xl left-2 flex items-center gap-1 mb-2'>
                    <div className='flex items-center gap-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'} transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className='text-xs text-gray-500 ml-1'>({product.rating})</span>
                  </div>
                </div>
                <div className='p-1 md:p-2'>

                  <h3 className='font-semibold text-gray-800 truncate text-lg mb-2 group-hover:text-purple-700 transition-colors duration-300'>{product.name}</h3>
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
            className='absolute right-0 top-1/2 mx-4 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 active:scale-95'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ═══ Category Showcase ═════════════════════════════════════ */}
      <section ref={categoryRef} className='my-0.5 bg-[#0A4174]  mx-1 rounded-2xl py-8 px-4'>
        <h2 className={`text-2xl font-bold text-white mx-2 mb-6 transition-all duration-700 ${categoryVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          Shop by Category
          <div className={`h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent rounded-full mt-2 transition-all duration-1000 delay-200 ${categoryVisible ? 'w-36 opacity-100' : 'w-0 opacity-0'}`} />
        </h2>
        <div className='grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto scrollbar-hide px-2 md:grid-rows-none md:grid-cols-3 md:grid-flow-row md:gap-5 md:overflow-x-visible'>
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
                style={Object.assign(
                  {},
                  category.image ? { backgroundImage: `url('${category.image}')` } : {},
                  { transitionDelay: `${index * 150}ms` }
                )}
                className={`h-58 md:h-72 min-w-58 md:min-w-0 flex-shrink-0 md:flex-shrink rounded-md relative overflow-hidden group bg-cover bg-center ${category.image ? '' : `bg-gradient-to-br ${bgColors[index]}`} transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-purple-500/15 hover:-translate-y-2 ${categoryVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                  }`}
              >
                <div className='absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500'></div>
                {/* Hover shimmer */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_ease-in-out] -skew-x-12 transition-opacity duration-300' />
                <div className='relative z-10 h-full flex flex-col justify-end p-6 text-white'>
                  <h3 className='text-2xl font-bold mb-1 group-hover:translate-x-1 transition-transform duration-300'>{category.name}</h3>
                  <p className='text-white/80 text-sm mb-3 group-hover:translate-x-1 transition-transform duration-300 delay-75'>{category.description}</p>
                  <span className='text-sm font-medium underline group-hover:translate-x-2 transition-transform duration-300 delay-100 inline-flex items-center gap-1'>
                    Explore Collection
                    <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ═══ Membership CTA Banner ════════════════════════════════ */}
      <section ref={ctaRef} className='mx-4 my-8'>
        <div className={`bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 rounded-xl p-8 md:p-12 text-white text-center relative overflow-hidden transition-all duration-1000 ease-out ${ctaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'
          }`}>
          {/* Decorative animated circles */}
          <div className='absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[pulse_4s_ease-in-out_infinite]' />
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 animate-[pulse_5s_ease-in-out_infinite_1s]' />
          <div className='absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full animate-[pulse_3s_ease-in-out_infinite_0.5s]' />

          <div className='relative z-10'>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 delay-200 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Join Our Membership Program
            </h2>
            <p className={`text-purple-200 mb-6 max-w-2xl mx-auto transition-all duration-700 delay-400 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Get exclusive access to new collections, special discounts, and personalized recommendations.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-[600ms] ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <button
                onClick={openAuthModal}
                className='bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-purple-100 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300 active:scale-95'
              >
                Sign Up Free
              </button>
              <Link
                href='/category?slug=decor'
                className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 active:scale-95'
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </>
  )
}

export default Hero