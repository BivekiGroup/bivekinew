'use client';

import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import toast from 'react-hot-toast';

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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
      workDate
      dueDate
      createdAt
    }
  }
`;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  developers: any[];
  onCreate: () => void;
}

export function CreateTaskModal({ isOpen, onClose, projectId, developers, onCreate }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeId: '',
    timeSpent: '',
    timeUnit: 'hours', // 'hours' или 'minutes'
    workDate: new Date().toISOString().split('T')[0], // По умолчанию сегодня
    dueDate: '',
  });

  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      toast.success('Задача успешно создана');
      onCreate();
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        assigneeId: '',
        timeSpent: '',
        timeUnit: 'hours',
        workDate: new Date().toISOString().split('T')[0],
        dueDate: '',
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка при создании задачи');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Введите название задачи');
      return;
    }

    // Конвертируем время в часы, если указаны минуты
    let timeInHours = 0;
    if (formData.timeSpent) {
      const timeValue = parseFloat(formData.timeSpent);
      timeInHours = formData.timeUnit === 'minutes' ? timeValue / 60 : timeValue;
    }

    await createTask({
      variables: {
        input: {
          title: formData.title,
          description: formData.description || null,
          projectId,
          priority: formData.priority,
          assigneeId: formData.assigneeId || null,
          timeSpent: timeInHours,
          workDate: formData.workDate || null,
          dueDate: formData.dueDate || null,
        },
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 max-w-2xl w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-bold text-white mb-2">Создать задачу</h2>
          <p className="text-gray-400">Добавьте новую задачу в проект</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 overflow-y-auto flex-1 space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название задачи *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Разработать главную страницу"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Описание задачи..."
                rows={4}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Приоритет
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="LOW" className="bg-[#1a1f2e]">Низкий</option>
                <option value="MEDIUM" className="bg-[#1a1f2e]">Средний</option>
                <option value="HIGH" className="bg-[#1a1f2e]">Высокий</option>
                <option value="URGENT" className="bg-[#1a1f2e]">Срочный</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Исполнитель
              </label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="" className="bg-[#1a1f2e]">Не назначен</option>
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id} className="bg-[#1a1f2e]">
                    {dev.name || dev.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Spent */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Затраченное время
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.timeSpent}
                  onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="0"
                />
                <select
                  value={formData.timeUnit}
                  onChange={(e) => setFormData({ ...formData, timeUnit: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="hours" className="bg-[#1a1f2e]">Часы</option>
                  <option value="minutes" className="bg-[#1a1f2e]">Минуты</option>
                </select>
              </div>
            </div>

            {/* Work Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Дата выполнения работы
              </label>
              <input
                type="date"
                value={formData.workDate}
                onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Срок выполнения
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-8 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
