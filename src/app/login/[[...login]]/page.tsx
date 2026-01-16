'use client';

import { SignIn } from '@clerk/nextjs';

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            cardBox: 'pixel-shadow',
            headerTitle: 'pixel-text-shadow text-2xl',
            headerSubtitle: 'text-muted-foreground',
            socialButtonsBlockButton: {
              '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '6px 6px 0 0 var(--shadow-color)',
              },
              '&:active': {
                transform: 'translate(2px, 2px)',
                boxShadow: '2px 2px 0 0 var(--shadow-color)',
              },
            },
            formButtonPrimary: {
              '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '6px 6px 0 0 var(--shadow-color)',
              },
              '&:active': {
                transform: 'translate(2px, 2px)',
                boxShadow: '2px 2px 0 0 var(--shadow-color)',
              },
            },
            footerAction: 'text-center',
            footer: 'hidden',
          },
        }}
      />
    </div>
  );
}