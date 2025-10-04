'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Nav } from '@/components/layout/nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Nav />
      <main className="flex-1 overflow-y-auto bg-background p-8">{children}</main>
    </div>
  );
}

