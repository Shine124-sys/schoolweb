import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SchoolWeb — School Management System',
  description: 'Complete school management platform for PP to Class 10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </Providers>
      </body>
    </html>
  );
}
