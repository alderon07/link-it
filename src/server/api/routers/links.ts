import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc';

// Dummy data - this would be replaced with actual database operations
const dummyLinks = [
  {
    id: '1',
    title: 'Google',
    url: 'https://google.com',
  },
  {
    id: '2',
    title: 'Facebook',
    url: 'https://facebook.com',
  },
  {
    id: '3',
    title: 'Twitter',
    url: 'https://twitter.com',
  },
  {
    id: '4',
    title: 'Instagram',
    url: 'https://instagram.com',
  },
];

export const linksRouter = router({
  // Public procedure for getting all links
  getAll: publicProcedure.query(() => {
    // In a real app, you would fetch from a database
    return dummyLinks;
  }),

  // Public procedure for getting a specific link
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const link = dummyLinks.find((link) => link.id === input.id);
      if (!link) {
        throw new Error('Link not found');
      }
      return link;
    }),

  // Protected procedure for creating a link
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        url: z.string().url(),
      })
    )
    .mutation(({ input }) => {
      // In a real app, you would create a link in the database
      const newLink = {
        id: String(dummyLinks.length + 1),
        title: input.title,
        url: input.url,
      };

      dummyLinks.push(newLink);
      return newLink;
    }),

  // Protected procedure for updating a link
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(100),
        url: z.string().url(),
      })
    )
    .mutation(({ input }) => {
      // In a real app, you would update a link in the database
      const linkIndex = dummyLinks.findIndex((link) => link.id === input.id);
      if (linkIndex === -1) {
        throw new Error('Link not found');
      }

      dummyLinks[linkIndex] = {
        ...dummyLinks[linkIndex],
        title: input.title,
        url: input.url,
      };

      return dummyLinks[linkIndex];
    }),

  // Protected procedure for deleting a link
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      // In a real app, you would delete a link from the database
      const linkIndex = dummyLinks.findIndex((link) => link.id === input.id);
      if (linkIndex === -1) {
        throw new Error('Link not found');
      }

      const deletedLink = dummyLinks[linkIndex];
      dummyLinks.splice(linkIndex, 1);
      return deletedLink;
    }),
}); 