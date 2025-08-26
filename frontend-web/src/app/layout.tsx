import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { LayoutManager } from '@/components/layout/LayoutManager';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArionComply - AI Accountability & Compliance Platform',
  description: 'Multi-framework compliance platform with AI accountability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <LayoutManager>
          {children}
        </LayoutManager>
      </body>
    </html>
  );
}