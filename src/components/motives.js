import React from 'react'

const motives = () => {
  return (
    <div className='w-full mb-0.5 grid grid-cols-2 md:grid-cols-4 gap-3 px-4 mt-0 bg-[#001D39] py-4'>
        <div className='flex items-center bg-white rounded-2xl p-2 gap-3'>
            <div className='h-16 sm:h-24sm:w-24 flex-shrink-0 rounded-xl overflow-hidden'>
                <img className='h-full w-full object-cover' src='/Gemini_Generated_Image_7av9hi7av9hi7av9.png' alt='Payment'/>
            </div>
            <div>
                <h2 className='text-black font-bold text-sm'>Payment Only Online</h2>
                <p className='text-xs text-gray-600'>Shop with confidence. Fully encrypted and safe.</p>
            </div>
        </div>
        <div className='flex items-center bg-white rounded-2xl p-2 gap-3'>
            <div className='h-16 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden'>
                <img className='h-full w-full object-cover' src='/Gemini_Generated_Image_ymawuymawuymawuy.png' alt='Delivery'/>
            </div>
            <div>
                <h2 className='text-black font-bold text-sm'>Free Delivery</h2>
                <p className='text-xs text-gray-600'>Free shipping on all orders over $50.</p>
            </div>
        </div>
        <div className='flex items-center bg-white rounded-2xl p-2 gap-3'>
            <div className='h-16 sm:h-24  sm:w-24 flex-shrink-0 rounded-xl overflow-hidden'>
                <img className='h-full w-full object-cover' src='/Gemini_Generated_Image_doanydoanydoanyd.png' alt='Returns'/>
            </div>
            <div>
                <h2 className='text-black font-bold text-sm'>Easy Returns</h2>
                <p className='text-xs text-gray-600'>30-day hassle-free return policy.</p>
            </div>
        </div>
        <div className='flex items-center bg-white rounded-2xl p-2 gap-3'>
            <div className='h-16 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden'>
                <img className='h-full w-full object-cover' src='/Gemini_Generated_Image_9fzajw9fzajw9fza.png' alt='Support'/>
            </div>
            <div>
                <h2 className='text-black font-bold text-sm'>24/7 Support</h2>
                <p className='text-xs text-gray-600'>We're here to help anytime you need us.</p>
            </div>
        </div>
    </div>
  )
}

export default motives