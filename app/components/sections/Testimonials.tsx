export default function Testimonials() {
  return (
    <section className="bg-[#0f1419] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Отзывы клиентов
          </h2>
          <p className="text-gray-400 text-lg">
            Что говорят о нас наши клиенты
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 lg:p-12 max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="mb-6">
            <svg className="w-12 h-12 text-blue-400/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          {/* Testimonial Text */}
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Работали с Biveki над созданием интернет-магазина для моего бизнеса. Команда профессионально подошла к задаче — от обсуждения деталей до запуска. Результат превзошёл ожидания: современный дизайн, удобная админка, интеграция с оплатой. Получила готовый магазин за 3 недели. Рекомендую!
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-400/30 border border-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Анна Петрова</h4>
              <p className="text-sm text-gray-400">Владелец интернет-магазина авторских изделий</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
