export default function Benefits() {
  return (
    <section className="bg-[#0f1419] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Работаем просто и
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              без лишних сложностей
            </span>
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Benefit 1 */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30 hover:bg-white/10">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">
              Фиксированная стоимость
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Обсуждаем проект, составляем техническое задание и фиксируем цену. Никаких скрытых платежей и доплат в процессе разработки.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30 hover:bg-white/10">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">
              Юридическая защита
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Работаем по официальному договору с прозрачными условиями. Защищаем интересы обеих сторон и гарантируем выполнение обязательств.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30 hover:bg-white/10">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">
              Быстрые обновления
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Вносим изменения и добавляем новые функции оперативно. Поддерживаем постоянную связь и быстро реагируем на ваши запросы.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30 hover:bg-white/10">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">
              Соответствие стандартам
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Разрабатываем в соответствии с современными стандартами безопасности и производительности. Гарантируем качество кода.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
