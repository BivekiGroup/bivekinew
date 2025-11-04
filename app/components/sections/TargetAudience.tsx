export default function TargetAudience() {
  return (
    <section className="bg-[#0f1419] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Для кого мы работаем
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl">
            Помогаем бизнесу любого размера выйти в онлайн и масштабироваться
          </p>
        </div>

        {/* Three Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Card 1 - Startups */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-all hover:border-blue-500/30">
            {/* Content */}
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Стартапы
                <span className="block text-xl mt-1">и молодые компании</span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Создаем MVP за 2-4 недели, чтобы быстро протестировать вашу идею. Масштабируем продукт по мере роста аудитории и добавляем функции на основе обратной связи пользователей.
              </p>
            </div>

            {/* Illustration - MVP Dashboard */}
            <div className="px-8 pb-8">
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-400/10 backdrop-blur-sm p-6 overflow-hidden">
                {/* Mock Dashboard */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-400"></div>
                      <span className="text-xs font-semibold text-white">MVP Dashboard</span>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                      <span className="text-xs text-green-400 font-semibold">Live</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Active Users</span>
                      <span className="text-sm font-bold text-blue-400">+127%</span>
                    </div>
                    <div className="h-16 rounded bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-white/10 flex items-end justify-around p-2">
                      <div className="w-2 bg-blue-400 rounded-t" style={{height: '40%'}}></div>
                      <div className="w-2 bg-blue-400 rounded-t" style={{height: '60%'}}></div>
                      <div className="w-2 bg-cyan-400 rounded-t" style={{height: '85%'}}></div>
                      <div className="w-2 bg-cyan-400 rounded-t" style={{height: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - E-commerce */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-all hover:border-blue-500/30">
            {/* Content */}
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Интернет-магазины
                <span className="block text-xl mt-1">и e-commerce</span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Разрабатываем платформы для онлайн-продаж с интеграцией оплаты, CRM, складского учета. Повышаем конверсию за счет UX-оптимизации и автоматизации бизнес-процессов.
              </p>
            </div>

            {/* Illustration - Shopping Cart */}
            <div className="px-8 pb-8">
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-400/10 backdrop-blur-sm p-6 overflow-hidden space-y-3">
                {/* Product in cart */}
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2 bg-white/20 rounded w-3/4"></div>
                      <div className="h-2 bg-white/15 rounded w-1/2"></div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-6 w-16 rounded bg-white/10 border border-white/20"></div>
                        <span className="text-xs font-bold text-blue-400">2 990 ₽</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout button */}
                <div className="rounded-lg bg-gradient-to-r from-blue-500/30 to-cyan-400/30 border border-blue-400/30 p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Оформить заказ</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Business Services */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition-all hover:border-blue-500/30">
            {/* Content */}
            <div className="p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Бизнес-услуги
                <span className="block text-xl mt-1">и SaaS-проекты</span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Создаем сложные веб-приложения для автоматизации бизнеса: CRM-системы, панели управления, сервисы подписок. Продуманная архитектура для легкого масштабирования.
              </p>
            </div>

            {/* Illustration - SaaS Dashboard */}
            <div className="px-8 pb-8">
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-400/10 backdrop-blur-sm p-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-white">Business Panel</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400"></div>
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Stat 1 */}
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <div className="text-xs text-gray-400 mb-1">Выручка</div>
                    <div className="text-lg font-bold text-blue-400">₽1.2M</div>
                    <div className="text-xs text-green-400 mt-1">+23%</div>
                  </div>

                  {/* Stat 2 */}
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <div className="text-xs text-gray-400 mb-1">Клиенты</div>
                    <div className="text-lg font-bold text-cyan-400">342</div>
                    <div className="text-xs text-green-400 mt-1">+12%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
