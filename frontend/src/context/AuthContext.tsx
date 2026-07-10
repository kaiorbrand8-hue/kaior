"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  clearSession,
  getMe,
  getStoredUser,
  loginUser,
  registerUser,
  setSession,
} from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage, unavailable during SSR
      setUserState(stored);
      getMe()
        .then((fresh) => setUserState((prev) => ({ ...fresh, token: prev?.token })))
        .catch(() => {
          clearSession();
          setUserState(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const setUser = (next: User | null) => {
    setUserState(next);
    if (next) setSession(next);
    else clearSession();
  };

  const login = async (email: string, password: string) => {
    const result = await loginUser({ email, password });
    setUser(result);
    return result;
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const result = await registerUser(payload);
    setUser(result);
    return result;
  };

  const logout = () => setUser(null);

  const value = { user, loading, login, register, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
