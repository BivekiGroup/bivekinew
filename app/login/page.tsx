'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

const REQUEST_AUTH_CODE = gql`
  mutation RequestAuthCode($email: String!) {
    requestAuthCode(email: $email) {
      success
      message
      expiresAt
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $code: String!) {
    login(email: $email, code: $code) {
      success
      message
      token
      user {
        id
        email
        role
        name
        createdAt
        updatedAt
        isActive
      }
    }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [countdown, setCountdown] = useState(0);

  const { login: authLogin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [requestAuthCode, { loading: requestLoading }] = useMutation(REQUEST_AUTH_CODE);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Обратный отсчет для кода
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация email
    if (!email.trim()) {
      toast.error('Введите email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Введите корректный email');
      return;
    }

    try {
      const { data } = await requestAuthCode({ variables: { email } });

      if (data.requestAuthCode.success) {
        toast.success(data.requestAuthCode.message);
        setStep('code');
        setCountdown(600); // 10 минут
      } else {
        toast.error(data.requestAuthCode.message);
      }
    } catch (err) {
      toast.error('Ошибка отправки кода. Попробуйте позже.');
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация кода
    if (!code.trim()) {
      toast.error('Введите код');
      return;
    }
    if (code.length !== 6) {
      toast.error('Код должен состоять из 6 цифр');
      return;
    }

    try {
      const { data } = await loginMutation({ variables: { email, code } });

      if (data.login.success && data.login.token) {
        toast.success('Успешный вход!');
        authLogin(data.login.token, data.login.user);
        router.push('/dashboard');
      } else {
        toast.error(data.login.message);
      }
    } catch (err) {
      toast.error('Ошибка входа. Проверьте код и попробуйте снова.');
      console.error(err);
    }
  };

  const handleResendCode = async () => {
    setCode('');

    try {
      const { data } = await requestAuthCode({ variables: { email } });

      if (data.requestAuthCode.success) {
        toast.success('Новый код отправлен на email');
        setCountdown(600);
      } else {
        toast.error(data.requestAuthCode.message);
      }
    } catch (err) {
      toast.error('Ошибка отправки кода');
      console.error(err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Biveki"
              width={48}
              height={48}
              className="h-12 w-12 transition-transform group-hover:scale-110"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Biveki
            </span>
          </Link>
          <p className="mt-3 text-gray-400">Вход в систему</p>
        </div>

        {/* Login card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm">
          {step === 'email' ? (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Авторизация</h2>
                <p className="text-sm text-gray-400">
                  Введите ваш email для получения кода
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="your@email.com"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={requestLoading}
                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {requestLoading ? 'Отправка...' : 'Получить код'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Вернуться на главную
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setCountdown(0);
                  }}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors mb-4 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Изменить email
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">Введите код</h2>
                <p className="text-sm text-gray-400">
                  Код отправлен на <span className="text-blue-400">{email}</span>
                </p>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                  6-значный код
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl font-mono tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {countdown > 0 && (
                <div className="text-center text-sm text-gray-400">
                  Код действителен еще <span className="text-blue-400 font-mono">{formatTime(countdown)}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loginLoading ? 'Вход...' : 'Войти'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={requestLoading || countdown > 540}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отправить код повторно
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Нет доступа? Обратитесь к администратору</p>
        </div>
      </div>
    </div>
  );
}
