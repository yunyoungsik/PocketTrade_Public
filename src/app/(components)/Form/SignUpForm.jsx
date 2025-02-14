'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const SignUpForm = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pocketName, setPocketName] = useState('');
  const [pocketIdParts, setPocketIdParts] = useState(['', '', '', '']);
  const { signup, loading } = useAuthStore();
  const router = useRouter();

  // pocketId 합치기
  const pocketId = pocketIdParts.join('-');

  const handlePocketIdChange = (index, value) => {
    // 숫자만 입력 가능하도록 필터링
    const newValue = value.replace(/\D/g, '').slice(0, 4);

    // 새로운 pocketIdParts 배열 만들기
    const newPocketIdParts = [...pocketIdParts];
    newPocketIdParts[index] = newValue;
    setPocketIdParts(newPocketIdParts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    const success = await signup({ id, password, pocketName, pocketId });

    if (success) {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signupForm">
      {/* id */}
      <div className="inputBox">
        <label htmlFor="id">아이디</label>
        <div>
          <input
            type="text"
            id="id"
            name="id"
            required
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
      </div>

      {/* password */}
      <div className="inputBox">
        <label htmlFor="password">비밀번호</label>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            minLength={6}
            maxLength={16}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* confirmPassword */}
      <div className="inputBox">
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            minLength={6}
            maxLength={16}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {/* pocketName */}
      <div className="inputBox">
        <label htmlFor="pocketName">Pocket 닉네임</label>
        <div>
          <input
            type="text"
            id="pocketName"
            name="pocketName"
            required
            value={pocketName}
            onChange={(e) => setPocketName(e.target.value)}
          />
        </div>
      </div>

      {/* pocketId */}
      <div className="inputBox pocketId">
        <label htmlFor="pocketId">Pocket 아이디</label>
        <div>
          {pocketIdParts.map((part, index) => (
            <input
              key={index}
              type="text"
              minLength={4}
              maxLength={4}
              value={part}
              onChange={(e) => handlePocketIdChange(index, e.target.value)}
            />
          ))}
        </div>
      </div>

      {/* button */}
      <div>
        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-pink-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
          }`}
          disabled={loading}
        >
          {loading ? <span className="loader" /> : '회원가입'}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
