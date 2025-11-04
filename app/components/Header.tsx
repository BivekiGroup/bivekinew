'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-[#0f1419]/80 border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo and Brand */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
            <Image
              src="/logo.png"
              alt="Biveki Logo"
              width={40}
              height={40}
              className="relative h-8 w-8 sm:h-10 sm:w-10 transition-transform group-hover:scale-110"
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Biveki
          </span>
        </Link>

        {/* Auth Button */}
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 sm:gap-3 rounded-lg bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-white/10 hover:scale-105"
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="hidden sm:inline">{user?.email}</span>
            <span className="sm:hidden">Профиль</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Войти</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}
      </div>
    </header>
  );
}
