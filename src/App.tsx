import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, ExternalLink, ListMusic, X, Music2 } from 'lucide-react';
// @ts-ignore
import bgImage from './assets/images/south_indian_temple_flat_1786238519827.jpg';

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const getThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

const PLAYLIST = [
  {
    id: "R-bwYbOExt8",
    title: "Sri Venkateswara Suprabhatam",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("R-bwYbOExt8")
  },
  {
    id: "ATflA6WOy0I",
    title: "Vishnu Sahasranamam",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("ATflA6WOy0I")
  },
];

export default function App() {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Use refs so callbacks always see fresh values without stale closures
  const playerRef = useRef<any>(null);
  const currentTrackIndexRef = useRef(0);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Progress ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      try {
        const t = playerRef.current?.getCurrentTime();
        if (typeof t === 'number') setProgress(t);
      } catch (_) {}
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const onReady = (event: any) => {
    playerRef.current = event.target;
  };

  const onStateChange = (event: any) => {
    if (event.data === 1) {
      // playing
      setIsPlaying(true);
      setDuration(event.target.getDuration());
    } else if (event.data === 2) {
      // paused by user — only this state sets isPlaying false
      setIsPlaying(false);
    } else if (event.data === 0) {
      // ended — auto-advance
      const nextIndex = (currentTrackIndexRef.current + 1) % PLAYLIST.length;
      setCurrentTrackIndex(nextIndex);
      setProgress(0);
      setDuration(0);
      playerRef.current?.loadVideoById(PLAYLIST[nextIndex].id);
    }
    // states -1 (unstarted) and 3 (buffering) intentionally ignored
    // so the spinning UI stays consistent while a new track loads
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    setDuration(0);
    if (playerRef.current) {
      // loadVideoById plays immediately; cueVideoById loads without playing
      if (isPlaying) {
        playerRef.current.loadVideoById(PLAYLIST[nextIndex].id);
      } else {
        playerRef.current.cueVideoById(PLAYLIST[nextIndex].id);
      }
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
    setDuration(0);
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.loadVideoById(PLAYLIST[prevIndex].id);
      } else {
        playerRef.current.cueVideoById(PLAYLIST[prevIndex].id);
      }
    }
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    setDuration(0);
    setShowPlaylist(false);
    // Always starts playing when user taps a track in the playlist
    playerRef.current?.loadVideoById(PLAYLIST[index].id);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    playerRef.current?.seekTo(newTime, true);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-zinc-900"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Single persistent YouTube iframe — never remounts, we switch via loadVideoById */}
      <div className="absolute -left-[9999px] -top-[9999px] w-1 h-1 overflow-hidden pointer-events-none" aria-hidden="true">
        <YouTube
          videoId={PLAYLIST[0].id}
          onReady={onReady}
          onStateChange={onStateChange}
          opts={{ playerVars: { autoplay: 0, controls: 0, disablekb: 1 } }}
        />
      </div>

      {/* Top Nav */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start text-white/90 text-sm font-medium z-20">
        <span>{currentTimeStr || '6:00 am'}</span>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <button
            onClick={() => setShowPlaylist(true)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ListMusic size={16} />
            <span>Playlist ({PLAYLIST.length})</span>
          </button>
          <a
            href={`https://music.youtube.com/watch?v=${currentTrack.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <YouTubeIcon />
            YT Music <ExternalLink size={12} className="ml-0.5" />
          </a>
        </div>
      </div>

      {/* Title — ~40% from top */}
      <div className="absolute w-full text-center z-10 drop-shadow-2xl px-4" style={{ top: '40%', transform: 'translateY(-50%)' }}>
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider font-serif"
          style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        >
          सुप्रभातम्
        </h1>
      </div>

      {/* Player Bar */}
      <div className="absolute w-full flex flex-col items-center px-4" style={{ bottom: '11%' }}>
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex items-center gap-4 sm:gap-6 shadow-2xl">

          {/* Album Art */}
          <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg border border-white/20">
            <img
              src={currentTrack.art}
              alt="Album Art"
              className={`w-full h-full object-cover scale-110 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-zinc-900 rounded-full border border-white/30" />
            </div>
          </div>

          {/* Track Info & Seek */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-white font-semibold text-base sm:text-lg truncate">{currentTrack.title}</h3>
            <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-white/50 text-xs w-8 text-right tabular-nums">{formatTime(progress)}</span>
              <div className="flex-1 relative flex items-center h-4 cursor-pointer">
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
                  />
                </div>
              </div>
              <span className="text-white/50 text-xs w-8 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 px-2">
            <button onClick={handlePrev} className="text-white/70 hover:text-white transition-colors p-2">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 flex items-center justify-center bg-white text-zinc-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {isPlaying
                ? <Pause size={24} fill="currentColor" />
                : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors p-2">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          showPlaylist ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-800">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Music2 size={18} />
              Morning Chants Playlist
            </h2>
            <button onClick={() => setShowPlaylist(false)} className="text-white/60 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {PLAYLIST.map((track, index) => (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(index)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  index === currentTrackIndex
                    ? 'bg-white/15 border border-white/20'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                  <img src={track.art} alt={track.title} className="w-full h-full object-cover" />
                  {index === currentTrackIndex && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-lg">▶</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${index === currentTrackIndex ? 'text-white' : 'text-white/80'}`}>
                    {track.title}
                  </p>
                  <p className="text-white/50 text-xs truncate">{track.artist}</p>
                </div>
                <span className="text-white/30 text-xs shrink-0">{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
