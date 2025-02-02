"use client";
import { User } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";
import React from "react";

interface AuthContextType {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const signIn = (userData: User) => {
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
  };
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!user && pathname !== "/signin" && pathname !== "/signup") {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
