import { Card, CardContent } from '@/components/ui/card';
import { useYouTubeIFramePlayer } from './useYouTubeIFramePlayer';
import { PlaybackControls } from './PlaybackControls';

interface YouTubeEmbedProps {
  videoId: string;
}

export function YouTubeEmbed({ videoId }: YouTubeEmbedProps) {
  const {
    playerState,
    play,
    pause,
    seekTo,
    mute,
    unmute,
    setVolume,
    setPlaybackRate,
    playerRef,
  } = useYouTubeIFramePlayer(videoId);

  const handleSeekBackward = () => {
    seekTo(playerState.currentTime - 10);
  };

  const handleSeekForward = () => {
    seekTo(playerState.currentTime + 10);
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <div
              ref={playerRef}
              className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Playback Controls */}
      <PlaybackControls
        playerState={playerState}
        onPlay={play}
        onPause={pause}
        onSeekBackward={handleSeekBackward}
        onSeekForward={handleSeekForward}
        onMute={mute}
        onUnmute={unmute}
        onVolumeChange={setVolume}
        onPlaybackRateChange={setPlaybackRate}
      />
    </div>
  );
}
