'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCardStore } from '@/stores/useCardStore';
import Header from '@/app/(components)/Header/index';
import AdAside from '@/app/(components)/Aside/AdAside';

const DashboardLayout = ({ children }) => {
  const { authUser, checkingAuth, checkAuth } = useAuthStore();
  const { cards, getCards } = useCardStore();
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = [
    '/mypage',
    '/mypage/cardList',
    '/mypage/tradeList',
    '/trade/write',
    '/trade/update',
  ];

  useEffect(() => {
    if (!authUser && protectedRoutes.includes(pathname)) {
      router.replace('/');
    }
  }, [authUser, router]);

  useEffect(() => {
    checkAuth();
  }, [checkingAuth]);

  useEffect(() => {
    if (cards.length === 0) {
      getCards();
    }
  }, []);

  // 콜드 스타트 방지
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/trade').catch(() => {});
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="wrap">
      <Header />
      <main>{children}</main>
      <Toaster />
      <AdAside xPosition={'left'} />
      <AdAside xPosition={'right'} />
    </div>
  );
};

const DashboardWrapper = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardWrapper;
