import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, ExternalLink } from 'lucide-react';
// @ts-ignore - Image might not be typed
import bgImage from './assets/images/south_indian_morning_1786237202263.jpg';

// Fallback image for album art
const ALBUM_ART = "https://images.unsplash.com/photo-1601662528567-526cd06f3647?q=80&w=400&auto=format&fit=crop";

const PLAYLIST = [
  {
    id: "R-bwYbOExt8", // Venkateswara Suprabhatam track ID
    title: "Sri Venkateswara Suprabhatam",
    artist: "M.S. Subbulakshmi",
    art: ALBUM_ART
  },
  {
    id: "g7B1PZ1Gg6s", 
    title: "Kurai Ondrum Illai",
    artist: "M.S. Subbulakshmi",
    art: ALBUM_ART
  },
  {
    id: "t_3F3Q22hE0",
    title: "Bhavayami Gopalabalam",
    artist: "M.S. Subbulakshmi",
    art: ALBUM_ART
  }
];

export default function App() {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState<any>(null);

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
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start text-white/90 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span>{currentTimeStr || '6:00 am'}</span>
        </div>

        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>108 online</span>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
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

      {/* Center Typography */}
      <div className="text-center z-10 drop-shadow-2xl">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider mb-2 font-serif" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>
          सुप्रभातम्
        </h1>
        <p className="text-white/80 text-xl md:text-2xl font-light tracking-[0.2em] uppercase mt-4">
          Morning Chants
        </p>
      </div>

      {/* Player Bar */}
      <div className="absolute bottom-8 md:bottom-12 w-[90%] max-w-2xl bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex items-center gap-4 sm:gap-6 shadow-2xl">
        
        {/* Album Art with spinning animation when playing */}
        <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg border border-white/20">
          <img 
            src={currentTrack.art} 
            alt="Album Art" 
            className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`} 
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
    </div>
  );
}
