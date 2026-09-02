'use client';

import { useEffect, useRef } from 'react';

// Global counter to coordinate stacked/nested modals and scroll lock state
let activeModalsCount = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';
let previousTouchAction = '';

function lockBackgroundScroll() {
  if (typeof document === 'undefined') return;

  if (activeModalsCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousTouchAction = document.body.style.touchAction;

    document.documentElement.classList.add('lenis-stopped');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Dispatch event to pause Lenis smooth scroll instances
    window.dispatchEvent(
      new CustomEvent('atlasaura-lenis-control', { detail: { action: 'stop' } })
    );
  }
  activeModalsCount++;
}

function unlockBackgroundScroll() {
  if (typeof document === 'undefined') return;

  activeModalsCount = Math.max(0, activeModalsCount - 1);
  if (activeModalsCount === 0) {
    document.documentElement.classList.remove('lenis-stopped');
    document.documentElement.style.overflow = previousHtmlOverflow;
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.touchAction = previousTouchAction;

    // Dispatch event to resume Lenis smooth scroll instances
    window.dispatchEvent(
      new CustomEvent('atlasaura-lenis-control', { detail: { action: 'start' } })
    );
  }
}

/**
 * Universal hook for dismissible layers and modals:
 * 1. Locks background scroll completely (body, document, and Lenis virtual scroll).
 * 2. Handles Escape key dismissals.
 * 3. Restores focus when closing.
 * 4. Safely stacks when multiple dialogs/layers are open.
 */
export function useModalLayer<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const panelRef = useRef<T | null>(null);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const returnFocusTo = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);

    lockBackgroundScroll();

    panelRef.current?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener('keydown', onKey);
      unlockBackgroundScroll();
      returnFocusTo?.focus?.();
    };
  }, [isOpen]);

  return panelRef;
}

