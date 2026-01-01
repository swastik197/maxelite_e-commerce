"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  const [categorystat, setCategorystat] = useState(false)
  const [profilestat, setProfilestat] = useState(false)
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books',
    'Toys & Games',
    'Automotive'
  ]
  const Profiles=[
    'My Account',
    'Orders',

  ]

  return (
    <>
      <nav className='bg-purple-500 flex justify-between items-center'>
        <div className='flex gap-6 items-center lg:mx-4'>
          <div className='w-24 h-10 bg-violet-900 mx-4 '>
            logo
          </div>
          <div className='hidden lg:flex items-center  '>
            <LocationOnIcon />
            location
          </div>
          
          <div 
            className='hidden p-2 m-2 rounded-2xl h-fit gap-2 bg-purple-700 md:flex relative group cursor-pointer'
            onMouseEnter={() => setCategorystat(true)}
            onMouseLeave={() => setCategorystat(false)}
          >
            {categorystat ? <MenuOpenIcon /> : <MenuIcon />}
            category

            {/* Dropdown Menu */}
            {categorystat && (
              <div className='absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50'>
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className='px-4 py-2 text-gray-800 hover:bg-purple-100 cursor-pointer transition'
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <form className='hidden rounded-4xl m-2  p-2 bg-purple-400 sm:flex items-center lg:w-1/3'>
          <input className='px-2 text-white w-full focus:outline-none' placeholder='Search for Products, Categories..'></input>
          <SearchIcon />
        </form>

        <div className='hidden gap-4 lg:flex p-2 m-2'>
          <div className='relative flex gap-1 mx-4 '>
            <PersonIcon fontSize="medium" 
             />
           <Link href='/Auth'>Login</Link>
          
          </div>
          <div className='flex gap-1 mx-4'>
            <FavoriteBorderIcon />
            <p>Wishlist</p>
          </div>
          <div className='flex gap-1 mx-4'>
            <ShoppingCartIcon />
            <p>Cart</p>
          </div>
        </div>
        
        <div className='flex lg:hidden gap-1 mx-4'>
          <ShoppingCartIcon />
          <p>Cart</p>
        </div>
      </nav>
    </>
  )
}

export default Navbar