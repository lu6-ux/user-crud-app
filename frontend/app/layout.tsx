import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'User CRUD App',
  description: 'Auth + User CRUD assessment app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
