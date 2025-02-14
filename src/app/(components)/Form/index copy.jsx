'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, SquarePlus } from 'lucide-react';
import { useCardStore } from '@/stores/useCardStore';
import SearchPopup from '@/app/(components)/Search/SearchPopup';

const Form = ({ type, authUser, localTrade, setLocalTrade, submitting, handleSubmit }) => {
  const { loading, cards, getCards } = useCardStore();
  const [title, setTitle] = useState(localTrade?.title || '');
  const [desc, setDesc] = useState(localTrade?.desc || '');
  const [localHaveCards, setLocalHaveCards] = useState(localTrade?.haveCards || []);
  const [localWantCards, setLocalWantCards] = useState(localTrade?.wantCards || []);
  const [isWantCardPopupOpen, setIsWantCardPopupOpen] = useState(false);

  useEffect(() => {
    if (cards.length === 0) {
      getCards();
    }
  }, [cards]);

  useEffect(() => {
    setLocalTrade((prev) => ({
      ...prev,
      title,
      desc,
      haveCards: localHaveCards,
      wantCards: localWantCards,
    }));
  }, [title, desc, localHaveCards, localWantCards, setLocalTrade]);

  // 보유카드 추가
  const handleAddCard = (cardId) => {
    setLocalHaveCards((prevCards) => {
      const card = prevCards.find((c) => c.card === cardId);
      return card
        ? prevCards.map((c) => (c.card === cardId ? { ...c, quantity: c.quantity + 1 } : c))
        : [
            ...prevCards,
            {
              card: cardId,
              quantity: 1,
            },
          ];
    });
  };

  // 보유카드 제거
  const handleMinusCard = (cardId) => {
    setLocalHaveCards((prevCards) => {
      return prevCards
        .map((c) => (c.card === cardId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0);
    });
  };

  // 원하는카드 추가
  const handleAddWantCard = (cardId) => {
    setLocalWantCards((prevCards) => {
      const card = prevCards.find((c) => c.card === cardId);
      return card
        ? prevCards.map((c) => (c.card === cardId ? { ...c, quantity: c.quantity + 1 } : c))
        : [
            ...prevCards,
            {
              card: cardId,
              quantity: 1,
            },
          ];
    });
  };

  // 원하는카드 빼기
  const handleMinusWantCard = (cardId) => {
    setLocalWantCards((prevCards) => {
      return prevCards
        .map((c) => (c.card === cardId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0);
    });
  };

  if (loading)
    return (
      <div className="loader-wrap">
        <span className="loader" />
      </div>
    );

  return (
    <div id="tradeForm">
      <form onSubmit={handleSubmit} className="tradeFormContainer">
        <div className="formSection haveCards">
          <p className="tradeFormSpan">보유카드</p>

          {authUser?.cards?.length === 0 ? (
            <div className="noHaveCards">
              <p>보유한 카드가 없습니다.</p>
              <span>
                <Link href={'/mypage/cardList'}>마이페이지</Link>에서 카드를 추가해주세요.
              </span>
            </div>
          ) : (
            <ul>
              {authUser?.cards?.map((card) => {
                const findCard = cards.find((find) => find._id === card.card);
                const isAdded = localHaveCards.some((find) => find.card === card.card);
                const cardQuantity =
                  localHaveCards.find((find) => find.card === card.card)?.quantity || 0;
                return (
                  <li key={card.card} className={isAdded ? 'active' : ''}>
                    <>
                      <button
                        type="button"
                        onClick={() => handleAddCard(findCard._id)}
                        disabled={
                          cardQuantity >=
                          (authUser.cards.find((find) => find.card === card.card)?.quantity || 0)
                        }
                      >
                        <Image
                          src={findCard?.image || '/img/default.webp'}
                          width={367}
                          height={512}
                          alt={`${findCard?.name || '알 수 없는 카드'} 이미지`}
                        />
                      </button>

                      {isAdded && (
                        <>
                          <span className="quantity">{cardQuantity}</span>
                          <button
                            type="button"
                            className="minusBtn"
                            onClick={() => handleMinusCard(card.card)}
                          >
                            <Minus />
                          </button>
                        </>
                      )}
                    </>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="formSection wantCards">
          <p htmlFor="wantCards" className="tradeFormSpan">
            원하는카드
          </p>

          <ul>
            {localWantCards?.map((card) => {
              const findCard = cards.find((find) => find._id === card.card);

              return (
                <li key={card.card} className="active">
                  <Image
                    src={findCard?.image || '/img/default.webp'}
                    width={367}
                    height={512}
                    alt={`${findCard?.name || '알 수 없는 카드'} 이미지`}
                  />

                  <span className="quantity">{card.quantity}</span>
                  <button
                    type="button"
                    className="minusBtn"
                    onClick={() => handleMinusWantCard(card.card)}
                  >
                    <Minus />
                  </button>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                className="cardAddBtn"
                onClick={() => setIsWantCardPopupOpen(true)}
              >
                <SquarePlus />
                <span>카드추가</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="formSection tradeTitle">
          <label htmlFor="tradeTitle" className="tradeFormSpan">
            제목
          </label>
          <input
            id="tradeTitle"
            name="tradeTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="제목"
            required
          />
        </div>

        <div className="formSection tradeDesc">
          <label htmlFor="tradeDesc" className="tradeFormSpan">
            자세한 설명
          </label>
          <textarea
            id="tradeDesc"
            name="tradeDesc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="설명"
            required
          />
        </div>

        <div className="tradeBtn">
          <div className="tradeBtnContainer">
            <button type="submit" disabled={submitting} className="white-btn">
              {submitting ? `${type}중` : type}
            </button>
          </div>
        </div>
      </form>

      {isWantCardPopupOpen && (
        <SearchPopup
          cards={cards || []}
          localWantCards={localWantCards}
          setLocalWantCards={setLocalWantCards}
          handleAddCard={handleAddWantCard}
          handleMinusCard={handleMinusWantCard}
          closePopup={() => setIsWantCardPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default Form;
