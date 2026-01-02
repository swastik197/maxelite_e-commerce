// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents "flicker" on load
  const router = useRouter();

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
    router.push("/login"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);