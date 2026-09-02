'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const ThreeGlobeExplorer = dynamic(
  () => import('@/components/ThreeGlobeExplorer'),
  { ssr: false }
);

function GlobeInner() {
  const searchParams = useSearchParams();
  const destination = searchParams?.get('destination') ?? undefined;

  return <ThreeGlobeExplorer initialDestinationId={destination} />;
}

export default function GlobePage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#050814] flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-aurora border-t-transparent animate-spin" />
          <p className="text-xs text-aurora animate-pulse">Initializing 3D Orbital Earth...</p>
        </div>
      }
    >
      <GlobeInner />
    </Suspense>
  );
}
