"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [hasSource, setHasSource] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    // Check if the audio file actually exists before trying to play
    fetch("/audio/theme.mp3", { method: "HEAD" })
      .then((res) => {
        if (!res.ok) return; // file doesn't exist — stay hidden
        setHasSource(true);
        a.volume = 0.35;
        a.play()
          .then(() => setPlaying(true))
          .catch(() => setNeedsTap(true));
      })
      .catch(() => {}); // network error — stay hidden
  }, []);

  useEffect(() => {
    function handlePlayMusic() {
      const a = audioRef.current;
      if (!a || playing || !hasSource) return;
      a.play().then(() => {
        setPlaying(true);
        setNeedsTap(false);
      }).catch(() => {});
    }
    window.addEventListener("play-music", handlePlayMusic);
    return () => window.removeEventListener("play-music", handlePlayMusic);
  }, [playing, hasSource]);

  function toggle() {
    const a = audioRef.current;
    if (!a || !hasSource) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => {
        setPlaying(true);
        setNeedsTap(false);
      }).catch(() => {});
    }
  }

  // Don't render the button at all if there's no audio file
  if (!hasSource) return <audio ref={audioRef} src="/audio/theme.mp3" preload="none" />;

  return (
    <>
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        className="fixed bottom-20 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel font-mono text-sm text-ink shadow-lg transition hover:border-accent sm:bottom-5"
      >
        {playing ? "🔊" : needsTap ? "🎵" : "🔇"}
      </button>
    </>
  );
}
