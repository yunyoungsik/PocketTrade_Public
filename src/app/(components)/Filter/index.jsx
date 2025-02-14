'use client';

import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import FilterPopup from '@/app/(components)/Filter/FilterPopup';

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 600); // 애니메이션 시간과 맞춤 (0.6s)
  };

  return (
    <>
      <div id="tradeFilter">
        <button type="button" className="filterBtn" onClick={() => setIsOpen(true)}>
          <Settings2 />
          <p>필터</p>
        </button>
      </div>

      
      {isOpen && <FilterPopup isClosing={isClosing} onClose={handleClose} />}
    </>
  );
};

export default Filter;
