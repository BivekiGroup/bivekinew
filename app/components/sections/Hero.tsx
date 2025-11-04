export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] px-4 sm:px-6 pt-20 pb-12 sm:pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Large gradient orbs */}
        <div className="absolute top-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Floating particles */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwMCIgaGVpZ2h0PSIxMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJyZ2JhKDU5LDEzMCwyNDYsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl w-full">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-blue-400 backdrop-blur-sm shadow-lg shadow-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Открыты для новых проектов
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-4 sm:mb-6">
            Создаем
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              цифровой опыт
            </span>
            <span className="block mt-1 sm:mt-2">нового уровня</span>
          </h1>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-gray-400 max-w-3xl mx-auto px-4">
            Разрабатываем веб-приложения, которые масштабируются вместе с вашим бизнесом и превосходят ожидания пользователей
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex justify-center px-4">
            <a
              href="#cta"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="relative">Обсудить проект</span>
              <svg className="relative ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-4">
            <div className="group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-400">Реализованных проектов</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                5+
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-400">Лет на рынке</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                98%
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-400">Довольных клиентов</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 sm:mt-16 flex justify-center">
            <div className="animate-bounce">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
