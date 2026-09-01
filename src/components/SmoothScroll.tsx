'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

function LenisSyncHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Recalculate dimensions on route change and scroll to top
    lenis.resize();
    lenis.scrollTo(0, { immediate: true });

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

    const timer = setTimeout(() => {
      lenis.resize();
    }, 250);

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      clearTimeout(timer);
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
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.12,
        touchMultiplier: 1.35,
        syncTouch: false,
        autoRaf: true,
      }}
    >
      <LenisSyncHandler />
      {children}
    </ReactLenis>
  );
}
