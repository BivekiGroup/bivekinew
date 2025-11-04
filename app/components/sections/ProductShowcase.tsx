export default function ProductShowcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419] px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-2 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-400 mb-4 sm:mb-6">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Наши решения
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Полнофункциональные
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                веб-платформы
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-400 mb-4 sm:mb-6 leading-relaxed">
              Разрабатываем современные веб-приложения с интуитивным интерфейсом. От интернет-магазинов до сложных SaaS-платформ.
            </p>

            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Интегрируем платежные системы, CRM, аналитику и другие инструменты для автоматизации бизнес-процессов.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#cta"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
              >
                Обсудить проект
                <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - Browser mockup */}
          <div className="relative order-1 lg:order-2">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-3xl rounded-3xl"></div>

            <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-[#1a1f2e] shadow-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-[#0f1419] px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 mx-2 sm:mx-4 bg-white/5 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-400 border border-white/10">
                  yourapp.com
                </div>
              </div>

              {/* Browser content - Modern dark UI */}
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  {/* Product card 1 */}
                  <div className="group rounded-xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                    <div className="aspect-square bg-gradient-to-br from-blue-500/30 to-cyan-400/30 relative">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAwIDIwIEwgMjAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <div className="h-1.5 sm:h-2 bg-white/20 rounded mb-1.5 sm:mb-2"></div>
                      <div className="h-1.5 sm:h-2 bg-white/10 rounded w-2/3"></div>
                    </div>
                  </div>

                  {/* Product card 2 */}
                  <div className="group rounded-xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                    <div className="aspect-square bg-gradient-to-br from-purple-500/30 to-pink-400/30 relative">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAwIDIwIEwgMjAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <div className="h-1.5 sm:h-2 bg-white/20 rounded mb-1.5 sm:mb-2"></div>
                      <div className="h-1.5 sm:h-2 bg-white/10 rounded w-2/3"></div>
                    </div>
                  </div>

                  {/* Product card 3 */}
                  <div className="group rounded-xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                    <div className="aspect-square bg-gradient-to-br from-cyan-500/30 to-blue-400/30 relative">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAwIDIwIEwgMjAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <div className="h-1.5 sm:h-2 bg-white/20 rounded mb-1.5 sm:mb-2"></div>
                      <div className="h-1.5 sm:h-2 bg-white/10 rounded w-2/3"></div>
                    </div>
                  </div>

                  {/* Product card 4 */}
                  <div className="group rounded-xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                    <div className="aspect-square bg-gradient-to-br from-pink-500/30 to-purple-400/30 relative">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAwIDIwIEwgMjAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                    </div>
                    <div className="p-2 sm:p-3">
                      <div className="h-1.5 sm:h-2 bg-white/20 rounded mb-1.5 sm:mb-2"></div>
                      <div className="h-1.5 sm:h-2 bg-white/10 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="hidden sm:flex absolute -bottom-3 sm:-bottom-4 -right-3 sm:-right-4 rounded-lg sm:rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">Адаптивный дизайн</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
