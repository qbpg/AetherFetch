"use client";

import { useRef, useEffect } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const el = ref.current;
    if (!el) return;

    el.classList.remove("cursor-glow-hidden");

    let raf = 0;
    let x = -400;
    let y = -400;

    function apply() {
      el!.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
      raf = 0;
    }

    function onMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="cursor-glow-hidden pointer-events-none fixed top-0 left-0 z-[80] h-[300px] w-[300px] rounded-full opacity-20 mix-blend-screen"
      style={{
        background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
        willChange: "transform",
        transform: "translate(-400px, -400px)",
      }}
    />
  );
}
