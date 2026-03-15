"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HistoryIcon from '@mui/icons-material/History'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import CancelIcon from '@mui/icons-material/Cancel'
import PendingIcon from '@mui/icons-material/Pending'
import SettingsIcon from '@mui/icons-material/Settings';
// Import data from config
import ordersData from '@/config/orders.json'
import productsData from '@/config/products.json'
import usersData from '@/config/users.json'

const UserProfileContent = () => {
  const { user, logout, loading } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditLocation, setShowEditLocation] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [userOrders, setUserOrders] = useState([])
  const [openSetting, setOpenSetting] = useState(false)

  // Get user data from config (simulating logged in user)
  const currentUser = usersData[0] // Using first user as demo

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+1 234 567 8900'
  })

  // Location form state
  const [locationForm, setLocationForm] = useState({
    street: currentUser?.address?.street || '',
    city: currentUser?.address?.city || '',
    zipCode: currentUser?.address?.zipCode || '',
    country: currentUser?.address?.country || ''
  })

  useEffect(() => {
    // Simulate recently viewed products (random 6 products)
    const shuffled = [...productsData].sort(() => 0.5 - Math.random())
    setRecentlyViewed(shuffled.slice(0, 6))

    // Simulate wishlist items (random 4 products)
    setWishlistItems(shuffled.slice(6, 10))

    // Filter orders for current user
    const filteredOrders = ordersData.filter(order => order.userId === 'user_1').slice(0, 5)
    setUserOrders(filteredOrders.length > 0 ? filteredOrders : ordersData.slice(0, 5))
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100'
      case 'Shipped':
        return 'text-blue-600 bg-blue-100'
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'Cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircleIcon className="w-5 h-5" />
      case 'Shipped':
        return <LocalShippingIcon className="w-5 h-5" />
      case 'Processing':
        return <PendingIcon className="w-5 h-5" />
      case 'Cancelled':
        return <CancelIcon className="w-5 h-5" />
      default:
        return <ShoppingBagIcon className="w-5 h-5" />
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <PersonIcon /> },
    { id: 'orders', label: 'Track Orders', icon: <LocalShippingIcon /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FavoriteIcon /> },
    { id: 'recently-viewed', label: 'Recently Viewed', icon: <HistoryIcon /> },
    { id: 'location', label: 'My Addresses', icon: <LocationOnIcon /> },
  ]

  const promotionalBanners = [
    {
      id: 1,
      title: "Get 20% Off Your Next Order!",
      description: "Use code WELCOME20 at checkout",
      bgColor: "bg-gradient-to-r from-[#0A4174] to-[#001D39]",
      icon: <LocalOfferIcon className="w-12 h-12 text-white/80" />
    },
    {
      id: 2,
      title: "Free Shipping on Orders $50+",
      description: "Limited time offer - Shop now!",
      bgColor: "bg-gradient-to-r from-pink-500 to-rose-500",
      icon: <LocalShippingIcon className="w-12 h-12 text-white/80" />
    }
  ]

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save to backend
    setShowEditProfile(false)
    alert('Profile updated successfully!')
  }

  const handleLocationSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save to backend
    setShowEditLocation(false)
    alert('Address updated successfully!')
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  const toggleSettings = () => {
    setOpenSetting((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-[#001D39] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center  gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src={currentUser?.avatar || "https://i.pravatar.cc/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentUser?.name || 'Guest User'}</h1>
                <p className="text-purple-200">{currentUser?.email || 'guest@example.com'}</p>
                <p className="text-sm text-purple-300 mt-1">
                  Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSettings}
              className="md:hidden inline-flex items-center justify-center rounded-lg  p-2 -mx-2 text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle settings menu"
            >
              <SettingsIcon className={`w-6 h-6 transition-transform duration-300 ${openSetting ? 'rotate-180' : 'rotate-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {openSetting && (
        <div className="md:hidden absolute right-1 max-w- mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <nav className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setOpenSetting(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === item.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setOpenSetting(false)
                  handleLogout()
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-2"
              >
                <LogoutIcon />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="hidden lg:w-64 md:flex flex-col flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <nav className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === item.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-2"
                >
                  <LogoutIcon />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>

            {/* Promotional Card */}
            <div className="mt-6 bg-gradient-to-br from-[#0A4174] to-[#001D39] rounded-xl p-6 text-white">
              <LocalOfferIcon className="w-10 h-10 mb-3 text-purple-200" />
              <h3 className="font-bold text-lg mb-2">Exclusive Member Deal</h3>
              <p className="text-purple-200 text-sm mb-4">Get 25% off on all furniture items this week!</p>
              <button className="w-full bg-white text-purple-700 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-colors">
                Shop Now
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Promotional Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {promotionalBanners.map((banner) => (
                <div
                  key={banner.id}
                  className={`${banner.bgColor} rounded-xl p-6 text-white flex items-center justify-between`}
                >
                  <div>
                    <h3 className="font-bold text-lg">{banner.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{banner.description}</p>
                  </div>
                  {banner.icon}
                </div>
              ))}
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#BDD8E9] rounded-xl p-6 shadow-sm">
                    <ShoppingBagIcon className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-4xl font-bold text-gray-800">{userOrders.length}</p>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                  </div>
                  <div className="bg-[#BDD8E9] rounded-xl p-6 shadow-sm">
                    <FavoriteIcon className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-4xl font-bold text-gray-800">{wishlistItems.length}</p>
                    <p className="text-gray-500 text-sm">Wishlist Items</p>
                  </div>
                  <div className="bg-[#BDD8E9] rounded-xl p-6 shadow-sm">
                    <CheckCircleIcon className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-4xl font-bold text-gray-800">
                      {userOrders.filter(o => o.status === 'Delivered').length}
                    </p>
                    <p className="text-gray-500 text-sm">Delivered</p>
                  </div>
                  <div className="bg-[#BDD8E9] rounded-xl p-6 shadow-sm">
                    <HistoryIcon className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-4xl font-bold text-gray-800">{recentlyViewed.length}</p>
                    <p className="text-gray-500 text-sm">Recently Viewed</p>
                  </div>
                </div> */}

                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                    >
                      <EditIcon className="w-5 h-5" />
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Full Name</p>
                      <p className="text-gray-800 font-medium">{currentUser?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="text-gray-800 font-medium">{currentUser?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>
                      <p className="text-gray-800 font-medium">+1 234 567 8900</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Role</p>
                      <p className="text-gray-800 font-medium capitalize">{currentUser?.role}</p>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Default Address</h2>
                    <button
                      onClick={() => setShowEditLocation(true)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                    >
                      <EditIcon className="w-5 h-5" />
                      Edit
                    </button>
                  </div>
                  <div className="flex items-start gap-3">
                    <LocationOnIcon className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <p className="text-gray-800 font-medium">{currentUser?.address?.street}</p>
                      <p className="text-gray-600">
                        {currentUser?.address?.city}, {currentUser?.address?.zipCode}
                      </p>
                      <p className="text-gray-600">{currentUser?.address?.country}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      View All
                      <ArrowForwardIosIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {userOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Order #{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">${order.totalAmount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Track Orders Section */}
            {activeSection === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-gray-800">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className={`mt-2 md:mt-0 inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="font-medium">{order.status}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ShoppingBagIcon className="text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-800">${item.price}</p>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Address */}
                      <div className="border-t pt-4 flex flex-col md:flex-row justify-between">
                        <div className="flex items-start gap-2">
                          <LocationOnIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Shipping Address</p>
                            <p className="text-sm text-gray-500">
                              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-xl font-bold text-purple-600">${order.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Section */}
            {activeSection === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">My Wishlist</h2>
                  <Link href="/wishlist" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden group">
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500">
                          <FavoriteIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-lg font-bold text-purple-600">${product.price}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed Section */}
            {activeSection === 'recently-viewed' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Recently Viewed Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentlyViewed.map((product) => (
                    <Link href={`/product/${product.slug}`} key={product.id} className="border border-gray-200 rounded-xl overflow-hidden group">
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600">{product.rating}</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600 mt-2">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Address Section */}
            {activeSection === 'location' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">My Addresses</h2>
                  <button
                    onClick={() => setShowEditLocation(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <EditIcon className="w-5 h-5" />
                    Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Default Address */}
                  <div className="border-2 border-purple-500 rounded-xl p-4 relative">
                    <span className="absolute -top-3 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                      Default
                    </span>
                    <div className="flex items-start gap-3 mt-2">
                      <LocationOnIcon className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{currentUser?.name}</p>
                        <p className="text-gray-600 text-sm mt-1">{currentUser?.address?.street}</p>
                        <p className="text-gray-600 text-sm">
                          {currentUser?.address?.city}, {currentUser?.address?.zipCode}
                        </p>
                        <p className="text-gray-600 text-sm">{currentUser?.address?.country}</p>
                        <p className="text-gray-600 text-sm mt-2">+1 234 567 8900</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setShowEditLocation(true)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Add New Address Card */}
                  <button
                    onClick={() => setShowEditLocation(true)}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-colors"
                  >
                    <LocationOnIcon className="w-12 h-12 mb-2" />
                    <p className="font-medium">Add New Address</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Location Modal */}
      {showEditLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Address</h3>
              <button onClick={() => setShowEditLocation(false)} className="text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={locationForm.street}
                  onChange={(e) => setLocationForm({ ...locationForm, street: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={locationForm.zipCode}
                    onChange={(e) => setLocationForm({ ...locationForm, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={locationForm.country}
                  onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditLocation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileContent
