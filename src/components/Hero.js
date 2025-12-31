import React from 'react'

const Hero = () => {
  return (
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
  )
}

export default Hero