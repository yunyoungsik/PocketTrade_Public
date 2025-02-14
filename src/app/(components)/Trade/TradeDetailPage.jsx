'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftRight, ChevronDown, ImageIcon, LetterText, X } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTradeStore } from '@/stores/useTradeStore';
import { formatTimeAgo } from '@/utils/formatTimaAgo';
import Status from '@/app/(components)/Trade/Status';
import CommentList from '@/app/(components)/Trade/CommentList';

const page = () => {
  const params = useParams();
  const tradeNum = params.tradeNum;
  const router = useRouter();
  const { authUser } = useAuthStore();
  const { loading, post, findPost, deletePost } = useTradeStore();
  const [isHaveTextView, setIsHaveTextView] = useState(false);
  const [isWantTextView, setIsWantTextView] = useState(false);
  const [localStatus, setLocalStatus] = useState(post?.status || 'trading');

  useEffect(() => {
    findPost(tradeNum);
  }, [tradeNum]);

  const gradeChange = (grade) => {
    switch (grade) {
      case 'diamond':
        return '◆';
      case 'star':
        return '★';
      case 'crown':
        return '♕';
      case 'promo':
        return '프로모';
      default:
        return '';
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      await deletePost(post?._id);
      router.push('/trade');
    }
  };

  if (loading)
    return (
      <div className="loader-wrap">
        <span className="loader" />
      </div>
    );

  return (
    <div id="tradeDetail">
      <div className="tradeStatus">
        {post?.author?._id === authUser?._id && (
          <>
            <Status
              tradeNum={tradeNum}
              postStatus={post?.status}
              localStatus={localStatus}
              setLocalStatus={setLocalStatus}
            />
            <ChevronDown />
          </>
        )}
      </div>

      <div className="detailTitle">
        <h2>{post?.title}</h2>
        <ul>
          <li className="titleAuthor">
            <p>{post?.author?.pocketName || '닉네임'}</p>
            <span>{`(${post?.author?.pocketId || '0000-0000-0000'})`}</span>
          </li>
          <li>·</li>
          <li>
            <span>{formatTimeAgo(post?.createdAt)}</span>
          </li>
        </ul>
      </div>

      <div className="tradeCards">
        <div>
          <div className="tradeCardsTitle">
            <h3>보유카드</h3>
            <button
              type="button"
              className="cardViewBtn"
              onClick={() => setIsHaveTextView(!isHaveTextView)}
            >
              {isHaveTextView ? (
                <>
                  <LetterText />
                  <ArrowLeftRight />
                  <ImageIcon />
                </>
              ) : (
                <>
                  <ImageIcon />
                  <ArrowLeftRight />
                  <LetterText />
                </>
              )}
            </button>
          </div>
          {isHaveTextView ? (
            <ul className="textView">
              {post?.haveCards?.map((item, index) => (
                <li key={index}>
                  <p>{gradeChange(item.card.rarity.grade).repeat(item.card.rarity.value)}</p>
                  <p>{item.card.name}</p> <X /> <p>{item.quantity}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="imgView">
              {post?.haveCards?.map((item, index) => (
                <li key={index}>
                  <Image
                    src={item.card.image || '/img/default.webp'}
                    width={276}
                    height={316}
                    alt={item.card.name}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="tradeCardsTitle">
            <h3>원하는카드</h3>
            <button
              type="button"
              className="cardViewBtn"
              onClick={() => setIsWantTextView(!isWantTextView)}
            >
              {isWantTextView ? (
                <>
                  <LetterText />
                  <ArrowLeftRight />
                  <ImageIcon />
                </>
              ) : (
                <>
                  <ImageIcon />
                  <ArrowLeftRight />
                  <LetterText />
                </>
              )}
            </button>
          </div>
          {isWantTextView ? (
            <ul className="textView">
              {post?.wantCards?.map((item, index) => (
                <li key={index}>
                  <p>{gradeChange(item.card.rarity.grade).repeat(item.card.rarity.value)}</p>
                  <p>{item.card.name}</p> <X /> <p>{item.quantity}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="imgView">
              {post?.wantCards?.map((item, index) => (
                <li key={index}>
                  <Image
                    src={item.card.image || '/img/default.webp'}
                    width={276}
                    height={316}
                    alt={item.card.name}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="tradeDescription">
        <p>{post?.description}</p>

        <ul>
          <li>조회수 {post?.views}</li>

          <li>
            {post?.author?._id === authUser?._id && (
              <>
                <Link href={`/trade/update/${tradeNum}`}>수정</Link>
                <button type="button" onClick={handleDelete}>
                  삭제
                </button>
              </>
            )}
          </li>
        </ul>
      </div>

      <CommentList
        authUser={authUser}
        post={post}
        findPost={findPost}
        formatTimeAgo={formatTimeAgo}
      />
    </div>
  );
};

export default page;
