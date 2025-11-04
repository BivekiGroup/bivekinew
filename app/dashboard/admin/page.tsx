'use client';

import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { UserRole } from '@/app/providers/AuthProvider';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      role
      name
      createdAt
      isActive
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      message
      user {
        id
        email
        role
        name
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $role: UserRole, $isActive: Boolean) {
    updateUser(id: $id, name: $name, role: $role, isActive: $isActive) {
      id
      email
      role
      name
      isActive
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  createdAt: string;
  isActive: boolean;
}

function AdminPanelContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    role: UserRole.CUSTOMER,
    name: '',
  });

  const { data, loading, refetch } = useQuery(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleCreateUser = async (e: React.FormEvent) => {
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

    try {
      const { data: result } = await createUser({
        variables: {
          input: {
            email: formData.email,
            role: formData.role,
            name: formData.name || null,
          },
        },
      });

      if (result.createUser.success) {
        toast.success(result.createUser.message);
        setShowCreateModal(false);
        setFormData({ email: '', role: UserRole.CUSTOMER, name: '' });
        refetch();
      } else {
        toast.error(result.createUser.message);
      }
    } catch (error) {
      console.error('Create user error:', error);
      toast.error('Ошибка создания пользователя');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await updateUser({
        variables: {
          id: userId,
          ...updates,
        },
      });
      toast.success('Пользователь обновлен');
      refetch();
      setEditingUser(null);
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Ошибка обновления пользователя');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Удалить пользователя ${userEmail}?`)) return;

    try {
      await deleteUser({ variables: { id: userId } });
      toast.success('Пользователь удален');
      refetch();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Ошибка удаления пользователя');
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case UserRole.DEVELOPER:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case UserRole.CUSTOMER:
        return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Администратор';
      case UserRole.DEVELOPER:
        return 'Разработчик';
      case UserRole.CUSTOMER:
        return 'Заказчик';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0d11]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Biveki"
                width={32}
                height={32}
                className="h-8 w-8 transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Biveki Admin
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              Назад
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Управление пользователями</h1>
            <p className="text-gray-400">Создание, редактирование и удаление пользователей</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать пользователя
            </span>
          </button>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Загрузка...</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Имя</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Роль</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Статус</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Дата создания</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data?.users.map((user: User) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{user.name || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {getRoleName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-300">{user.isActive ? 'Активен' : 'Неактивен'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                            title={user.isActive ? 'Деактивировать' : 'Активировать'}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                            title="Удалить"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Создать пользователя</h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Роль *</label>
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ email: '', role: UserRole.CUSTOMER, name: '' });
                  }}
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
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminPanelContent />
    </ProtectedRoute>
  );
}
