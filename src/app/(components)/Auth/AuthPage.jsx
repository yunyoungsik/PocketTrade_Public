'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/app/(components)/Form/LoginForm';
import SignUpForm from '@/app/(components)/Form/SignUpForm';
import { useAuthStore } from '@/stores/useAuthStore';

const page = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loading, authUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      router.push('/');
    }
  }, [authUser])

  if(loading) return null

  return (
    <div id="auth">
      <div className="authTitle">
        <h2>PocketTrade</h2>
      </div>

      <div>
        {isLogin ? <LoginForm /> : <SignUpForm />}

        <div className="formBtn">
          <p>{isLogin ? '처음이신가요?' : '이미 계정이 있나요?'}</p>

          <button onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}>
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
