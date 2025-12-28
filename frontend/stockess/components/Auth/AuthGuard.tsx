"use client";

import { useAuth } from "@/context/AuthContext";
import LoginScreen from "@/components/Auth/LoginScreen";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  useEffect(() => {}, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
