'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
      <h1 className="text-5xl font-bold text-rose-500 mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        An unexpected error occurred while loading this page.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-full border border-border font-medium hover:bg-accent transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
