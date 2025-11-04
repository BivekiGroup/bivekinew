export default function ProcessSteps() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419] px-6 py-24">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Четыре шага —
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic">
              и проект готов
            </span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30">
            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">1</span>
              <span className="ml-2 text-sm text-gray-400">шаг</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Обсудим проект
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Созвонимся или встретимся, обсудим ваши цели и задачи, составим техническое задание
            </p>

            {/* Illustration - Meeting */}
            <div className="relative mt-auto">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-400/10 backdrop-blur-sm p-6 overflow-hidden">
                <div className="space-y-3">
                  {/* Chat icon */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-400/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded w-3/4 mb-1.5"></div>
                      <div className="h-2 bg-white/15 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30">
            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">2</span>
              <span className="ml-2 text-sm text-gray-400">шаг</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Создадим дизайн
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Разработаем прототип и дизайн-макет, согласуем с вами все детали интерфейса
            </p>

            {/* Illustration - Design */}
            <div className="relative mt-auto">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-400/10 backdrop-blur-sm p-6 overflow-hidden">
                <div className="space-y-2">
                  {/* Design layers */}
                  <div className="h-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/20 border border-white/10 p-2">
                    <div className="flex gap-2">
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500/30 to-pink-400/30"></div>
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 bg-white/20 rounded"></div>
                        <div className="h-2 bg-white/15 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30">
            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3</span>
              <span className="ml-2 text-sm text-gray-400">шаг</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Разработаем сайт
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Напишем код, настроим все функции, интегрируем необходимые сервисы и API
            </p>

            {/* Illustration - Code */}
            <div className="relative mt-auto">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-400/10 backdrop-blur-sm p-6 overflow-hidden">
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex gap-2">
                    <span className="text-purple-400">&lt;div</span>
                    <span className="text-blue-400">className=</span>
                    <span className="text-green-400">"app"</span>
                    <span className="text-purple-400">&gt;</span>
                  </div>
                  <div className="flex gap-2 pl-4">
                    <span className="text-cyan-400">&lt;Header</span>
                    <span className="text-cyan-400">/&gt;</span>
                  </div>
                  <div className="flex gap-2 pl-4">
                    <span className="text-cyan-400">&lt;Content</span>
                    <span className="text-cyan-400">/&gt;</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-purple-400">&lt;/div&gt;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-blue-500/30">
            <div className="mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">4</span>
              <span className="ml-2 text-sm text-gray-400">шаг</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Запустим проект
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8">
              Протестируем, настроим хостинг и домен, запустим сайт и передадим вам доступы
            </p>

            {/* Illustration - Launch */}
            <div className="relative mt-auto">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-400/10 backdrop-blur-sm p-6 overflow-hidden">
                <div className="flex items-center justify-center">
                  {/* Rocket launch */}
                  <div className="relative">
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-t-full border border-white/10 relative">
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white/20"></div>
                    </div>
                    {/* Success badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
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
