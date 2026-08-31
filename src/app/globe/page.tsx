import { Suspense } from 'react';
import ThreeGlobeExplorer from '@/components/ThreeGlobeExplorer';

export const metadata = {
  title: '3D World Globe Explorer | AtlasAura',
  description: 'Explore the Earth in full 3D with geodesic flight arcs, terrain telemetry, and destination dossiers.',
};

function GlobeContent({ searchParams }: { searchParams?: { destination?: string } }) {
  return (
    <ThreeGlobeExplorer
      initialDestinationId={searchParams?.destination}
    />
  );
}

export default async function GlobePage(props: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#050814] flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-aurora border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-aurora animate-pulse">Initializing 3D Orbital Earth...</p>
        </div>
      }
    >
      <GlobeContent searchParams={searchParams} />
    </Suspense>
  );
}
