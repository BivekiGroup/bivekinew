import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen bg-[#0f1419] flex items-center justify-center px-6 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Image
            src="/logo.png"
            alt="Biveki"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-white">Biveki</span>
        </div>

        {/* 404 with glitch effect */}
        <div className="relative mb-6">
          <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          {/* Glitch layers */}
          <div className="absolute inset-0 text-[10rem] md:text-[14rem] font-bold leading-none opacity-20 animate-pulse" style={{ color: '#3b82f6', transform: 'translate(-2px, -2px)' }}>
            404
          </div>
          <div className="absolute inset-0 text-[10rem] md:text-[14rem] font-bold leading-none opacity-20 animate-pulse" style={{ color: '#22d3ee', transform: 'translate(2px, 2px)', animationDelay: '0.1s' }}>
            404
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Страница не найдена
        </h2>
        <p className="text-base md:text-lg text-gray-400 max-w-md mx-auto mb-8">
          Похоже, вы попали по несуществующему адресу
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
          >
            <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
            <svg className="relative mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="relative">На главную</span>
          </Link>

          <Link
            href="/#cta"
            className="group inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-blue-400/50 hover:bg-white/10"
          >
            Связаться
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Code snippet */}
        <div className="mt-10 max-w-sm mx-auto">
          <div className="rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm p-3 text-left">
            <code className="text-xs text-gray-400 font-mono block">
              <span className="text-blue-400">const</span> page = <span className="text-cyan-400">find</span>(<span className="text-yellow-400">&apos;/page&apos;</span>);<br />
              <span className="text-blue-400">if</span> (!page) {'{'}<br />
              &nbsp;&nbsp;<span className="text-purple-400">redirect</span>(<span className="text-yellow-400">&apos;/&apos;</span>);<br />
              {'}'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
