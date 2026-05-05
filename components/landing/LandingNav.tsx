"use client";

import Link from "next/link";

export default function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 bg-[#fafaf8]/85 backdrop-blur-md border-b border-[#ebebea]">
      <Link href="/" className="font-['Instrument_Serif','serif'] text-lg text-[#0a0a0a] no-underline">
        Cardfoi
      </Link>
      <div className="flex items-center gap-8">
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
    </nav>
  );
}
