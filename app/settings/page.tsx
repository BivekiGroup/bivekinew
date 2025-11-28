'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { AvatarUpload } from '../components/settings/AvatarUpload';
import toast from 'react-hot-toast';

const GET_MY_SETTINGS = gql`
  query GetMySettings {
    me {
      id
      email
      name
      phone
      avatar
      role
    }
    mySettings {
      id
      emailNotifications
      taskNotifications
      projectNotifications
      deadlineNotifications
      theme
      language
    }
  }
`;

const UPDATE_MY_SETTINGS = gql`
  mutation UpdateMySettings($input: UpdateUserSettingsInput!) {
    updateMySettings(input: $input) {
      id
      emailNotifications
      taskNotifications
      projectNotifications
      deadlineNotifications
      theme
      language
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      phone
      avatar
    }
  }
`;

type Tab = 'profile' | 'notifications' | 'appearance';

function SettingsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { data, loading, refetch } = useQuery(GET_MY_SETTINGS);
  const [updateSettings] = useMutation(UPDATE_MY_SETTINGS);
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  });

  const user = data?.me;
  const settings = data?.mySettings;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        variables: {
          input: {
            name: profileData.name || user?.name,
            phone: profileData.phone || user?.phone,
          },
        },
      });
      toast.success('Профиль обновлен');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка обновления профиля');
    }
  };

  const handleToggleSetting = async (key: string, value: boolean) => {
    try {
      await updateSettings({
        variables: {
          input: { [key]: value },
        },
      });
      toast.success('Настройки сохранены');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка сохранения настроек');
    }
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Профиль', icon: '👤' },
    { id: 'notifications' as Tab, label: 'Уведомления', icon: '🔔' },
    { id: 'appearance' as Tab, label: 'Внешний вид', icon: '🎨' },
  ];

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
        <p className="mt-6 text-gray-400 text-lg">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          Настройки
        </h1>
        <p className="text-gray-400 text-lg">Управление вашим аккаунтом и предпочтениями</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Личная информация</h2>

            <AvatarUpload currentAvatar={user?.avatar} onUploadSuccess={refetch} />

            <form onSubmit={handleUpdateProfile} className="space-y-6 mt-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Имя</label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Телефон</label>
                <input
                  type="tel"
                  defaultValue={user?.phone || ''}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                Сохранить изменения
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Настройки уведомлений</h2>

          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email уведомления', description: 'Получать уведомления на почту' },
              { key: 'taskNotifications', label: 'Уведомления о задачах', description: 'Новые задачи и изменения статуса' },
              { key: 'projectNotifications', label: 'Уведомления о проектах', description: 'Обновления проектов и дедлайны' },
              { key: 'deadlineNotifications', label: 'Уведомления о дедлайнах', description: 'Напоминания о приближающихся сроках' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <h3 className="text-white font-medium">{item.label}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
                <button
                  onClick={() => handleToggleSetting(item.key, !settings?.[item.key])}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings?.[item.key] ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      settings?.[item.key] ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Внешний вид</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Тема</label>
              <div className="grid grid-cols-2 gap-4">
                {['dark', 'light'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleToggleSetting('theme', theme === 'dark')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings?.theme === theme
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-white font-medium capitalize">{theme === 'dark' ? 'Темная' : 'Светлая'}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Язык</label>
              <select
                value={settings?.language || 'ru'}
                onChange={(e) => handleToggleSetting('language', e.target.value === 'ru')}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SettingsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

export default SettingsPage;
