import { nextAuthOptions } from '@/auth/nextAuthOptions';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/providers/AuthProvider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const session = await getServerSession(nextAuthOptions);

  return (
    <AuthProvider session={session}>
      <html lang="en" className="w-full h-full">
        <body className={`flex flex-col w-full h-full ${inter.className}`}>
          <NextTopLoader color="#d5782f" showSpinner={false} />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="dark"
            toastClassName="bg-secondary-gray text-primary-white"
          />
        </body>
      </html>
    </AuthProvider>
  );
}
