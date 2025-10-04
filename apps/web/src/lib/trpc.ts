import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../api/src/trpc/routers';

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  }
  // SSR should use absolute URL
  return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
}

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
        headers() {
          const token = localStorage.getItem('token');
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}

