'use client';

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import toast from 'react-hot-toast';

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($phone: String, $avatar: String) {
    updateProfile(phone: $phone, avatar: $avatar) {
      id
      phone
      avatar
    }
  }
`;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone?: string;
  currentAvatar?: string;
  onSuccess: () => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentPhone,
  currentAvatar,
  onSuccess,
}: EditProfileModalProps) {
  const [phone, setPhone] = useState(currentPhone || '');
  const [avatar, setAvatar] = useState(currentAvatar || '');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      variables: {
        phone: phone || null,
        avatar: avatar || null,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1419] to-[#1a1f2e] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Редактировать профиль</h2>
          <p className="text-gray-400 text-sm">Обновите свою контактную информацию</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-2">
              URL аватара
            </label>
            <input
              type="url"
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Avatar Preview */}
          {avatar && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <img
                src={avatar}
                alt="Avatar preview"
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="%23374151" width="48" height="48"/></svg>';
                }}
              />
              <span className="text-sm text-gray-400">Предпросмотр аватара</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
