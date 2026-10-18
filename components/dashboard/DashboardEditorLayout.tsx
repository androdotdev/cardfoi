"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import ProjectAssetUploader from "@/components/dashboard/ProjectAssetUploader";
import type { DashboardBootstrapResponse } from "@/types/project";
import type { ProjectDraft, SocialLinkDraft } from "@/components/dashboard/useDashboardActions";

const looks = [
  { id: "sage", name: "Field notes", color: "#dce5c9", ink: "#34442d" },
  { id: "blue", name: "Blue hour", color: "#d9e5ed", ink: "#304654" },
  { id: "peach", name: "Warm paper", color: "#f0dfd2", ink: "#624638" },
] as const;

type CardActions = { saveCard: () => Promise<void>; addSkill: (event: FormEvent<HTMLFormElement>) => void; addSocial: (event: FormEvent<HTMLFormElement>) => void };
type ProjectActions = { addProject: (event: FormEvent<HTMLFormElement>) => Promise<void>; saveProject: (item: ProjectDraft) => Promise<void>; deleteProject: (id: string) => Promise<void> };

export type DashboardEditorLayoutProps = {
  userName: string; userEmail: string; appUrl: string; workspace: DashboardBootstrapResponse;
  name: string; bio: string; email: string; skills: string[]; projects: ProjectDraft[]; socialLinks: SocialLinkDraft[];
  themeId: (typeof looks)[number]["id"]; selectedProjectId: string; newSkill: string; newProjectTitle: string;
  copied: boolean; saving: boolean; pageError: string; notice: string; socialDraft: SocialLinkDraft;
  setName: Dispatch<SetStateAction<string>>; setBio: Dispatch<SetStateAction<string>>; setEmail: Dispatch<SetStateAction<string>>;
  setSkills: Dispatch<SetStateAction<string[]>>; setProjects: Dispatch<SetStateAction<ProjectDraft[]>>;
  setSocialLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>; setThemeId: Dispatch<SetStateAction<(typeof looks)[number]["id"]>>;
  setSelectedProjectId: Dispatch<SetStateAction<string>>; setNewSkill: Dispatch<SetStateAction<string>>;
  setNewProjectTitle: Dispatch<SetStateAction<string>>; setSocialDraft: Dispatch<SetStateAction<SocialLinkDraft>>;
  cardActions: CardActions; projectActions: ProjectActions; onCopy: () => void;
};

export default function DashboardEditorLayout(props: DashboardEditorLayoutProps) {
  const initials = props.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "Y";
  const look = looks.find((item) => item.id === props.themeId) ?? looks[0];
  const selectedProject = props.projects.find((item) => item.id === props.selectedProjectId) ?? props.projects[0];

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#20241c]">
      <header className="sticky top-0 z-20 border-b border-[#e9e9e1] bg-[#f9f9f6]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Cardfoi home"><Image src="/icon.svg" alt="" width={30} height={30} /><span className="text-[15px] font-semibold tracking-[-0.04em]">cardfoi</span><span className="ml-1 hidden rounded-full border border-[#e5e7de] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#85897f] sm:inline">studio</span></Link>
          <div className="flex items-center gap-3 sm:gap-5"><button type="button" onClick={props.onCopy} className="inline-flex h-9 items-center gap-2 rounded-full border border-[#dedfd6] bg-white px-3.5 text-[11px] font-semibold text-[#38432f] transition hover:border-[#abb69b] sm:px-4"><span aria-hidden="true">↗</span>{props.copied ? "Copied" : "Copy card link"}</button><div className="hidden h-7 w-px bg-[#e6e7df] sm:block" /><div className="flex max-w-[180px] items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7e9df] text-[10px] font-semibold text-[#4a5540]">{initials}</span><span className="hidden min-w-0 sm:block"><span className="block truncate text-[11px] font-medium">{props.userName}</span><span className="block truncate text-[10px] text-[#8a8d84]">{props.userEmail}</span></span></div></div>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-7 sm:pt-11 lg:px-10 lg:pt-14">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78816c]">Your little corner of the internet</p><h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] tracking-[-0.055em]">Make it yours<span className="text-[#91a17b]">.</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#777b71]">Shape your card as you go. Save your changes when you’re ready to share.</p></div><div className="flex items-center gap-2 self-start rounded-full border border-[#e7e8e0] bg-white/70 px-3.5 py-2 text-[10px] text-[#777c70] sm:self-auto"><span className="h-1.5 w-1.5 rounded-full bg-[#88a16b]" />Your saved draft</div></div>
        {(props.pageError || props.notice) && <p role={props.pageError ? "alert" : "status"} className={`mb-4 rounded-2xl px-4 py-3 text-xs ${props.pageError ? "bg-[#f5e7e1] text-[#8d4938]" : "bg-[#e9eddf] text-[#536047]"}`}>{props.pageError || props.notice}</p>}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-7">
          <CardPreview {...props} look={look} initials={initials} />
          <CardSettings {...props} selectedProject={selectedProject} />
        </div>
      </div>
    </main>
  );
}

function CardPreview(props: DashboardEditorLayoutProps & { look: (typeof looks)[number]; initials: string }) {
  const { projects, skills, socialLinks, email, workspace, name, bio, newProjectTitle, selectedProjectId, copied, setName, setBio, setSkills, setProjects, setSelectedProjectId, setNewProjectTitle, projectActions, onCopy, look, initials } = props;
  const cardHost = props.appUrl.replace(/^https?:\/\//, "");
  return (
    <section className="overflow-hidden rounded-[26px] border border-[#e6e7df] bg-white shadow-[0_20px_70px_-55px_rgba(37,45,30,0.35)]">
      <div className="flex items-center justify-between border-b border-[#eff0ea] px-5 py-4 sm:px-7"><div><h2 className="text-xs font-semibold tracking-tight">Your card</h2><p className="mt-1 text-[10px] text-[#92958c]">Changes are saved to your account</p></div><span className="rounded-full bg-[#f5f6f1] px-3 py-1.5 font-mono text-[9px] text-[#777d6d]">LIVE PREVIEW</span></div>
      <div className="flex min-h-[620px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#fafbf7_0%,_#f1f2ec_72%)] px-4 py-10 sm:px-8 sm:py-12">
        <article className="w-full max-w-[510px] rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_28px_80px_-36px_rgba(42,49,35,0.3)] sm:p-9" style={{ color: look.ink }}>
          <div className="flex items-start justify-between gap-4"><div className="flex h-[58px] w-[58px] items-center justify-center rounded-[19px] font-serif text-xl" style={{ backgroundColor: look.color }}>{initials}</div><span className="mt-1 max-w-[60%] truncate rounded-full bg-[#f6f6f2] px-3 py-2 font-mono text-[9px] text-[#80847b]">{cardHost}/{workspace.card.slug}</span></div>
          <input aria-label="Name on your card" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} className="mt-7 block w-full bg-transparent font-serif text-[clamp(2.2rem,6vw,3.4rem)] leading-[1.02] tracking-[-0.055em] outline-none placeholder:text-[#b8b9b2]" placeholder="Your name" />
          <textarea aria-label="Short introduction" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={1000} rows={3} className="mt-4 block w-full resize-none bg-transparent text-sm leading-6 text-[#6e7369] outline-none placeholder:text-[#b8b9b2]" placeholder="A short introduction about you..." />
          <div className="mt-5 flex flex-wrap gap-2">{skills.map((skill) => <button key={skill} type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))} title="Remove skill" className="rounded-full border border-[#e8e9e3] px-3 py-1.5 text-[10px] text-[#5d6358] transition hover:border-[#d19d8b] hover:text-[#a25f4a]">{skill}<span className="ml-2 text-[#9da096]">×</span></button>)}</div>
          <ProjectList projects={projects} look={look} selectedProjectId={selectedProjectId} newProjectTitle={newProjectTitle} setProjects={setProjects} setSelectedProjectId={setSelectedProjectId} setNewProjectTitle={setNewProjectTitle} actions={projectActions} />
          <div className="mt-6 flex items-center justify-between border-t border-[#ecece7] pt-5"><a className="text-[10px] text-[#85897f]" href={`mailto:${email}`}>Say hello · {email}</a><div className="flex gap-2">{socialLinks.map((link) => <a key={link.id ?? `${link.platform}:${link.url}`} href={link.url} target="_blank" rel="noreferrer" title={link.label || link.platform} className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e8e1] px-2 text-[9px] font-semibold">{socialIcon(link)}</a>)}</div></div>
        </article>
      </div>
      <div className="flex flex-col gap-3 border-t border-[#eff0ea] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><p className="text-[10px] leading-5 text-[#92958c]">Your public card reflects the saved details.</p><button type="button" onClick={onCopy} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#dedfd6] px-5 text-[11px] font-semibold text-[#38432f] transition hover:bg-[#fbfcf8]">{copied ? "Link copied" : "Share your card"}<span aria-hidden="true">↗</span></button></div>
    </section>
  );
}

function ProjectList({ projects, look, selectedProjectId, newProjectTitle, setProjects, setSelectedProjectId, setNewProjectTitle, actions }: { projects: ProjectDraft[]; look: (typeof looks)[number]; selectedProjectId: string; newProjectTitle: string; setProjects: Dispatch<SetStateAction<ProjectDraft[]>>; setSelectedProjectId: Dispatch<SetStateAction<string>>; setNewProjectTitle: Dispatch<SetStateAction<string>>; actions: ProjectActions }) {
  return <div className="mt-7 border-t border-[#ecece7] pt-5"><div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#82877b]">Selected work</p><span className="font-mono text-[9px] text-[#a0a297]">{String(projects.length).padStart(2, "0")}</span></div><div className="space-y-2">{projects.map((item) => <div key={item.id} className={`flex items-center gap-3 rounded-2xl p-3 ${selectedProjectId === item.id ? "bg-[#f0f3eb]" : "bg-[#f7f8f4]"}`}><button type="button" aria-label={`Edit assets for ${item.title}`} onClick={() => setSelectedProjectId(item.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm" style={{ backgroundColor: look.color }}>✳</button><span className="min-w-0 flex-1"><input aria-label={`Project ${item.title} title`} value={item.title} onChange={(event) => setProjects((current) => current.map((projectItem) => projectItem.id === item.id ? { ...projectItem, title: event.target.value } : projectItem))} onBlur={() => void actions.saveProject(item)} maxLength={100} className="block w-full bg-transparent text-xs font-semibold text-[#30352d] outline-none" /><input aria-label={`Project ${item.title} description`} value={item.description} onChange={(event) => setProjects((current) => current.map((projectItem) => projectItem.id === item.id ? { ...projectItem, description: event.target.value } : projectItem))} onBlur={() => void actions.saveProject(item)} maxLength={500} className="mt-1 block w-full bg-transparent text-[10px] text-[#85897f] outline-none" /></span><button type="button" aria-label={`Remove ${item.title}`} onClick={() => void actions.deleteProject(item.id)} className="px-1 text-sm text-[#a0a297] hover:text-[#a25f4a]">×</button></div>)}{projects.length < 5 && <form onSubmit={(event) => void actions.addProject(event)} className="flex gap-2"><input aria-label="New project title" value={newProjectTitle} onChange={(event) => setNewProjectTitle(event.target.value)} className="h-10 min-w-0 flex-1 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none placeholder:text-[#a2a49b] focus:border-[#a9b397]" placeholder="New project title" /><button type="submit" className="h-10 shrink-0 rounded-xl border border-dashed border-[#dfe2d8] px-3 text-[10px] font-medium text-[#7b826f] hover:bg-[#fbfcf8]">＋ Add</button></form>}</div></div>;
}

function CardSettings(props: DashboardEditorLayoutProps & { selectedProject?: ProjectDraft }) {
  const { selectedProject, workspace, email, userEmail, skills, projects, socialLinks, themeId, newSkill, saving, socialDraft, setEmail, setNewSkill, setSocialLinks, setSocialDraft, setThemeId, cardActions } = props;
  return <aside className="space-y-5">
    {selectedProject ? <ProjectAssetUploader key={selectedProject.id} projectId={selectedProject.id} initialAssets={selectedProject.assets} /> : <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 text-xs text-[#85897f]">Add a project to attach images or video.</section>}
    <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7d866f]">Make it yours</p><h2 className="mt-1.5 text-sm font-semibold tracking-tight">A few details go a long way</h2></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f4ed] text-sm text-[#6e7b5e]">✳</span></div>
      <label className="mb-3 block text-[10px] font-medium text-[#777b71]">Contact email{workspace.card.emailVerified && normalizeEmail(email) === normalizeEmail(userEmail) ? <span className="ml-2 rounded-full bg-[#e9eddf] px-2 py-1 text-[#536047]">Verified</span> : null}<input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none focus:border-[#a9b397]" type="email" /></label>
      <form onSubmit={cardActions.addSkill} className="mb-2 flex gap-2"><input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} disabled={skills.length >= 10} className="h-10 min-w-0 flex-1 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none transition placeholder:text-[#a2a49b] focus:border-[#a9b397]" placeholder={skills.length >= 10 ? "Skill limit reached" : "Add a skill or interest"} /><button type="submit" disabled={skills.length >= 10} className="h-10 w-10 shrink-0 rounded-xl bg-[#283321] text-lg text-white transition hover:bg-[#3b4a30] disabled:opacity-40" aria-label="Add skill">＋</button></form><p className="mb-4 text-[9px] text-[#92958c]">{skills.length} / 10 skills</p>
      <SocialLinksEditor links={socialLinks} draft={socialDraft} setLinks={setSocialLinks} setDraft={setSocialDraft} onSubmit={cardActions.addSocial} />
    </section>
    <ThemePicker themeId={themeId} setThemeId={setThemeId} />
    <button type="button" onClick={() => void cardActions.saveCard()} disabled={saving} className="h-12 w-full rounded-full bg-[#283321] text-xs font-semibold text-white transition hover:bg-[#3b4a30] disabled:opacity-50">{saving ? "Saving…" : "Save card changes"}</button>
    <div className="rounded-[24px] bg-[#e9eddf] p-5 sm:p-6"><p className="font-serif text-xl tracking-[-0.03em] text-[#343f2b]">One link. A little more you.</p><p className="mt-2 text-[10px] leading-5 text-[#68725c]">Your skills, selected work, and ways to reach you—all on a card that’s easy to share.</p></div>
  </aside>;
}

function SocialLinksEditor({ links, draft, setLinks, setDraft, onSubmit }: { links: SocialLinkDraft[]; draft: SocialLinkDraft; setLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>; setDraft: Dispatch<SetStateAction<SocialLinkDraft>>; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="border-t border-[#eff0ea] pt-4"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#82877b]">Social links</p>{links.map((link, index) => <div key={link.id ?? `${link.platform}:${link.url}`} className="mb-2 flex items-center gap-2 rounded-xl bg-[#f7f8f4] px-3 py-2"><span className="w-16 shrink-0 text-[9px] capitalize text-[#69715f]">{link.label || link.platform}</span><span className="min-w-0 flex-1 truncate text-[9px] text-[#85897f]">{link.url}</span><button type="button" onClick={() => setLinks((current) => current.filter((_, i) => i !== index))} className="text-xs text-[#a0a297] hover:text-[#a25f4a]" aria-label={`Remove ${link.label || link.platform} link`}>×</button></div>)}<form onSubmit={onSubmit} className="space-y-2"><div className="flex gap-2"><label className="block text-[9px] text-[#777b71]">Platform<select aria-label="Social platform" value={draft.platform} onChange={(event) => setDraft((current) => ({ ...current, platform: event.target.value as SocialLinkDraft["platform"] }))} className="mt-1 block h-10 w-28 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-2 text-[10px]"><option value="github">GitHub</option><option value="linkedin">LinkedIn</option><option value="x">X</option><option value="other">Other</option></select></label>{draft.platform === "other" && <label className="block text-[9px] text-[#777b71]">Label<input aria-label="Social link label" value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} placeholder="e.g. Portfolio" className="mt-1 block h-10 min-w-0 w-24 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-2 text-[10px]" /></label>}</div><div className="flex items-end gap-2"><label className="min-w-0 flex-1 text-[9px] text-[#777b71]">URL<input aria-label="Social link URL" value={draft.url} onChange={(event) => setDraft((current) => ({ ...current, url: event.target.value }))} type="url" placeholder="https://…" className="mt-1 block h-10 w-full rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-[10px]" /></label><button type="submit" disabled={links.length >= 8} aria-label="Add social link" className="h-10 rounded-xl bg-[#283321] px-3 text-xs text-white disabled:opacity-40">＋</button></div></form></div>;
}

function ThemePicker({ themeId, setThemeId }: { themeId: (typeof looks)[number]["id"]; setThemeId: Dispatch<SetStateAction<(typeof looks)[number]["id"]>> }) {
  return <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7d866f]">The look</p><h2 className="mt-1.5 text-sm font-semibold tracking-tight">Choose a starting point</h2></div><span className="font-mono text-[9px] text-[#a0a297]">{looks.findIndex((option) => option.id === themeId) + 1} / 03</span></div><div className="mt-5 grid grid-cols-3 gap-2.5">{looks.map((option, index) => <button key={option.id} type="button" onClick={() => setThemeId(option.id)} aria-pressed={themeId === option.id} className={`group rounded-2xl border p-2 text-left transition ${themeId === option.id ? "border-[#8d9b7b] bg-[#f8faf5] ring-2 ring-[#e5eadf]" : "border-[#ebebe5] hover:border-[#c9cebf]"}`}><span className="flex aspect-[0.83] items-end rounded-xl p-2.5" style={{ backgroundColor: option.color }}><span className="h-5 w-5 rounded-full border-2 border-white/75" style={{ backgroundColor: option.ink }} /></span><span className="mt-2 block truncate text-[9px] font-medium text-[#666b61]">{option.name}</span><span className="mt-0.5 block text-[8px] text-[#a0a297]">0{index + 1}</span></button>)}</div><p className="mt-4 text-[10px] leading-5 text-[#92958c]">Theme changes are included when you save your card.</p></section>;
}

function socialIcon(link: SocialLinkDraft) {
  if (link.platform === "linkedin") return "in";
  if (link.platform === "github") return "gh";
  if (link.platform === "x") return "𝕏";
  return link.label.slice(0, 2).toLowerCase();
}

function normalizeEmail(value: string) { return value.trim().toLowerCase(); }
