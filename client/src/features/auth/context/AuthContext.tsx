import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { api } from "@/api/client";

import type { AuthUser } from "../types/auth.types";

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.get<AuthUser>("/auth/me");
        setUser(response.data);
      } catch (error) {
        // 401 or any error means no valid session
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Clear local state regardless of server response
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}