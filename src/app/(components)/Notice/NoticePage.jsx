'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

const page = () => {
  const { authUser } = useAuthStore();
  console.log(authUser);

  return (
    <div id="notice">
      <ul className="noticeList">
        <li>
          <Link href={'/notice//1'} className="noticeItem">
            <h2>2월 14일(금) 웹사이트 운영 안내</h2>
            <span>2025.02.14</span>
          </Link>
        </li>
      </ul>

      {authUser?.id === 'admin' && (
        <div className="writeTradeBtnWrap">
          <Link href={'/notice'} className="writeTradeBtn">
            <Plus />
            <p>글쓰기</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default page;
