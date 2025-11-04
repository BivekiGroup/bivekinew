'use client';

import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../providers/AuthProvider';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { AppLayout } from '../components/layout/AppLayout';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
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

const GET_CUSTOMERS = gql`
  query GetCustomers {
    users {
      id
      name
      email
      role
      clientType
      inn
      fullName
      companyName
    }
  }
`;

function ProjectsContent() {
  const { user, logout } = useAuth();
  const { data: projectsData, loading, refetch } = useQuery(GET_PROJECTS);
  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    skip: user?.role !== 'ADMIN', // Запрашиваем только для админа
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const projects = projectsData?.projects || [];
  const customers = customersData?.users?.filter((u: any) => u.role === 'CUSTOMER') || [];

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
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'Планирование';
      case 'IN_PROGRESS':
        return 'В работе';
      case 'ON_HOLD':
        return 'Приостановлен';
      case 'COMPLETED':
        return 'Завершен';
      case 'CANCELLED':
        return 'Отменен';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Проекты
            </h1>
            <p className="text-gray-400 text-lg">Управление проектами клиентов</p>
          </div>

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="group px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать проект
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
            <p className="mt-6 text-gray-400 text-lg">Загрузка проектов...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-4">
              <svg className="w-16 h-16 text-purple-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-white mb-2">Проектов пока нет</p>
            {user?.role === 'ADMIN' && (
              <p className="text-sm text-gray-400">Нажмите "Создать проект" чтобы добавить новый проект</p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-transparent p-6 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${getStatusColor(project.status)}`}>
                    {getStatusName(project.status)}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Project Name */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-1">
                  {project.name}
                </h3>

                {/* Description */}
                {project.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}

                {/* Customer */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Заказчик</p>
                    <p className="text-sm text-gray-300 font-medium truncate">{project.customer.name || project.customer.email}</p>
                  </div>
                </div>

                {/* Tasks Count */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Всего</p>
                      <p className="text-lg font-bold text-white">{project.tasksCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Готово</p>
                      <p className="text-lg font-bold text-white">{project.completedTasksCount}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                {project.dueDate && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs text-orange-400">Срок сдачи</p>
                      <p className="text-sm font-semibold text-orange-300">{new Date(project.dueDate).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        customers={customers}
        onCreate={() => {
          refetch();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'DEVELOPER']}>
      <AppLayout>
        <ProjectsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
