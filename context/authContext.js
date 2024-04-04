"use client";
import axiosInstance from "@/api/axiosConfig";
import { createContext, useContext, useState } from "react";
// import { useRouter } from "next/router"rem;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const router = useRouter();

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      if (response.data.success) {
        setUser({ email, id: response.data.user_id }); // Set user data in context
        // router.push("/"); // Redirect to home page after login
      }
      return response.data;
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
