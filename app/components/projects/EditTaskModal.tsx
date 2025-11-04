'use client';

import { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import toast from 'react-hot-toast';

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
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
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  developers: any[];
  onUpdate: () => void;
}

export function EditTaskModal({ isOpen, onClose, task, developers, onUpdate }: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assigneeId: '',
    timeSpent: '',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      };

      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || '',
        priority: task.priority || '',
        assigneeId: task.assignee?.id || '',
        timeSpent: task.timeSpent?.toString() || '0',
        dueDate: formatDate(task.dueDate),
      });
    }
  }, [task]);

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      toast.success('Задача успешно обновлена');
      onUpdate();
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка при обновлении задачи');
    },
  });

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      toast.success('Задача удалена');
      onUpdate();
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка при удалении задачи');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Введите название задачи');
      return;
    }

    await updateTask({
      variables: {
        id: task.id,
        input: {
          title: formData.title,
          description: formData.description || null,
          status: formData.status,
          priority: formData.priority,
          assigneeId: formData.assigneeId || null,
          timeSpent: formData.timeSpent ? parseFloat(formData.timeSpent) : 0,
          dueDate: formData.dueDate || null,
        },
      },
    });
  };

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      await deleteTask({ variables: { id: task.id } });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 max-w-2xl w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-bold text-white mb-2">Редактировать задачу</h2>
          <p className="text-gray-400">Обновите информацию о задаче</p>
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="TODO" className="bg-[#1a1f2e]">К выполнению</option>
                <option value="IN_PROGRESS" className="bg-[#1a1f2e]">В работе</option>
                <option value="REVIEW" className="bg-[#1a1f2e]">На проверке</option>
                <option value="DONE" className="bg-[#1a1f2e]">Выполнено</option>
                <option value="CANCELLED" className="bg-[#1a1f2e]">Отменено</option>
              </select>
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
                Затраченное время (часы)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.timeSpent}
                onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="0"
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
              onClick={handleDelete}
              disabled={updating || deleting}
              className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Удаление...' : 'Удалить'}
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
              disabled={updating || deleting}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={updating || deleting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
