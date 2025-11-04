'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import toast from 'react-hot-toast';

const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($input: SubmitContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`;

export default function CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
  });

  const [submitContactForm, { loading }] = useMutation(SUBMIT_CONTACT_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('Имя должно содержать минимум 2 символа');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Введите корректный email');
      return;
    }

    if (!formData.project.trim() || formData.project.trim().length < 10) {
      toast.error('Описание проекта должно содержать минимум 10 символов');
      return;
    }

    try {
      const { data } = await submitContactForm({
        variables: {
          input: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
            project: formData.project.trim(),
          },
        },
      });

      if (data?.submitContactForm?.success) {
        toast.success(data.submitContactForm.message);
        // Очищаем форму
        setFormData({
          name: '',
          email: '',
          phone: '',
          project: '',
        });
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error(error.message || 'Произошла ошибка при отправке заявки');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="cta" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8 lg:p-12 xl:p-16 backdrop-blur-sm">
          {/* Text Content */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Готовы начать свой проект?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Оставьте заявку, и мы свяжемся с вами в течение 24 часов для обсуждения деталей
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-xl mx-auto">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Ваше имя
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Иван Иванов"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="ivan@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Телефон <span className="text-gray-500">(необязательно)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">
                Расскажите о проекте
              </label>
              <textarea
                id="project"
                name="project"
                rows={4}
                value={formData.project}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Опишите, что вы хотите создать..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Privacy Note */}
            <p className="text-center text-xs sm:text-sm text-gray-500 px-4">
              Нажимая кнопку, вы соглашаетесь с{' '}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                политикой конфиденциальности
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
