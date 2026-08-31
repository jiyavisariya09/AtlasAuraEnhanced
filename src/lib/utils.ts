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
      // Small offset = just enough clearance under the sticky nav.
      // The section has large top padding (section-y), so a small offset
      // means we scroll past that padding and land right at the title.
      const navOffset = 20;
      const startPosition = window.pageYOffset;
      const targetPosition = element.getBoundingClientRect().top + startPosition - navOffset;
      const distance = targetPosition - startPosition;
      
      if (Math.abs(distance) < 5) return;

      // Dynamic duration based on distance to feel cinematic (800ms - 1500ms)
      const duration = Math.min(1500, Math.max(800, Math.sqrt(Math.abs(distance)) * 28));
      let startTime: number | null = null;
      let userCancelled = false;

      const cancelOnInteraction = () => {
        userCancelled = true;
      };

      window.addEventListener('wheel', cancelOnInteraction, { passive: true, once: true });
      window.addEventListener('touchmove', cancelOnInteraction, { passive: true, once: true });

      // Cubic ease-in-out for graceful acceleration and deceleration through sections
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const step = (currentTime: number) => {
        if (userCancelled) return;
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, targetPosition);
          window.history.pushState(null, '', hash);
          window.removeEventListener('wheel', cancelOnInteraction);
          window.removeEventListener('touchmove', cancelOnInteraction);
        }
      };

      requestAnimationFrame(step);
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

  const startPosition = window.pageYOffset;
  const distance = targetY - startPosition;

  if (Math.abs(distance) < 5) return;

  const duration = Math.min(1500, Math.max(800, Math.sqrt(Math.abs(distance)) * 28));
  let startTime: number | null = null;
  let userCancelled = false;

  const cancelOnInteraction = () => {
    userCancelled = true;
  };

  window.addEventListener('wheel', cancelOnInteraction, { passive: true, once: true });
  window.addEventListener('touchmove', cancelOnInteraction, { passive: true, once: true });

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const step = (currentTime: number) => {
    if (userCancelled) return;
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY);
      window.removeEventListener('wheel', cancelOnInteraction);
      window.removeEventListener('touchmove', cancelOnInteraction);
    }
  };

  requestAnimationFrame(step);
}
