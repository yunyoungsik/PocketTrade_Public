import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const HeaderSearch = () => {
  const router = useRouter();
  const [localSearchText, setLocalSearchText] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!localSearchText) return toast.error('검색어를 입력해주세요.');
    router.push(`/trade?search=${localSearchText}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!localSearchText) return toast.error('검색어를 입력해주세요.');
      router.push(`/trade?search=${localSearchText}`);
    }
  };

  return (
    <div id="headerSearch">
      <input
        type="text"
        placeholder="검색"
        name="search"
        id="search"
        value={localSearchText}
        onChange={(e) => setLocalSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={handleSearch}>
        <Search />
      </button>
    </div>
  );
};

export default HeaderSearch;
