'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int, $offset: Int) {
    notifications(limit: $limit, offset: $offset) {
      id
      type
      title
      message
      read
      link
      createdAt
    }
    notificationStats {
      total
      unread
    }
  }
`;

const MARK_AS_READ = gql`
  mutation MarkAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsRead {
    markAllNotificationsAsRead
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

function NotificationsContent() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { limit: 50, offset: 0 },
    pollInterval: 60000,
  });

  const [markAsRead] = useMutation(MARK_AS_READ, {
    onCompleted: () => refetch(),
  });

  const [markAllAsRead] = useMutation(MARK_ALL_AS_READ, {
    onCompleted: () => refetch(),
  });

  const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
    onCompleted: () => refetch(),
  });

  const notifications = data?.notifications || [];
  const stats = data?.notificationStats || { total: 0, unread: 0 };

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n: any) => !n.read) : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
      case 'TASK_UPDATED':
        return '📋';
      case 'TASK_COMPLETED':
        return '✅';
      case 'PROJECT_CREATED':
      case 'PROJECT_UPDATED':
        return '📁';
      case 'PROJECT_COMPLETED':
        return '🎉';
      case 'DEADLINE_APPROACHING':
        return '⏰';
      case 'FILE_UPLOADED':
        return '📎';
      case 'COMMENT_ADDED':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return 'from-blue-500 to-cyan-500';
      case 'TASK_COMPLETED':
      case 'PROJECT_COMPLETED':
        return 'from-green-500 to-emerald-500';
      case 'DEADLINE_APPROACHING':
        return 'from-red-500 to-orange-500';
      case 'FILE_UPLOADED':
        return 'from-yellow-500 to-amber-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          Уведомления
        </h1>
        <p className="text-gray-400 text-lg">Все уведомления в одном месте</p>
      </div>

      {/* Stats & Controls */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Всего</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">{stats.unread}</div>
              <div className="text-sm text-gray-400">Непрочитанных</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Непрочитанные
              </button>
            </div>

            {/* Mark All Read */}
            {stats.unread > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
              >
                Прочитать все
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <p className="mt-6 text-gray-400 text-lg">Загрузка...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-16 text-center">
          <div className="text-6xl mb-4">
            {filter === 'unread' ? '✨' : '📭'}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {filter === 'unread' ? 'Все прочитано!' : 'Нет уведомлений'}
          </h3>
          <p className="text-gray-400">
            {filter === 'unread'
              ? 'У вас нет непрочитанных уведомлений'
              : 'Уведомления появятся здесь, когда произойдут важные события'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`group rounded-xl border transition-all ${
                !notification.read
                  ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(
                      notification.type
                    )} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Перейти →
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead({ variables: { id: notification.id } })}
                            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Прочитать
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification({ variables: { id: notification.id } })}
                          className="text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <NotificationsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
