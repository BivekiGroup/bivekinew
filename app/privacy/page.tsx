import Header from "../components/Header";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-24 pt-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Вернуться на главную
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
          Политика конфиденциальности
        </h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p className="text-gray-400 text-sm">
              Последнее обновление: 02 ноября 2025 года
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта biveki.ru (далее — «Сайт»), принадлежащего Индивидуальному предпринимателю Данилову Льву Ильичу (ИНН: 370230592107).
              </p>
              <p>
                Используя Сайт, вы соглашаетесь с условиями настоящей Политики конфиденциальности. Если вы не согласны с какими-либо условиями, пожалуйста, не используйте Сайт.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Какие данные мы собираем</h2>
              <p>Мы можем собирать следующие категории персональных данных:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Имя и фамилия</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Информация о компании (название, должность)</li>
                <li>Описание проекта или запроса</li>
                <li>IP-адрес и данные о браузере</li>
                <li>Файлы cookie и данные об использовании Сайта</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Как мы используем ваши данные</h2>
              <p>Мы используем собранные данные для следующих целей:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Обработка и ответ на ваши запросы</li>
                <li>Предоставление услуг веб-разработки</li>
                <li>Связь с вами по поводу проектов и услуг</li>
                <li>Улучшение качества наших услуг и Сайта</li>
                <li>Отправка информационных и маркетинговых материалов (с вашего согласия)</li>
                <li>Анализ использования Сайта и поведения пользователей</li>
                <li>Соблюдение законодательных требований</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Правовые основания обработки данных</h2>
              <p>Мы обрабатываем ваши персональные данные на следующих правовых основаниях:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ваше согласие на обработку персональных данных</li>
                <li>Необходимость исполнения договора оказания услуг</li>
                <li>Соблюдение законодательных обязательств</li>
                <li>Законные интересы нашей компании</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Передача данных третьим лицам</h2>
              <p>
                Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением следующих случаев:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>С вашего явного согласия</li>
                <li>Для предоставления услуг нашими партнерами и подрядчиками (хостинг, аналитика, платежные системы)</li>
                <li>По требованию государственных органов в случаях, предусмотренных законодательством</li>
                <li>Для защиты наших прав и законных интересов</li>
              </ul>
              <p className="mt-4">
                Все третьи лица, получающие доступ к вашим данным, обязаны обеспечить их конфиденциальность и безопасность.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Безопасность данных</h2>
              <p>
                Мы применяем технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения, включая:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Шифрование данных при передаче (SSL/TLS)</li>
                <li>Ограничение доступа к персональным данным</li>
                <li>Регулярное обновление систем безопасности</li>
                <li>Мониторинг и аудит доступа к данным</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Файлы cookie</h2>
              <p>
                Наш Сайт использует файлы cookie для улучшения пользовательского опыта, анализа посещаемости и персонализации контента. Вы можете настроить свой браузер для отклонения файлов cookie, однако это может ограничить функциональность Сайта.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Ваши права</h2>
              <p>В соответствии с законодательством о персональных данных, вы имеете следующие права:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Право на доступ к вашим персональным данным</li>
                <li>Право на исправление неточных данных</li>
                <li>Право на удаление данных («право на забвение»)</li>
                <li>Право на ограничение обработки данных</li>
                <li>Право на отзыв согласия на обработку данных</li>
                <li>Право на подачу жалобы в надзорный орган</li>
              </ul>
              <p className="mt-4">
                Для реализации ваших прав, пожалуйста, свяжитесь с нами по адресу: developer@biveki.ru
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Хранение данных</h2>
              <p>
                Мы храним ваши персональные данные только в течение периода, необходимого для достижения целей, для которых они были собраны, или в соответствии с требованиями законодательства.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Изменения в Политике конфиденциальности</h2>
              <p>
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. Все изменения вступают в силу с момента публикации новой версии на Сайте. Рекомендуем регулярно проверять эту страницу для ознакомления с актуальной версией Политики.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Контактная информация</h2>
              <p>
                Если у вас есть вопросы или предложения относительно настоящей Политики конфиденциальности, пожалуйста, свяжитесь с нами:
              </p>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <p><strong className="text-white">ИП Данилов Лев Ильич</strong></p>
                <p>ИНН: 370230592107</p>
                <p>Email: <a href="mailto:developer@biveki.ru" className="text-blue-400 hover:text-blue-300">developer@biveki.ru</a></p>
                <p>Телефон: <a href="tel:+79611177205" className="text-blue-400 hover:text-blue-300">+7 (961) 117-72-05</a></p>
                <p>Адрес: г. Иваново, Россия</p>
                <p>Часы работы: Пн-Пт, 10:00 - 18:00</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-[#0a0d11]/50 backdrop-blur-xl mt-24">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Biveki. Все права защищены.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-blue-400 text-sm transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Пользовательское соглашение
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
