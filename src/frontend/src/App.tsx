import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { YouTubeEmbed } from './features/youtube/YouTubeEmbed';
import { parseYouTubeVideoId } from './features/youtube/parseYouTubeVideoId';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadVideo = () => {
    setError(null);
    const result = parseYouTubeVideoId(inputValue.trim());
    
    if (result.success) {
      setVideoId(result.videoId || null);
    } else {
      setError(result.error || null);
      setVideoId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoadVideo();
    }
  };

  return (
    <div className="dark min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            YouTube Player
          </h1>
          <p className="text-muted-foreground">
            Embed and control YouTube videos with custom playback controls
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Load Video</CardTitle>
              <CardDescription>
                Enter a YouTube URL or video ID to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... or video ID"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleLoadVideo}
                  className="sm:w-auto w-full"
                >
                  Load Video
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* YouTube Player */}
          {videoId && <YouTubeEmbed videoId={videoId} />}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'youtube-player'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
