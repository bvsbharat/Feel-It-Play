import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, ExternalLink, ListMusic, X, Music2 } from 'lucide-react';
// @ts-ignore
import bgImage from './assets/images/south_indian_temple_flat_1786238519827.jpg';

const getThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

const PLAYLIST = [
  {
    id: "R-bwYbOExt8",
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
  },
  {
    id: "5iXR2sBWkFU",
    title: "Vishnu Sahasranamam",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("5iXR2sBWkFU")
  },
  {
    id: "K2Fqx3_T01A",
    title: "Mahadeva Shambho",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("K2Fqx3_T01A")
  },
  {
    id: "xoJmNpJiSMw",
    title: "Hanuman Chalisa",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("xoJmNpJiSMw")
  },
  {
    id: "AJ3Lm2n-BTs",
    title: "Gayatri Mantra",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("AJ3Lm2n-BTs")
  },
  {
    id: "7IpStscnxjc",
    title: "Devi Stotram – Mahishasura Mardini",
    artist: "M.S. Subbulakshmi",
    art: getThumbnail("7IpStscnxjc")
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

  // Carry autoplay intent across track switches via a ref
  const shouldAutoplayRef = useRef(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

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

  useEffect(() => {
    if (!player || !isPlaying) return;
    const interval = setInterval(async () => {
      try {
        const currentTime = await player.getCurrentTime();
        setProgress(currentTime);
      } catch (_) {}
    }, 1000);
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  const onReady = (event: any) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    setProgress(0);
    if (shouldAutoplayRef.current) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event: any) => {
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());
    } else if (event.data === 2 || event.data === -1) {
      setIsPlaying(false);
    }
    // ENDED → advance to next track
    if (event.data === 0) {
      shouldAutoplayRef.current = true;
      setCurrentTrackIndex(prev => (prev + 1) % PLAYLIST.length);
    }
  };

  const handlePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      shouldAutoplayRef.current = false;
      player.pauseVideo();
    } else {
      shouldAutoplayRef.current = true;
      player.playVideo();
    }
  };

  const handleNext = () => {
    shouldAutoplayRef.current = isPlaying;
    setIsPlaying(false);
    setCurrentTrackIndex(prev => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    shouldAutoplayRef.current = isPlaying;
    setIsPlaying(false);
    setCurrentTrackIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleSelectTrack = (index: number) => {
    shouldAutoplayRef.current = true;
    setIsPlaying(false);
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
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
    if (player) player.seekTo(newTime, true);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-zinc-900"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Hidden YouTube Player — key forces full remount on track change */}
      <div className="hidden">
        <YouTube
          key={currentTrack.id}
          videoId={currentTrack.id}
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
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">▶</span>
            YT Music <ExternalLink size={12} className="ml-0.5" />
          </a>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-24 md:top-32 w-full text-center z-10 drop-shadow-2xl px-4">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider font-serif"
          style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        >
          सुप्रभातम्
        </h1>
      </div>

      {/* Bottom Container */}
      <div className="absolute bottom-8 md:bottom-10 w-full flex flex-col items-center gap-6 px-4">
        {/* Player Bar */}
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
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors p-2">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
        </div>

        <p className="text-white/60 text-sm md:text-base font-light tracking-[0.3em] uppercase drop-shadow-md">
          Morning Chants
        </p>
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
