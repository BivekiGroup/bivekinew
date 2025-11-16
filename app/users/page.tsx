'use client';

import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth, UserRole } from '../providers/AuthProvider';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CreateUserModal } from '../components/admin/CreateUserModal';
import { ViewUserModal } from '../components/admin/ViewUserModal';
import { AppLayout } from '../components/layout/AppLayout';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      role
      name
      createdAt
      isActive
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
        isActive
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  LEGAL_ENTITY = 'LEGAL_ENTITY',
  ENTREPRENEUR = 'ENTREPRENEUR',
}

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  createdAt: string;
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

function UsersContent() {
  const { user: currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, refetch: refetchUsers } = useQuery(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const users: User[] = data?.users || [];

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      user.name?.toLowerCase().includes(query) ||
      user.companyName?.toLowerCase().includes(query) ||
      user.fullName?.toLowerCase().includes(query) ||
      user.inn?.includes(query)
    );
  });

  const handleCreateUser = async (userData: any) => {
    try {
      const result = await createUser({
        variables: {
          input: userData,
        },
      });

      if (result.data?.createUser?.success) {
        toast.success('Пользователь успешно создан');
        refetchUsers();
        setShowCreateModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при создании пользователя');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      await deleteUser({
        variables: { id: userId },
      });
      toast.success('Пользователь удален');
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при удалении пользователя');
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор';
      case 'DEVELOPER':
        return 'Разработчик';
      case 'CUSTOMER':
        return 'Заказчик';
      default:
        return 'Неизвестно';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'from-red-400 to-pink-400';
      case 'DEVELOPER':
        return 'from-blue-400 to-cyan-400';
      case 'CUSTOMER':
        return 'from-green-400 to-emerald-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Пользователи</h1>
          <p className="text-gray-400">Управление пользователями системы</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
        >
          Создать пользователя
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, email, компании, ИНН..."
            className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Загрузка пользователей...</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Пользователь</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Роль</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Компания/ФИО</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Статус</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Дата создания</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowViewModal(true);
                      }}
                    >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{user.name || 'Без имени'}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRoleColor(user.role)}`}></div>
                        <span className="text-sm text-gray-300">{getRoleName(user.role)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                        {user.companyName || user.fullName || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Активен
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          Неактивен
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id);
                        }}
                        className="px-3 py-1 rounded-lg text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateUser}
        creating={creating}
      />

      {/* View User Modal */}
      <ViewUserModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser as any}
        onUpdate={() => {
          refetchUsers();
        }}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <AppLayout>
        <UsersContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
