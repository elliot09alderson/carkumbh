import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginAdmin as apiLoginAdmin, logoutAdmin as apiLogoutAdmin, isAuthenticated } from '@/api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage immediately to prevent redirect flicker
  const [isAuth, setIsAuth] = useState(() => isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const token = localStorage.getItem('adminToken');
    setIsAuth(!!token);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await apiLoginAdmin({ email, password });
    setIsAuth(true);
  };

  const logout = () => {
    apiLogoutAdmin();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuth, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
