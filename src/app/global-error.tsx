'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4 text-center">
        <h1 className="text-5xl font-bold text-rose-500 mb-4">Critical Error</h1>
        <p className="text-slate-400 max-w-md mb-8">
          A critical system error occurred.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
        >
          Reset Application
        </button>
      </body>
    </html>
  );
}
