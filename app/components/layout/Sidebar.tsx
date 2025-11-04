'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();
  const { user, logout, isAdmin, isDeveloper } = useAuth();

  const isActive = (path: string) => {
    if (pathname === path) return true;
    const menuPaths = ['/dashboard', '/users', '/projects', '/my-projects', '/profile', '/dashboard/reports', '/my-projects/reports', '/dashboard/contacts'];
    const longerPaths = menuPaths.filter(p => p !== path && p.startsWith(path));

    if (longerPaths.length > 0) {
      return pathname?.startsWith(path + '/') && !longerPaths.some(p => pathname === p || pathname?.startsWith(p + '/'));
    }

    return pathname?.startsWith(path + '/');
  };

  const menuItems = [
    {
      name: 'Панель управления',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
      show: true,
    },
    {
      name: 'Пользователи',
      path: '/users',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500',
      show: isAdmin,
    },
    {
      name: 'Проекты',
      path: '/projects',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-500',
      show: isAdmin || isDeveloper,
    },
    {
      name: 'Заявки',
      path: '/dashboard/contacts',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-pink-500 to-rose-500',
      show: isAdmin || isDeveloper,
    },
    {
      name: 'Мои проекты',
      path: '/my-projects',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-500',
      show: user?.role === 'CUSTOMER',
    },
    {
      name: 'Отчеты',
      path: user?.role === 'CUSTOMER' ? '/my-projects/reports' : '/dashboard/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-500',
      show: true,
    },
    {
      name: 'Профиль',
      path: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      gradient: 'from-teal-500 to-cyan-500',
      show: true,
    },
  ];

  const getRoleConfig = () => {
    switch (user?.role) {
      case 'ADMIN':
        return {
          color: 'from-red-400 via-pink-400 to-purple-400',
          name: 'Администратор',
          icon: '👑',
          badge: 'ADMIN'
        };
      case 'DEVELOPER':
        return {
          color: 'from-blue-400 via-cyan-400 to-teal-400',
          name: 'Разработчик',
          icon: '💻',
          badge: 'DEV'
        };
      case 'CUSTOMER':
        return {
          color: 'from-green-400 via-emerald-400 to-teal-400',
          name: 'Заказчик',
          icon: '🏢',
          badge: 'CLIENT'
        };
      default:
        return {
          color: 'from-gray-400 to-gray-500',
          name: 'Пользователь',
          icon: '👤',
          badge: 'USER'
        };
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <aside className="w-72 h-full bg-gradient-to-b from-[#0a0d14] via-[#0d1117] to-[#0a0d14] border-r border-white/5 flex flex-col relative">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/5 backdrop-blur-sm">
          <Link href="/dashboard" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Image
                src="/logo.png"
                alt="Biveki"
                width={40}
                height={40}
                className="relative h-10 w-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Biveki
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {menuItems.filter(item => item.show).map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onNavigate}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                  ${active
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {/* Active Background */}
                {active && (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 blur-xl`}></div>
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${item.gradient} rounded-r-full`}></div>
                  </>
                )}

                {/* Icon */}
                <div className={`relative z-10 ${active ? `bg-gradient-to-r ${item.gradient} p-2 rounded-lg shadow-lg` : 'p-2'} transition-all duration-300 group-hover:scale-110 ${active ? 'text-white' : ''}`}>
                  {item.icon}
                </div>

                {/* Label */}
                <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
                  {item.name}
                </span>

                {/* Hover Effect */}
                {!active && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/5 backdrop-blur-sm space-y-3">
          {/* User Card */}
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${roleConfig.color} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity duration-300`}></div>
            <div className="relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
              {/* Role Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{roleConfig.icon}</span>
                  <span className={`text-xs font-bold bg-gradient-to-r ${roleConfig.color} bg-clip-text text-transparent`}>
                    {roleConfig.badge}
                  </span>
                </div>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${roleConfig.color} animate-pulse`}></div>
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <p className="text-sm text-white font-semibold truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="
              group relative w-full px-4 py-3 rounded-xl font-medium
              bg-gradient-to-r from-red-500/10 to-pink-500/10
              border border-red-500/20
              text-red-400
              hover:from-red-500/20 hover:to-pink-500/20
              hover:border-red-500/40
              hover:shadow-lg hover:shadow-red-500/20
              transition-all duration-300
              overflow-hidden
              justify-center
            "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Выйти</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
