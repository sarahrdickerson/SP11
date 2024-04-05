"use client";
import axiosInstance from "@/api/axiosConfig";
import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/router"rem;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Parsing error", error);
        // Optional: clear the localStorage if it's invalid to prevent future errors
        localStorage.removeItem("user");
      }
    }
  }, []);
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      if (response.data.success) {
        const userData = { email, id: response.data.user_id };
        setUser(userData); // Set user data in context
        localStorage.setItem("user", JSON.stringify(userData)); // Store user data in local storage as a string
      }
      return response.data;
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
