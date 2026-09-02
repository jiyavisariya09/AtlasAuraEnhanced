'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

function LenisSyncHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  // Expose global Lenis instance for seamless programmatic scrolling across components
  useEffect(() => {
    if (!lenis) return;
    (window as any).lenis = lenis;

    const handleControl = (e: Event) => {
      const customEvent = e as CustomEvent<{ action: 'stop' | 'start' }>;
      if (customEvent.detail?.action === 'stop') {
        lenis.stop();
      } else if (customEvent.detail?.action === 'start') {
        lenis.start();
      }
    };

    window.addEventListener('atlasaura-lenis-control', handleControl);
    return () => {
      window.removeEventListener('atlasaura-lenis-control', handleControl);
      if ((window as any).lenis === lenis) {
        delete (window as any).lenis;
      }
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    // Recalculate dimensions on route change
    lenis.resize();

    let resizeTimeout: NodeJS.Timeout | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.resize();
      }, 100);
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.3,
        syncTouch: false,
        autoRaf: true,
      }}
    >
      <LenisSyncHandler />
      {children}
    </ReactLenis>
  );
}

