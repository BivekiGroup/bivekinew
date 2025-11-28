'use client';

import { gql, useQuery } from '@apollo/client';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../providers/AuthProvider';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';

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
            <StatsCard
              title="Пользователей"
              value={stats.totalUsers}
              subtitle={`${stats.activeUsers} активных`}
              icon={
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              gradientFrom="from-blue-500/10"
              gradientVia="via-blue-500/5"
              iconBg="bg-blue-500/20"
              iconColor="text-blue-400"
              subtitleColor="text-green-400"
              borderColor="blue-500/30"
              shadowColor="blue-500/10"
            />

            <StatsCard
              title="Проектов"
              value={stats.totalProjects}
              subtitle={`${stats.activeProjects} в работе`}
              icon={
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              gradientFrom="from-purple-500/10"
              gradientVia="via-purple-500/5"
              iconBg="bg-purple-500/20"
              iconColor="text-purple-400"
              subtitleColor="text-yellow-400"
              borderColor="purple-500/30"
              shadowColor="purple-500/10"
            />

            <StatsCard
              title="Задач"
              value={stats.totalTasks}
              subtitle={`${stats.completedTasks} выполнено`}
              icon={
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              gradientFrom="from-cyan-500/10"
              gradientVia="via-cyan-500/5"
              iconBg="bg-cyan-500/20"
              iconColor="text-cyan-400"
              subtitleColor="text-green-400"
              borderColor="cyan-500/30"
              shadowColor="cyan-500/10"
            />

            <StatsCard
              title="Завершено"
              value={stats.completedProjects}
              subtitle="проектов"
              icon={
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              gradientFrom="from-green-500/10"
              gradientVia="via-green-500/5"
              iconBg="bg-green-500/20"
              iconColor="text-green-400"
              subtitleColor="text-gray-400"
              borderColor="green-500/30"
              shadowColor="green-500/10"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></span>
              Быстрые действия
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {isAdmin && (
                <QuickActionCard
                  href="/users"
                  title="Пользователи"
                  description="Управление пользователями системы"
                  icon={
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                  iconBg="bg-blue-500/20"
                  iconColor="blue-400"
                  borderColor="blue-500/40"
                  shadowColor="blue-500/20"
                />
              )}

              <QuickActionCard
                href="/projects"
                title="Проекты"
                description="Управление проектами клиентов"
                icon={
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                iconBg="bg-purple-500/20"
                iconColor="purple-400"
                borderColor="purple-500/40"
                shadowColor="purple-500/20"
              />

              <QuickActionCard
                href={user?.role === 'CUSTOMER' ? '/my-projects/reports' : '/dashboard/reports'}
                title="Отчеты"
                description="Анализ выполненных задач"
                icon={
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                iconBg="bg-cyan-500/20"
                iconColor="cyan-400"
                borderColor="cyan-500/40"
                shadowColor="cyan-500/20"
              />
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
                <StatsCard
                  title="Проектов"
                  value={myProjects.length}
                  subtitle="активных"
                  icon={
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  gradientFrom="from-purple-500/10"
                  gradientVia="via-purple-500/5"
                  iconBg="bg-purple-500/20"
                  iconColor="text-purple-400"
                  subtitleColor="text-purple-400"
                  borderColor="purple-500/30"
                  shadowColor="purple-500/10"
                />

                <StatsCard
                  title="Всего задач"
                  value={myProjects.reduce((sum: number, p: any) => sum + (p.tasksCount || 0), 0)}
                  subtitle="по всем проектам"
                  icon={
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  }
                  gradientFrom="from-cyan-500/10"
                  gradientVia="via-cyan-500/5"
                  iconBg="bg-cyan-500/20"
                  iconColor="text-cyan-400"
                  subtitleColor="text-cyan-400"
                  borderColor="cyan-500/30"
                  shadowColor="cyan-500/10"
                />

                <StatsCard
                  title="Выполнено"
                  value={myProjects.reduce((sum: number, p: any) => sum + (p.completedTasksCount || 0), 0)}
                  subtitle="задач завершено"
                  icon={
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  gradientFrom="from-green-500/10"
                  gradientVia="via-green-500/5"
                  iconBg="bg-green-500/20"
                  iconColor="text-green-400"
                  subtitleColor="text-green-400"
                  borderColor="green-500/30"
                  shadowColor="green-500/10"
                />

                <StatsCard
                  title="Прогресс"
                  value={myProjects.length > 0 ? Math.round(myProjects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / myProjects.length) : 0}
                  subtitle="средний по проектам"
                  icon={
                    <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                  gradientFrom="from-orange-500/10"
                  gradientVia="via-orange-500/5"
                  iconBg="bg-orange-500/20"
                  iconColor="text-orange-400"
                  subtitleColor="text-orange-400"
                  borderColor="orange-500/30"
                  shadowColor="orange-500/10"
                />
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                  Быстрые действия
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <QuickActionCard
                    href="/my-projects"
                    title="Мои проекты"
                    description="Просмотр и управление вашими проектами"
                    icon={
                      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                    iconBg="bg-purple-500/20"
                    iconColor="purple-400"
                    borderColor="purple-500/40"
                    shadowColor="purple-500/20"
                  />

                  <QuickActionCard
                    href="/my-projects/reports"
                    title="Отчеты"
                    description="Просмотр и экспорт отчетов по задачам"
                    icon={
                      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                    iconBg="bg-cyan-500/20"
                    iconColor="cyan-400"
                    borderColor="cyan-500/40"
                    shadowColor="cyan-500/20"
                  />
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
                    <ProjectStatusCard
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      progress={project.progress}
                      status={project.status}
                      completedTasksCount={project.completedTasksCount || 0}
                      tasksCount={project.tasksCount || 0}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Activity Feed - показывается для всех ролей */}
      <div className="mt-8">
        <ActivityFeed limit={15} />
      </div>
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
