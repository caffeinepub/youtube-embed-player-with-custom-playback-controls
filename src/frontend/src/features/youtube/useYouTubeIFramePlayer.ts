import { useEffect, useRef, useState, useCallback } from 'react';

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface PlayerState {
  isReady: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  currentTime: number;
  duration: number;
}

export interface UseYouTubePlayerReturn {
  playerState: PlayerState;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  mute: () => void;
  unmute: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  playerRef: React.RefObject<HTMLDivElement | null>;
}

export function useYouTubeIFramePlayer(videoId: string): UseYouTubePlayerReturn {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isReady: false,
    isMuted: false,
    volume: 100,
    playbackRate: 1,
    currentTime: 0,
    duration: 0,
  });

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Initialize player
  useEffect(() => {
    if (!playerRef.current || !videoId) return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      // Destroy existing player
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }

      ytPlayerRef.current = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            const player = event.target;
            setPlayerState((prev) => ({
              ...prev,
              isReady: true,
              isMuted: player.isMuted(),
              volume: player.getVolume(),
              playbackRate: player.getPlaybackRate(),
              duration: player.getDuration(),
            }));
          },
          onStateChange: (event: any) => {
            const player = event.target;
            setPlayerState((prev) => ({
              ...prev,
              currentTime: player.getCurrentTime(),
              duration: player.getDuration(),
            }));
          },
        },
      });
    };

    initPlayer();

    return () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
        ytPlayerRef.current = null;
      }
    };
  }, [videoId]);

  // Update current time periodically
  useEffect(() => {
    if (!playerState.isReady) return;

    const interval = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        const currentTime = ytPlayerRef.current.getCurrentTime();
        const duration = ytPlayerRef.current.getDuration();
        setPlayerState((prev) => ({
          ...prev,
          currentTime,
          duration,
        }));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [playerState.isReady]);

  const play = useCallback(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.playVideo) {
      ytPlayerRef.current.playVideo();
    }
  }, []);

  const pause = useCallback(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
      ytPlayerRef.current.pauseVideo();
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      const clampedSeconds = Math.max(0, Math.min(seconds, playerState.duration));
      ytPlayerRef.current.seekTo(clampedSeconds, true);
    }
  }, [playerState.duration]);

  const mute = useCallback(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.mute) {
      ytPlayerRef.current.mute();
      setPlayerState((prev) => ({ ...prev, isMuted: true }));
    }
  }, []);

  const unmute = useCallback(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.unMute) {
      ytPlayerRef.current.unMute();
      setPlayerState((prev) => ({ ...prev, isMuted: false }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      const clampedVolume = Math.max(0, Math.min(100, volume));
      ytPlayerRef.current.setVolume(clampedVolume);
      setPlayerState((prev) => ({ ...prev, volume: clampedVolume }));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (ytPlayerRef.current && ytPlayerRef.current.setPlaybackRate) {
      ytPlayerRef.current.setPlaybackRate(rate);
      setPlayerState((prev) => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  return {
    playerState,
    play,
    pause,
    seekTo,
    mute,
    unmute,
    setVolume,
    setPlaybackRate,
    playerRef,
  };
}
