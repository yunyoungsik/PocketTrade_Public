'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownUp, MessageCircleMore } from 'lucide-react';
import { formatTimeAgo } from '@/utils/formatTimaAgo';

const Card = ({ postData }) => {
  const getStatusInKorean = (status) => {
    const statusMap = {
      trading: '교환중',
      reservation: '예약중',
      completed: '교환완료',
    };
    return statusMap[status] || '알 수 없음';
  };

  return (
    <div id="tradeCard">
      <div className={`tradeStatus ${postData?.status}`}>{getStatusInKorean(postData?.status)}</div>

      <Link href={`/trade/view/${postData?.tradeNum}`}>
        <div className="tradeCardImages">
          {postData?.haveCards?.slice(0, 3).map((item, index) => (
            <Image
              key={index}
              src={item.card.image || '/img/default.webp'}
              width={276}
              height={316}
              alt={item.card.name}
              className="stackedImage"
            />
          ))}
        </div>
      </Link>

      <div className="tradeText">
        <div className="title">
          <Link href={`/trade/view/${postData?.tradeNum}`}>
            <h2>{postData?.title}</h2>
            <span>
              <MessageCircleMore />
              {postData?.comments?.length}
            </span>
          </Link>
        </div>

        <div className="tradeCardName">
          <p>
            {postData?.haveCards?.length > 1
              ? `${postData?.haveCards[0].card.name} 외 ${postData?.haveCards.length - 1}개`
              : postData?.haveCards[0]?.card.name}
          </p>
          <span>
            <ArrowDownUp />
          </span>
          <p>
            {postData?.wantCards?.length > 1
              ? `${postData?.wantCards[0].card.name} 외 ${postData?.wantCards.length - 1}개`
              : postData?.wantCards[0]?.card.name}
          </p>
        </div>

        <div className="tradeInfo">
          <p className="authorName">
            {postData?.author?.pocketName || '닉네임'}
            <span>{`(${postData?.author?.pocketId || '0000-0000-0000'})`}</span>
          </p>
          <span className="writeTime">{formatTimeAgo(postData.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
