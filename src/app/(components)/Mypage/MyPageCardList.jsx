'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus } from 'lucide-react';
import { useCardStore } from '@/stores/useCardStore';
import { useAuthStore } from '@/stores/useAuthStore';
import SelectPack from '@/app/(components)/Mypage/SelectPack';

const packs = [
  { value: 'A1', label: '최강의유전자', img: '/img/packTitle/geneticApex.webp' },
  { value: 'A1a', label: '환상이있는섬', img: '/img/packTitle/mythicalIsland.webp' },
  { value: 'A2', label: '시공의격투', img: '/img/packTitle/spacetimeSmackdown.webp' },
  { value: 'P-A', label: 'PROMO-A', img: '/img/packTitle/promoA.webp' },
];

const Page = () => {
  const { cards = [] } = useCardStore();
  const { loading, authUser, updateCard } = useAuthStore();
  const [localHaveCards, setLocalHaveCards] = useState([]);
  const [selected, setSelected] = useState(packs[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (authUser?.cards) {
      setLocalHaveCards(authUser.cards);
    }
  }, [authUser]);

  // Pack 필터
  const filterPack = (codeName) => {
    return cards.filter((card) => card.pack.codeName === codeName);
  };

  // 추가
  const handleAddCard = (cardId) => {
    setLocalHaveCards((prevCards) => {
      const existingCard = prevCards.find((c) => c.card.toString() === cardId);

      return existingCard
        ? prevCards.map((c) =>
            c.card.toString() === cardId ? { ...c, quantity: c.quantity + 1 } : c
          )
        : [...prevCards, { card: cardId, quantity: 1 }];
    });
  };

  // 빼기
  const handleMinusCard = (cardId) => {
    setLocalHaveCards((prevCards) =>
      prevCards
        .map((c) => (c.card.toString() === cardId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const sortCards = (cards) =>
    [...cards].sort((a, b) => a.card.toString().localeCompare(b.card.toString()));

  // 업데이트
  const handleUpdateCard = () => {
    if (!authUser) return;

    // 기존 유저 카드 데이터를 정렬
    const sortedAuthCards = sortCards(authUser.cards || []);
    const sortedLocalCards = sortCards(localHaveCards);

    // JSON 비교 후 변경 사항이 있을 경우 업데이트
    if (JSON.stringify(sortedAuthCards) !== JSON.stringify(sortedLocalCards)) {
      updateCard({ userId: authUser._id, cards: localHaveCards });
    }
  };

  if (loading) return null;

  return (
    <div id="authCardList">
      <div className="packList">
        {/* 로고 */}
        <div className="pack">
          <SelectPack
            packs={packs}
            selected={selected}
            setSelected={setSelected}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />

          <ul className='list'>
            {filterPack(selected?.value).map((card) => {
              const findCard = localHaveCards.find((haveCard) => haveCard.card === card._id);
              return (
                <li key={card._id} className={findCard ? 'active' : ''}>
                  <button type="button" onClick={() => handleAddCard(card._id)}>
                    <Image
                      src={card.image || '/img/default.webp'}
                      width={367}
                      height={512}
                      alt={`${card.name} 이미지`}
                    />
                  </button>
                  {findCard && (
                    <>
                      <button
                        type="button"
                        className="minusBtn"
                        onClick={() => handleMinusCard(findCard.card)}
                      >
                        <Minus />
                      </button>
                      <span> {findCard.quantity}</span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 업데이트 버튼 */}
      <button type="submit" className="submitBtn" onClick={handleUpdateCard}>
        OK
      </button>
    </div>
  );
};

export default Page;
