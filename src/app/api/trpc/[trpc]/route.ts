import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';

import { createTRPCContext } from '@/server/api/trpc/trpc';
import { appRouter } from '@/server/api/root';

/**
 * This wraps the tRPC API endpoint in a Next.js API route
 */
const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export { handler as GET, handler as POST }; 