import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/providers/AuthProvider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OnxGists',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <AuthProvider session={session}>
      <html lang="en" className="w-full h-full">
        <body className={`flex flex-col w-full h-full ${inter.className}`}>
          <NextTopLoader color="#d5782f" showSpinner={false} />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
