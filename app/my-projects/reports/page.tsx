'use client';

import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import toast from 'react-hot-toast';

const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      name
    }
  }
`;

const GET_TASKS_REPORT = gql`
  query GetTasksReport($startDate: String!, $endDate: String!, $projectId: ID) {
    tasksReport(startDate: $startDate, endDate: $endDate, projectId: $projectId) {
      task {
        id
        title
        description
        status
        priority
        timeSpent
        createdAt
        completedAt
        assignee {
          name
          email
        }
      }
      projectName
    }
  }
`;

const EXPORT_REPORT = gql`
  mutation ExportReport($startDate: String!, $endDate: String!, $projectId: ID) {
    exportReport(startDate: $startDate, endDate: $endDate, projectId: $projectId) {
      success
      url
      fileName
      totalReports
      totalHours
    }
  }
`;

function ReportsContent() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [filters, setFilters] = useState({
    startDate: firstDayOfMonth.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
    projectId: '',
  });

  const { data: projectsData } = useQuery(GET_MY_PROJECTS);
  const { data: reportData, loading } = useQuery(GET_TASKS_REPORT, {
    variables: {
      startDate: filters.startDate,
      endDate: filters.endDate,
      projectId: filters.projectId || undefined,
    },
  });

  const [exportReport, { loading: exporting }] = useMutation(EXPORT_REPORT);

  const projects = projectsData?.myProjects || [];
  const taskReports = reportData?.tasksReport || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'IN_PROGRESS':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'REVIEW':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'DONE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      TODO: 'К выполнению',
      IN_PROGRESS: 'В работе',
      REVIEW: 'На проверке',
      DONE: 'Выполнено',
      CANCELLED: 'Отменено',
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

  // Статистика
  const totalTasks = taskReports.length;
  const completedTasks = taskReports.filter((r: any) => r.task.status === 'DONE').length;
  const totalTimeSpent = taskReports.reduce((sum: number, r: any) => sum + (r.task.timeSpent || 0), 0);

  const handleExport = async () => {
    try {
      const { data } = await exportReport({
        variables: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          projectId: filters.projectId || undefined,
        },
      });

      if (data?.exportReport?.success) {
        // Open file in new tab
        window.open(data.exportReport.url, '_blank');

        toast.success(
          `Отчет успешно создан! Всего отчетов: ${data.exportReport.totalReports}, часов: ${data.exportReport.totalHours}`
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при экспорте отчета');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:pt-20">
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            Отчеты по задачам
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Анализ выполненных задач за выбранный период</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || taskReports.length === 0}
          className="group px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {exporting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Экспорт...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Экспорт в Excel
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-cyan-500/5 to-transparent p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Фильтры
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Начало периода
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Конец периода
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Проект
            </label>
            <select
              value={filters.projectId}
              onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="" className="bg-[#1a1f2e]">Все проекты</option>
              {projects.map((project: any) => (
                <option key={project.id} value={project.id} className="bg-[#1a1f2e]">
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Всего задач</p>
              <p className="text-3xl font-bold text-white">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-6 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Выполнено</p>
              <p className="text-3xl font-bold text-white">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Часов затрачено</p>
              <p className="text-3xl font-bold text-white">{totalTimeSpent.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <h2 className="text-xl font-bold text-white mb-6">Задачи за период</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Загрузка отчета...</p>
          </div>
        ) : taskReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-lg">Задач за выбранный период не найдено</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {taskReports.map((report: any) => (
              <div
                key={report.task.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-medium text-white truncate">{report.task.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${getStatusColor(report.task.status)}`}>
                        {getStatusName(report.task.status)}
                      </span>
                      <span className={`text-xs font-medium whitespace-nowrap ${getPriorityColor(report.task.priority)}`}>
                        {getPriorityName(report.task.priority)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span>{report.projectName}</span>
                      </div>
                      {report.task.assignee && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{report.task.assignee.name || report.task.assignee.email}</span>
                        </div>
                      )}
                      {report.task.timeSpent > 0 && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{report.task.timeSpent} ч</span>
                        </div>
                      )}
                      {report.task.createdAt && !isNaN(new Date(report.task.createdAt).getTime()) && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(report.task.createdAt).toLocaleDateString('ru-RU')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <AppLayout>
        <ReportsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
