'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Nav } from '@/components/layout/nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if we're in an authenticated route and not authenticated
    if (mounted && !isAuthenticated && pathname.startsWith('/dashboard')) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router, pathname]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Only apply auth check for routes within the (app) group
  if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/transactions') || pathname.startsWith('/insights') || pathname.startsWith('/actions') || pathname.startsWith('/settings'))) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Nav />
      <main className="flex-1 overflow-y-auto bg-background p-8">{children}</main>
    </div>
  );
}

