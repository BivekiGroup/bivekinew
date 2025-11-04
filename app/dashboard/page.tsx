'use client';

import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../providers/AuthProvider';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { AppLayout } from '../components/layout/AppLayout';

const GET_STATS = gql`
  query GetStats {
    users {
      id
      role
      isActive
    }
    projects {
      id
      status
      tasksCount
      completedTasksCount
    }
  }
`;

const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      name
      status
      progress
    }
  }
`;

function DashboardContent() {
  const { user, isAdmin, isDeveloper } = useAuth();
  const { data: statsData } = useQuery(GET_STATS, {
    skip: user?.role === 'CUSTOMER',
  });
  const { data: myProjectsData } = useQuery(GET_MY_PROJECTS, {
    skip: user?.role !== 'CUSTOMER',
  });

  const users = statsData?.users || [];
  const projects = statsData?.projects || [];
  const myProjects = myProjectsData?.myProjects || [];

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u: any) => u.isActive).length,
    customers: users.filter((u: any) => u.role === 'CUSTOMER').length,
    developers: users.filter((u: any) => u.role === 'DEVELOPER').length,
    totalProjects: projects.length,
    activeProjects: projects.filter((p: any) => p.status === 'IN_PROGRESS').length,
    completedProjects: projects.filter((p: any) => p.status === 'COMPLETED').length,
    totalTasks: projects.reduce((sum: number, p: any) => sum + (p.tasksCount || 0), 0),
    completedTasks: projects.reduce((sum: number, p: any) => sum + (p.completedTasksCount || 0), 0),
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Администратор';
      case 'DEVELOPER':
        return 'Разработчик';
      case 'CUSTOMER':
        return 'Заказчик';
      default:
        return 'Пользователь';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:pt-4 lg:mt-16">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
          Добро пожаловать, {user?.name || 'пользователь'}!
        </h1>
        <p className="text-gray-400 text-base sm:text-lg flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          {getRoleName()}
        </p>
      </div>

      {/* Admin/Developer Stats */}
      {(isAdmin || isDeveloper) && (
        <>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-10">
            {/* Users Stats */}
            <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Пользователей</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  {stats.activeUsers} активных
                </span>
              </div>
            </div>

            {/* Projects Stats */}
            <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Проектов</p>
                  <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-sm text-yellow-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  {stats.activeProjects} в работе
                </span>
              </div>
            </div>

            {/* Tasks Stats */}
            <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-300">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Задач</p>
                  <p className="text-3xl font-bold text-white">{stats.totalTasks}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  {stats.completedTasks} выполнено
                </span>
              </div>
            </div>

            {/* Completed Projects */}
            <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-6 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Завершено</p>
                  <p className="text-3xl font-bold text-white">{stats.completedProjects}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  проектов
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></span>
              Быстрые действия
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {isAdmin && (
                <Link
                  href="/users"
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-blue-500/5 to-transparent p-6 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Пользователи</h3>
                      <p className="text-sm text-gray-400">Управление пользователями системы</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )}

              <Link
                href="/projects"
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-transparent p-6 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">Проекты</h3>
                    <p className="text-sm text-gray-400">Управление проектами клиентов</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link
                href={user?.role === 'CUSTOMER' ? '/my-projects/reports' : '/dashboard/reports'}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-cyan-500/5 to-transparent p-6 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">Отчеты</h3>
                    <p className="text-sm text-gray-400">Анализ выполненных задач</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Customer View */}
      {user?.role === 'CUSTOMER' && (
        <>
          {myProjects.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <div className="text-center py-16 px-4">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-4">
                  <svg className="w-16 h-16 text-purple-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-white mb-2">У вас пока нет проектов</p>
                <p className="text-sm text-gray-400">Обратитесь к администратору для создания проекта</p>
              </div>
            </div>
          ) : (
            <>
              {/* Customer Statistics */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-10">
                {/* Total Projects */}
                <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Проектов</p>
                      <p className="text-3xl font-bold text-white">{myProjects.length}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-sm text-purple-400 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      активных
                    </span>
                  </div>
                </div>

                {/* Total Tasks */}
                <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Всего задач</p>
                      <p className="text-3xl font-bold text-white">
                        {myProjects.reduce((sum: number, p: any) => sum + (p.tasksCount || 0), 0)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-sm text-cyan-400 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      по всем проектам
                    </span>
                  </div>
                </div>

                {/* Completed Tasks */}
                <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-6 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Выполнено</p>
                      <p className="text-3xl font-bold text-white">
                        {myProjects.reduce((sum: number, p: any) => sum + (p.completedTasksCount || 0), 0)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-sm text-green-400 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      задач завершено
                    </span>
                  </div>
                </div>

                {/* Average Progress */}
                <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent p-6 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Прогресс</p>
                      <p className="text-3xl font-bold text-white">
                        {myProjects.length > 0
                          ? Math.round(myProjects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / myProjects.length)
                          : 0}%
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-sm text-orange-400 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      средний по проектам
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                  Быстрые действия
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Link
                    href="/my-projects"
                    className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-transparent p-6 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300">
                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">Мои проекты</h3>
                        <p className="text-sm text-gray-400">Просмотр и управление вашими проектами</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    href="/my-projects/reports"
                    className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-cyan-500/5 to-transparent p-6 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all duration-300">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">Отчеты</h3>
                        <p className="text-sm text-gray-400">Просмотр и экспорт отчетов по задачам</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Activity / Project Status Overview */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></span>
                  Статус проектов
                </h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {myProjects.map((project: any) => (
                    <Link
                      key={project.id}
                      href={`/my-projects/${project.id}`}
                      className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors flex-1 pr-2">
                          {project.name}
                        </h3>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Прогресс</span>
                          <span className="font-semibold text-green-400">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-3 border-t border-white/10">
                        <span className="text-gray-400">
                          {project.completedTasksCount || 0} / {project.tasksCount || 0} задач
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          project.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' :
                          project.status === 'ON_HOLD' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {project.status === 'COMPLETED' ? 'Завершен' :
                           project.status === 'IN_PROGRESS' ? 'В работе' :
                           project.status === 'ON_HOLD' ? 'На паузе' :
                           project.status === 'PLANNING' ? 'Планирование' :
                           'Отменен'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
