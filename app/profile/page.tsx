'use client';

import { gql, useQuery } from '@apollo/client';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
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
  const { data, loading, refetch } = useQuery(GET_ME);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
            {/* Edit Profile Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Редактировать профиль
              </button>
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

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentPhone={user?.phone}
          currentAvatar={user?.avatar}
          onSuccess={() => refetch()}
        />
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
