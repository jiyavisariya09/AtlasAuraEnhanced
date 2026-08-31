'use client';

import { useEffect, useRef } from 'react';

/**
 * The behaviour every dismissible layer on the site owes the reader: Escape
 * closes it, the page underneath holds still, and focus moves into the layer
 * and returns to whatever opened it.
 *
 * The AI assistant modal spelt this out by hand and four other overlays — the
 * gem detail, the country detail, the question detail and the ask form — had
 * none of it: no Escape, no scroll lock, and `aria-modal` nowhere. Collecting
 * it here means the next correction reaches all of them rather than the one
 * file being edited.
 *
 * Deliberately *not* a focus trap. Tab can still walk out of the panel and into
 * the page behind, which `aria-modal="true"` tells assistive tech it cannot.
 * Closing that gap properly means enumerating focusable descendants and cycling
 * them, which is a real amount of code with real edge cases; the far larger win
 * is that focus starts inside the dialog and comes back afterwards, which is
 * what this does. Radix's Dialog is already a dependency here if a full trap is
 * ever wanted — these four overlays predate that choice.
 *
 * Returns a ref for the panel element, which needs `tabIndex={-1}`: a plain
 * `div` does not accept focus, so without it the focus() call does nothing.
 */
export function useModalLayer<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const panelRef = useRef<T | null>(null);

  /* Held in a ref so that an inline `onClose={() => setThing(null)}` — a new
     function identity on every parent render — does not tear the effect down
     and rebuild it on each render while the layer is open. */
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const returnFocusTo = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);

    /* Read back rather than assumed to be '': restoring a hard-coded empty
       string would unlock the page while an outer layer is still open. Capturing
       the previous value means stacked layers unwind in the order they opened. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    /* preventScroll because the panel lives inside a `fixed inset-0` layer —
       without it the browser scrolls the document behind to reveal something
       that is already centred on screen. */
    panelRef.current?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus?.();
    };
  }, [isOpen]);

  return panelRef;
}
