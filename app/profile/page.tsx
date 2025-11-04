'use client';

import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../providers/AuthProvider';
import { useQuery, gql } from '@apollo/client';
import { AppLayout } from '../components/layout/AppLayout';

const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      role
      name
      createdAt
      isActive
      phone
      avatar
      clientType
      inn
      bik
      accountNumber
      fullName
      companyName
      kpp
      ogrn
      legalAddress
      bankName
      corrAccount
    }
  }
`;

function ProfileContent() {
  const { data, loading } = useQuery(GET_ME);

  const user = data?.me;

  const renderField = (label: string, value: string | null | undefined) => (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="text-white text-lg">{value || '—'}</div>
    </div>
  );

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор';
      case 'DEVELOPER':
        return 'Разработчик';
      case 'CUSTOMER':
        return 'Заказчик';
      default:
        return 'Пользователь';
    }
  };

  const getClientTypeName = (type: string | null | undefined) => {
    switch (type) {
      case 'INDIVIDUAL':
        return 'Физическое лицо';
      case 'LEGAL_ENTITY':
        return 'Юридическое лицо';
      case 'ENTREPRENEUR':
        return 'ИП';
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">Мой профиль</h1>
          <p className="text-gray-400 text-lg">Просмотр информации о вашем аккаунте</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
            <p className="mt-6 text-gray-400 text-lg">Загрузка...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Информационное сообщение */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Изменение данных</h3>
                  <p className="text-gray-300 mb-3">
                    Для изменения данных профиля или реквизитов, пожалуйста, свяжитесь с администратором.
                  </p>
                  <a
                    href="mailto:developer@biveki.ru"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    developer@biveki.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Основная информация */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Основная информация</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {renderField('Email', user?.email)}
                {renderField('Имя', user?.name)}
                {renderField('Роль', getRoleName(user?.role))}
                {renderField('Дата регистрации', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : null)}
              </div>
            </div>

            {/* Реквизиты (только для клиентов) */}
            {user?.role === 'CUSTOMER' && (
              <>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Реквизиты</h2>

                  {renderField('Тип клиента', getClientTypeName(user.clientType))}

                  {user.clientType && (
                    <div className="mt-4 space-y-4">
                      {/* Для физ. лиц */}
                      {user.clientType === 'INDIVIDUAL' && (
                        <>
                          {renderField('Полное ФИО', user.fullName)}
                        </>
                      )}

                      {/* Для юр. лиц и ИП */}
                      {user.clientType !== 'INDIVIDUAL' && (
                        <>
                          <div className="grid gap-4 md:grid-cols-2">
                            {renderField('ИНН', user.inn)}
                            {renderField('КПП', user.kpp)}
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {renderField('ОГРН', user.ogrn)}
                            {renderField('Название организации', user.companyName)}
                          </div>
                          {renderField('Юридический адрес', user.legalAddress)}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Банковские реквизиты */}
                {user.clientType && (
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Банковские реквизиты</h2>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {renderField('БИК', user.bik)}
                        {renderField('Название банка', user.bankName)}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {renderField('Расчетный счет', user.accountNumber)}
                        {renderField('Корреспондентский счет', user.corrAccount)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProfileContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
