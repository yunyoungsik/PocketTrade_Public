'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import Aside from '@/app/(components)/Aside/index';
import Navbar from '@/app/(components)/Navbar/index';
import Filter from '@/app/(components)/Filter/index';
import TradeList from '@/app/(components)/Trade/index';
import Loading from '@/app/(components)/Loading/index';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTradeStore } from '@/stores/useTradeStore';

function TradePageContent() {
  const { authUser } = useAuthStore();
  const { loading, posts, fetchPosts, page, count } = useTradeStore();
  const searchParams = useSearchParams();
  const searchText = searchParams.get('search') || '';

  useEffect(() => {
    fetchPosts(searchText, 1);
  }, [fetchPosts, searchText]);

  const handleLoadMore = () => {
    fetchPosts(searchText, page + 1);
  };

  // 전체 글 개수(count)보다 현재 불러온 글 개수(posts.length)가 적으면 "더보기" 버튼 표시
  const hasMorePosts = posts.length < count;

  if (loading) {
    return (
      <div className="loader-wrap">
        <span className="loader" />
      </div>
    );
  }

  return (
    <div id="trade">
      <Navbar />
      <Aside />
      <Filter />
      <TradeList
        data={posts}
        hasMorePosts={hasMorePosts}
        loading={loading}
        handleLoadMore={handleLoadMore}
      />

      {authUser && (
        <div className="writeTradeBtnWrap">
          <Link href={'/trade/write'} className="writeTradeBtn">
            <Plus />
            <p>글쓰기</p>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense fallback={<Loading />}>
      <TradePageContent />
    </Suspense>
  );
}
