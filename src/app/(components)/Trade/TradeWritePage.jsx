'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTradeStore } from '@/stores/useTradeStore';
import Form from '@/app/(components)/Form';
import toast from 'react-hot-toast';

const page = () => {
  const router = useRouter();
  const { authUser } = useAuthStore();
  const { loading, writePost } = useTradeStore();
  const [localTrade, setLocalTrade] = useState({
    title: '',
    desc: '',
    haveCards: [],
    wantCards: [],
  });

  const handleWriteTrade = async (e) => {
    e.preventDefault();

    if (localTrade.haveCards.length === 0 || localTrade.wantCards.length === 0) {
      toast.error('보유 카드와 원하는 카드를 추가해주세요.');
      return;
    }

    if (!localTrade.title.trim() || !localTrade.desc.trim()) {
      toast.error('제목과 설명을 입력해주세요.');
      return;
    }

    try {
      const success = await writePost(localTrade);
      if (success) {
        toast.success('트레이드 등록 완료');
        router.push('/trade');
      }
    } catch (error) {
      console.log(error);
    } 
  };

  return (
    <div id="tradeWrite">
      <Form
        type="등록"
        authUser={authUser}
        localTrade={localTrade}
        setLocalTrade={setLocalTrade}
        submitting={loading}
        handleSubmit={handleWriteTrade}
      />
    </div>
  );
};

export default page;
