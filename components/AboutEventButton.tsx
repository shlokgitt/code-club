"use client";

export default function AboutEventButton({ description }: { description: string }) {
  function handleClick() {
    // Trigger background music on first interaction
    window.dispatchEvent(new CustomEvent("play-music"));
    alert(description);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded border border-accent px-4 py-2.5 font-mono text-sm font-semibold text-accent transition hover:bg-accent hover:text-black"
    >
      about the event
    </button>
  );
}
