'use client';

import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
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

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
  creating: boolean;
}

export function CreateUserModal({ isOpen, onClose, onCreate, creating }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: UserRole.CUSTOMER,
    name: '',
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

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: '',
        role: UserRole.CUSTOMER,
        name: '',
        clientType: '',
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
    }
  }, [isOpen]);

  const handleInnBlur = async () => {
    if (!formData.inn || formData.inn.length < 10) return;

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
    if (!formData.bik || formData.bik.length !== 9) return;

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

    // Валидация
    if (!formData.email.trim()) {
      toast.error('Введите email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Введите корректный email');
      return;
    }

    if (formData.role === UserRole.CUSTOMER && !formData.clientType) {
      toast.error('Выберите тип клиента');
      return;
    }

    // Подготовка данных
    const input: any = {
      email: formData.email,
      role: formData.role,
      name: formData.name || null,
    };

    // Добавляем реквизиты только если клиент
    if (formData.role === UserRole.CUSTOMER && formData.clientType) {
      input.clientType = formData.clientType;
      input.bik = formData.bik || null;
      input.accountNumber = formData.accountNumber || null;

      if (formData.clientType === ClientType.INDIVIDUAL) {
        input.fullName = formData.fullName || null;
      } else {
        input.inn = formData.inn || null;
        input.companyName = formData.companyName || null;
        input.kpp = formData.kpp || null;
        input.ogrn = formData.ogrn || null;
        input.legalAddress = formData.legalAddress || null;
      }

      input.bankName = formData.bankName || null;
      input.corrAccount = formData.corrAccount || null;
    }

    await onCreate(input);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 max-w-2xl w-full flex flex-col max-h-[90vh]">
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold text-white">Создать пользователя</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 overflow-y-auto flex-1 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="user@example.com"
            />
          </div>

          {/* Имя */}
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

          {/* Роль */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Роль *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole, clientType: '' })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value={UserRole.CUSTOMER}>Заказчик</option>
              <option value={UserRole.DEVELOPER}>Разработчик</option>
              <option value={UserRole.ADMIN}>Администратор</option>
            </select>
          </div>

          {/* Реквизиты для клиентов */}
          {formData.role === UserRole.CUSTOMER && (
            <>
              {/* Тип клиента */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Тип клиента *</label>
                <select
                  value={formData.clientType}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value as ClientType })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Выберите тип</option>
                  <option value={ClientType.INDIVIDUAL}>Физическое лицо</option>
                  <option value={ClientType.LEGAL_ENTITY}>Юридическое лицо</option>
                  <option value={ClientType.ENTREPRENEUR}>ИП</option>
                </select>
              </div>

              {formData.clientType && (
                <>
                  {/* Для физ. лиц - ФИО */}
                  {formData.clientType === ClientType.INDIVIDUAL && (
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
                  )}

                  {/* Для юр. лиц и ИП - ИНН с автозаполнением */}
                  {formData.clientType !== ClientType.INDIVIDUAL && (
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
                  )}

                  {/* Банковские реквизиты для всех типов */}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Банковские реквизиты</h3>

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

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 mt-4">Название банка</label>
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
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {creating ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
