export default function CustomerBenefits() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419] px-6 py-24">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Выгодно и удобно
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              для вас и клиентов
            </span>
          </h2>
        </div>

        {/* Four Column Layout */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Card 1 - Contract */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 lg:p-10 transition-all hover:border-blue-500/30">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Официальное сотрудничество
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Заключаем договор с четкими условиями и гарантиями. Работаем по ТЗ с поэтапной приемкой, предоставляем все необходимые документы для бухгалтерии.
              </p>
            </div>

            {/* Illustration placeholder */}
            <div className="relative mt-8 flex justify-center">
              <div className="relative w-64 h-64">
                {/* Document illustration */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm border border-white/10 p-6 transform rotate-3 transition-transform group-hover:rotate-6">
                  <div className="space-y-3">
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-full"></div>
                    <div className="h-3 bg-white/20 rounded w-5/6"></div>
                    <div className="mt-6 space-y-2">
                      <div className="h-2 bg-white/15 rounded w-full"></div>
                      <div className="h-2 bg-white/15 rounded w-full"></div>
                      <div className="h-2 bg-white/15 rounded w-4/5"></div>
                    </div>
                    {/* Signature line */}
                    <div className="mt-8 pt-4 border-t border-white/20">
                      <div className="h-8 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                {/* Checkmark badge */}
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Easy for customers */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 lg:p-10 transition-all hover:border-blue-500/30">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Удобство для клиентов
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Современный интерфейс, быстрая загрузка, интуитивная навигация. Ваши клиенты легко найдут нужное и совершат покупку с любого устройства.
              </p>
            </div>

            {/* Illustration placeholder - Devices */}
            <div className="relative mt-8 flex justify-center">
              <div className="relative w-72 h-64">
                {/* Desktop */}
                <div className="absolute left-0 top-0 w-48 h-32 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-400/30 backdrop-blur-sm border border-white/10 p-2 transform transition-transform group-hover:scale-105">
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded">
                    <div className="p-2 space-y-1">
                      <div className="h-1.5 bg-white/20 rounded w-3/4"></div>
                      <div className="h-1.5 bg-white/15 rounded w-full"></div>
                      <div className="h-1.5 bg-white/15 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>

                {/* Mobile */}
                <div className="absolute right-4 bottom-0 w-20 h-40 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-400/30 backdrop-blur-sm border border-white/10 p-1.5 transform transition-transform group-hover:scale-105">
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-xl">
                    <div className="p-1.5 space-y-1">
                      <div className="h-1 bg-white/20 rounded w-2/3 mx-auto"></div>
                      <div className="mt-2 space-y-0.5">
                        <div className="h-1 bg-white/15 rounded"></div>
                        <div className="h-1 bg-white/15 rounded"></div>
                        <div className="h-1 bg-white/10 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success indicator */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-green-400/20 to-green-500/20 backdrop-blur-sm border border-green-400/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Fast Delivery */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 lg:p-10 transition-all hover:border-blue-500/30">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Быстрый запуск
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Работаем по agile-методологии с короткими спринтами. Получаете рабочую версию быстро, тестируете и даете обратную связь на каждом этапе.
              </p>
            </div>

            {/* Illustration - Rocket/Speed */}
            <div className="relative mt-8 flex justify-center">
              <div className="relative w-64 h-64">
                {/* Rocket */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Rocket body */}
                    <div className="w-24 h-32 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-t-full border border-white/10 backdrop-blur-sm relative transform transition-transform group-hover:-translate-y-4">
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/20 border border-white/30"></div>
                      {/* Wings */}
                      <div className="absolute bottom-0 -left-6 w-6 h-12 bg-gradient-to-br from-purple-500/30 to-pink-400/30 rounded-bl-full border border-white/10"></div>
                      <div className="absolute bottom-0 -right-6 w-6 h-12 bg-gradient-to-br from-purple-500/30 to-pink-400/30 rounded-br-full border border-white/10"></div>
                    </div>
                    {/* Fire trail */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-16 opacity-70">
                      <div className="w-full h-full bg-gradient-to-b from-orange-400/40 via-red-400/30 to-transparent rounded-full blur-sm animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Speed indicator */}
                <div className="absolute top-4 right-4 rounded-full bg-gradient-to-br from-orange-400/20 to-red-400/20 backdrop-blur-sm border border-orange-400/30 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-orange-400">Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Support */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 lg:p-10 transition-all hover:border-blue-500/30">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Техподдержка 24/7
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Сопровождаем проект после запуска, оперативно решаем технические вопросы, обновляем и масштабируем систему по мере роста бизнеса.
              </p>
            </div>

            {/* Illustration - Support/Chat */}
            <div className="relative mt-8 flex justify-center">
              <div className="relative w-64 h-64">
                {/* Chat bubbles */}
                <div className="absolute top-8 left-8 w-32 h-20 rounded-2xl rounded-tl-none bg-gradient-to-br from-blue-500/30 to-cyan-400/30 backdrop-blur-sm border border-white/10 p-3 transform transition-transform group-hover:scale-105">
                  <div className="space-y-1.5">
                    <div className="h-2 bg-white/30 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-full"></div>
                    <div className="h-2 bg-white/20 rounded w-2/3"></div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 w-32 h-20 rounded-2xl rounded-br-none bg-gradient-to-br from-purple-500/30 to-pink-400/30 backdrop-blur-sm border border-white/10 p-3 transform transition-transform group-hover:scale-105">
                  <div className="space-y-1.5">
                    <div className="h-2 bg-white/30 rounded w-2/3"></div>
                    <div className="h-2 bg-white/20 rounded w-full"></div>
                    <div className="h-2 bg-white/20 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Online indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* 24/7 badge */}
                <div className="absolute -top-2 right-4 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm border border-blue-400/30 px-3 py-1.5">
                  <span className="text-xs font-bold text-blue-400">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
