# Specification

## Summary
**Goal:** Provide a single-page YouTube embed experience where users can load a video from a URL/video ID and control playback via custom on-page controls.

**Planned changes:**
- Build a single-page UI with an input to paste a YouTube URL or raw video ID, parse/validate it into a videoId, and show clear English errors for invalid input.
- Embed the requested YouTube video on successful validation and only render the player when a valid videoId is provided.
- Implement custom playback controls wired to the embedded player: Play, Pause, Seek -10s, Seek +10s, Mute/Unmute, Volume (0–100), and Playback speed selector (e.g., 0.5x, 1x, 1.5x, 2x), reflecting current state where feasible.
- Apply a minimal, coherent, responsive visual theme (layout, colors, typography, components) consistently across the page.

**User-visible outcome:** Users can paste a YouTube link or video ID to load an embedded video, and then control playback (play/pause, seek, mute, volume, speed) using custom controls in a clean, responsive UI.
