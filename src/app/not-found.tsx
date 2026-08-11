import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
      <h1 className="text-6xl font-bold text-sky-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The destination you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
      >
        Return to Home
      </Link>
    </div>
  );
}
