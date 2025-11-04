'use client';

import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { UserRole } from '../../providers/AuthProvider';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import { AppLayout } from '../../components/layout/AppLayout';

const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      customer {
        id
        name
        email
      }
      startDate
      dueDate
      completedAt
      createdAt
      tasksCount
      completedTasksCount
      progress
    }
  }
`;

const GET_TASKS = gql`
  query GetTasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      priority
      assignee {
        id
        name
        email
      }
      timeSpent
      dueDate
      completedAt
      createdAt
    }
  }
`;

function ProjectDetailContent() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  const { data: tasksData, loading: tasksLoading } = useQuery(GET_TASKS, {
    variables: { projectId },
  });

  const project = projectData?.project;
  const tasks = tasksData?.tasks || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'IN_PROGRESS':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ON_HOLD':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'TODO':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'REVIEW':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'DONE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      PLANNING: 'Планирование',
      IN_PROGRESS: 'В работе',
      ON_HOLD: 'Приостановлен',
      COMPLETED: 'Завершен',
      CANCELLED: 'Отменен',
      TODO: 'К выполнению',
      REVIEW: 'На проверке',
      DONE: 'Выполнено',
    };
    return statusMap[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'text-gray-400';
      case 'MEDIUM':
        return 'text-blue-400';
      case 'HIGH':
        return 'text-orange-400';
      case 'URGENT':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityName = (priority: string) => {
    const priorityMap: Record<string, string> = {
      LOW: 'Низкий',
      MEDIUM: 'Средний',
      HIGH: 'Высокий',
      URGENT: 'Срочный',
    };
    return priorityMap[priority] || priority;
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <p className="mt-6 text-gray-400 text-lg">Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-4">
            <svg className="w-16 h-16 text-purple-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-white">Проект не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-transparent p-8 mb-8 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">{project.name}</h1>
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(project.status)}`}>
                  {getStatusName(project.status)}
                </span>
              </div>
              {project.description && (
                <p className="text-gray-300 text-lg leading-relaxed">{project.description}</p>
              )}
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-cyan-500/20">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Всего задач</p>
                  <p className="text-2xl font-bold text-white">{project.tasksCount}</p>
                </div>
              </div>
            </div>

            <div className="group p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-white/10 hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-green-500/20">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Выполнено</p>
                  <p className="text-2xl font-bold text-white">{project.completedTasksCount}</p>
                </div>
              </div>
            </div>

            {project.dueDate && (
              <div className="group p-5 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-lg bg-orange-500/20">
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-orange-400">Срок сдачи</p>
                    <p className="text-base font-bold text-orange-300">{new Date(project.dueDate).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Общий прогресс</span>
              <span className="font-semibold text-purple-400">{project.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2 mb-6">
            <span className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full"></span>
            Задачи проекта
          </h2>
        </div>

        {tasksLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500/30 border-t-cyan-500"></div>
            <p className="mt-6 text-gray-400 text-lg">Загрузка задач...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 mb-4">
              <svg className="w-16 h-16 text-cyan-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-white mb-2">Задач пока нет</p>
            <p className="text-sm text-gray-400">Задачи появятся здесь после их создания</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {getStatusName(task.status)}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityName(task.priority)}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                  {task.assignee && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Исполнитель: {task.assignee.name || task.assignee.email}</span>
                    </div>
                  )}
                  {task.timeSpent > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Затрачено: {task.timeSpent} ч</span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Срок: {new Date(task.dueDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                  {task.completedAt && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10">
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-400">Завершено: {new Date(task.completedAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <AppLayout>
        <ProjectDetailContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
