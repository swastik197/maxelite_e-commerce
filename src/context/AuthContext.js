// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch user data from backend (call after profile/address/pic updates)
  const refreshUser = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("Error refreshing user:", error);
    }
  };

  const login = async (email, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      await refreshUser(); // Fetch full user data after login
      router.push("/");
    } else {
      alert(data.message || "Login failed");
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser, openAuthModal, closeAuthModal }}>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);