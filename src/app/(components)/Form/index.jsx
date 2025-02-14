'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronLeft, Minus, SquarePlus } from 'lucide-react';
import { isTradeable } from '@/utils/filterCards';
import { useCardStore } from '@/stores/useCardStore';

const Form = ({ type, authUser, localTrade, setLocalTrade, submitting, handleSubmit }) => {
  const { loading, cards, getCards } = useCardStore();
  const [isWantCardPopupOpen, setIsWantCardPopupOpen] = useState(false);
  // 팝업
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (cards.length === 0) {
      getCards();
    }
  }, [cards]);

  // 보유카드 추가
  const handleAddCard = (cardId) => {
    setLocalTrade((prev) => ({
      ...prev,
      haveCards: prev.haveCards.some((c) => c.card === cardId)
        ? prev.haveCards.map((c) => (c.card === cardId ? { ...c, quantity: c.quantity + 1 } : c))
        : [...prev.haveCards, { card: cardId, quantity: 1 }],
    }));
  };

  // 보유카드 제거
  const handleMinusCard = (cardId) => {
    setLocalTrade((prev) => ({
      ...prev,
      haveCards: prev.haveCards
        .map((c) => (c.card === cardId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0),
    }));
  };

  // 원하는카드 빼기
  const handleMinusWantCard = (cardId) => {
    setLocalTrade((prev) => ({
      ...prev,
      wantCards: prev.wantCards
        .map((c) => (c.card === cardId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0),
    }));
  };

  // 카드 검색
  // 검색어 입력 핸들러
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      const results = cards.filter((card) => card.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredCards(results);
      setShowDropdown(results.length > 0);
    } else {
      setFilteredCards([]);
      setShowDropdown(false);
    }
  };

  // 카드 선택 핸들러
  const handleSelectCard = (cardId) => {
    setLocalTrade((prev) => ({
      ...prev,
      wantCards: prev.wantCards.some((c) => c.card === cardId)
        ? prev.wantCards.map((c) => (c.card === cardId ? { ...c, quantity: c.quantity + 1 } : c))
        : [...prev.wantCards, { card: cardId, quantity: 1 }],
    }));

    setSearchTerm(''); // 검색어 초기화
    setShowDropdown(false); // 드롭다운 닫기
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
              {authUser?.cards
                ?.filter((card) => {
                  const findCard = cards.find((find) => find._id === card.card);
                  return findCard && isTradeable(findCard);
                })
                .map((card) => {
                  const findCard = cards.find((find) => find._id === card.card);
                  const isAdded = localTrade?.haveCards?.some((find) => find.card === card.card);
                  const cardQuantity =
                    localTrade?.haveCards?.find((find) => find.card === card.card)?.quantity || 0;
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

          {localTrade?.wantCards?.length === 0 ? (
            <ul>
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
          ) : (
            <ul>
              {localTrade?.wantCards.map((card) => {
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
          )}
          <ul></ul>
        </div>

        <div className="formSection tradeTitle">
          <label htmlFor="tradeTitle" className="tradeFormSpan">
            제목
          </label>
          <input
            id="tradeTitle"
            name="tradeTitle"
            value={localTrade?.title || ''}
            onChange={(e) => setLocalTrade((prev) => ({ ...prev, title: e.target.value }))}
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
            value={localTrade?.desc || ''}
            onChange={(e) => setLocalTrade((prev) => ({ ...prev, desc: e.target.value }))}
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

      {/* 검색 */}
      {isWantCardPopupOpen && (
        <div id="searchPopup">
          <div className="header_top">
            <div className="header_back">
              <button type="button" onClick={() => setIsWantCardPopupOpen(false)}>
                <ChevronLeft />
              </button>
              <span>카드추가</span>
            </div>
          </div>

          {/* 검색 */}
          <div id="seachBox" className={`${showDropdown && 'active'}`}>
            <label htmlFor="seachInput">
              <Search />
            </label>
            <input
              type="text"
              name="search"
              id="seachInput"
              placeholder="검색어를 입력해주세요"
              value={searchTerm}
              onChange={handleSearch}
            />

            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <ul className="searchDropdown">
                {filteredCards
                  .filter((card) => isTradeable(card))
                  .map((card) => (
                    <li key={card.cardId} onClick={() => handleSelectCard(card._id)}>
                      <div className="seachImageBox">
                        <Image
                          src={card.image || '/img/default.webp'}
                          width={36}
                          height={50}
                          alt={card.name}
                        />
                      </div>
                      <span>{card.name}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="searchPopupContent">
            <ul>
              {localTrade?.wantCards?.map((card) => {
                const findCard = cards.find((find) => find._id === card.card);
                const isAdded = localTrade?.wantCards?.some((find) => find.card === card.card);
                const cardQuantity =
                  localTrade?.wantCards?.find((find) => find.card === card.card)?.quantity || 0;

                return (
                  <li key={card.card} className={isAdded ? 'active' : ''}>
                    <button type="button" onClick={() => handleAddCard(card.card)}>
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
                          onClick={() => handleMinusWantCard(card.card)}
                        >
                          <Minus />
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
