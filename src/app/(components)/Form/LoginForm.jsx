'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { login, loading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login({ id, password });

    if (success) {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleLogin} className="loginForm">
      <div className="loginId">
        <label htmlFor="id" className="sr-only">
          아이디
        </label>
        <div>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="아이디"
            required
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
      </div>

      <div className="loginPassword">
        <label htmlFor="password" className="sr-only">
          비밀번호
        </label>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? <span className="loader" /> : '로그인'}
      </button>
    </form>
  );
};

export default LoginForm;
