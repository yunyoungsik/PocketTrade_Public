import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

const Navigation = ({ isOpen, setIsOpen }) => {
  const { authUser, logout } = useAuthStore();

  return (
    <nav id="headerMenu" className={isOpen ? `open` : `close`}>
      <div className="menu">
        <div>
          <Link href={'/trade'} onClick={() => setIsOpen(false)}>
            <h2>트레이드</h2>
          </Link>
        </div>

        <div>
          <h2>포켓몬도감</h2>
        </div>

        <div>
          <h2>회원</h2>
          <ul>
            {authUser ? (
              <>
                <li>
                  <Link href={'/mypage'} onClick={() => setIsOpen(false)}>
                    마이페이지
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={'/auth'} onClick={() => setIsOpen(false)}>
                    로그인/회원가입
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h2>기타</h2>
          <ul>
            <li>
              <Link href={'/notice'} onClick={() => setIsOpen(false)}>
                공지사항
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        <p>
          Pokémon and all related media, images, and names are trademarks and © of Nintendo,
          Creatures, Game Freak, and The Pokémon Company. All rights reserved. This site is not
          affiliated with or endorsed by these companies.
        </p>
      </div>
    </nav>
  );
};

export default Navigation;
