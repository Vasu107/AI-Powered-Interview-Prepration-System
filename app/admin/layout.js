import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard - AskUp Interview',
  description: 'Admin panel for managing interview system',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}