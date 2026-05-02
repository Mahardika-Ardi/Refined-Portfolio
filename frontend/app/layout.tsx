import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mahardika Arfuri My Portofolio",
  description:
    "Mahardika Arfuri | Fullstack Developer | Backend Enthusiast, SMK Software Engineering student turned backend builder. I craft scalable APIs, integrate AI, and deploy reliably—driven by clean code and curiosity.",
  openGraph: {
    title: "Mahardika Arfuri Portofolio",
    description:
      "Mahardika Arfuri | Fullstack Developer, Backend-focused fullstack developer skilled in NestJS, Express, Prisma, and Next.js. I build from database to deployment, now exploring AI integration.",
    url: "https://marshal-studio.fun",
    siteName: "Mahardika Arfuri Portfolio",
    images: [
      { url: "https://namakamu.my.id/og-image.jpg", width: 1200, height: 630 },
    ],
    locale: "id_ID",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
