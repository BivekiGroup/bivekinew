import Header from "../components/Header";
import Link from "next/link";

export default function TermsOfService() {
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
          Пользовательское соглашение
        </h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p className="text-gray-400 text-sm">
              Последнее обновление: 02 ноября 2025 года
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Общие положения</h2>
              <p>
                Настоящее Пользовательское соглашение (далее — «Соглашение») определяет условия использования сайта biveki.ru (далее — «Сайт»), принадлежащего Индивидуальному предпринимателю Данилову Льву Ильичу (ИНН: 370230592107, далее — «Исполнитель»).
              </p>
              <p>
                Использование Сайта означает ваше полное и безоговорочное согласие с условиями настоящего Соглашения. Если вы не согласны с какими-либо условиями, пожалуйста, прекратите использование Сайта.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Термины и определения</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Сайт</strong> — интернет-ресурс, расположенный по адресу biveki.ru</li>
                <li><strong className="text-white">Пользователь</strong> — лицо, использующее Сайт</li>
                <li><strong className="text-white">Исполнитель</strong> — ИП Данилов Лев Ильич, предоставляющий услуги веб-разработки</li>
                <li><strong className="text-white">Услуги</strong> — услуги по разработке веб-сайтов, интернет-магазинов и веб-приложений</li>
                <li><strong className="text-white">Контент</strong> — информация, размещенная на Сайте</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Предмет соглашения</h2>
              <p>
                Исполнитель предоставляет Пользователю доступ к Сайту и информации о предоставляемых услугах в области веб-разработки, включая:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Разработка корпоративных сайтов и лендингов</li>
                <li>Создание интернет-магазинов</li>
                <li>Разработка веб-приложений</li>
                <li>Дизайн и UX/UI проектирование</li>
                <li>Техническая поддержка и доработка сайтов</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Права и обязанности Исполнителя</h2>
              <p><strong className="text-white">Исполнитель имеет право:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Изменять содержание и структуру Сайта</li>
                <li>Ограничивать доступ к Сайту для проведения технических работ</li>
                <li>Отказать в оказании услуг без объяснения причин</li>
                <li>Вносить изменения в настоящее Соглашение</li>
              </ul>
              <p className="mt-4"><strong className="text-white">Исполнитель обязуется:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Обеспечивать работоспособность Сайта</li>
                <li>Предоставлять качественные услуги в соответствии с договором</li>
                <li>Соблюдать конфиденциальность персональных данных Пользователя</li>
                <li>Своевременно отвечать на запросы Пользователей</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Права и обязанности Пользователя</h2>
              <p><strong className="text-white">Пользователь имеет право:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Получать информацию об услугах Исполнителя</li>
                <li>Обращаться к Исполнителю с запросами и предложениями</li>
                <li>Заказывать услуги веб-разработки</li>
              </ul>
              <p className="mt-4"><strong className="text-white">Пользователь обязуется:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Соблюдать условия настоящего Соглашения</li>
                <li>Не использовать Сайт в противоправных целях</li>
                <li>Предоставлять достоверную информацию при заполнении форм</li>
                <li>Не нарушать права интеллектуальной собственности</li>
                <li>Не предпринимать действий, направленных на нарушение работы Сайта</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Оказание услуг</h2>
              <p>
                Оказание услуг веб-разработки осуществляется на основании отдельного договора между Исполнителем и Заказчиком (Пользователем).
              </p>
              <p className="mt-4">
                <strong className="text-white">Порядок оказания услуг:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Пользователь направляет запрос через форму на Сайте или по электронной почте</li>
                <li>Исполнитель рассматривает запрос и связывается с Пользователем</li>
                <li>Стороны обсуждают детали проекта и согласовывают условия</li>
                <li>Подписывается договор на оказание услуг</li>
                <li>Исполнитель выполняет работы в соответствии с договором</li>
                <li>Заказчик принимает выполненные работы и производит оплату</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Стоимость и порядок оплаты</h2>
              <p>
                Стоимость услуг определяется индивидуально для каждого проекта и указывается в договоре. Цены, указанные на Сайте, носят информационный характер и не являются публичной офертой.
              </p>
              <p className="mt-4">
                Оплата услуг осуществляется в соответствии с условиями договора. Возможны следующие варианты оплаты:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Предоплата 100%</li>
                <li>Поэтапная оплата (например, 50% аванс, 50% по завершении)</li>
                <li>Оплата по результату</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Интеллектуальная собственность</h2>
              <p>
                Все материалы Сайта, включая тексты, графические изображения, дизайн, программный код и другие элементы, являются объектами интеллектуальной собственности Исполнителя и защищены законодательством РФ.
              </p>
              <p className="mt-4">
                Права на результаты работ, созданные в рамках оказания услуг, передаются Заказчику в соответствии с условиями договора после полной оплаты услуг.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Ответственность сторон</h2>
              <p>
                Исполнитель не несет ответственности за:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Временную недоступность Сайта по техническим причинам</li>
                <li>Действия третьих лиц, нарушающих работу Сайта</li>
                <li>Убытки, возникшие в результате использования информации с Сайта</li>
                <li>Ошибки или неточности в информации, размещенной на Сайте</li>
              </ul>
              <p className="mt-4">
                Пользователь несет ответственность за:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Достоверность предоставленной информации</li>
                <li>Сохранность своих учетных данных</li>
                <li>Все действия, совершенные с использованием его учетной записи</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Конфиденциальность</h2>
              <p>
                Обработка персональных данных Пользователя осуществляется в соответствии с{" "}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Политикой конфиденциальности
                </Link>.
              </p>
              <p className="mt-4">
                Вся информация о проектах и коммерческая информация Заказчика является конфиденциальной и не подлежит разглашению третьим лицам без письменного согласия Заказчика.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Разрешение споров</h2>
              <p>
                Все споры и разногласия, возникающие в связи с исполнением настоящего Соглашения, решаются путем переговоров. В случае невозможности урегулирования спора путем переговоров, спор подлежит рассмотрению в суде по месту нахождения Исполнителя в соответствии с законодательством РФ.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Срок действия и изменение Соглашения</h2>
              <p>
                Настоящее Соглашение вступает в силу с момента начала использования Сайта Пользователем и действует бессрочно.
              </p>
              <p className="mt-4">
                Исполнитель оставляет за собой право в любое время изменять условия настоящего Соглашения без предварительного уведомления Пользователя. Новая редакция Соглашения вступает в силу с момента ее размещения на Сайте.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">13. Прочие условия</h2>
              <p>
                Если какое-либо положение настоящего Соглашения будет признано недействительным, это не влияет на действительность остальных положений.
              </p>
              <p className="mt-4">
                Бездействие Исполнителя в случае нарушения Пользователем условий настоящего Соглашения не лишает Исполнителя права предпринять соответствующие действия в защиту своих интересов позднее.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">14. Реквизиты</h2>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <p><strong className="text-white">Индивидуальный предприниматель Данилов Лев Ильич</strong></p>
                <p>ИНН: 370230592107</p>
                <p className="mt-3"><strong className="text-white">Банковские реквизиты:</strong></p>
                <p>Банк: ООО &quot;Банк Точка&quot;</p>
                <p>БИК: 044525104</p>
                <p>Расчётный счёт: 40802810820000749783</p>
                <p>Корреспондентский счёт: 30101810745374525104</p>
                <p className="mt-3"><strong className="text-white">Контактная информация:</strong></p>
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
              <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-blue-400 text-sm transition-colors">
                Пользовательское соглашение
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
