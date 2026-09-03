'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface SeamlessHeroVideoProps {
  src: string;
  className?: string;
  playbackRate?: number;
  /** Whether this video's layer is currently visible / active */
  isActive?: boolean;
  /** Fires once video begins playing or has decoded frames */
  onPlaying?: () => void;
  /** Fires ONLY if video source genuinely cannot be found or loaded (e.g. 404) */
  onError?: () => void;
}

export default function SeamlessHeroVideo({
  src,
  className = '',
  playbackRate = 0.75,
  isActive = true,
  onPlaying,
  onError,
}: SeamlessHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const hasPlayedRef = useRef(false);
  const retryCountRef = useRef(0);

  const handlePlaySuccess = useCallback(() => {
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      setIsReady(true);
      onPlaying?.();
    }
  }, [onPlaying]);

  // Main playback lifecycle and error handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;
    let initialTimeout: NodeJS.Timeout | null = null;

    // Reset verification for new source
    hasPlayedRef.current = false;
    retryCountRef.current = 0;
    setIsReady(false);

    video.playbackRate = playbackRate;

    const onPlayingEvent = () => {
      if (initialTimeout) clearTimeout(initialTimeout);
      handlePlaySuccess();
    };

    const onLoadedData = () => {
      video.playbackRate = playbackRate;
      if (video.currentTime > 0 || !video.paused) {
        handlePlaySuccess();
      }
    };

    const handleVideoError = () => {
      // If the video has already successfully loaded and played, NEVER fall back to image.
      // Transient decode or network glitches should be recovered, not downgraded.
      if (hasPlayedRef.current) {
        console.warn('[HeroVideo] Transient playback disruption encountered. Recovering stream...');
        try {
          video.currentTime = 0;
          video.play().catch(() => {});
        } catch {
          /* recovery attempt */
        }
        return;
      }

      // Initial load failure — verify if genuine 404 / unsupported source
      const err = video.error;
      const isNotFoundOrUnsupported = err && err.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;

      if (isNotFoundOrUnsupported) {
        // Source not found or format unplayable: trigger fallback
        if (initialTimeout) clearTimeout(initialTimeout);
        onError?.();
      } else if (retryCountRef.current < 2) {
        // Transient network retry
        retryCountRef.current += 1;
        setTimeout(() => {
          if (!isMounted || hasPlayedRef.current) return;
          video.load();
          video.play().catch(() => {});
        }, 800);
      } else {
        if (initialTimeout) clearTimeout(initialTimeout);
        onError?.();
      }
    };

    video.addEventListener('playing', onPlayingEvent);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onLoadedData);
    video.addEventListener('error', handleVideoError);

    // Initial timeout (8s): Only triggers fallback if video completely failed to connect/buffer
    initialTimeout = setTimeout(() => {
      if (isMounted && !hasPlayedRef.current) {
        // If readyState is 0 (HAVE_NOTHING) after 8s, server cannot be reached
        if (video.readyState === 0) {
          onError?.();
        }
      }
    }, 8000);

    // Initial play attempt if active
    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isMounted) {
              video.playbackRate = playbackRate;
              handlePlaySuccess();
            }
          })
          .catch((err) => {
            // AbortError is normal when pause() interrupts play() (e.g. fast scroll or tab switch).
            // Do NOT trigger fallback for AbortError!
            if (err.name === 'AbortError') return;
            // On autoplay block (rare for muted inline videos), wait for user gesture without showing image
            console.debug('[HeroVideo] Autoplay policy deferred playback');
          });
      }
    }

    return () => {
      isMounted = false;
      if (initialTimeout) clearTimeout(initialTimeout);
      video.removeEventListener('playing', onPlayingEvent);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplay', onLoadedData);
      video.removeEventListener('error', handleVideoError);
    };
  }, [src, playbackRate, handlePlaySuccess, onError, isActive]);

  // Synchronize play/pause with isActive to conserve hardware video decoders
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.playbackRate = playbackRate;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== 'AbortError') {
            console.debug('[HeroVideo] Play activation deferred:', err.message);
          }
        });
      }
    } else {
      video.pause();
    }
  }, [isActive, playbackRate]);

  // Pause when scrolled offscreen or when page is hidden to save GPU/battery
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else if (isActive) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isActive && !document.hidden) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    if (video.parentElement) {
      observer.observe(video.parentElement);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, [isActive]);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-transparent ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          opacity: isReady ? 1 : 0,
        }}
        className="absolute inset-0 w-full h-full object-cover z-[1] transform-gpu transition-opacity duration-700 ease-out"
      />
    </div>
  );
}
