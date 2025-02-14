import localFont from 'next/font/local';
import DashboardWrapper from '@/app/(components)/Dashboard/index'
import '@/style/style.scss';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata = {
  generator: 'Next.js',
  title: 'PocketTrade - 포켓몬 카드 게임 Pocket 카드 트레이드',
  description: '포켓몬 카드 게임 Pocket 카드 트레이드',
  keywords: [
    '포켓몬, 포켓몬 카드 게임, Pocket, 포켓몬 카드 게임 Pocket, 포켓몬 교환, 포켓몬 트레이드',
  ],
  authors: [{ name: 'Yun' }],
  creator: [{ name: 'Yun' }],
  publisher: [{ name: 'Yun' }],
  formatDetection: {
    email: '13579yys@gmail.kr',
  },
  icons: {
    icon: 'favicon.ico',
  },
  metadataBase: new URL('https://pocket-trade-theta.vercel.app/'),
  images: 'https://pocket-trade-theta.vercel.app/img/meta/meta.webp',
  openGraph: {
    title: 'PocketTrade - 포켓몬 카드 게임 Pocket 카드 트레이드',
    description:
      '포켓몬 카드 게임 Pocket 카드 트레이드',
    url: 'https://pocket-trade-theta.vercel.app/',
    siteName: 'FCON.KR',
    images: 'https://pocket-trade-theta.vercel.app/img/meta/meta.webp',
    locale: 'ko_KR',
    type: 'website',
    type: 'article',
    publishedTime: '2025-02-14T14:00:00.000Z',
    authors: ['Yun'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    Yeti: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PocketTrade - 포켓몬 카드 게임 Pocket 카드 트레이드',
    description:
      '포켓몬 카드 게임 Pocket 카드 트레이드',
    images: ['https://pocket-trade-theta.vercel.app/img/meta/meta.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="kr">
      <body className={`${pretendard.variable}`}>
        <DashboardWrapper>{children}</DashboardWrapper>
      </body>
    </html>
  );
}
