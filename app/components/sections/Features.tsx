export default function Features() {
  return (
    <section className="bg-[#0f1419] px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 sm:mb-16 text-center px-4">
          <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-white">
            Почему выбирают нас
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400">
            Профессиональный подход к каждому проекту
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20"></div>
            <div className="relative">
              <div className="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/50">
                <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-white">
                Полный цикл разработки
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                От идеи и проектирования до запуска и поддержки вашего приложения
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20"></div>
            <div className="relative">
              <div className="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/50">
                <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-white">
                Индивидуальный дизайн
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Создаем уникальный интерфейс, который отражает ценности вашего бренда
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20"></div>
            <div className="relative">
              <div className="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/50">
                <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-white">
                Современные технологии
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Используем передовые фреймворки для быстрых и надежных решений
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20"></div>
            <div className="relative">
              <div className="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/50">
                <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-white">
                Соблюдение сроков
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Четкое планирование и прозрачный процесс разработки на всех этапах
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
