'use client'
import React, { useEffect, useRef, useState } from 'react'

const Motives = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const cards = [
    { img: '/Gemini_Generated_Image_7av9hi7av9hi7av9.png', alt: 'Payment', title: 'Payment Only Online', desc: 'Shop with confidence. Fully encrypted and safe.', delay: 0 },
    { img: '/Gemini_Generated_Image_ymawuymawuymawuy.png', alt: 'Delivery', title: 'Free Delivery', desc: 'Free shipping on all orders over $50.', delay: 100 },
    { img: '/Gemini_Generated_Image_doanydoanydoanyd.png', alt: 'Returns', title: 'Easy Returns', desc: '30-day hassle-free return policy.', delay: 200 },
    { img: '/Gemini_Generated_Image_9fzajw9fzajw9fza.png', alt: 'Support', title: '24/7 Support', desc: "We're here to help anytime you need us.", delay: 300 },
  ]

  return (
    <div ref={sectionRef} className='w-full mb-0.5 mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 px-4 mt-0 bg-[#001D39] py-4'>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{ transitionDelay: `${card.delay}ms` }}
          className={`flex items-center bg-white rounded-2xl p-2 gap-3 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 hover:shadow-purple-500/10 group ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <div className='h-16 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden'>
            <img
              className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-500'
              src={card.img}
              alt={card.alt}
            />
          </div>
          <div>
            <h2 className='text-black font-bold text-sm group-hover:text-purple-700 transition-colors duration-300'>{card.title}</h2>
            <p className='text-xs text-gray-600'>{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Motives