"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] pt-8 pb-8 px-10">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        <Link href="/" className="font-['Instrument_Serif','serif'] text-base text-white no-underline">
          Cardfoi
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/andro" className="text-[13px] text-[#9a9a97] hover:text-white no-underline">
            Sample card
          </Link>
          <Link href="https://github.com/androdotdev/cardfoi" target="_blank" className="text-[13px] text-[#9a9a97] hover:text-white no-underline">
            GitHub
          </Link>
        </div>
        <span className="text-[12px] text-[#5c5c5a]">
          © 2026 Cardfoi. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
