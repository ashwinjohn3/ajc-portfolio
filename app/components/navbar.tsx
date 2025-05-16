"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevents hydration mismatch

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex gap-6">
          <a href="#about" className="hover:underline">About</a>
          <a href="#work" className="hover:underline">Work</a>
          <a href="#projects" className="hover:underline">Projects</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </nav>
  );
}
