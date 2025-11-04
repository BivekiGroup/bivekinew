'use client';

import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import toast from 'react-hot-toast';

const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
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
      createdAt
    }
  }
`;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: any[];
  onCreate: () => void;
}

export function CreateProjectModal({ isOpen, onClose, customers, onCreate }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    customerId: '',
    startDate: '',
    dueDate: '',
  });

  const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
    onCompleted: () => {
      toast.success('Проект успешно создан');
      onCreate();
      setFormData({
        name: '',
        description: '',
        customerId: '',
        startDate: '',
        dueDate: '',
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка при создании проекта');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Введите название проекта');
      return;
    }

    if (!formData.customerId) {
      toast.error('Выберите заказчика');
      return;
    }

    await createProject({
      variables: {
        input: {
          name: formData.name,
          description: formData.description || null,
          customerId: formData.customerId,
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
          <h2 className="text-3xl font-bold text-white mb-2">Создать проект</h2>
          <p className="text-gray-400">Создайте новый проект для клиента</p>
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

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заказчик *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="" className="bg-[#1a1f2e]">Выберите заказчика</option>
                {customers.map((customer) => {
                  const getCustomerLabel = () => {
                    const parts = [];

                    // Название компании или имя
                    if (customer.companyName) {
                      parts.push(customer.companyName);
                    } else if (customer.fullName) {
                      parts.push(customer.fullName);
                    } else if (customer.name) {
                      parts.push(customer.name);
                    } else {
                      parts.push(customer.email);
                    }

                    // Тип клиента
                    if (customer.clientType) {
                      const typeMap: Record<string, string> = {
                        'INDIVIDUAL': 'Физ. лицо',
                        'LEGAL_ENTITY': 'ООО',
                        'ENTREPRENEUR': 'ИП',
                      };
                      parts.push(`(${typeMap[customer.clientType]})`);
                    }

                    // ИНН если есть
                    if (customer.inn) {
                      parts.push(`ИНН: ${customer.inn}`);
                    }

                    return parts.join(' ');
                  };

                  return (
                    <option key={customer.id} value={customer.id} className="bg-[#1a1f2e]">
                      {getCustomerLabel()}
                    </option>
                  );
                })}
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
              {loading ? 'Создание...' : 'Создать проект'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
