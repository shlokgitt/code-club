"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.35;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setNeedsTap(true)); // autoplay blocked — wait for a tap
  }, []);

  useEffect(() => {
    function handlePlayMusic() {
      const a = audioRef.current;
      if (!a || playing) return;
      a.play().then(() => {
        setPlaying(true);
        setNeedsTap(false);
      });
    }
    window.addEventListener("play-music", handlePlayMusic);
    return () => window.removeEventListener("play-music", handlePlayMusic);
  }, [playing]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => {
        setPlaying(true);
        setNeedsTap(false);
      });
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel font-mono text-sm text-ink shadow-lg transition hover:border-accent"
      >
        {playing ? "🔊" : needsTap ? "🎵" : "🔇"}
      </button>
    </>
  );
}
