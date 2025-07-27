"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevents hydration mismatch

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-3">
        <div className="font-bold text-lg">
          <button 
            onClick={() => scrollToSection('hero')}
            className="hover:text-blue-600 transition-colors"
          >
            AJC
          </button>
        </div>
        <div className="flex gap-6">
          <button 
            onClick={() => scrollToSection('about')}
            className="hover:text-blue-600 transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('experience')}
            className="hover:text-blue-600 transition-colors"
          >
            Experience
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="hover:text-blue-600 transition-colors"
          >
            Projects
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="hover:text-blue-600 transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
