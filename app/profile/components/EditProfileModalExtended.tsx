'use client';

import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      phone
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

interface EditProfileModalExtendedProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onSuccess: () => void;
}

export function EditProfileModalExtended({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: EditProfileModalExtendedProps) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    clientType: currentUser?.clientType || 'INDIVIDUAL',
    inn: currentUser?.inn || '',
    bik: currentUser?.bik || '',
    accountNumber: currentUser?.accountNumber || '',
    fullName: currentUser?.fullName || '',
    companyName: currentUser?.companyName || '',
    kpp: currentUser?.kpp || '',
    ogrn: currentUser?.ogrn || '',
    legalAddress: currentUser?.legalAddress || '',
    bankName: currentUser?.bankName || '',
    corrAccount: currentUser?.corrAccount || '',
  });

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      toast.success('Профиль успешно обновлен');
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    },
  });

  const [findPartyByInn, { loading: loadingParty }] = useLazyQuery(FIND_PARTY_BY_INN, {
    onCompleted: (data) => {
      if (data.findPartyByInn) {
        setFormData((prev) => ({
          ...prev,
          ...data.findPartyByInn,
        }));
        toast.success('Данные компании загружены');
      }
    },
    onError: () => {
      toast.error('Не удалось найти компанию по ИНН');
    },
  });

  const [findBankByBik, { loading: loadingBank }] = useLazyQuery(FIND_BANK_BY_BIK, {
    onCompleted: (data) => {
      if (data.findBankByBik) {
        setFormData((prev) => ({
          ...prev,
          ...data.findBankByBik,
        }));
        toast.success('Данные банка загружены');
      }
    },
    onError: () => {
      toast.error('Не удалось найти банк по БИК');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      variables: {
        input: {
          ...formData,
          clientType: formData.clientType as any,
        },
      },
    });
  };

  const handleInnBlur = () => {
    if (formData.inn && formData.inn.length >= 10) {
      findPartyByInn({ variables: { inn: formData.inn } });
    }
  };

  const handleBikBlur = () => {
    if (formData.bik && formData.bik.length === 9) {
      findBankByBik({ variables: { bik: formData.bik } });
    }
  };

  if (!isOpen) return null;

  const isLegalEntity = formData.clientType === 'LEGAL_ENTITY' || formData.clientType === 'ENTREPRENEUR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1419] to-[#1a1f2e] p-8 shadow-2xl my-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Редактировать профиль</h2>
          <p className="text-gray-400">Обновите свою контактную информацию и реквизиты</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Тип клиента</label>
              <select
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="INDIVIDUAL">Физическое лицо</option>
                <option value="LEGAL_ENTITY">Юридическое лицо</option>
                <option value="ENTREPRENEUR">ИП</option>
              </select>
            </div>
          </div>

          {/* Реквизиты для физ. лиц */}
          {formData.clientType === 'INDIVIDUAL' && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Данные физического лица</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ФИО полностью</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Иванов Иван Иванович"
                />
              </div>
            </div>
          )}

          {/* Реквизиты для юр. лиц и ИП */}
          {isLegalEntity && (
            <>
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  Реквизиты организации
                  {loadingParty && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ИНН <span className="text-xs text-gray-500">(авто-заполнение)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.inn}
                      onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                      onBlur={handleInnBlur}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">КПП</label>
                    <input
                      type="text"
                      value={formData.kpp}
                      onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ОГРН</label>
                    <input
                      type="text"
                      value={formData.ogrn}
                      onChange={(e) => setFormData({ ...formData, ogrn: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="1234567890123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {formData.clientType === 'ENTREPRENEUR' ? 'ФИО ИП' : 'Название компании'}
                    </label>
                    <input
                      type="text"
                      value={formData.clientType === 'ENTREPRENEUR' ? formData.fullName : formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [formData.clientType === 'ENTREPRENEUR' ? 'fullName' : 'companyName']: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder={formData.clientType === 'ENTREPRENEUR' ? 'ИП Иванов И.И.' : 'ООО "Компания"'}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Юридический адрес</label>
                  <input
                    type="text"
                    value={formData.legalAddress}
                    onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="г. Москва, ул. Примерная, д. 1"
                  />
                </div>
              </div>

              {/* Банковские реквизиты */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  Банковские реквизиты
                  {loadingBank && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      БИК <span className="text-xs text-gray-500">(авто-заполнение)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.bik}
                      onChange={(e) => setFormData({ ...formData, bik: e.target.value })}
                      onBlur={handleBikBlur}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="044525225"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Номер счета</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="40702810000000000000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Название банка</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="ПАО Сбербанк"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Корр. счет</label>
                    <input
                      type="text"
                      value={formData.corrAccount}
                      onChange={(e) => setFormData({ ...formData, corrAccount: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="30101810000000000225"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
