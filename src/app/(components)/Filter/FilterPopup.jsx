'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTradeStore } from '@/stores/useTradeStore';

const tradeFilters = [
  {
    name: 'status',
    label: '거래상태',
    options: [
      { name: '교환중', value: 'trading' },
      { name: '예약중', value: 'reservation' },
      { name: '교환완료', value: 'complete' },
    ],
  },
  {
    name: 'pack',
    label: '팩',
    options: [
      // { name: '시공의격투', value: 'A2' },
      { name: '환상이있는섬', value: 'A1a' },
      { name: '최강의유전자', value: 'A1' },
      // { name: 'PROMO-A', value: 'PA'}
    ],
  },
  {
    name: 'category',
    label: '종류',
    options: [
      { name: '포켓몬', value: 'pokemon' },
      { name: '아이템', value: 'item' },
      { name: '서포터', value: 'support' },
      { name: '아이템(화석)', value: 'item(fossil)' },
      { name: '포켓몬도구', value: 'pokemonTool' },
    ],
  },
  {
    name: 'rarity',
    label: '레어도',
    options: [
      { name: '◆', value: 'diamond-1' },
      { name: '◆◆', value: 'diamond-2' },
      { name: '◆◆◆', value: 'diamond-3' },
      { name: '◆◆◆◆', value: 'diamond-4' },
      { name: '★', value: 'star-1' },
      // { name: '★★', value: 'star-2' },
      // { name: '★★★', value: 'star-3' },
      // { name: '♕', value: 'crown' },
      // { name: '프로모', value: 'promo' },
    ],
  },
];

const pokemonFilters = [
  {
    name: 'type',
    label: '타입',
    options: [
      { name: '풀', value: 'grass' },
      { name: '불꽃', value: 'fire' },
      { name: '물', value: 'water' },
      { name: '번개', value: 'electric' },
      { name: '초', value: 'psychic' },
      { name: '격투', value: 'fighting' },
      { name: '악', value: 'dark' },
      { name: '강철', value: 'steel' },
      { name: '드래곤', value: 'dragon' },
      { name: '무색', value: 'colorless' },
    ],
  },
  {
    name: 'minHP',
    label: '최소HP',
    options: [
      { name: '10', value: '10' },
      { name: '20', value: '20' },
      { name: '30', value: '30' },
      { name: '40', value: '40' },
      { name: '50', value: '50' },
      { name: '60', value: '60' },
      { name: '70', value: '70' },
      { name: '80', value: '80' },
      { name: '90', value: '90' },
      { name: '100', value: '100' },
      { name: '110', value: '110' },
      { name: '120', value: '120' },
      { name: '130', value: '130' },
      { name: '140', value: '140' },
      { name: '150', value: '150' },
      { name: '160', value: '160' },
      { name: '170', value: '170' },
      { name: '180', value: '180' },
      { name: '190', value: '190' },
      { name: '200', value: '200' },
      { name: '210', value: '210' },
      { name: '220', value: '220' },
      { name: '230', value: '230' },
      { name: '240', value: '240' },
      { name: '250', value: '250' },
      { name: '260', value: '260' },
      { name: '270', value: '270' },
      { name: '280', value: '280' },
      { name: '290', value: '290' },
      { name: '300', value: '300' },
    ],
  },
  {
    name: 'maxHP',
    label: '최대HP',
    options: [
      { name: '10', value: '10' },
      { name: '20', value: '20' },
      { name: '30', value: '30' },
      { name: '40', value: '40' },
      { name: '50', value: '50' },
      { name: '60', value: '60' },
      { name: '70', value: '70' },
      { name: '80', value: '80' },
      { name: '90', value: '90' },
      { name: '100', value: '100' },
      { name: '110', value: '110' },
      { name: '120', value: '120' },
      { name: '130', value: '130' },
      { name: '140', value: '140' },
      { name: '150', value: '150' },
      { name: '160', value: '160' },
      { name: '170', value: '170' },
      { name: '180', value: '180' },
      { name: '190', value: '190' },
      { name: '200', value: '200' },
      { name: '210', value: '210' },
      { name: '220', value: '220' },
      { name: '230', value: '230' },
      { name: '240', value: '240' },
      { name: '250', value: '250' },
      { name: '260', value: '260' },
      { name: '270', value: '270' },
      { name: '280', value: '280' },
      { name: '290', value: '290' },
      { name: '300', value: '300' },
    ],
  },
  {
    name: 'minDamage',
    label: '최소데미지',
    options: [
      { name: '10', value: '10' },
      { name: '20', value: '20' },
      { name: '30', value: '30' },
      { name: '40', value: '40' },
      { name: '50', value: '50' },
      { name: '60', value: '60' },
      { name: '70', value: '70' },
      { name: '80', value: '80' },
      { name: '90', value: '90' },
      { name: '100', value: '100' },
      { name: '110', value: '110' },
      { name: '120', value: '120' },
      { name: '130', value: '130' },
      { name: '140', value: '140' },
      { name: '150', value: '150' },
      { name: '160', value: '160' },
      { name: '170', value: '170' },
      { name: '180', value: '180' },
      { name: '190', value: '190' },
      { name: '200', value: '200' },
      { name: '210', value: '210' },
      { name: '220', value: '220' },
      { name: '230', value: '230' },
      { name: '240', value: '240' },
      { name: '250', value: '250' },
      { name: '260', value: '260' },
      { name: '270', value: '270' },
      { name: '280', value: '280' },
      { name: '290', value: '290' },
      { name: '300', value: '300' },
    ],
  },
  {
    name: 'maxDamage',
    label: '최대데미지',
    options: [
      { name: '10', value: '10' },
      { name: '20', value: '20' },
      { name: '30', value: '30' },
      { name: '40', value: '40' },
      { name: '50', value: '50' },
      { name: '60', value: '60' },
      { name: '70', value: '70' },
      { name: '80', value: '80' },
      { name: '90', value: '90' },
      { name: '100', value: '100' },
      { name: '110', value: '110' },
      { name: '120', value: '120' },
      { name: '130', value: '130' },
      { name: '140', value: '140' },
      { name: '150', value: '150' },
      { name: '160', value: '160' },
      { name: '170', value: '170' },
      { name: '180', value: '180' },
      { name: '190', value: '190' },
      { name: '200', value: '200' },
      { name: '210', value: '210' },
      { name: '220', value: '220' },
      { name: '230', value: '230' },
      { name: '240', value: '240' },
      { name: '250', value: '250' },
      { name: '260', value: '260' },
      { name: '270', value: '270' },
      { name: '280', value: '280' },
      { name: '290', value: '290' },
      { name: '300', value: '300' },
    ],
  },
];

const FilterPopup = ({ isClosing, onClose }) => {
  const { allPosts, applyFilters, setFilterList, filterList } = useTradeStore();
  const [localFilters, setLocalFilters] = useState({
    status: 'all',
    pack: 'all',
    category: 'all',
    rarity: 'all',
    type: 'all',
    minHP: 'all',
    maxHP: 'all',
    minDamage: '10',
    maxDamage: 'all',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilters = () => {
    setFilterList(localFilters);
    setTimeout(() => applyFilters(), 0); // 비동기 업데이트 후 적용
    onClose();
  };

  const resetFilters = () => {
    const initialFilters = {
      status: 'all',
      pack: 'all',
      category: 'all',
      rarity: 'all',
      type: 'all',
      minHP: 'all',
      maxHP: 'all',
      minDamage: 'all',
      maxDamage: 'all',
    };

    setLocalFilters(initialFilters);
    setFilterList(initialFilters); // Zustand 상태도 초기화
    setTimeout(() => applyFilters(), 0);
  };

  return (
    <div id="tradeFilterPopup" className={isClosing ? 'close' : 'open'}>
      <div className="popupContainer">
        <div className="popupTop">
          <h2>트레이드 필터</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="filterContainer">
          {/* ✅ 일반 필터 */}
          <div className="basicFilter">
            {tradeFilters.map(({ name, label, options }) => (
              <div key={name} className="filter-group">
                <h3 className="filter-label">{label}</h3>
                <div className="filter-options">
                  {options.map((option) => (
                    <label
                      key={option.value}
                      className={`filter-option ${
                        localFilters[name] === option.value ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={localFilters[name] === option.value}
                        onChange={handleChange}
                        className="hidden-radio"
                      />
                      <span className="custom-radio"></span>
                      {option.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ 포켓몬 관련 필터 (카테고리가 포켓몬일 때만 표시) */}
          {localFilters.category === 'pokemon' && (
            <div className="pokemonFilter">
              {pokemonFilters
                .filter(
                  ({ name }) =>
                    name !== 'minHP' &&
                    name !== 'maxHP' &&
                    name !== 'minDamage' &&
                    name !== 'maxDamage'
                )
                .map(({ name, label, options }) => (
                  <div key={name} className="filter-group">
                    <h3 className="filter-label">{label}</h3>
                    <div className="filter-options">
                      {options.map((option) => (
                        <label
                          key={option.value}
                          className={`filter-option ${
                            localFilters[name] === option.value ? 'selected' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={localFilters[name] === option.value}
                            onChange={handleChange}
                            className="hidden-radio"
                          />
                          <span className="custom-radio"></span>
                          {option.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

              {/* ✅ 최소HP - 최대HP (selectbox) */}
              <div className="filter-group">
                <h3 className="filter-label">HP</h3>
                <div className="select-group">
                  <select name="minHP" value={localFilters.minHP} onChange={handleChange}>
                    {pokemonFilters
                      .find((filter) => filter.name === 'minHP')
                      ?.options.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <span> - </span>
                  <select name="maxHP" value={localFilters.maxHP} onChange={handleChange}>
                    {pokemonFilters
                      .find((filter) => filter.name === 'maxHP')
                      ?.options.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* ✅ 최소데미지 - 최대데미지 (selectbox) */}
              <div className="filter-group">
                <h3 className="filter-label">데미지</h3>
                <div className="select-group">
                  <select name="minDamage" value={localFilters.minDamage} onChange={handleChange}>
                    {pokemonFilters
                      .find((filter) => filter.name === 'minDamage')
                      ?.options.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <span> - </span>
                  <select name="maxDamage" value={localFilters.maxDamage} onChange={handleChange}>
                    {pokemonFilters
                      .find((filter) => filter.name === 'maxDamage')
                      ?.options.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="filterBtn">
            <button type="button" onClick={resetFilters}>
              전체해제
            </button>
            <button type="button" className="applyBtn" onClick={handleFilters}>
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
