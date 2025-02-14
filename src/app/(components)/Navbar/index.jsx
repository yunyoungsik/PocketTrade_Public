'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: '트레이드', href: '/trade' },
  { name: '포켓몬도감(예정)', href: '/' },
]

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div id="navbar">
      <ul>
       {navigation.map((item) => (
         <li key={item.name} className={pathname === item.href ? 'active' : ''}>
           <Link href={item.href}>{item.name}</Link>
         </li>
       ))}
      </ul>
    </div>
  );
};

export default Navbar;
