// src/app/(main)/(protected)/layout.jsx
"use client"
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProtectedLayout({ children }) {
//   return <ProtectedRoute>{children}</ProtectedRoute>
return <>{children}</>
}