import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, ExternalLink, ListMusic, X } from 'lucide-react';
// @ts-ignore - Image might not be typed
import bgImage from './assets/images/south_indian_temple_flat_1786238519827.jpg';

// Fallback image for album art
const ALBUM_ART = "https://images.unsplash.com/photo-1601662528567-526cd06f3647?q=80&w=400&auto=format&fit=crop";
const getThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

const PLAYLIST = [
  {
    id: "R-bwYbOExt8", // Venkateswara Suprabhatam track ID
    title: "Sri Venkateswara Suprabhatam",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("R-bwYbOExt8")
  },
  {
    id: "g7B1PZ1Gg6s", 
    title: "Kurai Ondrum Illai",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("g7B1PZ1Gg6s")
  },
  {
    id: "t_3F3Q22hE0",
    title: "Bhavayami Gopalabalam",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("t_3F3Q22hE0")
  }
];

export default function App() {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update progress bar
  useEffect(() => {
    if (!player || !isPlaying) return;
    
    const interval = setInterval(async () => {
      try {
        const currentTime = await player.getCurrentTime();
        setProgress(currentTime);
      } catch (e) {
        // Ignore errors if player is not fully ready
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  const onReady = (event: any) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event: any) => {
    // YT.PlayerState.PLAYING is 1
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(player.getDuration());
    } else {
      setIsPlaying(false);
    }
    
    // YT.PlayerState.ENDED is 0
    if (event.data === 0) {
      handleNext();
    }
  };

  const handlePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    // When changing tracks, we expect the onReady to fire and play if isPlaying was true.
    // We'll let the component re-render with the new video ID.
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (player) {
      player.seekTo(newTime, true);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-zinc-900"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <YouTube 
          videoId={currentTrack.id} 
          onReady={onReady} 
          onStateChange={onStateChange}
          opts={{
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              controls: 0,
              disablekb: 1
            }
          }}
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start text-white/90 text-sm font-medium z-20">
        <div className="flex items-center gap-2">
          <span>{currentTimeStr || '6:00 am'}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <button 
            onClick={() => setShowPlaylist(true)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ListMusic size={16} />
            <span>Playlist</span>
          </button>
          <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
            <span className="w-4 h-4 bg-white text-zinc-900 rounded-full flex items-center justify-center text-[10px]">S</span>
            Spotify <ExternalLink size={12} className="ml-0.5" />
          </a>
          <a 
            href={`https://music.youtube.com/watch?v=${currentTrack.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">▶</span>
            YT Music <ExternalLink size={12} className="ml-0.5" />
          </a>
        </div>
      </div>

      {/* Top Typography */}
      <div className="absolute top-24 md:top-32 w-full text-center z-10 drop-shadow-2xl px-4">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider font-serif" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>
          सुप्रभातम्
        </h1>
      </div>

      {/* Bottom Container */}
      <div className="absolute bottom-8 md:bottom-10 w-full flex flex-col items-center gap-6 px-4">
        {/* Player Bar */}
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex items-center gap-4 sm:gap-6 shadow-2xl">
          
          {/* Album Art with spinning animation when playing */}
          <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg border border-white/20">
            <img 
              src={currentTrack.art} 
              alt="Album Art" 
              className={`w-full h-full object-cover scale-110 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`} 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-zinc-900 rounded-full border border-white/30"></div>
            </div>
          </div>

        {/* Track Info & Progress */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-white font-semibold text-base sm:text-lg truncate">{currentTrack.title}</h3>
          <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
          
          <div className="mt-3 flex items-center gap-3">
            <span className="text-white/50 text-xs w-8 text-right tabular-nums">{formatTime(progress)}</span>
            
            {/* Custom Range Slider */}
            <div className="flex-1 relative group flex items-center h-4 cursor-pointer">
              <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <span className="text-white/50 text-xs w-8 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 px-2">
          <button 
            onClick={handlePrev}
            className="text-white/70 hover:text-white transition-colors p-2"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-12 h-12 flex items-center justify-center bg-white text-zinc-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white/70 hover:text-white transition-colors p-2"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
      </div>
      
      <p className="text-white/60 text-sm md:text-base font-light tracking-[0.3em] uppercase drop-shadow-md">
        Morning Chants
      </p>
    </div>

      {/* Playlist Modal */}
      <div className={`absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${showPlaylist ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-800">
            <h2 className="text-white font-semibold">Morning Playlists</h2>
            <button 
              onClick={() => setShowPlaylist(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {/* Isolate SociableKit Widget in an iframe to catch script errors */}
            <iframe 
              title="YouTube Playlist"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { margin: 0; padding: 0; background: transparent; font-family: sans-serif; color: white; }
                    /* Force dark mode for widget if possible, though SociableKit usually handles it */
                  </style>
                </head>
                <body>
                  <div class="sk-ww-youtube-playlist-videos" data-embed-id="25703856"></div>
                  <script src="https://widgets.sociablekit.com/youtube-playlist-videos/widget.js" defer></script>
                </body>
                </html>
              `}
              className="w-full h-full min-h-[500px]"
              frameBorder="0"
              sandbox="allow-scripts allow-popups allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
