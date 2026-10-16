import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f8f5] px-5 py-16 text-[#20241c]">
      <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[#e9eddf] blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#eef0e8] blur-3xl" aria-hidden="true" />
      <section className="relative w-full max-w-xl text-center">
        <Link href="/" className="mx-auto mb-14 flex w-fit items-center gap-2.5" aria-label="Cardfoi home">
          <Image src="/icon.svg" alt="" width={34} height={34} />
          <span className="text-base font-semibold tracking-[-0.04em]">cardfoi</span>
        </Link>
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8a927d]">404 · PAGE NOT FOUND</p>
        <h1 className="mt-5 font-serif text-[clamp(3rem,10vw,5.75rem)] leading-[0.95] tracking-[-0.065em]">
          This card is<br /><span className="italic text-[#82916f]">out of reach.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-[#777b71]">
          That link doesn’t lead to a page. Let’s get you back to your corner of the internet.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#283321] px-6 text-xs font-semibold text-white transition hover:bg-[#3b4a30]">
            Back to Cardfoi <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/dashboard" className="inline-flex h-12 items-center justify-center rounded-full border border-[#dfe1d8] bg-white/70 px-6 text-xs font-semibold text-[#394032] transition hover:bg-white">
            Make your card
          </Link>
        </div>
        <div className="mx-auto mt-14 h-px w-12 bg-[#dce2d2]" />
        <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.18em] text-[#a0a297]">Cardfoi · Instant shareable card</p>
      </section>
    </main>
  );
}
