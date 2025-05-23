'use client';

import { useEffect } from 'react';

export default function LoginError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Login error:', error);
  }, [error]);

  return (
    <div> 
      <h1>Login Error</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reset</button>
    </div>
  );
}   

