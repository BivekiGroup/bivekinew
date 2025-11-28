'use client';

import { gql, useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

const GET_ACTIVITIES = gql`
  query GetActivities($limit: Int) {
    myActivities(limit: $limit) {
      id
      type
      description
      createdAt
      user {
        name
        email
      }
      project {
        id
        name
      }
      task {
        id
        title
      }
    }
  }
`;

interface ActivityFeedProps {
  limit?: number;
}

export function ActivityFeed({ limit = 10 }: ActivityFeedProps) {
  const { data, loading } = useQuery(GET_ACTIVITIES, {
    variables: { limit },
    pollInterval: 60000, // Обновляем каждую минуту
  });

  const activities = data?.myActivities || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_CREATED':
        return '📁';
      case 'PROJECT_UPDATED':
        return '📝';
      case 'PROJECT_STATUS_CHANGED':
        return '🔄';
      case 'TASK_CREATED':
        return '✨';
      case 'TASK_UPDATED':
        return '📋';
      case 'TASK_STATUS_CHANGED':
        return '✅';
      case 'TASK_ASSIGNED':
        return '👤';
      case 'FILE_UPLOADED':
        return '📎';
      case 'COMMENT_ADDED':
        return '💬';
      case 'USER_JOINED':
        return '👋';
      default:
        return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'PROJECT_CREATED':
      case 'TASK_CREATED':
        return 'from-green-500 to-emerald-500';
      case 'PROJECT_UPDATED':
      case 'TASK_UPDATED':
        return 'from-blue-500 to-cyan-500';
      case 'PROJECT_STATUS_CHANGED':
      case 'TASK_STATUS_CHANGED':
        return 'from-purple-500 to-pink-500';
      case 'TASK_ASSIGNED':
        return 'from-orange-500 to-red-500';
      case 'FILE_UPLOADED':
        return 'from-yellow-500 to-amber-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Последняя активность</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white/10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Последняя активность</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-400">Пока нет активности</p>
          <p className="text-sm text-gray-500 mt-2">Активность появится после создания проектов и задач</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Последняя активность</h2>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Обновляется автоматически</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {activities.map((activity: any) => (
          <div
            key={activity.id}
            className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${getActivityColor(activity.type)} flex items-center justify-center text-xl shadow-lg`}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm mb-1 line-clamp-2">{activity.description}</p>

              {/* Links */}
              <div className="flex items-center gap-2 flex-wrap">
                {activity.project && (
                  <Link
                    href={`/my-projects/${activity.project.id}`}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📁 {activity.project.name}
                  </Link>
                )}
                {activity.task && (
                  <span className="text-xs text-purple-400">
                    📋 {activity.task.title}
                  </span>
                )}
              </div>

              {/* Time */}
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                  locale: ru,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
