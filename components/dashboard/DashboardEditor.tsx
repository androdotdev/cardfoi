"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export type DashboardEditorProps = {
  userName: string;
  userEmail: string;
};

type Project = { title: string; description: string };

const looks = [
  { id: "sage", name: "Field notes", color: "#dce5c9", ink: "#34442d" },
  { id: "blue", name: "Blue hour", color: "#d9e5ed", ink: "#304654" },
  { id: "peach", name: "Warm paper", color: "#f0dfd2", ink: "#624638" },
] as const;

export default function DashboardEditor({
  userName,
  userEmail,
}: DashboardEditorProps) {
  const [name, setName] = useState(userName || "Your name");
  const [role, setRole] = useState("Designer · Builder · Curious person");
  const [bio, setBio] = useState("A little about what you do, what you care about, and what you’re making next.");
  const [skills, setSkills] = useState(["Product design", "Writing", "Building things"]);
  const [projects, setProjects] = useState<Project[]>([
    { title: "A project you love", description: "A short note about the work" },
  ]);
  const [look, setLook] = useState<(typeof looks)[number]>(looks[0]);
  const [newSkill, setNewSkill] = useState("");
  const [copied, setCopied] = useState(false);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "Y";

  function addSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = newSkill.trim();
    if (value && !skills.includes(value)) setSkills((current) => [...current, value]);
    setNewSkill("");
  }

  function addProject() {
    setProjects((current) => [...current, { title: "New project", description: "Add a short description" }]);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${name.toLowerCase().trim().replace(/\s+/g, "-") || "your-name"}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#20241c]">
      <header className="sticky top-0 z-20 border-b border-[#e9e9e1] bg-[#f9f9f6]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Cardfoi home">
            <Image src="/icon.svg" alt="" width={30} height={30} />
            <span className="text-[15px] font-semibold tracking-[-0.04em]">cardfoi</span>
            <span className="ml-1 hidden rounded-full border border-[#e5e7de] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#85897f] sm:inline">studio</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <button onClick={copyLink} className="inline-flex h-9 items-center gap-2 rounded-full border border-[#dedfd6] bg-white px-3.5 text-[11px] font-semibold text-[#38432f] transition hover:border-[#abb69b] hover:bg-[#fbfcf8] sm:px-4">
              <span aria-hidden="true">↗</span>{copied ? "Copied" : "Copy card link"}
            </button>
            <div className="hidden h-7 w-px bg-[#e6e7df] sm:block" />
            <div className="flex max-w-[180px] items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7e9df] text-[10px] font-semibold text-[#4a5540]">{initials}</span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-[11px] font-medium">{userName}</span>
                <span className="block truncate text-[10px] text-[#8a8d84]">{userEmail}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-7 sm:pt-11 lg:px-10 lg:pt-14">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78816c]">Your little corner of the internet</p>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] tracking-[-0.055em]">Make it yours<span className="text-[#91a17b]">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#777b71]">Shape your card as you go. What you edit here is what people will see when you share it.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-[#e7e8e0] bg-white/70 px-3.5 py-2 text-[10px] text-[#777c70] sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-[#88a16b]" />
            Draft · updates as you edit
          </div>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-7">
          <section className="overflow-hidden rounded-[26px] border border-[#e6e7df] bg-white shadow-[0_20px_70px_-55px_rgba(37,45,30,0.35)]">
            <div className="flex items-center justify-between border-b border-[#eff0ea] px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-xs font-semibold tracking-tight">Your card</h2>
                <p className="mt-1 text-[10px] text-[#92958c]">Click into any text to make it yours</p>
              </div>
              <span className="rounded-full bg-[#f5f6f1] px-3 py-1.5 font-mono text-[9px] text-[#777d6d]">LIVE PREVIEW</span>
            </div>

            <div className="flex min-h-[620px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#fafbf7_0%,_#f1f2ec_72%)] px-4 py-10 sm:px-8 sm:py-12">
              <article className="w-full max-w-[510px] rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_28px_80px_-36px_rgba(42,49,35,0.3)] sm:p-9" style={{ color: look.ink }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[19px] font-serif text-xl" style={{ backgroundColor: look.color }}>{initials}</div>
                  <span className="mt-1 max-w-[60%] truncate rounded-full bg-[#f6f6f2] px-3 py-2 font-mono text-[9px] text-[#80847b]">cardfoi.me/{name.toLowerCase().trim().replace(/\s+/g, "-") || "your-name"}</span>
                </div>
                <input aria-label="Name on your card" value={name} onChange={(event) => setName(event.target.value)} className="mt-7 block w-full bg-transparent font-serif text-[clamp(2.2rem,6vw,3.4rem)] leading-[1.02] tracking-[-0.055em] outline-none placeholder:text-[#b8b9b2]" placeholder="Your name" />
                <input aria-label="Your role" value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 block w-full bg-transparent text-[11px] font-semibold uppercase tracking-[0.15em] text-[#85897e] outline-none placeholder:text-[#b8b9b2]" placeholder="What do you do?" />
                <textarea aria-label="Short introduction" value={bio} onChange={(event) => setBio(event.target.value)} rows={3} className="mt-4 block w-full resize-none bg-transparent text-sm leading-6 text-[#6e7369] outline-none placeholder:text-[#b8b9b2]" placeholder="A short introduction about you..." />

                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill, index) => <button key={`${skill}-${index}`} onClick={() => setSkills((current) => current.filter((_, skillIndex) => skillIndex !== index))} title="Remove skill" className="rounded-full border border-[#e8e9e3] px-3 py-1.5 text-[10px] text-[#5d6358] transition hover:border-[#d19d8b] hover:text-[#a25f4a]">{skill}<span className="ml-2 text-[#9da096]">×</span></button>)}
                </div>

                <div className="mt-7 border-t border-[#ecece7] pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#82877b]">Selected work</p>
                    <span className="font-mono text-[9px] text-[#a0a297]">{String(projects.length).padStart(2, "0")}</span>
                  </div>
                  <div className="space-y-2">
                    {projects.map((project, index) => <div key={index} className="flex items-center gap-3 rounded-2xl bg-[#f7f8f4] p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm" style={{ backgroundColor: look.color }}>✳</span>
                      <span className="min-w-0 flex-1">
                        <input aria-label={`Project ${index + 1} title`} value={project.title} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} className="block w-full bg-transparent text-xs font-semibold text-[#30352d] outline-none" />
                        <input aria-label={`Project ${index + 1} description`} value={project.description} onChange={(event) => setProjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} className="mt-1 block w-full bg-transparent text-[10px] text-[#85897f] outline-none" />
                      </span>
                      <button aria-label={`Remove ${project.title}`} onClick={() => setProjects((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="px-1 text-sm text-[#a0a297] hover:text-[#a25f4a]">×</button>
                    </div>)}
                    <button onClick={addProject} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#dfe2d8] py-3 text-[10px] font-medium text-[#7b826f] transition hover:border-[#aeb89f] hover:bg-[#fbfcf8]"><span className="text-sm">＋</span> Add a project</button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#ecece7] pt-5">
                  <span className="text-[10px] text-[#85897f]">Say hello</span>
                  <div className="flex gap-2"><span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e8e1] px-2 text-[9px] font-semibold">in</span><span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e8e1] px-2 text-[9px] font-semibold">gh</span><span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e8e1] px-2 text-[9px] font-semibold">✉</span></div>
                </div>
              </article>
            </div>
            <div className="flex flex-col gap-3 border-t border-[#eff0ea] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-[10px] leading-5 text-[#92958c]">Your card is taking shape. Add the details you want people to remember.</p>
              <button onClick={copyLink} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#283321] px-5 text-[11px] font-semibold text-white transition hover:bg-[#3b4a30]">{copied ? "Link copied" : "Share your card"}<span aria-hidden="true">↗</span></button>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7d866f]">Make it yours</p><h2 className="mt-1.5 text-sm font-semibold tracking-tight">A few details go a long way</h2></div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f4ed] text-sm text-[#6e7b5e]">✳</span>
              </div>
              <form onSubmit={addSkill} className="mb-3 flex gap-2">
                <input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} className="h-10 min-w-0 flex-1 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none transition placeholder:text-[#a2a49b] focus:border-[#a9b397]" placeholder="Add a skill or interest" />
                <button className="h-10 w-10 shrink-0 rounded-xl bg-[#283321] text-lg text-white transition hover:bg-[#3b4a30]" aria-label="Add skill">＋</button>
              </form>
              <div className="rounded-2xl bg-[#f7f8f4] px-4 py-3.5">
                <p className="text-[10px] font-semibold text-[#555d4d]">A good card feels like you</p>
                <p className="mt-1.5 text-[10px] leading-5 text-[#85897f]">Start with a clear introduction, then add work or interests you’d enjoy talking about.</p>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7d866f]">The look</p><h2 className="mt-1.5 text-sm font-semibold tracking-tight">Choose a starting point</h2></div>
                <span className="font-mono text-[9px] text-[#a0a297]">01 / 03</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                {looks.map((option, index) => <button key={option.id} onClick={() => setLook(option)} aria-pressed={look.id === option.id} className={`group rounded-2xl border p-2 text-left transition ${look.id === option.id ? "border-[#8d9b7b] bg-[#f8faf5] ring-2 ring-[#e5eadf]" : "border-[#ebebe5] hover:border-[#c9cebf]"}`}>
                  <span className="flex aspect-[0.83] items-end rounded-xl p-2.5" style={{ backgroundColor: option.color }}><span className="h-5 w-5 rounded-full border-2 border-white/75" style={{ backgroundColor: option.ink }} /></span>
                  <span className="mt-2 block truncate text-[9px] font-medium text-[#666b61]">{option.name}</span>
                  <span className="mt-0.5 block text-[8px] text-[#a0a297]">0{index + 1}</span>
                </button>)}
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[#92958c]">More card styles will live here as your collection grows.</p>
            </section>

            <div className="rounded-[24px] bg-[#e9eddf] p-5 sm:p-6">
              <p className="font-serif text-xl tracking-[-0.03em] text-[#343f2b]">One link. A little more you.</p>
              <p className="mt-2 text-[10px] leading-5 text-[#68725c]">Your skills, selected work, and ways to reach you—all on a card that’s easy to share.</p>
              <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-[#536047]"><span className="h-px w-6 bg-[#9eaa8d]" /> CARDfoi · INSTANT SHAREABLE CARD</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
