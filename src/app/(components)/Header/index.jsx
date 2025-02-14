'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ChevronLeft, X } from 'lucide-react';
import Navigation from '@/app/(components)/Header/Navigation';
import HeaderSearch from './HeaderSearch';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isTrade = pathname === '/trade';

  const getPageTitle = (item) => {
    const titles = {
      '/auth': '로그인/회원가입',
      '/mypage': '마이페이지',
      '/trade': '트레이드',
      '/trade/write': '트레이드',
      '/trade/view/[tradeNum]': '트레이드',
      '/mypage/cardList': '보유카드',
      '/mypage/tradeList': '트레이드 내역',
      '/notice': '공지사항',
      '/notice/view/[noticeNum]': '공지사항',
    };

    const matchedKey = Object.keys(titles).find((key) => {
      if (key.includes('[tradeNum]')) {
        return item.startsWith(key.replace('[tradeNum]', ''));
      }
      if (key.includes('[noticeNum]')) {
        return item.startsWith(key.replace('[noticeNum]', ''));
      }
      return key === item;
    });

    return matchedKey ? titles[matchedKey] : '페이지';
  };

  const handleBack = () => {
    if (/^\/trade\/view\/\d+$/.test(pathname)) {
      router.push('/trade');
      return;
    }

    if (/^\/notice\/view\/\d+$/.test(pathname)) {
      router.push('/notice');
      return;
    }

    // 기본적인 부모 경로 이동 로직
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 1) {
      const parentPath = '/' + pathSegments.slice(0, -1).join('/');
      router.push(parentPath);
    } else {
      router.push('/'); // 최상위 경로에서는 홈으로 이동
    }
  };

  return (
    <header id="header">
      <div className="header_top">
        {isHome ? (
          <h1 className="logo">
            <Link href={'/'} onClick={() => setIsOpen(false)}>
              PocketTrade
            </Link>
          </h1>
        ) : (
          <div className="header_back">
            <button onClick={handleBack} aria-label="뒤로 가기">
              <ChevronLeft />
            </button>
            <span className="page-title">{getPageTitle(pathname)}</span>
          </div>
        )}

        <div className="icon">
          <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <Navigation isOpen={isOpen} setIsOpen={setIsOpen} />

      {isHome || isTrade ? <HeaderSearch /> : null}
    </header>
  );
};

export default Header;
