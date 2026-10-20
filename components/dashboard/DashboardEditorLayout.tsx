"use client";

import Image from "next/image";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import ProjectAssetUploader from "@/components/dashboard/ProjectAssetUploader";
import { CARD_THEMES as looks, resolveCardTheme } from "@/lib/themes";
import type { CardSaveStatus, EditorSection } from "@/components/dashboard/dashboardEditorStore";
import type { DashboardBootstrapResponse } from "@/types/project";
import type { ProjectDraft, SocialLinkDraft } from "@/components/dashboard/useDashboardActions";

type CardActions = {
  addSkill: (event: FormEvent<HTMLFormElement>) => void;
  addSocial: (event: FormEvent<HTMLFormElement>) => void;
};
type ProjectActions = {
  addProject: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  saveProject: (item: ProjectDraft) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
};

export type DashboardEditorLayoutProps = {
  userName: string; userEmail: string; appUrl: string; workspace: DashboardBootstrapResponse;
  name: string; bio: string; email: string; skills: string[]; projects: ProjectDraft[]; socialLinks: SocialLinkDraft[];
  themeId: (typeof looks)[number]["id"]; selectedProjectId: string; newSkill: string; newProjectTitle: string;
  copied: boolean; activeSection: EditorSection; mobileNavigationOpen: boolean; cardSaveStatus: CardSaveStatus;
  dirtySections: Record<"profile" | "appearance", boolean>;
  pageError: string; notice: string; socialDraft: SocialLinkDraft;
  setName: Dispatch<SetStateAction<string>>; setBio: Dispatch<SetStateAction<string>>; setEmail: Dispatch<SetStateAction<string>>;
  setSkills: Dispatch<SetStateAction<string[]>>; setProjects: Dispatch<SetStateAction<ProjectDraft[]>>;
  setSocialLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>; setThemeId: Dispatch<SetStateAction<(typeof looks)[number]["id"]>>;
  setSelectedProjectId: Dispatch<SetStateAction<string>>; setNewSkill: Dispatch<SetStateAction<string>>;
  setNewProjectTitle: Dispatch<SetStateAction<string>>; setSocialDraft: Dispatch<SetStateAction<SocialLinkDraft>>;
  cardActions: CardActions; projectActions: ProjectActions;
  setActiveSection: Dispatch<SetStateAction<EditorSection>>;
  setMobileNavigationOpen: Dispatch<SetStateAction<boolean>>;
  onSaveNow: () => void; onCopy: () => void;
};

const SECTIONS: { id: EditorSection; label: string; blurb: string }[] = [
  { id: "profile", label: "Profile", blurb: "Everything people see first." },
  { id: "projects", label: "Projects", blurb: "The work you want shown on your card." },
  { id: "appearance", label: "Appearance", blurb: "Pick the look that suits you." },
  { id: "settings", label: "Settings", blurb: "Your card link and sharing." },
];

export default function DashboardEditorLayout(props: DashboardEditorLayoutProps) {
  const initials = props.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "Y";
  const look = resolveCardTheme(props.themeId);
  const cardUrl = `${props.appUrl}/${props.workspace.card.slug}`;
  const section = SECTIONS.find((item) => item.id === props.activeSection) ?? SECTIONS[0];

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#20241c]">
      {props.mobileNavigationOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => props.setMobileNavigationOpen(false)}
          className="fixed inset-0 z-30 bg-[#20241c]/30 lg:hidden"
        />
      )}

      <Sidebar {...props} variant="desktop" cardUrl={cardUrl} />
      <Sidebar {...props} variant="sheet" cardUrl={cardUrl} />

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-[#e9e9e1] bg-[#f9f9f6]/90 backdrop-blur-xl">
          <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => props.setMobileNavigationOpen(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dedfd6] bg-white text-sm lg:hidden"
              >
                ☰
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold tracking-tight">{section.label}</h1>
                <p className="truncate text-[10px] text-[#8a8d84]">{section.blurb}</p>
              </div>
            </div>
            <SaveIndicator status={props.cardSaveStatus} onSaveNow={props.onSaveNow} />
          </div>
        </header>

        <main className="px-4 pb-16 pt-7 sm:px-7 sm:pt-9 lg:px-10">
          {(props.pageError || props.notice) && (
            <p
              role={props.pageError ? "alert" : "status"}
              className={`mb-5 rounded-2xl px-4 py-3 text-xs ${props.pageError ? "bg-[#f5e7e1] text-[#8d4938]" : "bg-[#e9eddf] text-[#536047]"}`}
            >
              {props.pageError || props.notice}
            </p>
          )}

          {props.activeSection === "profile" && <ProfileSection {...props} look={look} initials={initials} />}
          {props.activeSection === "appearance" && <AppearanceSection {...props} look={look} initials={initials} />}
          {props.activeSection === "projects" && <ProjectsSection {...props} />}
          {props.activeSection === "settings" && <SettingsSection {...props} cardUrl={cardUrl} />}
        </main>
      </div>
    </div>
  );
}

function Sidebar(
  props: DashboardEditorLayoutProps & { variant: "desktop" | "sheet"; cardUrl: string },
) {
  const isSheet = props.variant === "sheet";
  return (
    <aside
      inert={isSheet && !props.mobileNavigationOpen}
      className={[
        "fixed inset-y-0 left-0 z-40 w-[264px] border-r border-[#e6e7df] bg-[#f9f9f6] transition-transform duration-200",
        isSheet ? "lg:hidden" : "hidden lg:block",
        isSheet && !props.mobileNavigationOpen ? "-translate-x-full" : "translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-[68px] items-center gap-2.5 border-b border-[#e9e9e1] px-6">
          <Image src="/icon.svg" alt="" width={26} height={26} />
          <span className="text-[15px] font-semibold tracking-[-0.04em]">cardfoi</span>
          <span className="rounded-full border border-[#e5e7de] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#85897f]">studio</span>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard sections">
          {SECTIONS.map((section) => {
            const active = props.activeSection === section.id;
            const dirty = section.id === "profile"
              ? props.dirtySections.profile
              : section.id === "appearance"
                ? props.dirtySections.appearance
                : false;
            return (
              <button
                key={section.id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  props.setActiveSection(section.id);
                  props.setMobileNavigationOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                  active ? "bg-[#e9eddf] text-[#343f2b]" : "text-[#6e7369] hover:bg-[#f0f1ec]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-[#88a16b]" : "bg-[#c9ccc2]"}`}
                />
                {section.label}
                {dirty && (
                  <span
                    title="Unsaved changes"
                    aria-label="Unsaved changes"
                    className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#c98a5e]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-[#e9e9e1] p-3">
          <a
            href={props.cardUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[#6e7369] transition hover:bg-[#f0f1ec]"
          >
            <span aria-hidden="true">↗</span> View card
          </a>
          <button
            type="button"
            onClick={props.onCopy}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[#6e7369] transition hover:bg-[#f0f1ec]"
          >
            <span aria-hidden="true">⧉</span> {props.copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>
    </aside>
  );
}

function SaveIndicator({ status, onSaveNow }: { status: CardSaveStatus; onSaveNow: () => void }) {
  if (status === "saving") {
    return (
      <span role="status" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e7e8e0] bg-white/70 px-3.5 py-2 text-[10px] text-[#777c70]">
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8a8d84]" />
        Saving…
      </span>
    );
  }

  if (status === "failed") {
    return (
      <button
        type="button"
        onClick={onSaveNow}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e6c4b8] bg-[#f9ece6] px-3.5 py-2 text-[10px] font-semibold text-[#8d4938] transition hover:bg-[#f5e2d9]"
      >
        Couldn’t save · Retry
      </button>
    );
  }

  if (status === "dirty") {
    return (
      <button
        type="button"
        onClick={onSaveNow}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e7e8e0] bg-white/70 px-3.5 py-2 text-[10px] text-[#777c70] transition hover:border-[#abb69b] hover:text-[#38432f]"
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c98a5e]" />
        Unsaved changes · Save now
      </button>
    );
  }

  return (
    <span role="status" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e7e8e0] bg-white/70 px-3.5 py-2 text-[10px] text-[#777c70]">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#88a16b]" />
      Saved
    </span>
  );
}

function ProfileSection(props: DashboardEditorLayoutProps & { look: (typeof looks)[number]; initials: string }) {
  const { email, userEmail, skills, newSkill, socialDraft, socialLinks, setEmail, setNewSkill, setSocialDraft, setSocialLinks, cardActions } = props;
  const verified = props.workspace.card.emailVerified && normalizeEmail(email) === normalizeEmail(userEmail);

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-7">
      <div className="space-y-5">
        <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold tracking-tight">Your details</h2>
          <p className="mt-1 text-[10px] text-[#92958c]">Name and short bio, shown at the top of your card.</p>

          <label className="mt-5 block text-[10px] font-medium text-[#777b71]">
            Name
            <input
              value={props.name}
              onChange={(event) => props.setName(event.target.value)}
              maxLength={80}
              placeholder="Your name"
              className="mt-1.5 h-10 w-full rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none transition focus:border-[#a9b397]"
            />
          </label>

          <label className="mt-3 block text-[10px] font-medium text-[#777b71]">
            Short bio
            <textarea
              value={props.bio}
              onChange={(event) => props.setBio(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="A short introduction about you..."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 py-2 text-xs leading-5 outline-none transition focus:border-[#a9b397]"
            />
          </label>
          <p className="mt-1 text-right text-[9px] text-[#a0a297]">{props.bio.length} / 1000</p>

          <form onSubmit={cardActions.addSkill} className="mt-4 flex gap-2">
            <input
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              disabled={skills.length >= 10}
              placeholder={skills.length >= 10 ? "Skill limit reached" : "Add a skill or interest"}
              className="h-10 min-w-0 flex-1 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none transition placeholder:text-[#a2a49b] focus:border-[#a9b397]"
            />
            <button
              type="submit"
              disabled={skills.length >= 10}
              aria-label="Add skill"
              className="h-10 w-10 shrink-0 rounded-xl bg-[#283321] text-lg text-white transition hover:bg-[#3b4a30] disabled:opacity-40"
            >
              ＋
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill}
                type="button"
                title={`Remove ${skill}`}
                aria-label={`Remove ${skill}`}
                onClick={() => setSkillsFilter(props.setSkills, skill)}
                className="rounded-full border border-[#e8e9e3] px-3 py-1.5 text-[10px] text-[#5d6358] transition hover:border-[#d19d8b] hover:text-[#a25f4a]"
              >
                {skill}
                <span aria-hidden="true" className="ml-2 text-[#9da096]">×</span>
              </button>
            ))}
            {skills.length === 0 && <p className="text-[10px] text-[#a0a297]">No skills yet.</p>}
          </div>
          <p className="mt-3 text-[9px] text-[#92958c]">{skills.length} / 10 skills</p>
        </section>

        <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold tracking-tight">Contact and links</h2>
          <p className="mt-1 text-[10px] text-[#92958c]">How people can reach you.</p>

          <label className="mt-5 block text-[10px] font-medium text-[#777b71]">
            Contact email
            {verified && (
              <span className="ml-2 rounded-full bg-[#e9eddf] px-2 py-1 text-[9px] text-[#536047]">Verified</span>
            )}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none transition focus:border-[#a9b397]"
            />
          </label>

          <SocialLinksEditor
            links={socialLinks}
            draft={socialDraft}
            setLinks={setSocialLinks}
            setDraft={setSocialDraft}
            onSubmit={cardActions.addSocial}
          />
        </section>
      </div>

      <CardPreview {...props} />
    </div>
  );
}

function AppearanceSection(props: DashboardEditorLayoutProps & { look: (typeof looks)[number]; initials: string }) {
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-7">
      <ThemePicker themeId={props.themeId} setThemeId={props.setThemeId} />
      <CardPreview {...props} />
    </div>
  );
}

function ProjectsSection(props: DashboardEditorLayoutProps) {
  const selectedProject = props.projects.find((item) => item.id === props.selectedProjectId) ?? props.projects[0];

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-7">
      <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Projects</h2>
            <p className="mt-1 text-[10px] text-[#92958c]">Edits save on their own once you leave a field.</p>
          </div>
          <span className="font-mono text-[9px] text-[#a0a297]">{String(props.projects.length).padStart(2, "0")} / 05</span>
        </div>

        <div className="mt-5 space-y-3">
          {props.projects.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition ${
                item.id === selectedProject?.id ? "border-[#c3ceb2] bg-[#f7f9f3]" : "border-[#ebebe5] bg-[#fbfbf8]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => props.setSelectedProjectId(item.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <input
                    aria-label={`Project ${item.title} title`}
                    value={item.title}
                    maxLength={100}
                    onChange={(event) =>
                      props.setProjects((current) =>
                        current.map((project) => (project.id === item.id ? { ...project, title: event.target.value } : project)),
                      )
                    }
                    onBlur={() => void props.projectActions.saveProject(item)}
                    className="block w-full bg-transparent text-xs font-semibold text-[#30352d] outline-none"
                  />
                  <input
                    aria-label={`Project ${item.title} description`}
                    value={item.description}
                    maxLength={500}
                    placeholder="Add a short description"
                    onChange={(event) =>
                      props.setProjects((current) =>
                        current.map((project) => (project.id === item.id ? { ...project, description: event.target.value } : project)),
                      )
                    }
                    onBlur={() => void props.projectActions.saveProject(item)}
                    className="mt-1 block w-full bg-transparent text-[10px] text-[#85897f] outline-none placeholder:text-[#b8b9b2]"
                  />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${item.title}`}
                  onClick={() => void props.projectActions.deleteProject(item.id)}
                  className="shrink-0 px-1 text-sm text-[#a0a297] transition hover:text-[#a25f4a]"
                >
                  ×
                </button>
              </div>
              <p className="mt-2 text-[9px] text-[#a0a297]">{item.assets.length} proof {item.assets.length === 1 ? "asset" : "assets"}</p>
            </div>
          ))}
        </div>

        {props.projects.length < 5 && (
          <form onSubmit={(event) => void props.projectActions.addProject(event)} className="mt-4 flex gap-2">
            <input
              aria-label="New project title"
              value={props.newProjectTitle}
              onChange={(event) => props.setNewProjectTitle(event.target.value)}
              maxLength={100}
              placeholder="New project title"
              className="h-10 min-w-0 flex-1 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 text-xs outline-none transition placeholder:text-[#a2a49b] focus:border-[#a9b397]"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-xl bg-[#283321] px-4 text-xs font-semibold text-white transition hover:bg-[#3b4a30]"
            >
              Add
            </button>
          </form>
        )}
      </section>

      <aside>
        {selectedProject ? (
          <ProjectAssetUploader
            key={selectedProject.id}
            projectId={selectedProject.id}
            initialAssets={selectedProject.assets}
          />
        ) : (
          <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 text-xs text-[#85897f]">
            Add a project to attach images or video.
          </section>
        )}
      </aside>
    </div>
  );
}

function SettingsSection(props: DashboardEditorLayoutProps & { cardUrl: string }) {
  return (
    <section className="max-w-[560px] rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
      <h2 className="text-sm font-semibold tracking-tight">Your card</h2>
      <p className="mt-1 text-[10px] text-[#92958c]">This is the link you share with people.</p>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-[#62695b]">{props.cardUrl}</span>
        <button
          type="button"
          onClick={props.onCopy}
          className="shrink-0 rounded-lg bg-[#283321] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#3b4a30]"
        >
          {props.copied ? "Copied" : "Copy"}
        </button>
      </div>

      <dl className="mt-6 space-y-3 border-t border-[#eff0ea] pt-5 text-[10px]">
        <div className="flex items-center justify-between">
          <dt className="text-[#85897f]">Signed in as</dt>
          <dd className="font-medium text-[#30352d]">{props.userEmail}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#85897f]">Card slug</dt>
          <dd className="font-mono text-[#30352d]">{props.workspace.card.slug}</dd>
        </div>
      </dl>
    </section>
  );
}

function setSkillsFilter(setSkills: Dispatch<SetStateAction<string[]>>, skill: string) {
  setSkills((current) => current.filter((item) => item !== skill));
}

function CardPreview(props: DashboardEditorLayoutProps & { look: (typeof looks)[number]; initials: string }) {
  const cardHost = props.appUrl.replace(/^https?:\/\//, "");
  const look = props.look;

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#e6e7df] bg-white shadow-[0_20px_70px_-55px_rgba(37,45,30,0.35)]">
      <div className="flex items-center justify-between border-b border-[#eff0ea] px-5 py-4 sm:px-7">
        <div>
          <h2 className="text-xs font-semibold tracking-tight">Live preview</h2>
          <p className="mt-1 text-[10px] text-[#92958c]">Read-only. Edit on the left.</p>
        </div>
        <span className="rounded-full bg-[#f5f6f1] px-3 py-1.5 font-mono text-[9px] text-[#777d6d]">LIVE PREVIEW</span>
      </div>

      <div className="flex min-h-[420px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#fafbf7_0%,_#f1f2ec_72%)] px-4 py-10 sm:px-8">
        <article className="w-full max-w-[510px] rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_28px_80px_-36px_rgba(42,49,35,0.3)] sm:p-9" style={{ color: look.ink }}>
          <div className="flex items-start justify-between gap-4">
            <div
              className="flex h-[58px] w-[58px] items-center justify-center rounded-[19px] font-serif text-xl"
              style={{ backgroundColor: look.color }}
            >
              {props.initials}
            </div>
            <span className="mt-1 max-w-[60%] truncate rounded-full bg-[#f6f6f2] px-3 py-2 font-mono text-[9px] text-[#80847b]">
              {cardHost}/{props.workspace.card.slug}
            </span>
          </div>

          <p className="mt-7 break-words font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.02] tracking-[-0.055em]">
            {props.name || "Your name"}
          </p>
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#6e7369]">
            {props.bio || "A short introduction about you..."}
          </p>

          {props.skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {props.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-[#e8e9e3] px-3 py-1.5 text-[10px] text-[#5d6358]">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {props.projects.length > 0 && (
            <div className="mt-7 border-t border-[#ecece7] pt-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#82877b]">Selected work</p>
              <ul className="space-y-2">
                {props.projects.map((project) => (
                  <li key={project.id} className="flex items-center gap-3 rounded-2xl bg-[#f7f8f4] p-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm"
                      style={{ backgroundColor: look.color }}
                      aria-hidden="true"
                    >
                      ✳
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-[#30352d]">{project.title}</span>
                      {project.description && (
                        <span className="mt-0.5 block truncate text-[10px] text-[#85897f]">{project.description}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#ecece7] pt-5">
            <a className="truncate text-[10px] text-[#85897f]" href={`mailto:${props.email}`}>
              Say hello · {props.email}
            </a>
            <div className="flex shrink-0 gap-2">
              {props.socialLinks.map((link) => (
                <a
                  key={link.id ?? `${link.platform}:${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  title={link.label || link.platform}
                  className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e8e1] px-2 text-[9px] font-semibold"
                >
                  {socialIcon(link)}
                </a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function SocialLinksEditor({
  links,
  draft,
  setLinks,
  setDraft,
  onSubmit,
}: {
  links: SocialLinkDraft[];
  draft: SocialLinkDraft;
  setLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>;
  setDraft: Dispatch<SetStateAction<SocialLinkDraft>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="mt-5 border-t border-[#eff0ea] pt-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#82877b]">Social links</p>

      {links.map((link, index) => (
        <div key={link.id ?? `${link.platform}:${link.url}`} className="mb-2 flex items-center gap-2 rounded-xl bg-[#f7f8f4] px-3 py-2">
          <span className="w-16 shrink-0 text-[9px] capitalize text-[#69715f]">{link.label || link.platform}</span>
          <span className="min-w-0 flex-1 truncate text-[9px] text-[#85897f]">{link.url}</span>
          <button
            type="button"
            aria-label={`Remove ${link.label || link.platform} link`}
            onClick={() => setLinks((current) => current.filter((_, i) => i !== index))}
            className="text-xs text-[#a0a297] transition hover:text-[#a25f4a]"
          >
            ×
          </button>
        </div>
      ))}

      <form onSubmit={onSubmit} className="space-y-2">
        <div className="flex gap-2">
          <label className="block text-[9px] text-[#777b71]">
            Platform
            <select
              aria-label="Social platform"
              value={draft.platform}
              onChange={(event) => setDraft((current) => ({ ...current, platform: event.target.value as SocialLinkDraft["platform"] }))}
              className="mt-1 block h-10 w-28 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-2 text-[10px]"
            >
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X</option>
              <option value="other">Other</option>
            </select>
          </label>
          {draft.platform === "other" && (
            <label className="block text-[9px] text-[#777b71]">
              Label
              <input
                aria-label="Social link label"
                value={draft.label}
                onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
                placeholder="e.g. Portfolio"
                className="mt-1 block h-10 w-24 rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-2 text-[10px]"
              />
            </label>
          )}
        </div>
        <div className="flex items-end gap-2">
          <label className="min-w-0 flex-1 text-[9px] text-[#777b71]">
            URL
            <input
              aria-label="Social link URL"
              value={draft.url}
              onChange={(event) => setDraft((current) => ({ ...current, url: event.target.value }))}
              type="url"
              placeholder="https://…"
              className="mt-1 block h-10 w-full rounded-xl border border-[#e8e9e2] bg-[#fbfbf8] px-2 text-[10px] placeholder:text-[#a2a49b] focus:border-[#a9b397]"
            />
          </label>
          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl bg-[#283321] px-3 text-[10px] font-semibold text-white transition hover:bg-[#3b4a30]"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

function ThemePicker({ themeId, setThemeId }: { themeId: (typeof looks)[number]["id"]; setThemeId: Dispatch<SetStateAction<(typeof looks)[number]["id"]>> }) {
  return (
    <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7d866f]">The look</p>
          <h2 className="mt-1.5 text-sm font-semibold tracking-tight">Choose a starting point</h2>
        </div>
        <span className="font-mono text-[9px] text-[#a0a297]">
          {looks.findIndex((option) => option.id === themeId) + 1} / 03
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {looks.map((option, index) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setThemeId(option.id)}
            aria-pressed={themeId === option.id}
            className={`group rounded-2xl border p-2 text-left transition ${
              themeId === option.id ? "border-[#8d9b7b] bg-[#f8faf5] ring-2 ring-[#e5eadf]" : "border-[#ebebe5] hover:border-[#c9cebf]"
            }`}
          >
            <span className="flex aspect-[0.83] items-end rounded-xl p-2.5" style={{ backgroundColor: option.color }}>
              <span className="h-5 w-5 rounded-full border-2 border-white/75" style={{ backgroundColor: option.ink }} />
            </span>
            <span className="mt-2 block truncate text-[9px] font-medium text-[#666b61]">{option.name}</span>
            <span className="mt-0.5 block text-[8px] text-[#a0a297]">0{index + 1}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-[10px] leading-5 text-[#92958c]">Theme changes save automatically like the rest of your card.</p>
    </section>
  );
}

function socialIcon(link: SocialLinkDraft) {
  if (link.platform === "linkedin") return "in";
  if (link.platform === "github") return "gh";
  if (link.platform === "x") return "𝕏";
  return link.label.slice(0, 2).toLowerCase();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
