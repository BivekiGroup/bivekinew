'use client';

import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';

const FIND_PARTY_BY_INN = gql`
  query FindPartyByInn($inn: String!) {
    findPartyByInn(inn: $inn) {
      inn
      kpp
      ogrn
      companyName
      legalAddress
    }
  }
`;

const FIND_BANK_BY_BIK = gql`
  query FindBankByBik($bik: String!) {
    findBankByBik(bik: $bik) {
      bik
      bankName
      corrAccount
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $email: String, $name: String, $role: UserRole, $isActive: Boolean) {
    updateUser(id: $id, email: $email, name: $name, role: $role, isActive: $isActive) {
      id
      email
      role
      name
      isActive
    }
  }
`;

const UPDATE_USER_REQUISITES = gql`
  mutation UpdateUserRequisites($id: ID!, $input: UpdateProfileInput!) {
    updateUserRequisites(id: $id, input: $input) {
      id
      email
      role
      name
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

enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN',
}

enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  LEGAL_ENTITY = 'LEGAL_ENTITY',
  ENTREPRENEUR = 'ENTREPRENEUR',
}

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  isActive: boolean;
  clientType?: ClientType | null;
  inn?: string | null;
  bik?: string | null;
  accountNumber?: string | null;
  fullName?: string | null;
  companyName?: string | null;
  kpp?: string | null;
  ogrn?: string | null;
  legalAddress?: string | null;
  bankName?: string | null;
  corrAccount?: string | null;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: () => void;
}

export function ViewUserModal({ isOpen, onClose, user, onUpdate }: ViewUserModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: UserRole.CUSTOMER,
    isActive: true,
    clientType: '' as ClientType | '',
    inn: '',
    bik: '',
    accountNumber: '',
    fullName: '',
    companyName: '',
    kpp: '',
    ogrn: '',
    legalAddress: '',
    bankName: '',
    corrAccount: '',
  });

  const [findParty, { loading: loadingParty }] = useLazyQuery(FIND_PARTY_BY_INN);
  const [findBank, { loading: loadingBank }] = useLazyQuery(FIND_BANK_BY_BIK);
  const [updateUser, { loading: updatingBasic }] = useMutation(UPDATE_USER);
  const [updateUserRequisites, { loading: updatingRequisites }] = useMutation(UPDATE_USER_REQUISITES);

  const updating = updatingBasic || updatingRequisites;

  // Загружаем данные пользователя в форму
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name || '',
        role: user.role,
        isActive: user.isActive,
        clientType: user.clientType || '',
        inn: user.inn || '',
        bik: user.bik || '',
        accountNumber: user.accountNumber || '',
        fullName: user.fullName || '',
        companyName: user.companyName || '',
        kpp: user.kpp || '',
        ogrn: user.ogrn || '',
        legalAddress: user.legalAddress || '',
        bankName: user.bankName || '',
        corrAccount: user.corrAccount || '',
      });
    }
  }, [user]);

  // Сброс при закрытии
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleInnBlur = async () => {
    if (!formData.inn || formData.inn.length < 10 || !isEditing) return;

    try {
      const { data } = await findParty({ variables: { inn: formData.inn } });

      if (data?.findPartyByInn) {
        const party = data.findPartyByInn;
        setFormData(prev => ({
          ...prev,
          companyName: party.companyName || prev.companyName,
          kpp: party.kpp || prev.kpp,
          ogrn: party.ogrn || prev.ogrn,
          legalAddress: party.legalAddress || prev.legalAddress,
        }));
        toast.success('Данные организации загружены');
      } else {
        toast.error('Организация с таким ИНН не найдена');
      }
    } catch (error) {
      console.error('Error fetching party:', error);
      toast.error('Ошибка загрузки данных организации');
    }
  };

  const handleBikBlur = async () => {
    if (!formData.bik || formData.bik.length !== 9 || !isEditing) return;

    try {
      const { data } = await findBank({ variables: { bik: formData.bik } });

      if (data?.findBankByBik) {
        const bank = data.findBankByBik;
        setFormData(prev => ({
          ...prev,
          bankName: bank.bankName || prev.bankName,
          corrAccount: bank.corrAccount || prev.corrAccount,
        }));
        toast.success('Данные банка загружены');
      } else {
        toast.error('Банк с таким БИК не найден');
      }
    } catch (error) {
      console.error('Error fetching bank:', error);
      toast.error('Ошибка загрузки данных банка');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      // Обновляем базовые данные
      await updateUser({
        variables: {
          id: user.id,
          email: formData.email !== user.email ? formData.email : undefined,
          name: formData.name || null,
          role: formData.role,
          isActive: formData.isActive,
        },
      });

      // Обновляем реквизиты через админскую мутацию
      const requisitesInput: any = {
        clientType: formData.clientType || null,
        bik: formData.bik || null,
        accountNumber: formData.accountNumber || null,
        bankName: formData.bankName || null,
        corrAccount: formData.corrAccount || null,
      };

      if (formData.clientType === ClientType.INDIVIDUAL) {
        requisitesInput.fullName = formData.fullName || null;
        // Очищаем поля для юр. лиц
        requisitesInput.inn = null;
        requisitesInput.companyName = null;
        requisitesInput.kpp = null;
        requisitesInput.ogrn = null;
        requisitesInput.legalAddress = null;
      } else if (formData.clientType) {
        requisitesInput.inn = formData.inn || null;
        requisitesInput.companyName = formData.companyName || null;
        requisitesInput.kpp = formData.kpp || null;
        requisitesInput.ogrn = formData.ogrn || null;
        requisitesInput.legalAddress = formData.legalAddress || null;
        // Очищаем поле для физ. лиц
        requisitesInput.fullName = null;
      }

      await updateUserRequisites({
        variables: {
          id: user.id,
          input: requisitesInput,
        },
      });

      toast.success('Данные пользователя обновлены');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Ошибка обновления пользователя');
    }
  };

  if (!isOpen || !user) return null;

  const renderField = (label: string, value: string | null | undefined) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="text-white">{value || '—'}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="p-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Редактировать пользователя' : 'Просмотр пользователя'}
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              Редактировать
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 overflow-y-auto flex-1 space-y-4">
            {/* Email */}
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="user@example.com"
                  required
                />
              </div>
            ) : (
              renderField('Email', user.email)
            )}

            {/* Имя */}
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Иван Иванов"
                />
              </div>
            ) : (
              renderField('Имя', user.name)
            )}

            {/* Роль */}
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Роль</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value={UserRole.CUSTOMER}>Заказчик</option>
                  <option value={UserRole.DEVELOPER}>Разработчик</option>
                  <option value={UserRole.ADMIN}>Администратор</option>
                </select>
              </div>
            ) : (
              renderField('Роль', user.role === 'CUSTOMER' ? 'Заказчик' : user.role === 'DEVELOPER' ? 'Разработчик' : 'Администратор')
            )}

            {/* Статус */}
            {isEditing ? (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                  <span className="text-gray-300">Аккаунт активен</span>
                </label>
              </div>
            ) : (
              renderField('Статус', user.isActive ? 'Активен' : 'Неактивен')
            )}

            {/* Реквизиты для клиентов */}
            {(formData.role === UserRole.CUSTOMER || user.role === UserRole.CUSTOMER) && (
              <>
                {/* Тип клиента */}
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Тип клиента</label>
                    <select
                      value={formData.clientType}
                      onChange={(e) => setFormData({ ...formData, clientType: e.target.value as ClientType })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">Не указано</option>
                      <option value={ClientType.INDIVIDUAL}>Физическое лицо</option>
                      <option value={ClientType.LEGAL_ENTITY}>Юридическое лицо</option>
                      <option value={ClientType.ENTREPRENEUR}>ИП</option>
                    </select>
                  </div>
                ) : (
                  renderField('Тип клиента',
                    user.clientType === 'INDIVIDUAL' ? 'Физическое лицо' :
                    user.clientType === 'LEGAL_ENTITY' ? 'Юридическое лицо' :
                    user.clientType === 'ENTREPRENEUR' ? 'ИП' : null
                  )
                )}

                {formData.clientType && (
                  <>
                    {/* Для физ. лиц - ФИО */}
                    {formData.clientType === ClientType.INDIVIDUAL && (
                      isEditing ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Полное ФИО</label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Иванов Иван Иванович"
                          />
                        </div>
                      ) : (
                        renderField('Полное ФИО', user.fullName)
                      )
                    )}

                    {/* Для юр. лиц и ИП */}
                    {formData.clientType !== ClientType.INDIVIDUAL && (
                      <>
                        {isEditing ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                ИНН {loadingParty && <span className="text-blue-400">(загрузка...)</span>}
                              </label>
                              <input
                                type="text"
                                value={formData.inn}
                                onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                                onBlur={handleInnBlur}
                                maxLength={12}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="1234567890"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">КПП</label>
                                <input
                                  type="text"
                                  value={formData.kpp}
                                  onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                  placeholder="123456789"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">ОГРН</label>
                                <input
                                  type="text"
                                  value={formData.ogrn}
                                  onChange={(e) => setFormData({ ...formData, ogrn: e.target.value })}
                                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                  placeholder="1234567890123"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Название организации</label>
                              <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="ООО Компания"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Юридический адрес</label>
                              <input
                                type="text"
                                value={formData.legalAddress}
                                onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="г. Москва, ул. Примерная, д. 1"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {renderField('ИНН', user.inn)}
                            <div className="grid grid-cols-2 gap-4">
                              {renderField('КПП', user.kpp)}
                              {renderField('ОГРН', user.ogrn)}
                            </div>
                            {renderField('Название организации', user.companyName)}
                            {renderField('Юридический адрес', user.legalAddress)}
                          </>
                        )}
                      </>
                    )}

                    {/* Банковские реквизиты */}
                    <div className="border-t border-white/10 pt-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Банковские реквизиты</h3>

                      {isEditing ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              БИК {loadingBank && <span className="text-blue-400">(загрузка...)</span>}
                            </label>
                            <input
                              type="text"
                              value={formData.bik}
                              onChange={(e) => setFormData({ ...formData, bik: e.target.value })}
                              onBlur={handleBikBlur}
                              maxLength={9}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              placeholder="044525225"
                            />
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Название банка</label>
                            <input
                              type="text"
                              value={formData.bankName}
                              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              placeholder="ПАО Сбербанк"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Расчетный счет</label>
                              <input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                maxLength={20}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="40817810099910004312"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Корр. счет</label>
                              <input
                                type="text"
                                value={formData.corrAccount}
                                onChange={(e) => setFormData({ ...formData, corrAccount: e.target.value })}
                                maxLength={20}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="30101810400000000225"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {renderField('БИК', user.bik)}
                          {renderField('Название банка', user.bankName)}
                          <div className="grid grid-cols-2 gap-4">
                            {renderField('Расчетный счет', user.accountNumber)}
                            {renderField('Корр. счет', user.corrAccount)}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 p-8 pt-4">
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  // Восстанавливаем данные
                  if (user) {
                    setFormData({
                      email: user.email,
                      name: user.name || '',
                      role: user.role,
                      isActive: user.isActive,
                      clientType: user.clientType || '',
                      inn: user.inn || '',
                      bik: user.bik || '',
                      accountNumber: user.accountNumber || '',
                      fullName: user.fullName || '',
                      companyName: user.companyName || '',
                      kpp: user.kpp || '',
                      ogrn: user.ogrn || '',
                      legalAddress: user.legalAddress || '',
                      bankName: user.bankName || '',
                      corrAccount: user.corrAccount || '',
                    });
                  }
                } else {
                  onClose();
                }
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
            >
              {isEditing ? 'Отмена' : 'Закрыть'}
            </button>
            {isEditing && (
              <button
                type="submit"
                disabled={updating}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {updating ? 'Сохранение...' : 'Сохранить'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
