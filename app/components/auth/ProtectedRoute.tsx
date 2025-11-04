'use client';

import { useAuth, UserRole } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Проверка авторизации
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
        return;
      }

      // Проверка роли (одна конкретная роль)
      if (requiredRole && user?.role !== requiredRole) {
        router.push('/dashboard');
        return;
      }

      // Проверка роли (список разрешенных ролей)
      if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, allowedRoles, requireAuth, router]);

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если не авторизован и требуется авторизация
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Если роль не подходит (одна конкретная роль)
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // Если роль не подходит (список разрешенных ролей)
  if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
