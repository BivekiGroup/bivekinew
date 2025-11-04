'use client';

import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import { UserRole } from '@/app/providers/AuthProvider';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState } from 'react';
import { AppLayout } from '@/app/components/layout/AppLayout';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const GET_CONTACT_FORMS = gql`
  query GetContactForms {
    contactForms {
      id
      name
      email
      phone
      project
      status
      ipAddress
      userAgent
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_CONTACT_FORM_STATUS = gql`
  mutation UpdateContactFormStatus($id: ID!, $status: ContactStatus!) {
    updateContactFormStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

enum ContactStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone?: string;
  project: string;
  status: ContactStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  [ContactStatus.NEW]: 'Новая',
  [ContactStatus.IN_PROGRESS]: 'В обработке',
  [ContactStatus.COMPLETED]: 'Обработана',
  [ContactStatus.REJECTED]: 'Отклонена',
};

const STATUS_COLORS: Record<ContactStatus, string> = {
  [ContactStatus.NEW]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [ContactStatus.IN_PROGRESS]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  [ContactStatus.COMPLETED]: 'bg-green-500/10 text-green-400 border-green-500/20',
  [ContactStatus.REJECTED]: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// Безопасное форматирование даты
function formatDate(dateString: string, formatStr: string): string {
  try {
    if (!dateString) return 'Неверная дата';
    // Используем parseISO для парсинга ISO 8601 строк из базы данных
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      return 'Неверная дата';
    }
    return format(date, formatStr, { locale: ru });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Неверная дата';
  }
}

function ContactsContent() {
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);

  const { data, loading, refetch } = useQuery(GET_CONTACT_FORMS, {
    pollInterval: 30000,
  });
  const [updateStatus] = useMutation(UPDATE_CONTACT_FORM_STATUS);

  const contacts: ContactForm[] = data?.contactForms || [];

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    try {
      await updateStatus({
        variables: { id, status },
      });
      toast.success('Статус обновлен');
      refetch();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при обновлении статуса');
    }
  };

  const newCount = contacts.filter((c) => c.status === ContactStatus.NEW).length;
  const inProgressCount = contacts.filter((c) => c.status === ContactStatus.IN_PROGRESS).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:pt-20">
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent mb-2 sm:mb-3">
          Заявки
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">Управление контактными заявками с сайта</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/15 transition-colors duration-300">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Всего заявок</p>
              <p className="text-3xl font-bold text-white">{contacts.length}</p>
            </div>
          </div>
        </div>
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Новых</p>
              <p className="text-3xl font-bold text-white">{newCount}</p>
            </div>
          </div>
        </div>
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent p-6 hover:border-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">В обработке</p>
              <p className="text-3xl font-bold text-white">{inProgressCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Проект
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Заявок пока нет
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-blue-400 hover:text-blue-300 block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {contact.email}
                        </a>
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-sm text-gray-400 hover:text-gray-300 block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 line-clamp-2 max-w-xs">
                        {contact.project}
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value as ContactStatus)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${STATUS_COLORS[contact.status]} bg-transparent cursor-pointer hover:opacity-80`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value} className="bg-[#1a1f2e]">
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">
                        {formatDate(contact.createdAt, 'dd MMM yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(contact.createdAt, 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                        }}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Детали
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-[#1a1f2e] rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Детали заявки</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Статус</label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => handleStatusChange(selectedContact.id, e.target.value as ContactStatus)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value} className="bg-[#1a1f2e]">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Имя</label>
                <p className="text-white">{selectedContact.name}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {selectedContact.email}
                </a>
              </div>

              {/* Phone */}
              {selectedContact.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Телефон</label>
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {selectedContact.phone}
                  </a>
                </div>
              )}

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Описание проекта</label>
                <p className="text-white whitespace-pre-wrap bg-white/5 border border-white/10 rounded-lg p-4">
                  {selectedContact.project}
                </p>
              </div>

              {/* Meta info */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">Создана:</span>{' '}
                  {formatDate(selectedContact.createdAt, 'dd MMMM yyyy, HH:mm:ss')}
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Обновлена:</span>{' '}
                  {formatDate(selectedContact.updatedAt, 'dd MMMM yyyy, HH:mm:ss')}
                </p>
                {selectedContact.ipAddress && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">IP адрес:</span> {selectedContact.ipAddress}
                  </p>
                )}
                {selectedContact.userAgent && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">User Agent:</span>{' '}
                    <span className="text-xs">{selectedContact.userAgent}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.DEVELOPER]}>
      <AppLayout>
        <ContactsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
