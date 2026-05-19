import type { Metadata } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import '../styles/globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mahardika Arfuri My Portofolio',
  description:
    'Mahardika Arfuri | Fullstack Developer | Backend Enthusiast, SMK Software Engineering student turned backend builder. I craft scalable APIs, integrate AI, and deploy reliably—driven by clean code and curiosity.',
  openGraph: {
    title: 'Mahardika Arfuri Portofolio',
    description:
      'Mahardika Arfuri | Fullstack Developer, Backend-focused fullstack developer skilled in NestJS, Express, Prisma, and Next.js. I build from database to deployment, now exploring AI integration.',
    url: 'https://marshal-studio.fun',
    siteName: 'Mahardika Arfuri Portofolio',
    images: [
      {
        url: 'https://res.cloudinary.com/duybc3phn/image/upload/v1778156980/Image_12_wrllmz.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
