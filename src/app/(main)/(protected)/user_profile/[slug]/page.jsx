"use client"
import React, { useState, useEffect, useRef } from 'react'
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
import SettingsIcon from '@mui/icons-material/Settings'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SaveIcon from '@mui/icons-material/Save'
import ordersData from '@/config/orders.json'
import productsData from '@/config/products.json'

// ─── Toast Notification ──────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-700',
    error: 'bg-red-50 border-red-300 text-red-700',
    info: 'bg-blue-50 border-blue-300 text-blue-700',
  }

  return (
    <div className="fixed top-6 right-6 z-[100] animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]">
      <div className={`${styles[type]} border rounded-2xl px-5 py-3.5 shadow-lg flex items-center gap-3 min-w-[300px]`}>
        {type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
        {type === 'error' && <CancelIcon className="w-5 h-5" />}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const UserProfileContent = () => {
  const { user, logout, refreshUser } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditLocation, setShowEditLocation] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [userOrders, setUserOrders] = useState([])
  const [openSetting, setOpenSetting] = useState(false)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingPic, setUploadingPic] = useState(false)
  const fileInputRef = useRef(null)

  const currentAddress = user?.address?.[0] || {}

  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' })
  const [locationForm, setLocationForm] = useState({ street: '', city: '', state: '', postalCode: '', country: '' })

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
      const addr = user.address?.[0] || {}
      setLocationForm({ street: addr.street || '', city: addr.city || '', state: addr.state || '', postalCode: addr.postalCode || '', country: addr.country || '' })
    }
  }, [user])

  useEffect(() => {
    const shuffled = [...productsData].sort(() => 0.5 - Math.random())
    setRecentlyViewed(shuffled.slice(0, 6))
    setWishlistItems(shuffled.slice(6, 10))
    const filteredOrders = ordersData.filter(order => order.userId === 'user_1').slice(0, 5)
    setUserOrders(filteredOrders.length > 0 ? filteredOrders : ordersData.slice(0, 5))
  }, [])

  const showToast = (message, type = 'success') => setToast({ message, type })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-600 bg-emerald-50 border border-emerald-200'
      case 'Shipped': return 'text-blue-600 bg-blue-50 border border-blue-200'
      case 'Processing': return 'text-amber-600 bg-amber-50 border border-amber-200'
      case 'Cancelled': return 'text-red-600 bg-red-50 border border-red-200'
      default: return 'text-gray-600 bg-gray-50 border border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircleIcon className="w-5 h-5" />
      case 'Shipped': return <LocalShippingIcon className="w-5 h-5" />
      case 'Processing': return <PendingIcon className="w-5 h-5" />
      case 'Cancelled': return <CancelIcon className="w-5 h-5" />
      default: return <ShoppingBagIcon className="w-5 h-5" />
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <PersonIcon /> },
    { id: 'orders', label: 'Track Orders', icon: <LocalShippingIcon /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FavoriteIcon /> },
    { id: 'recently-viewed', label: 'Recently Viewed', icon: <HistoryIcon /> },
    { id: 'location', label: 'My Addresses', icon: <LocationOnIcon /> },
  ]

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPic(true)
    try {
      const formData = new FormData()
      formData.append('profilepic', file)
      const res = await fetch('/api/user/profile-pic', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) { showToast('Profile picture updated!', 'success'); await refreshUser() }
      else showToast(data.error || 'Failed to upload picture', 'error')
    } catch { showToast('Network error. Please try again.', 'error') }
    finally { setUploadingPic(false) }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profileForm) })
      const data = await res.json()
      if (res.ok) { showToast('Profile updated successfully!', 'success'); setShowEditProfile(false); await refreshUser() }
      else showToast(data.error || 'Failed to update profile', 'error')
    } catch { showToast('Network error. Please try again.', 'error') }
    finally { setSaving(false) }
  }

  const handleLocationSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/address', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(locationForm) })
      const data = await res.json()
      if (res.ok) { showToast('Address updated successfully!', 'success'); setShowEditLocation(false); await refreshUser() }
      else showToast(data.error || 'Failed to update address', 'error')
    } catch { showToast('Network error. Please try again.', 'error') }
    finally { setSaving(false) }
  }

  const handleLogout = () => { if (confirm('Are you sure you want to logout?')) logout() }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/40 relative">
      {/* Decorative background shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-200/20 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-200/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-teal-100/10 blur-[120px]" />
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ─── Header Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f3c4c] via-[#1a5568] to-[#0f3c4c]" />
        {/* Animated decorative elements in header */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-teal-300/10 rounded-full blur-2xl animate-[float_10s_ease-in-out_infinite]" />
        </div>
        <div className="relative py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 sm:gap-8">
                {/* Avatar with upload */}
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-400 to-blue-400 p-[3px] shadow-xl shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-500">
                    <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                      <img
                        src={user?.profilepic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=7c3aed&color=fff&size=150&font-size=0.4&bold=true`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPic}
                    className="absolute inset-[3px] rounded-2xl sm:rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm"
                  >
                    {uploadingPic ? (
                      <div className="w-6 h-6 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <CameraAltIcon className="w-6 h-6 text-white" />
                        <span className="text-[10px] text-white/80 font-medium">Change</span>
                      </div>
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleProfilePicUpload} className="hidden" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight animate-[fadeInUp_0.5s_ease-out]">
                    {user?.name || 'Guest User'}
                  </h1>
                  <p className="text-purple-200/80 text-sm sm:text-base mt-1 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
                    {user?.email || 'guest@example.com'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-white/50 text-xs sm:text-sm">
                      Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenSetting(prev => !prev)}
                className="md:hidden inline-flex items-center justify-center rounded-xl p-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle settings menu"
              >
                <SettingsIcon className={`w-6 h-6 transition-transform duration-500 ${openSetting ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Settings Dropdown ─────────────────────────────── */}
      {openSetting && (
        <div className="md:hidden absolute right-4 z-50 w-64 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-2">
            <nav className="p-2">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveSection(item.id); setOpenSetting(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === item.id ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
              <div className="mx-3 my-2 border-t border-gray-100" />
              <button onClick={() => { setOpenSetting(false); handleLogout() }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-all">
                <LogoutIcon />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ─── Main Layout ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── Sidebar ──────────────────────────────────────────── */}
          <div className="hidden md:flex flex-col w-72 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden animate-[fadeInLeft_0.4s_ease-out]">
              <div className="p-3">
                {menuItems.map((item, i) => (
                  <button key={item.id} onClick={() => setActiveSection(item.id)}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 mb-1 animate-[fadeInLeft_0.3s_ease-out_both] ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-l-[3px] border-purple-500 shadow-sm'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                    }`}>
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                    {activeSection === item.id && <ArrowForwardIosIcon className="w-3 h-3 ml-auto text-purple-400" />}
                  </button>
                ))}
                <div className="mx-3 my-3 border-t border-gray-100" />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
                  <LogoutIcon />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            </div>

            {/* Promo Card */}
            <div className="mt-6 relative overflow-hidden rounded-2xl animate-[fadeInLeft_0.4s_ease-out_0.3s_both]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f3c4c] via-[#1a5568] to-[#0f3c4c]" />
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
              </div>
              <div className="relative p-6">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <LocalOfferIcon className="w-5 h-5 text-purple-200" />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">Member Deal</h3>
                <p className="text-white/60 text-sm mb-5">25% off on all furniture items this week!</p>
                <button className="w-full bg-white text-[#0f3c4c] font-semibold py-2.5 rounded-xl hover:bg-purple-50 transition-all duration-300 text-sm hover:shadow-lg hover:shadow-purple-500/10 active:scale-[0.98]">
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* ─── Content Area ─────────────────────────────────────── */}
          <div className="flex-1 space-y-6">

            {/* ─── Promo Banners ────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group animate-[fadeInUp_0.4s_ease-out]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f3c4c] to-[#1a5568]" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">Get 20% Off!</h3>
                    <p className="text-white/60 text-sm mt-1">Use code <span className="text-purple-300 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">WELCOME20</span></p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <LocalOfferIcon className="w-7 h-7 text-purple-200" />
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group animate-[fadeInUp_0.4s_ease-out_0.1s_both]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">Free Shipping</h3>
                    <p className="text-white/60 text-sm mt-1">On orders <span className="text-purple-200 font-bold">$50+</span> — Limited time!</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <LocalShippingIcon className="w-7 h-7 text-purple-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ OVERVIEW ═══════════════════════════════════════ */}
            {activeSection === 'overview' && (
              <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out]">
                {/* Quick Stats */}
                {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: <ShoppingBagIcon className="w-6 h-6" />, value: userOrders.length, label: 'Total Orders', color: 'purple', bg: 'from-purple-50 to-purple-100/50', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
                    { icon: <FavoriteIcon className="w-6 h-6" />, value: wishlistItems.length, label: 'Wishlist', color: 'rose', bg: 'from-rose-50 to-pink-100/50', iconBg: 'bg-rose-100', iconText: 'text-rose-500' },
                    { icon: <CheckCircleIcon className="w-6 h-6" />, value: userOrders.filter(o => o.status === 'Delivered').length, label: 'Delivered', color: 'emerald', bg: 'from-emerald-50 to-green-100/50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
                    { icon: <HistoryIcon className="w-6 h-6" />, value: recentlyViewed.length, label: 'Viewed', color: 'blue', bg: 'from-blue-50 to-sky-100/50', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
                  ].map((stat, i) => (
                    <div key={i} style={{ animationDelay: `${i * 0.08}s` }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-[fadeInUp_0.4s_ease-out_both]">
                      <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconText} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-gray-400 text-xs mt-1 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>*/}

                {/* Profile Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-6 hover:shadow-md transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_0.3s_both]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <PersonIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      Profile Information
                    </h2>
                    <button onClick={() => setShowEditProfile(true)}
                      className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all active:scale-95">
                      <EditIcon className="w-4 h-4" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                    {[
                      { label: 'Full Name', value: user?.name },
                      { label: 'Email Address', value: user?.email },
                      { label: 'Phone', value: user?.phone || 'Not set' },
                      { label: 'Role', value: user?.role },
                    ].map((field, i) => (
                      <div key={i} className="group">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 font-medium">{field.label}</p>
                        <p className="text-gray-800 font-medium capitalize group-hover:text-purple-700 transition-colors">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-6 hover:shadow-md transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_0.4s_both]">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                        <LocationOnIcon className="w-4 h-4 text-teal-600" />
                      </div>
                      Default Address
                    </h2>
                    <button onClick={() => setShowEditLocation(true)}
                      className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all active:scale-95">
                      <EditIcon className="w-4 h-4" /> Edit
                    </button>
                  </div>
                  {currentAddress.street ? (
                    <div className="flex items-start gap-4 bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <LocationOnIcon className="w-5 h-5 text-teal-500" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">{currentAddress.street}</p>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {currentAddress.city}{currentAddress.state ? `, ${currentAddress.state}` : ''} {currentAddress.postalCode}
                        </p>
                        <p className="text-gray-500 text-sm">{currentAddress.country}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50/50 rounded-xl">
                      <LocationOnIcon className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm mb-3">No address saved yet</p>
                      <button onClick={() => setShowEditLocation(true)}
                        className="text-purple-600 text-sm font-medium hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg transition-all">
                        + Add Address
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-6 hover:shadow-md transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_0.5s_both]">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ShoppingBagIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      Recent Orders
                    </h2>
                    <button onClick={() => setActiveSection('orders')}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all">
                      View All <ArrowForwardIosIcon className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {userOrders.slice(0, 3).map((order, i) => (
                      <div key={order.id} style={{ animationDelay: `${i * 0.08}s` }}
                        className="flex items-center justify-between p-4 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group animate-[fadeInUp_0.3s_ease-out_both]">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${getStatusColor(order.status)} group-hover:scale-105 transition-transform`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-sm">${order.totalAmount}</p>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)} inline-block mt-1`}>{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ ORDERS ═══════════════════════════════════════════ */}
            {activeSection === 'orders' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-6 animate-[fadeInUp_0.3s_ease-out]">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <LocalShippingIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  My Orders
                </h2>
                <div className="space-y-4">
                  {userOrders.map((order, i) => (
                    <div key={order.id} style={{ animationDelay: `${i * 0.08}s` }}
                      className="border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-purple-100 transition-all duration-300 animate-[fadeInUp_0.3s_ease-out_both]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-gray-800">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-sm text-gray-400 mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className={`mt-2 md:mt-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="font-medium text-sm">{order.status}</span>
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                              <ShoppingBagIcon className="text-gray-300" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-700 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-700 text-sm">${item.price}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between">
                        <div className="flex items-start gap-2">
                          <LocationOnIcon className="w-5 h-5 text-gray-300 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                            <p className="text-sm text-gray-400">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <p className="text-sm text-gray-400">Total</p>
                          <p className="text-xl font-bold text-purple-600">${order.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ WISHLIST ═════════════════════════════════════════ */}
            {activeSection === 'wishlist' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-6 animate-[fadeInUp_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                      <FavoriteIcon className="w-4 h-4 text-rose-500" />
                    </div>
                    My Wishlist
                  </h2>
                  <Link href="/wishlist" className="text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {wishlistItems.map((product, i) => (
                    <div key={product.id} style={{ animationDelay: `${i * 0.08}s` }}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-[fadeInUp_0.3s_ease-out_both]">
                      <div className="relative aspect-square bg-gray-50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-rose-500 shadow-sm hover:bg-white hover:shadow-md transition-all active:scale-90">
                          <FavoriteIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-700 text-sm truncate">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-base font-bold text-purple-600">${product.price}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                            {product.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </div>
                        <button className="w-full mt-3 bg-[#0f3c4c] text-white py-2.5 rounded-xl hover:bg-[#1a5568] transition-all duration-200 text-sm font-medium active:scale-[0.98]">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ RECENTLY VIEWED ══════════════════════════════════ */}
            {activeSection === 'recently-viewed' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-6 animate-[fadeInUp_0.3s_ease-out]">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <HistoryIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  Recently Viewed Products
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentlyViewed.map((product, i) => (
                    <Link href={`/product/${product.slug}`} key={product.id} style={{ animationDelay: `${i * 0.06}s` }}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-[fadeInUp_0.3s_ease-out_both]">
                      <div className="relative aspect-square bg-gray-50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-700 text-sm truncate">{product.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-amber-400 text-sm">★</span>
                          <span className="text-xs text-gray-400">{product.rating}</span>
                        </div>
                        <p className="text-base font-bold text-purple-600 mt-1">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ ADDRESSES ════════════════════════════════════════ */}
            {activeSection === 'location' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 p-6 animate-[fadeInUp_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                      <LocationOnIcon className="w-4 h-4 text-teal-600" />
                    </div>
                    My Addresses
                  </h2>
                  <button onClick={() => setShowEditLocation(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-[0.98]">
                    <EditIcon className="w-4 h-4" /> Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentAddress.street && (
                    <div className="border-2 border-purple-200 rounded-2xl p-5 relative bg-purple-50/30 hover:border-purple-300 transition-all duration-300">
                      <span className="absolute -top-2.5 left-4 bg-purple-600 text-white text-[10px] font-semibold px-3 py-0.5 rounded-full uppercase tracking-wider">Default</span>
                      <div className="flex items-start gap-3 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <LocationOnIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{user?.name}</p>
                          <p className="text-gray-500 text-sm mt-1">{currentAddress.street}</p>
                          <p className="text-gray-500 text-sm">{currentAddress.city}{currentAddress.state ? `, ${currentAddress.state}` : ''} {currentAddress.postalCode}</p>
                          <p className="text-gray-500 text-sm">{currentAddress.country}</p>
                          {user?.phone && <p className="text-gray-500 text-sm mt-2">{user.phone}</p>}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4 pt-3 border-t border-purple-100">
                        <button onClick={() => setShowEditLocation(true)} className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">Edit</button>
                        <span className="text-gray-200">|</span>
                        <button className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">Delete</button>
                      </div>
                    </div>
                  )}
                  <button onClick={() => setShowEditLocation(true)}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-300 hover:border-purple-300 hover:text-purple-400 hover:bg-purple-50/30 transition-all duration-300 active:scale-[0.98]">
                    <LocationOnIcon className="w-10 h-10 mb-2" />
                    <p className="font-medium text-sm">Add New Address</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ EDIT PROFILE MODAL ════════════════════════════════════ */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-[scaleIn_0.25s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <PersonIcon className="w-4 h-4 text-purple-600" />
                </div>
                Edit Profile
              </h3>
              <button onClick={() => setShowEditProfile(false)} className="text-gray-300 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-lg">
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {[
                { label: 'Full Name', type: 'text', key: 'name', value: profileForm.name },
                { label: 'Email', type: 'email', key: 'email', value: profileForm.email },
                { label: 'Phone', type: 'tel', key: 'phone', value: profileForm.phone },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                  <input type={field.type} value={field.value}
                    onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 focus:bg-white focus:outline-none transition-all"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium active:scale-[0.98]">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]">
                  {saving ? <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" /> : <><SaveIcon className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ EDIT ADDRESS MODAL ════════════════════════════════════ */}
      {showEditLocation && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-[scaleIn_0.25s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                  <LocationOnIcon className="w-4 h-4 text-teal-600" />
                </div>
                Edit Address
              </h3>
              <button onClick={() => setShowEditLocation(false)} className="text-gray-300 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-lg">
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Street Address</label>
                <input type="text" value={locationForm.street} onChange={(e) => setLocationForm({ ...locationForm, street: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 focus:bg-white focus:outline-none transition-all"
                  placeholder="Enter street address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'City', key: 'city' },
                  { label: 'State', key: 'state' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type="text" value={locationForm[f.key]} onChange={(e) => setLocationForm({ ...locationForm, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 focus:bg-white focus:outline-none transition-all"
                      placeholder={f.label} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Postal Code', key: 'postalCode' },
                  { label: 'Country', key: 'country' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type="text" value={locationForm[f.key]} onChange={(e) => setLocationForm({ ...locationForm, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 focus:bg-white focus:outline-none transition-all"
                      placeholder={f.label} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditLocation(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium active:scale-[0.98]">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]">
                  {saving ? <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" /> : <><SaveIcon className="w-4 h-4" /> Save Address</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Keyframe Animations ──────────────────────────────────── */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

export default UserProfileContent
