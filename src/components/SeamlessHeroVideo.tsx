'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface SeamlessHeroVideoProps {
  src: string;
  className?: string;
  crossfadeDuration?: number;
  playbackRate?: number;
  /** Fires once video A begins playing successfully */
  onPlaying?: () => void;
  /** Fires if video fails to load or cannot autoplay within timeout */
  onError?: () => void;
}

export default function SeamlessHeroVideo({
  src,
  className = '',
  crossfadeDuration = 1.4,
  playbackRate = 0.75,
  onPlaying,
  onError,
}: SeamlessHeroVideoProps) {
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);
  const [bOpacity, setBOpacity] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeRef = useRef<'A' | 'B'>('A');
  const transitioningRef = useRef(false);
  const playFiredRef = useRef(false);

  const handlePlaySuccess = useCallback(() => {
    if (!playFiredRef.current) {
      playFiredRef.current = true;
      setIsPlaying(true);
      onPlaying?.();
    }
  }, [onPlaying]);

  useEffect(() => {
    const vA = videoA.current;
    const vB = videoB.current;
    if (!vA || !vB) return;

    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;

    // Apply cinematic playback rate
    vA.playbackRate = playbackRate;
    vB.playbackRate = playbackRate;

    // Timeout: if video hasn't started playing within 4 seconds, signal fallback
    fallbackTimeout = setTimeout(() => {
      if (isMounted && !playFiredRef.current) {
        onError?.();
      }
    }, 4000);

    const onPlayingA = () => {
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      handlePlaySuccess();
    };

    const onErrorA = () => {
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      onError?.();
    };

    vA.addEventListener('playing', onPlayingA);
    vA.addEventListener('error', onErrorA);

    // If already playing
    if (!vA.paused && vA.currentTime > 0) {
      handlePlaySuccess();
    }

    // Start Player A
    vA.play()
      .then(() => {
        if (vA) vA.playbackRate = playbackRate;
        handlePlaySuccess();
      })
      .catch(() => {
        // Autoplay policy or error: trigger error handler
        onErrorA();
      });

    const onTimeUpdateA = () => {
      if (!isMounted || activeRef.current !== 'A' || transitioningRef.current) return;
      if (vA.duration && vA.currentTime >= vA.duration - crossfadeDuration) {
        transitioningRef.current = true;

        vB.preload = 'auto';
        vB.currentTime = 0;
        vB.playbackRate = playbackRate;
        vB.play()
          .then(() => {
            if (vB) vB.playbackRate = playbackRate;
          })
          .catch(() => {});

        setBOpacity(1);

        timer = setTimeout(() => {
          if (!isMounted) return;
          activeRef.current = 'B';
          vA.pause();
          vA.currentTime = 0;
          transitioningRef.current = false;
        }, crossfadeDuration * 1000);
      }
    };

    const onTimeUpdateB = () => {
      if (!isMounted || activeRef.current !== 'B' || transitioningRef.current) return;
      if (vB.duration && vB.currentTime >= vB.duration - crossfadeDuration) {
        transitioningRef.current = true;

        vA.currentTime = 0;
        vA.playbackRate = playbackRate;
        vA.play()
          .then(() => {
            if (vA) vA.playbackRate = playbackRate;
          })
          .catch(() => {});

        setBOpacity(0);

        timer = setTimeout(() => {
          if (!isMounted) return;
          activeRef.current = 'A';
          vB.pause();
          vB.currentTime = 0;
          transitioningRef.current = false;
        }, crossfadeDuration * 1000);
      }
    };

    vA.addEventListener('timeupdate', onTimeUpdateA);
    vB.addEventListener('timeupdate', onTimeUpdateB);

    // Pause both players when scrolled far away to save CPU/GPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (activeRef.current === 'A') {
            vA.playbackRate = playbackRate;
            vA.play().catch(() => {});
          } else {
            vB.playbackRate = playbackRate;
            vB.play().catch(() => {});
          }
        } else {
          vA.pause();
          vB.pause();
        }
      },
      { threshold: 0.05 }
    );

    if (vA.parentElement) {
      observer.observe(vA.parentElement);
    }

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      vA.removeEventListener('playing', onPlayingA);
      vA.removeEventListener('error', onErrorA);
      vA.removeEventListener('timeupdate', onTimeUpdateA);
      vB.removeEventListener('timeupdate', onTimeUpdateB);
      observer.disconnect();
    };
  }, [src, crossfadeDuration, playbackRate, handlePlaySuccess, onError]);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-transparent ${className}`}
    >
      {/* Base Layer — Player A (eagerly loaded, fades in smoothly on play) */}
      <video
        ref={videoA}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ opacity: isPlaying ? 1 : 0 }}
        className="absolute inset-0 w-full h-full object-cover z-[1] transform-gpu transition-opacity duration-700 ease-out"
      />

      {/* Overlay Layer — Player B (lazy-loaded, crossfades near loop boundary) */}
      <video
        ref={videoB}
        src={src}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{
          opacity: isPlaying ? bOpacity : 0,
          transition: `opacity ${crossfadeDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        className="absolute inset-0 w-full h-full object-cover z-[2] will-change-opacity"
      />
    </div>
  );
}
