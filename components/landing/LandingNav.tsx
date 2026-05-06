"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 bg-[#fafaf8]/85 backdrop-blur-md border-b border-[#ebebea]">
      <Link href="/" className="font-['Instrument_Serif','serif'] text-lg text-[#0a0a0a] no-underline">
        Cardfoi
      </Link>

      {/* Desktop menu */}
      <div className="hidden lg:flex items-center gap-8">
        <Link href="#features" className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline">
          Features
        </Link>
        <Link href="#how" className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline">
          How it works
        </Link>
        <Link href="https://github.com/androdotdev/cardfoi" target="_blank" className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline">
          GitHub
        </Link>
        <Link href="/dashboard" className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline px-[1.2rem] py-2 border border-[#d4d4d2] rounded-full hover:bg-[#f5f5f3]">
          Sign in
        </Link>
        <Link href="/dashboard" className="bg-[#0a0a0a] text-white text-sm px-[1.2rem] py-2 rounded-full font-medium no-underline">
          Create card →
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span className={`block w-5 h-0.5 bg-[#0a0a0a] transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-[#0a0a0a] transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-[#0a0a0a] transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#fafaf8]/95 backdrop-blur-md border-b border-[#ebebea] lg:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline py-2"
            >
              Features
            </Link>
            <Link
              href="#how"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline py-2"
            >
              How it works
            </Link>
            <Link
              href="https://github.com/androdotdev/cardfoi"
              target="_blank"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline py-2"
            >
              GitHub
            </Link>
            <hr className="border-[#ebebea]" />
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm text-[#5c5c5a] hover:text-[#0a0a0a] no-underline py-2"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="bg-[#0a0a0a] text-white text-sm px-4 py-2 rounded-full font-medium no-underline text-center"
            >
              Create card →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
