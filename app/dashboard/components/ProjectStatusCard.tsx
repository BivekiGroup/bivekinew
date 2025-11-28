import Link from 'next/link';

interface ProjectStatusCardProps {
  id: string;
  name: string;
  progress: number;
  status: string;
  completedTasksCount: number;
  tasksCount: number;
}

export function ProjectStatusCard({
  id,
  name,
  progress,
  status,
  completedTasksCount,
  tasksCount,
}: ProjectStatusCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400';
      case 'IN_PROGRESS':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'ON_HOLD':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Завершен';
      case 'IN_PROGRESS':
        return 'В работе';
      case 'ON_HOLD':
        return 'На паузе';
      case 'PLANNING':
        return 'Планирование';
      default:
        return 'Отменен';
    }
  };

  return (
    <Link
      href={`/my-projects/${id}`}
      className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors flex-1 pr-2">
          {name}
        </h3>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Прогресс</span>
          <span className="font-semibold text-green-400">{progress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm pt-3 border-t border-white/10">
        <span className="text-gray-400">
          {completedTasksCount || 0} / {tasksCount || 0} задач
        </span>
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusStyle(status)}`}>
          {getStatusText(status)}
        </span>
      </div>
    </Link>
  );
}
