'use client';

import { useEffect, useState } from 'react';
import { LinkButton } from './ui/LinkButton';
import { getAllLinks, type Link, ValidationError } from '@/data/links';

export function LinksList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function fetchLinks() {
      try {
        setIsLoading(true);
        setValidationErrors({});
        const data = await getAllLinks();
        setLinks(data);
        setError(null);
      } catch (err) {
        if (err instanceof ValidationError) {
          const fieldErrors = err.errors.flatten().fieldErrors;
          const typedErrors: Record<string, string[]> = {};
          
          Object.entries(fieldErrors).forEach(([key, value]) => {
            if (value) {
              typedErrors[key] = value;
            }
          });
          
          setValidationErrors(typedErrors);
        } else {
          setError(err instanceof Error ? err : new Error('Failed to load links'));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchLinks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
        <div className="h-10 w-full animate-pulse rounded-2xl bg-pink-400/20"></div>
        <div className="h-10 w-full animate-pulse rounded-2xl bg-pink-400/20"></div>
        <div className="h-10 w-full animate-pulse rounded-2xl bg-pink-400/20"></div>
      </div>
    );
  }

  if (Object.keys(validationErrors).length > 0) {
    return (
      <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
        <p className="text-center text-red-400">Validation errors occurred:</p>
        <ul className="list-disc pl-5 text-red-400">
          {Object.entries(validationErrors).map(([field, errors]) => (
            errors.map((error, i) => (
              <li key={`${field}-${i}`}>
                <span className="font-semibold">{field}:</span> {error}
              </li>
            ))
          ))}
        </ul>
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