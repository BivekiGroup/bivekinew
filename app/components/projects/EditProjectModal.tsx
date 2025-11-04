'use client';

import { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import toast from 'react-hot-toast';

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      status
      startDate
      dueDate
      completedAt
    }
  }
`;

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onUpdate: () => void;
}

export function EditProjectModal({ isOpen, onClose, project, onUpdate }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    startDate: '',
    dueDate: '',
  });

  useEffect(() => {
    if (project) {
      const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || '',
        startDate: formatDate(project.startDate),
        dueDate: formatDate(project.dueDate),
      });
    }
  }, [project]);

  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      toast.success('Проект успешно обновлен');
      onUpdate();
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка при обновлении проекта');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Введите название проекта');
      return;
    }

    await updateProject({
      variables: {
        id: project.id,
        input: {
          name: formData.name,
          description: formData.description || null,
          status: formData.status,
          startDate: formData.startDate || null,
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
          <h2 className="text-3xl font-bold text-white mb-2">Редактировать проект</h2>
          <p className="text-gray-400">Обновите информацию о проекте</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 overflow-y-auto flex-1 space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название проекта *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Разработка веб-сайта"
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
                placeholder="Описание проекта..."
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
                <option value="PLANNING" className="bg-[#1a1f2e]">Планирование</option>
                <option value="IN_PROGRESS" className="bg-[#1a1f2e]">В работе</option>
                <option value="ON_HOLD" className="bg-[#1a1f2e]">Приостановлен</option>
                <option value="COMPLETED" className="bg-[#1a1f2e]">Завершен</option>
                <option value="CANCELLED" className="bg-[#1a1f2e]">Отменен</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Дата начала
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Срок сдачи
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
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
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
