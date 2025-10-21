"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { checkSession, logout } from "@/components/Auth/AuthService";
import AppSkeleton from "@/components/Common/AppSkeleton";

interface AuthContextType {
  isLoggedIn: boolean;
  showLoginModal: boolean;
  showRegisterModal: boolean;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeModals: () => void;
  handleLogout: () => void;
  setIsLoggedIn: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  useEffect(() => {
    const check = async () => {
      const isSessionValid = await checkSession();
      setIsLoggedIn(isSessionValid);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    check();
  }, []);

  const handleLogout = async () => {
    setIsLoggedIn(false);
    const res = await logout();
  };

  if (loading) {
    return (
      <AppSkeleton/>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        showLoginModal,
        showRegisterModal,
        openLoginModal: () => setShowLoginModal(true),
        openRegisterModal: () => setShowRegisterModal(true),
        closeModals: () => {
          setShowLoginModal(false);
          setShowRegisterModal(false);
        },
        handleLogout,
        setIsLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
