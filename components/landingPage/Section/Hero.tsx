import Link from "next/link";
import HeroCard from "@/ui/HeroCard";

const navLinks = [
  { label: "Why Cardfoi", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export default function Hero() {
  return (
    <section className="relative isolate">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[#25291f]" aria-label="Cardfoi home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#283321] font-serif text-lg text-white">c</span>
          cardfoi
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-xs text-[#73786d] transition hover:text-[#25291f]">{link.label}</Link>)}
          <Link href="#how-it-works" className="rounded-full border border-[#dfe1d8] px-4 py-2.5 text-xs font-medium text-[#394032] transition hover:border-[#aeb69f] hover:bg-white">See how it works <span aria-hidden="true">↗</span></Link>
        </nav>
        <a href="#get-started" className="rounded-full bg-[#283321] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#3b4a30] sm:px-5">Make your card <span aria-hidden="true">↗</span></a>
      </header>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-12 lg:pb-32 lg:pt-20">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e3e6dc] bg-white/70 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#5e6d4c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#82965f]" />
            A home for your work
          </p>
          <h1 className="max-w-[700px] font-serif text-[clamp(3.5rem,8vw,6.7rem)] leading-[0.92] tracking-[-0.065em] text-[#20241c]">
            Your work,<br />on one <span className="italic text-[#788663]">shareable card.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-[#73786d] sm:text-lg sm:leading-8">
            Make an instant shareable card for your skills, projects, and links. One page that makes it easy to show what you do.
          </p>
          <div id="get-started" className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#283321] px-6 py-3.5 text-sm font-medium text-white shadow-[0_8px_24px_-12px_rgba(40,51,33,0.7)] transition hover:-translate-y-0.5 hover:bg-[#3b4a30]">
              Create your card <span aria-hidden="true">↗</span>
            </Link>
            <a href="#features" className="inline-flex items-center justify-center rounded-full border border-[#dfe1d8] px-6 py-3.5 text-sm font-medium text-[#394032] transition hover:bg-white">See what you can add</a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-[11px] text-[#85897f]">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="h-6 w-6 rounded-full border-2 border-[#f8f8f5] bg-[#dce5c9]" />
              <span className="h-6 w-6 rounded-full border-2 border-[#f8f8f5] bg-[#e6d8c6]" />
              <span className="h-6 w-6 rounded-full border-2 border-[#f8f8f5] bg-[#d5dddf]" />
            </span>
            For makers, builders, and curious people.
          </div>
        </div>
        <div className="relative px-2 py-5 sm:px-8 lg:px-3">
          <div className="absolute -right-20 top-0 -z-10 h-64 w-64 rounded-full border border-[#e6e9e0]" aria-hidden="true" />
          <div className="absolute -bottom-12 left-0 -z-10 h-40 w-40 rounded-full bg-[#e9eddf]" aria-hidden="true" />
          <HeroCard />
          <p className="mt-8 text-center font-mono text-[10px] tracking-wide text-[#989c91]">ONE PAGE · YOUR STORY · READY WHEN YOU ARE</p>
        </div>
      </div>
    </section>
  );
}
