import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

const API_URL = 'http://193.77.60.244/api/trpc';

export function getTRPCClientOptions() {
  return {
    links: [
      httpBatchLink({
        url: API_URL,
        transformer: superjson,
      }),
    ],
  };
}
