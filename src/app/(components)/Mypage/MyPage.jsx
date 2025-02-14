'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import ChangeForm from '@/app/(components)/Form/ChangeForm';
import DeleteIdBtn from '@/app/(components)/Mypage/DeleteIdBtn';

const page = () => {
  const { authUser } = useAuthStore();

  return (
    <div id="mypage">
      <div className="mypageTopCard mypageCard">
        <div className="topCardTitle">
          <p>{authUser?.pocketName || '닉네임'}</p>
          <span>{`(${authUser?.pocketId || '0000-0000-0000-'})`}</span>
        </div>

        <div className="topCardBtn">
          <Link href={'/mypage/tradeList'}>
            <span>트레이드 내역</span>
          </Link>
          <Link href={'/mypage/cardList'}>
            <span>보유카드</span>
          </Link>
        </div>
      </div>

      <div className="mypageChange mypageCard">
        <h3>계정/정보관리</h3>
        <ChangeForm />
      </div>

      <div className="mypageCard">
        <h3>기타</h3>
        <DeleteIdBtn />
      </div>
    </div>
  );
};

export default page;
