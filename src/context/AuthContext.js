// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents "flicker" on load
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // 1. Check if user is logged in immediately when the app loads
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Function to ask the server "Who is this user?"
  const checkUserLoggedIn = async () => {
    try {
      const res = await fetch("/api/me"); // Hits the JWT verification route
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user); // Set user data (Name, Email)
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false); // Stop showing the loading spinner
    }
  };

  // 2. Login Function
  const login = async (email, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user); // Update UI instantly
      router.push("/");   // Redirect to home
    } else {
      alert(data.message || "Login failed"); // Handle error
    }
  };

  // 3. Logout Function
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" }); // Tell server to kill cookie
    setUser(null); // Clear local state
    router.push("/"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, openAuthModal, closeAuthModal }}>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);