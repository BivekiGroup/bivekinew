'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDeveloper: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      role
      name
      createdAt
      updatedAt
      isActive
    }
  }
`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [getMe] = useLazyQuery(ME_QUERY);

  useEffect(() => {
    // Проверяем наличие токена и пользователя в localStorage
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Проверяем актуальность данных с сервера
        getMe().then(({ data, error }) => {
          if (error || !data?.me) {
            // Токен невалидный, очищаем
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            // Обновляем данные пользователя
            setUser(data.me);
            localStorage.setItem('user', JSON.stringify(data.me));
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [getMe]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isDeveloper: user?.role === UserRole.DEVELOPER,
    isCustomer: user?.role === UserRole.CUSTOMER,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
