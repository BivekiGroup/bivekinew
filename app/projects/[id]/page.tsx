'use client';

import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../providers/AuthProvider';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreateTaskModal } from '../../components/projects/CreateTaskModal';
import { EditProjectModal } from '../../components/projects/EditProjectModal';
import { EditTaskModal } from '../../components/projects/EditTaskModal';
import { AppLayout } from '../../components/layout/AppLayout';
import toast from 'react-hot-toast';

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

const GET_DEVELOPERS = gql`
  query GetDevelopers {
    users {
      id
      name
      email
      role
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

function ProjectDetailContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: projectData, loading: projectLoading, refetch: refetchProject } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  const { data: tasksData, loading: tasksLoading, refetch: refetchTasks } = useQuery(GET_TASKS, {
    variables: { projectId },
  });

  const { data: developersData } = useQuery(GET_DEVELOPERS, {
    skip: user?.role !== 'ADMIN', // Запрашиваем только для админа
  });

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      toast.success('Проект удален');
      router.push('/projects');
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка при удалении проекта');
    },
  });

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const project = projectData?.project;
  const tasks = tasksData?.tasks || [];
  const developers = developersData?.users?.filter((u: any) => u.role === 'DEVELOPER' || u.role === 'ADMIN') || [];

  const handleDeleteProject = async () => {
    if (confirm('Вы уверены, что хотите удалить этот проект? Все задачи будут также удалены.')) {
      await deleteProject({ variables: { id: projectId } });
    }
  };

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

            {user?.role === 'ADMIN' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditProjectModal(true)}
                  className="group px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Редактировать
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Удалить
                </button>
              </div>
            )}
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="group p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Заказчик</p>
                  <p className="text-base font-bold text-white truncate">{project.customer.name || project.customer.email}</p>
                </div>
              </div>
            </div>

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

        </div>

        {/* Tasks Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full"></span>
            Задачи
          </h2>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="group px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать задачу
            </button>
          )}
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
            {user?.role === 'ADMIN' && (
              <p className="text-sm text-gray-400">Нажмите "Создать задачу" чтобы добавить первую задачу</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                onClick={() => {
                  if (user?.role === 'ADMIN') {
                    setSelectedTask(task);
                    setShowEditTaskModal(true);
                  }
                }}
                className={`rounded-xl border border-white/10 bg-white/5 p-4 ${
                  user?.role === 'ADMIN' ? 'cursor-pointer hover:bg-white/10 hover:border-blue-500/30' : ''
                } transition-all`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-medium text-white truncate">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${getStatusColor(task.status)}`}>
                        {getStatusName(task.status)}
                      </span>
                      <span className={`text-xs font-medium whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                        {getPriorityName(task.priority)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{task.assignee.name || task.assignee.email}</span>
                        </div>
                      )}
                      {task.timeSpent > 0 && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{task.timeSpent} ч</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(task.dueDate).toLocaleDateString('ru-RU')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        projectId={projectId}
        developers={developers}
        onCreate={() => {
          refetchTasks();
          refetchProject();
          setShowCreateTaskModal(false);
        }}
      />

      <EditProjectModal
        isOpen={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
        project={project}
        onUpdate={() => {
          refetchProject();
          setShowEditProjectModal(false);
        }}
      />

      {selectedTask && (
        <EditTaskModal
          isOpen={showEditTaskModal}
          onClose={() => {
            setShowEditTaskModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          developers={developers}
          onUpdate={() => {
            refetchTasks();
            refetchProject();
            setShowEditTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProjectDetailContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
