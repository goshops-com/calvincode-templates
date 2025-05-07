import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DevInspector from '@/components/dev-inspector';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopNow - Your One-Stop Shop',
  description: 'Discover amazing products at unbeatable prices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <DevInspector />
      </body>
    </html>
  );
}