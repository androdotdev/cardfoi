import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#283321] px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 border-b border-white/15 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bdc8ad]">Make your work easier to find</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl tracking-[-0.035em] sm:text-4xl">Your work, ready to share in an instant.</h2>
          </div>
          <a href="https://cardfoi.vercel.app/dashboard" className="inline-flex w-fit items-center gap-3 rounded-full bg-[#f8f8f5] px-5 py-3 text-xs font-semibold text-[#283321] transition hover:bg-white">Make your card <span aria-hidden="true">↗</span></a>
        </div>
        <div className="flex flex-col gap-4 pt-6 text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-white"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 font-serif text-base">c</span> cardfoi</Link>
          <p>A little page for the things you make.</p>
          <a href="https://github.com/androdotdev/cardfoi" target="_blank" rel="noreferrer" className="transition hover:text-white">Built in the open <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </footer>
  );
}
