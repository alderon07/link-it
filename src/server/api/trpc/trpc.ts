/**
 * tRPC API configuration
 */
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const createTRPCContext = async () => {
  return {
    // Add context properties here (like database access, user session, etc.)
  };
};

/**
 * Initialize the tRPC API
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export tRPC procedures
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Create middleware for protected routes
 */
const isAuthed = t.middleware(({ next, ctx }) => {
  // Check if user is authenticated
  // For now, we'll just proceed without any verification
  return next({
    ctx: {
      ...ctx,
      // Add user information to context if needed
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed); 