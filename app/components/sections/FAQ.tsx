export default function FAQ() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419] px-6 py-24">
      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Часто задаваемые вопросы
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {/* FAQ Item 1 */}
          <details className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
              <span className="text-lg font-semibold text-white pr-4">
                Сколько стоит разработка сайта?
              </span>
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 group-open:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              Стоимость зависит от сложности проекта. Простой лендинг — от 50 000₽, корпоративный сайт — от 150 000₽, интернет-магазин — от 250 000₽. Обсудим ваш проект и назовем точную цену после составления ТЗ.
            </div>
          </details>

          {/* FAQ Item 2 */}
          <details className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
              <span className="text-lg font-semibold text-white pr-4">
                Как долго разрабатывается сайт?
              </span>
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 group-open:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              Лендинг — 1-2 недели, корпоративный сайт — 3-4 недели, интернет-магазин — 4-6 недель, сложное веб-приложение — от 8 недель. Сроки зависят от объема работ и ваших требований.
            </div>
          </details>

          {/* FAQ Item 3 */}
          <details className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
              <span className="text-lg font-semibold text-white pr-4">
                Нужно ли мне привлекать программиста или дизайнера?
              </span>
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 group-open:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              Нет, мы работаем под ключ. Наша команда включает дизайнеров, разработчиков и менеджеров проекта. Вам нужно только описать задачу — мы сделаем всё остальное.
            </div>
          </details>

          {/* FAQ Item 4 */}
          <details className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
              <span className="text-lg font-semibold text-white pr-4">
                Будет ли сайт адаптирован под мобильные устройства?
              </span>
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 group-open:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              Да, все наши сайты адаптивные и корректно отображаются на всех устройствах: компьютерах, планшетах и смартфонах. Это стандарт современной веб-разработки.
            </div>
          </details>

          {/* FAQ Item 5 */}
          <details className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
              <span className="text-lg font-semibold text-white pr-4">
                Что входит в поддержку после запуска?
              </span>
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 group-open:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              Техподдержка включает исправление ошибок, обновление контента, консультации по работе сайта. Также предлагаем доработку функционала и масштабирование по мере роста вашего бизнеса.
            </div>
          </details>

          {/* FAQ Item 6 */}
          <details className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
              <span className="text-lg font-semibold text-white pr-4">
                Могу ли я сам редактировать контент на сайте?
              </span>
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 group-open:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              Да, мы настроим удобную систему управления контентом (CMS). Вы сможете самостоятельно добавлять и редактировать тексты, фото, товары. Проведем обучение по работе с админ-панелью.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
