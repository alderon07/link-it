'use client';

import { trpc } from '@/utils/trpc';
import { LinkButton } from './ui/LinkButton';

export function LinksList() {
  // Use tRPC to fetch links from the server
  const { data: links, isLoading, error } = trpc.links.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
        <div className="h-10 w-full animate-pulse rounded-2xl bg-pink-400/20"></div>
        <div className="h-10 w-full animate-pulse rounded-2xl bg-pink-400/20"></div>
        <div className="h-10 w-full animate-pulse rounded-2xl bg-pink-400/20"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
        <p className="text-center text-red-400">
          Error loading links: {error.message}
        </p>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
        <p className="text-center text-pink-200">No links found</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
      {links.map((link) => (
        <LinkButton
          key={link.id}
          href={link.url}
          className="bg-pink-400/40 text-white hover:bg-pink-400/60"
        >
          {link.title}
        </LinkButton>
      ))}
    </div>
  );
} 