import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0a0d11] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Biveki"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-white">Biveki</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Веб-разработка для бизнеса
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/biveki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a
                href="https://github.com/biveki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="mailto:developer@biveki.ru" className="hover:text-blue-400 transition-colors">
                  developer@biveki.ru
                </a>
              </li>
              <li>
                <a href="tel:+79611177205" className="hover:text-blue-400 transition-colors">
                  +7 (961) 117-72-05
                </a>
              </li>
              <li>Иваново, Россия</li>
              <li>Пн-Пт: 10:00 - 18:00</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Документы</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/privacy" className="hover:text-blue-400 transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-400 transition-colors">
                  Пользовательское соглашение
                </a>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Реквизиты</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>ИП Данилов Лев Ильич</p>
              <p>ИНН: 370230592107</p>
              <p>Банк: ООО &quot;Банк Точка&quot;</p>
              <p>БИК: 044525104</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <p className="text-center text-sm text-gray-500">
            © 2025 Biveki. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
