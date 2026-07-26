import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "../types/auth.types";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;

  login: (token: string, user: AuthUser) => void;
  logout: () => void;

  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  function login(token: string, user: AuthUser) {
    setToken(token);
    setUser(user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
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