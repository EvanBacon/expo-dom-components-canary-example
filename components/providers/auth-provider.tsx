import React, { createContext, useContext } from "react";
import { useVerifyToken } from "@/lib/hooks/useVerifyToken";
import { useLoginStore } from "@/lib/store/loginStore";
import { router } from "expo-router";

interface AuthContextType {
  token: string | null;
  user: any;
  isLoggedIn: boolean;
  loading: boolean;
  error: any;
  login: (
    username: string,
    password: string,
    tenantId: string,
  ) => Promise<void>;
  verifyToken: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  login: async () => {},
  verifyToken: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    login,
    isLoading: loginLoading,
    error: loginError,
    token,
    isLoggedIn,
    userInfo,
    logout,
  } = useLoginStore();
  const {
    verifyToken,
    isLoading: verifyLoading,
    error: verifyError,
  } = useVerifyToken();

  return (
    <AuthContext.Provider
      value={{
        token: token,
        user: userInfo,
        isLoggedIn: isLoggedIn,
        login: login,
        verifyToken: verifyToken,
        logout,
        loading: loginLoading || verifyLoading,
        error: loginError || verifyError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
