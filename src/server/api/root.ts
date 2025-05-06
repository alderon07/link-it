import { router } from './trpc/trpc';
import { linksRouter } from './routers/links';

/**
 * Root router that combines all sub-routers
 */
export const appRouter = router({
  links: linksRouter,
});

export type AppRouter = typeof appRouter; 