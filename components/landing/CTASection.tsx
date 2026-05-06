"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-[#0a0a0a] pt-20 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="font-['Instrument_Serif','serif'] text-[clamp(1.8rem,3vw,2.5rem)] text-white mb-4">
          Your card is one signup away.
        </h2>
        <p className="text-[15px] text-[#9a9a97] leading-[1.6] mb-8">
          Built by a developer, for developers. Free to use. Open source.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/dashboard"
            className="bg-white text-[#0a0a0a] text-base px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-gray-100 no-underline"
          >
            Create your card →
          </Link>
          <Link
            href="https://github.com/androdotdev/cardfoi"
            target="_blank"
            className="bg-transparent text-white text-base px-8 py-3 rounded-lg font-medium border border-white/20 hover:border-white/40 no-underline"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
