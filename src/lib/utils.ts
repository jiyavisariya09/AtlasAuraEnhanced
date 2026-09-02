import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const AVATAR_MAP: Record<string, string> = {
  'TravelNewbie': '/avatars/avatar-1.jpg',
  'SoloWanderer': '/avatars/avatar-2.jpg',
  'OffPathTraveler': '/avatars/avatar-3.jpg',
  'SakuraExpert': '/avatars/avatar-4.jpg',
  'JapanLover': '/avatars/avatar-5.jpg',
  'AdventureAnna': '/avatars/avatar-6.jpg',
  'NordicNomad': '/avatars/avatar-7.jpg',
  'Sarah Chen': '/avatars/avatar-sarah.jpg',
  'Marco Rossi': '/avatars/avatar-marco.jpg',
  'Emma Wilson': '/avatars/avatar-1.jpg',
  'David Park': '/avatars/avatar-3.jpg',
  'Alex Thompson': '/avatars/avatar-7.jpg',
  'Lisa Anderson': '/avatars/avatar-lisa.jpg',
  'You': '/avatars/avatar-default.jpg',
}

export function getAuthorAvatar(author?: string, customAvatar?: string): string {
  if (customAvatar) return customAvatar;
  if (author && AVATAR_MAP[author]) return AVATAR_MAP[author];
  return '/avatars/avatar-default.jpg';
}

const COUNTRY_IMAGE_MAP: Record<string, string> = {
  'Japan': '/memories/japan.jpg',
  'Morocco': '/memories/morocco.jpg',
  'Norway': '/memories/norway.jpg',
  'Indonesia': '/memories/indonesia.jpg',
  'Greece': '/memories/greece.jpg',
  'Iceland': '/memories/iceland.jpg',
  'Peru': '/memories/peru.jpg',
  'Switzerland': '/memories/switzerland.jpg',
};

export function getPinImage(pin: { image?: string; country?: string }): string {
  if (pin.image) return pin.image;
  if (pin.country && COUNTRY_IMAGE_MAP[pin.country]) return COUNTRY_IMAGE_MAP[pin.country];
  return '/memories/default.jpg';
}

export function smoothScrollTo(target: string, e?: React.MouseEvent) {
  if (typeof window === 'undefined') return;
  const hash = target.includes('#') ? target.substring(target.indexOf('#')) : '';
  if (!hash) return;

  // If on same page
  const currentPath = window.location.pathname;
  const targetPath = target.startsWith('/#') ? '/' : target.split('#')[0];
  
  if (!targetPath || targetPath === currentPath) {
    if (e) e.preventDefault();
    const element = document.querySelector(hash);
    if (element) {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(element, {
          offset: -20,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        window.history.pushState(null, '', hash);
        return;
      }

      // Fallback
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', hash);
    }
  }
}

/**
 * Cinematic rAF scroll to any absolute Y position (e.g. 0 for back-to-top).
 * Shares the same easing curve as smoothScrollTo so every on-page scroll
 * feels consistent.
 */
export function smoothScrollToPosition(targetY: number) {
  if (typeof window === 'undefined') return;
  const lenis = (window as any).lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(targetY, {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}

export function smoothScrollToTop() {
  smoothScrollToPosition(0);
}
