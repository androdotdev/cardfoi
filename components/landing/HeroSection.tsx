"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const CardMockup = dynamic(() => import("@/components/landing/CardMockup"), { ssr: false });

export default function HeroSection() {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16 pt-32 px-4 sm:px-6 lg:px-10 max-w-[1200px] mx-auto">
      <div className="animate-[fadeUp_0.6s_ease_both]">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.08em] uppercase text-[#1a7a52] bg-[#e8f5ef] px-3 py-1 rounded-full mb-6 animate-[fadeUp_0.6s_ease_0s_both]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1a7a52]" />
          Free for developers
        </div>
        <h1 className="font-['Instrument_Serif','serif'] text-[clamp(2.8rem,5vw,4.2rem)] leading-[1.08] tracking-[-0.02em] text-[#0a0a0a] mb-6 animate-[fadeUp_0.6s_ease_0.1s_both]">
          Your work,<br />
          <em className="not-italic text-[#9a9a97]">shareable</em><br />
          in seconds.
        </h1>
        <p className="text-base text-[#5c5c5a] leading-[1.7] max-w-[420px] mb-10 animate-[fadeUp_0.6s_ease_0.2s_both]">
          Build a public profile card with your tech stack, projects, and contact details. One link. No portfolio site needed.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 animate-[fadeUp_0.6s_ease_0.35s_both]">
          <Link
            href="/dashboard"
            className="bg-[#0a0a0a] text-white text-base px-6 py-2.5 rounded-full font-medium no-underline inline-flex items-center gap-2"
          >
            Create your card
          </Link>
          <Link
            href="/andro"
            className="border border-[#d4d4d2] text-[#0a0a0a] text-base px-6 py-2.5 rounded-full font-medium hover:bg-[#f5f5f3] no-underline inline-flex items-center gap-2"
          >
            View sample
          </Link>
        </div>
        <p className="text-[10px] text-[#9a9a97] mt-4 animate-[fadeUp_0.6s_ease_0.5s_both]">
          No credit card required &nbsp;·&nbsp; Takes 2 minutes
        </p>
      </div>

      <div className="hidden lg:flex justify-center items-center relative animate-[fadeUp_0.6s_ease_0.2s_both]">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,#e8f5ef_0%,transparent_70%)]" />
        <CardMockup />
      </div>
    </section>
  );
}
