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
import { useAuth } from '@/context/AuthContext';
const Navbar = () => {
  const { user, logout, loading } = useAuth()
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
  const Profiles = [
    'My Account',
    'Orders',

  ]
  if (loading) return <nav className="p-4 bg-gray-800 text-white">Loading...</nav>;
  return (
    <>
      <nav className='bg-purple-500 flex justify-between sticky items-center z-30'>
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
              <div className='absolute top-full z-30 left-0 mt-0 w-56 bg-white rounded-lg shadow-lg py-2 '>
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

        <div className='hidden gap-4 lg:flex items-center p-0 m-0'>
          
          <div className='flex cursor-pointer p-2 gap-1 mx-4'>
            <FavoriteBorderIcon />
            <p>Wishlist</p>
          </div>
          <div className='flex cursor-pointer p-2 gap-1 mx-4'>
            <ShoppingCartIcon />
            <p>Cart</p>
          </div>
          <div className='relative bg-purple-700 rounded-2xl p-2 m-2 flex gap-1 mx-4 group cursor-pointer '
            onMouseEnter={() => setProfilestat(true)}
            onMouseLeave={() => setProfilestat(false)}>
            <PersonIcon fontSize="medium"
            />
            {/* <Link href='/Auth'>Login</Link> */}
            {user ? (<>
              <div className="flex gap-4 items-center">
                <span>Hello, {user.name}</span>

              </div>

              {profilestat && (
                <div className='absolute top-full left-0 mt-0 w-full bg-white rounded-lg shadow-lg py-2 z-50'>
                  {Profiles.map((profile, index) => (
                    <div
                      key={index}
                      className='px-4 py-2 text-gray-800 hover:bg-purple-100 cursor-pointer transition'
                    >
                      {profile}
                    </div>
                  ))}
                </div>
              )}</>
            ) : (
              <div className="flex gap-4">
                <Link href="/Auth">Login</Link>

              </div>
            )}

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