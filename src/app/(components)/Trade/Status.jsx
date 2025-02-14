import { useTradeStore } from '@/stores/useTradeStore';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const Status = ({ tradeNum, postStatus, localStatus, setLocalStatus }) => {
  const { loading, updatePost } = useTradeStore();
  const prevStatusRef = useRef(localStatus); // 이전 상태 저장

  useEffect(() => {
    // 이전 상태와 현재 상태가 다를 때만 실행
    if (tradeNum && prevStatusRef.current !== localStatus) {
      updatePost({ tradeNum, status: localStatus });
      prevStatusRef.current = localStatus;
      toast.success('변경 완료')
    }
  }, [localStatus, tradeNum, updatePost]);

  if(loading) null

  return (
    <select
      value={localStatus}
      onChange={(e) => setLocalStatus(e.target.value)}
    >
      <option value="trading">교환중</option>
      <option value="reservation">예약중</option>
      <option value="completed">교환완료</option>
    </select>
  );
};

export default Status;
