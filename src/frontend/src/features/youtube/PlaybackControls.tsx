import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import type { PlayerState } from './useYouTubeIFramePlayer';

interface PlaybackControlsProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onMute: () => void;
  onUnmute: () => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
}

export function PlaybackControls({
  playerState,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
  onMute,
  onUnmute,
  onVolumeChange,
  onPlaybackRateChange,
}: PlaybackControlsProps) {
  const { isReady, isMuted, volume, playbackRate, currentTime, duration } = playerState;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={([value]) => {
                // This would need to be wired to seekTo
              }}
              disabled={!isReady}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onSeekBackward}
              disabled={!isReady}
              title="Seek backward 10 seconds"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={onPlay}
              disabled={!isReady}
              title="Play"
              className="h-12 w-12"
            >
              <Play className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={onPause}
              disabled={!isReady}
              title="Pause"
              className="h-12 w-12"
            >
              <Pause className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onSeekForward}
              disabled={!isReady}
              title="Seek forward 10 seconds"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume and Speed Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isMuted ? onUnmute : onMute}
                  disabled={!isReady}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => onVolumeChange(value)}
                  disabled={!isReady}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.round(isMuted ? 0 : volume)}%
                </span>
              </div>
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Speed:
                </span>
                <Select
                  value={playbackRate.toString()}
                  onValueChange={(value) => onPlaybackRateChange(parseFloat(value))}
                  disabled={!isReady}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">0.25x</SelectItem>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x (Normal)</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="1.75">1.75x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
