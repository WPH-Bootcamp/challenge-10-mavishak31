import './globals.css';
import { Geist } from 'next/font/google';

import Providers from '@/app/providers';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

// Title dan description default
export const metadata = {
  title: 'Foody',
  description: 'Food ordering app',
};

// RootLayout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={cn('font-sans', geist.variable)}>
      <body>
        <Providers>
          {/* Navbar tampil di semua halaman */}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
