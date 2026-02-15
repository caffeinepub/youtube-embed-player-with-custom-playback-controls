/**
 * Parses a YouTube URL or video ID and extracts the video ID.
 * Supports common YouTube URL formats and raw video IDs.
 */

export interface ParseResult {
  success: boolean;
  videoId?: string;
  error?: string;
}

export function parseYouTubeVideoId(input: string): ParseResult {
  if (!input) {
    return {
      success: false,
      error: 'Please enter a YouTube URL or video ID',
    };
  }

  // Check if it's already a valid 11-character video ID
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (videoIdRegex.test(input)) {
    return {
      success: true,
      videoId: input,
    };
  }

  // Try to parse as URL
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    
    // youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      const videoId = url.searchParams.get('v');
      if (videoId && videoIdRegex.test(videoId)) {
        return {
          success: true,
          videoId,
        };
      }
    }
    
    // youtu.be/VIDEO_ID
    if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
      const videoId = url.pathname.slice(1).split('?')[0];
      if (videoId && videoIdRegex.test(videoId)) {
        return {
          success: true,
          videoId,
        };
      }
    }
    
    // youtube.com/embed/VIDEO_ID
    if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
      const videoId = url.pathname.split('/')[2];
      if (videoId && videoIdRegex.test(videoId)) {
        return {
          success: true,
          videoId,
        };
      }
    }
  } catch (e) {
    // Not a valid URL, continue to error
  }

  return {
    success: false,
    error: 'Invalid YouTube URL or video ID. Please check your input and try again.',
  };
}
