"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function MusicPlayer({
  url,
  accentColor,
  textColor,
  cardBg,
}: {
  url: string;
  accentColor: string;
  textColor: string;
  cardBg: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function onTimeUpdate() {
      if (audio) setProgress(audio.currentTime);
    }
    function onLoadedMetadata() {
      if (audio) setDuration(audio.duration);
    }
    function onEnded() {
      setPlaying(false);
      setProgress(0);
    }

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setProgress(time);
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  }

  function formatTime(s: number) {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-full w-full max-w-xs mx-auto"
      style={{ backgroundColor: cardBg, backdropFilter: "blur(10px)" }}
    >
      <audio ref={audioRef} src={url} preload="metadata" />

      <button
        onClick={togglePlay}
        className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 transition-transform hover:scale-110"
        style={{ backgroundColor: accentColor }}
      >
        {playing ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-xs tabular-nums" style={{ color: textColor, opacity: 0.6 }}>
          {formatTime(progress)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${accentColor} ${
              duration ? (progress / duration) * 100 : 0
            }%, ${textColor}20 0%)`,
          }}
        />
        <span className="text-xs tabular-nums" style={{ color: textColor, opacity: 0.6 }}>
          {formatTime(duration)}
        </span>
      </div>

      <button
        onClick={toggleMute}
        className="shrink-0 transition-opacity hover:opacity-80"
        style={{ color: textColor, opacity: 0.6 }}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
