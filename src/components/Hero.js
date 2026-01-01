'use client'
import React, { useRef } from 'react'

const Hero = () => {
  const scrollRef = useRef(null)

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
    <section className='lg:h-screen'>
        <div className='w-full h-96 lg:h-2/3 grid grid-cols-3 gap-4'>
            <div className='ml-6 my-6 col-span-2 bg-violet-400'></div>
            <div className='bg-green-400 mr-6 my-6'></div>

        </div>

        <div className='grid  grid-cols-2 gap-4 w-full h-48 lg:h-1/3'>
            <div className='ml-6 mb-6 bg-yellow-300 '></div>
            <div className='mr-6 mb-6 bg-orange-300 '></div>

        </div>

    </section>
    <section className='m-2 relative'>
      <button 
        onClick={scrollLeft}
        className='absolute left-0 top-1/2 mx-4 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md'
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div 
        ref={scrollRef}
        className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-10'
      >
        <div className='h-72 w-56 min-w-56 bg-pink-400 rounded-lg'></div>
        <div className='h-72 w-56 min-w-56 bg-blue-400 rounded-lg'></div>
        <div className='h-72 w-56 min-w-56 bg-green-400 rounded-lg'></div>
        <div className='h-72 w-56 min-w-56 bg-yellow-400 rounded-lg'></div>
        <div className='h-72 w-56 min-w-56 bg-purple-400 rounded-lg'></div>
        <div className='h-72 w-56 min-w-56 bg-red-400 rounded-lg'></div>
        <div className='h-72 w-56 min-w-56 bg-indigo-400 rounded-lg'></div>
        <div className='h-72 w-56 min-w-56 bg-teal-400 rounded-lg'></div>
      </div>

      <button 
        onClick={scrollRight}
        className='absolute right-0 top-1/2 mx-4 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md'
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
    <section className='mx-4 my-6 grid grid-cols-3 gap-2'>
      <div className='bg-yellow-300 h-52'></div>
      <div className='bg-green-300 h-52'></div>
      <div className='bg-red-300 h-52'></div>
       
    </section>
    </>
  )
}

export default Hero