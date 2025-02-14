'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Form from '@/app/(components)/Form';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTradeStore } from '@/stores/useTradeStore';
import toast from 'react-hot-toast';

const page = () => {
  const params = useParams();
  const tradeNum = params.tradeNum;
  const router = useRouter();
  const { authUser } = useAuthStore();
  const { loading, post, findPost, updatePost } = useTradeStore();
  const [localTrade, setLocalTrade] = useState({
    tradeNum,
    title: '',
    desc: '',
    haveCards: [],
    wantCards: [],
  });

  useEffect(() => {
    if (tradeNum) {
      findPost(tradeNum);
    }
  }, [tradeNum]);

  useEffect(() => {
    if (post) {
      setLocalTrade({
        tradeNum,
        title: post.title || '',
        desc: post.description || '',
        haveCards:
          post.haveCards?.map((item) => ({
            card: item.card._id,
            quantity: item.quantity,
          })) || [],
        wantCards:
          post.wantCards?.map((item) => ({
            card: item.card._id,
            quantity: item.quantity,
          })) || [],
      });
    }
  }, [post]);

  const handleUpdate = async (e) => {
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
      await updatePost(localTrade);
      toast.success('트레이드 수정 완료');
      router.push(`/trade/view/${tradeNum}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="tradeWrite">
      <Form
        type="수정"
        authUser={authUser}
        localTrade={localTrade}
        setLocalTrade={setLocalTrade}
        submitting={loading}
        handleSubmit={handleUpdate}
      />
    </div>
  );
};

export default page;
