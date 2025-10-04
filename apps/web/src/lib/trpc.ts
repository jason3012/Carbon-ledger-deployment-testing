import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../api/src/trpc/routers';

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  if (typeof window !== 'undefined') {
    console.log('🔍 tRPC Base URL:', url);
  }
  return url;
}

export function getTRPCClient() {
  const baseUrl = getBaseUrl();
  const trpcUrl = `${baseUrl}/trpc`;
  
  if (typeof window !== 'undefined') {
    console.log('🔍 Creating tRPC client with URL:', trpcUrl);
  }
  
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: trpcUrl,
        headers() {
          if (typeof window === 'undefined') {
            return {};
          }
          const token = localStorage.getItem('token');
          return token ? { authorization: `Bearer ${token}` } : {};
        },
        fetch(url, options) {
          if (typeof window !== 'undefined') {
            console.log('🔍 Fetching:', url);
          }
          return fetch(url, options).catch((err) => {
            console.error('❌ Fetch error:', err);
            throw err;
          });
        },
      }),
    ],
  });
}

