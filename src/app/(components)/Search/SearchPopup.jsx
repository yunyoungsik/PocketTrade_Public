import { useState } from 'react';
import Image from 'next/image';
import { Search, ChevronLeft, Minus } from 'lucide-react';
import { isTradeable } from '@/utils/filterCards';

const SearchPopup = ({
  cards,
  localWantCards,
  setLocalWantCards,
  closePopup,
  handleAddCard,
  handleMinusCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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
    setLocalWantCards((prev) => ({
      wantCards: (prev.wantCards || []).some((c) => c.card === cardId)
        ? (prev.wantCards || []).map((c) =>
            c.card === cardId ? { ...c, quantity: c.quantity + 1 } : c
          )
        : [...(prev.wantCards || []), { card: cardId, quantity: 1 }],
    }));

    setSearchTerm(''); // 검색어 초기화
    setShowDropdown(false); // 드롭다운 닫기
  };

  return (
    <div id="searchPopup">
      <div className="header_top">
        <div className="header_back">
          <button type="button" onClick={closePopup}>
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
          {localWantCards?.map((card) => {
            const findCard = cards.find((find) => find._id === card.card);
            const isAdded = localWantCards?.some((find) => find.card === card.card);
            const cardQuantity =
              localWantCards?.find((find) => find.card === card.card)?.quantity || 0;

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
                      onClick={() => handleMinusCard(card.card)}
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
  );
};

export default SearchPopup;
