'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

const Aside = () => {
  // const [isClosed, setIsClosed] = useState(false);
  // const handleAdClose = () => {
  //   setIsClosed(true);
  // };

  return (
    <aside id="aside">
      <div className="adImage"></div>
      {/* <button type="button" className="adClose" onClick={handleAdClose}>
          <X />
        </button> */}
    </aside>
  );
};

export default Aside;
