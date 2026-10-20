OK CAN U DRAFT ONE? UI?

## Assistant

Yeah. I’d draft the **Profile** dashboard screen first, because it establishes the shell, autosave behavior, and visual language for Projects and Appearance.

```text
Desktop
┌─────────────────────────────────────────────────────────────────────────────┐
│ cardfoi                                                                    │
│ studio                                                                     │
├───────────────┬─────────────────────────────────────────────────────────────┤
│               │  Profile                                      ● Saved       │
│  ◉ Profile    │  Everything people see first.                              │
│               │                                                             │
│  ▣ Projects   │  ┌─────────────────────────┐  ┌──────────────────────────┐ │
│               │  │ Your details            │  │ Live preview             │ │
│  ◇ Appearance │  │                         │  │                          │ │
│               │  │ [ avatar ]  Your Name   │  │       YN                 │ │
│  ⚙ Settings   │  │            name@email   │  │    Your Name             │ │
│               │  │                         │  │    Short bio…            │ │
│───────────────│  │ Bio                     │  │                          │ │
│  ↗ View card  │  │ [ textarea            ] │  │   [design] [web]         │ │
│  ⧉ Copy link  │  │                         │  │                          │ │
│               │  │ Skills                  │  │ Selected work            │ │
│               │  │ [React ×] [Design ×]    │  │  My project        ✳     │ │
│               │  │ [+ Add a skill]         │  │                          │ │
│               │  └─────────────────────────┘  └──────────────────────────┘ │
│               │                                                             │
│               │  ┌──────────────────────────────────────────────────────┐ │
│               │  │ Contact and links                                    │ │
│               │  │ Contact email      you@email.com  ✓ Verified         │ │
│               │  │ GitHub             github.com/you              ×     │ │
│               │  │ [+ Add social link]                                  │ │
│               │  └──────────────────────────────────────────────────────┘ │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

The visual behavior:

- Sidebar is fixed on desktop, collapsible to icons.
- `Profile` is active with a soft sage background.
- `Saved` sits in the page header. It changes to `Saving…` only while a request is running and `Couldn’t save · Retry` only after a failure.
- The preview stays visible on Profile and Appearance.
- Inputs sit inside clear cards. Avoid a single huge form.
- “View card” and “Copy link” are always available in the sidebar footer.
- No global save button.

Mobile:

```text
┌──────────────────────────────────┐
│ ☰  Profile             ● Saved   │
├──────────────────────────────────┤
│ Your details                     │
│ [ avatar ]  Your Name            │
│                                  │
│ Bio                              │
│ [ textarea                     ] │
│                                  │
│ Skills                           │
│ [React ×] [Design ×]             │
│ [+ Add skill]                    │
│                                  │
│ Contact and links                │
│ …                                │
├──────────────────────────────────┤
│              [ Preview card ]    │
└──────────────────────────────────┘
```

The mobile sidebar becomes a slide-out sheet. The live preview opens as a sheet or dedicated preview page, so it does not make the editor cramped.

For **Projects**, the same shell stays, but the main area becomes:

```text
Projects                                      ● Saved

┌───────────────────────┬────────────────────────────────────┐
│ + New project         │ Project details                    │
│                       │                                    │
│ ● Portfolio website   │ Title       [ Portfolio website ]  │
│   2 assets            │ Description [ ...                ] │
│                       │                                    │
│ ● Open-source tool    │ Proof                             │
│   1 asset             │ [ image ] [ video ] [+ Add link]  │
│                       │                                    │
│                       │                    Delete project  │
└───────────────────────┴────────────────────────────────────┘
```

This makes project selection, asset upload, and deletion much clearer than embedding everything inside the card preview.

## User

as we talk using dirty state and all

## Assistant

Exactly — the draft should show the dirty state instead of pretending every change is already saved.

The dashboard shell should use these states:

```text
Clean      → Saved
Dirty      → Unsaved changes
Saving     → Saving…
Failed     → Couldn’t save · Retry
```

Revised header:

```text
┌─────────────────────────────────────────────────────────────┐
│ Profile                                  ● Unsaved changes   │
│ Everything people see first.                  Save now       │
└─────────────────────────────────────────────────────────────┘
```

`Save now` is optional but useful. Autosave still starts after the debounce period. It simply flushes the pending changes immediately.

Once the request starts:

```text
│ Profile                                      ◌ Saving…       │
```

After success:

```text
│ Profile                                      ● Saved          │
```

After failure:

```text
│ Profile                       ! Couldn’t save   [Retry]       │
```

The sidebar should also reflect unsaved sections:

```text
┌───────────────┐
│ ◉ Profile   • │  ← dirty
│ ▣ Projects    │
│ ◇ Appearance• │  ← dirty
│ ⚙ Settings    │
└───────────────┘
```

The dot means that section has local changes not yet confirmed by the server. It disappears only after that section saves successfully.

For a full dashboard draft:

```text
┌───────────────┬──────────────────────────────────────────────────────────┐
│ cardfoi       │ Profile                              ● Unsaved changes    │
│ studio        │ Changes save automatically.               [Save now]      │
│               ├──────────────────────────────────────────────────────────┤
│ ◉ Profile   • │                                                          │
│ ▣ Projects    │  ┌──────────────────────────┐  ┌────────────────────────┐│
│ ◇ Appearance• │  │ Your details             │  │ Live card preview      ││
│ ⚙ Settings    │  │                          │  │                        ││
│               │  │ [avatar] Your name       │  │      Your Name         ││
│ ───────────── │  │          [input]         │  │      Short bio…        ││
│ ↗ View card   │  │                          │  │                        ││
│ ⧉ Copy link   │  │ Bio                      │  │  [React] [Design]      ││
│               │  │ [textarea]               │  │                        ││
│               │  │                          │  │  Selected work         ││
│               │  │ Skills                   │  │  Portfolio       ✳     ││
│               │  │ [React ×] [Design ×]     │  │                        ││
│               │  └──────────────────────────┘  └────────────────────────┘│
│               │                                                          │
│               │  ┌──────────────────────────────────────────────────────┐│
│               │  │ Contact and links                                    ││
│               │  │ email@email.com                         ✓ Verified   ││
│               │  │ GitHub · github.com/you                            ×  ││
│               │  └──────────────────────────────────────────────────────┘│
└───────────────┴──────────────────────────────────────────────────────────┘
```

For projects, dirty state belongs to each project row too:

```text
Projects                                        ● 2 unsaved changes

┌───────────────────────┬─────────────────────────────────────────┐
│ + New project          │ Portfolio website              Saving…   │
│                       │                                         │
│ ● Portfolio website • │ Title       [ Portfolio website       ]  │
│   2 assets             │ Description [ …                     ]  │
│                       │                                         │
│ ● Open source tool     │ Proof                                  │
│                       │ [image] [video] [+ Add link]            │
└───────────────────────┴─────────────────────────────────────────┘
```

Important behavior decisions:

- Text/profile/theme edits become dirty and autosave after the debounce.
- Project title/description edits become dirty independently per project.
- New project creation shows `Creating…`; it is unavailable until the server returns its ID.
- Upload is immediate because it creates an external file. Show `Uploading…` then `Added`; do not mark the whole dashboard dirty for it.
- Deletion is immediate: show `Removed`. The queue remains invisible to users.
- On route change, only warn if any section is `dirty`, `saving`, or `failed`.

So the user can always answer: “Is this saved?” without needing to understand your API, queue, or media provider.

## User

OK buikd this

## Assistant

I’ll turn the current editor into the dashboard shell we drafted: responsive sidebar, section navigation, dirty/saving/error indicators, and debounced autosave that batches card changes. I’ll preserve immediate project/upload/delete behavior, but make their feedback user-facing rather than queue-facing.

## Activity

    $ sed -n '1,220p' components/dashboard/DashboardEditor.tsx && sed -n '1,180p' components/dashboard/dashboardEditorStore.ts && sed -n '1,180p' components/dashboard/useDashboardActions.ts
    "use client";
    
    import { useStore } from "zustand";
    import DashboardEditorLayout from "@/components/dashboard/DashboardEditorLayout";
    import { useDashboardEditorStore } from "@/components/dashboard/dashboardEditorStore";
    import { copyCardLink, useCardActions, useProjectActions } from "@/components/dashboard/useDashboardActions";
    import type { DashboardBootstrapResponse } from "@/types/project";
    
    export type DashboardEditorProps = { userName: string; userEmail: string; appUrl: string; initialWorkspace: DashboardBootstrapResponse };
    
    export default function DashboardEditor({ userName, userEmail, appUrl, initialWorkspace }: DashboardEditorProps) {
      const store = useDashboardEditorStore(initialWorkspace);
      const state = useStore(store);
      const cardActions = useCardActions({
        name: state.name,
        bio: state.bio,
        email: state.email,
        skills: state.skills,
        theme: state.themeId,
        socialLinks: state.socialLinks,
        setSkills: state.setSkills,
        newSkill: state.newSkill,
        setNewSkill: state.setNewSkill,
        socialDraft: state.socialDraft,
        setSocialDraft: state.setSocialDraft,
        setSocialLinks: state.setSocialLinks,
        setSaving: state.setSaving,
        setError: state.setPageError,
        setNotice: state.setNotice,
      });
      const projectActions = useProjectActions({
        projects: state.projects,
        setProjects: state.setProjects,
        setSelectedProjectId: state.setSelectedProjectId,
        newProjectTitle: state.newProjectTitle,
        setNewProjectTitle: state.setNewProjectTitle,
        setError: state.setPageError,
        setNotice: state.setNotice,
      });
    
      return (
        <DashboardEditorLayout
          userName={userName}
          userEmail={userEmail}
          appUrl={appUrl}
          workspace={state.workspace}
          name={state.name}
          bio={state.bio}
          email={state.email}
          skills={state.skills}
          projects={state.projects}
          socialLinks={state.socialLinks}
          themeId={state.themeId}
          selectedProjectId={state.selectedProjectId}
          newSkill={state.newSkill}
          newProjectTitle={state.newProjectTitle}
          copied={state.copied}
          saving={state.saving}
          pageError={state.pageError}
          notice={state.notice}
          socialDraft={state.socialDraft}
          setName={state.setName}
          setBio={state.setBio}
          setEmail={state.setEmail}
          setSkills={state.setSkills}
          setProjects={state.setProjects}
          setSocialLinks={state.setSocialLinks}
          setThemeId={state.setThemeId}
          setSelectedProjectId={state.setSelectedProjectId}
          setNewSkill={state.setNewSkill}
          setNewProjectTitle={state.setNewProjectTitle}
          setSocialDraft={state.setSocialDraft}
          cardActions={cardActions}
          projectActions={projectActions}
          onCopy={() => void copyCardLink(`${appUrl}/${state.workspace.card.slug}`, state.setCopied)}
        />
      );
    }
    import { useState } from "react";
    import { createStore, type StoreApi } from "zustand/vanilla";
    import type { Dispatch, SetStateAction } from "react";
    import type { DashboardBootstrapResponse } from "@/types/project";
    import type { ProjectDraft, SocialLinkDraft } from "@/components/dashboard/useDashboardActions";
    
    type DashboardEditorState = {
      workspace: DashboardBootstrapResponse;
      name: string;
      bio: string;
      email: string;
      skills: string[];
      projects: ProjectDraft[];
      socialLinks: SocialLinkDraft[];
      themeId: "sage" | "blue" | "peach";
      selectedProjectId: string;
      newSkill: string;
      newProjectTitle: string;
      copied: boolean;
      saving: boolean;
      pageError: string;
      notice: string;
      socialDraft: SocialLinkDraft;
      setName: Dispatch<SetStateAction<string>>;
      setBio: Dispatch<SetStateAction<string>>;
      setEmail: Dispatch<SetStateAction<string>>;
      setSkills: Dispatch<SetStateAction<string[]>>;
      setProjects: Dispatch<SetStateAction<ProjectDraft[]>>;
      setSocialLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>;
      setThemeId: Dispatch<SetStateAction<"sage" | "blue" | "peach">>;
      setSelectedProjectId: Dispatch<SetStateAction<string>>;
      setNewSkill: Dispatch<SetStateAction<string>>;
      setNewProjectTitle: Dispatch<SetStateAction<string>>;
      setCopied: Dispatch<SetStateAction<boolean>>;
      setSaving: Dispatch<SetStateAction<boolean>>;
      setPageError: Dispatch<SetStateAction<string>>;
      setNotice: Dispatch<SetStateAction<string>>;
      setSocialDraft: Dispatch<SetStateAction<SocialLinkDraft>>;
    };
    
    function resolve<T>(value: SetStateAction<T>, current: T) {
      return typeof value === "function" ? (value as (previous: T) => T)(current) : value;
    }
    
    function createDashboardEditorStore(workspace: DashboardBootstrapResponse) {
      return createStore<DashboardEditorState>()((set) => {
        const setter = <K extends keyof DashboardEditorState>(key: K) => (value: SetStateAction<DashboardEditorState[K]>) =>
          set((state) => ({ [key]: resolve(value, state[key]) }) as Pick<DashboardEditorState, K>);
    
        return {
          workspace,
          name: workspace.card.name || "Your name",
          bio: workspace.card.bio,
          email: workspace.card.email,
          skills: workspace.card.skills,
          projects: workspace.projects.map((item) => ({ ...item, description: item.description ?? "" })),
          socialLinks: workspace.socialLinks.map((item) => ({ ...item, label: item.label ?? "" })),
          themeId: workspace.card.theme === "blue" || workspace.card.theme === "peach" ? workspace.card.theme : "sage",
          selectedProjectId: workspace.selectedProjectId,
          newSkill: "",
          newProjectTitle: "",
          copied: false,
          saving: false,
          pageError: "",
          notice: "",
          socialDraft: { platform: "github", label: "", url: "" },
          setName: setter("name"),
          setBio: setter("bio"),
          setEmail: setter("email"),
          setSkills: setter("skills"),
          setProjects: setter("projects"),
          setSocialLinks: setter("socialLinks"),
          setThemeId: setter("themeId"),
          setSelectedProjectId: setter("selectedProjectId"),
          setNewSkill: setter("newSkill"),
          setNewProjectTitle: setter("newProjectTitle"),
          setCopied: setter("copied"),
          setSaving: setter("saving"),
          setPageError: setter("pageError"),
          setNotice: setter("notice"),
          setSocialDraft: setter("socialDraft"),
        };
      });
    }
    
    export function useDashboardEditorStore(workspace: DashboardBootstrapResponse): StoreApi<DashboardEditorState> {
      const [store] = useState(() => createDashboardEditorStore(workspace));
      return store;
    }
    
    export type { DashboardEditorState };
    import type { Dispatch, FormEvent, SetStateAction } from "react";
    import type { DashboardBootstrapResponse } from "@/types/project";
    
    export type SocialLinkDraft = { id?: string; platform: "github" | "linkedin" | "x" | "other"; label: string; url: string };
    export type ProjectDraft = { id: string; title: string; description: string; assets: DashboardBootstrapResponse["projects"][number]["assets"] };
    type Notify = Dispatch<SetStateAction<string>>;
    
    export function useCardActions(input: {
      name: string; bio: string; email: string; skills: string[]; theme: string; socialLinks: SocialLinkDraft[];
      setSkills: Dispatch<SetStateAction<string[]>>; newSkill: string; setNewSkill: Dispatch<SetStateAction<string>>;
      socialDraft: SocialLinkDraft; setSocialDraft: Dispatch<SetStateAction<SocialLinkDraft>>;
      setSocialLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>;
      setSaving: Dispatch<SetStateAction<boolean>>; setError: Notify; setNotice: Notify;
    }) {
      async function saveCard() {
        input.setSaving(true); input.setError(""); input.setNotice("");
        try {
          const response = await fetch("/api/dashboard/card", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: input.name, bio: input.bio, email: input.email, skills: input.skills, theme: input.theme, socialLinks: input.socialLinks }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not save your card.");
          input.setNotice("Your card is saved.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not save your card."); }
        finally { input.setSaving(false); }
      }
    
      function addSkill(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const skill = input.newSkill.trim();
        if (skill && input.skills.length < 10 && !input.skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
          input.setSkills((current) => [...current, skill]);
        }
        input.setNewSkill("");
      }
    
      function addSocial(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!input.socialDraft.url.trim() || input.socialLinks.length >= 8) return;
        input.setSocialLinks((current) => [...current, { ...input.socialDraft, id: crypto.randomUUID(), url: input.socialDraft.url.trim() }]);
        input.setSocialDraft({ platform: "github", label: "", url: "" });
      }
    
      return { saveCard, addSkill, addSocial };
    }
    
    export function useProjectActions(input: {
      projects: ProjectDraft[]; setProjects: Dispatch<SetStateAction<ProjectDraft[]>>;
      setSelectedProjectId: Dispatch<SetStateAction<string>>; newProjectTitle: string;
      setNewProjectTitle: Dispatch<SetStateAction<string>>; setError: Notify; setNotice: Notify;
    }) {
      async function addProject(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const title = input.newProjectTitle.trim();
        if (!title || input.projects.length >= 5) return;
        input.setError("");
        try {
          const response = await fetch("/api/dashboard/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not add project.");
          const added = { ...result.project, description: result.project.description ?? "", assets: [] } as ProjectDraft;
          input.setProjects((current) => [...current, added]); input.setSelectedProjectId(added.id); input.setNewProjectTitle("");
          input.setNotice("Project added.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not add project."); }
      }
    
      async function saveProject(item: ProjectDraft) {
        input.setError("");
        try {
          const response = await fetch(`/api/dashboard/projects/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not save project.");
          input.setNotice("Project saved.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not save project."); }
      }
    
      async function deleteProject(projectId: string) {
        input.setError("");
        try {
          const response = await fetch(`/api/dashboard/projects/${projectId}`, { method: "DELETE" });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not queue project deletion.");
          const remaining = input.projects.filter((item) => item.id !== projectId);
          input.setProjects(remaining); input.setSelectedProjectId(remaining[0]?.id ?? "");
          input.setNotice("Project removed. Media cleanup is queued.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not remove project."); }
      }
    
      return { addProject, saveProject, deleteProject };
    }
    
    export function copyCardLink(cardUrl: string, setCopied: Dispatch<SetStateAction<boolean>>) {
      return navigator.clipboard.writeText(cardUrl)
        .then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); })
        .catch(() => setCopied(false));
    }
    ✓ • 171ms

## Activity

    $ sed -n '1,220p' components/dashboard/DashboardEditorLayout.tsx && sed -n '1,180p' app/dashboard/page.tsx
    "use client";
    
    import Image from "next/image";
    import Link from "next/link";
    import type { Dispatch, FormEvent, SetStateAction } from "react";
    import ProjectAssetUploader from "@/components/dashboard/ProjectAssetUploader";
    import { CARD_THEMES as looks } from "@/lib/themes";
    import type { DashboardBootstrapResponse } from "@/types/project";
    import type { ProjectDraft, SocialLinkDraft } from "@/components/dashboard/useDashboardActions";
    
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
    import type { Metadata } from "next";
    import { connection } from "next/server";
    import { headers } from "next/headers";
    import { redirect } from "next/navigation";
    import { Suspense } from "react";
    import { and, asc, eq, isNull } from "drizzle-orm";
    import DashboardEditor from "@/components/dashboard/DashboardEditor";
    import { auth } from "@/lib/auth";
    import { db } from "@/lib/db";
    import { card, project, projectAsset, socialLink } from "@/lib/db/schema";
    import { normalizeSlug } from "@/lib/utils/normalize";
    import { randomUUID } from "node:crypto";
    import type { DashboardBootstrapResponse } from "@/types/project";
    import { getAppUrl } from "@/lib/environment";
    
    export const metadata: Metadata = {
      title: "Your card | Cardfoi",
      description: "Create and edit your shareable Cardfoi card.",
    };
    
    async function DashboardPageContent() {
      await connection();
      const session = await auth.api.getSession({ headers: await headers() });
    
      if (!session) {
        redirect("/sign-in");
      }
    
      let [userCard] = await db.select().from(card)
        .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1);
      if (!userCard) {
        const suffix = randomUUID().slice(0, 8);
        const base = normalizeSlug(session.user.name) || "card";
        const [created] = await db.insert(card).values({
          ownerId: session.user.id,
          slug: `${base.slice(0, 31)}-${suffix}`,
          name: session.user.name,
          bio: "",
          email: session.user.email,
          emailVerified: session.user.emailVerified,
          skills: [],
          theme: "sage",
          template: "default",
        }).onConflictDoNothing({ target: card.ownerId }).returning();
        userCard = created ?? (await db.select().from(card)
          .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1))[0];
      }
      if (!userCard) throw new Error("Could not initialize card.");
    
      let [firstProject] = await db.select().from(project)
        .where(and(eq(project.cardId, userCard.id), isNull(project.deletedAt))).orderBy(project.position).limit(1);
      if (!firstProject) {
        const [createdProject] = await db.insert(project).values({ cardId: userCard.id, title: "My first project", position: 0 }).returning();
        firstProject = createdProject;
      }
    
      const projects = await db.select().from(project)
        .where(and(eq(project.cardId, userCard.id), isNull(project.deletedAt)))
        .orderBy(asc(project.position));
      const [projectsWithAssets, links] = await Promise.all([
        Promise.all(projects.map(async (item) => ({
          ...item,
          assets: await db.select().from(projectAsset)
            .where(and(eq(projectAsset.projectId, item.id), isNull(projectAsset.deletedAt)))
            .orderBy(asc(projectAsset.position)),
        }))),
        db.select().from(socialLink).where(eq(socialLink.cardId, userCard.id)).orderBy(asc(socialLink.position)),
      ]);
      const initialWorkspace: DashboardBootstrapResponse = {
        card: userCard,
        projects: projectsWithAssets,
        selectedProjectId: firstProject.id,
        socialLinks: links,
      };
      const appUrl = getAppUrl();
    
      return (
        <DashboardEditor
          userName={session.user.name}
          userEmail={session.user.email}
          appUrl={appUrl}
          initialWorkspace={initialWorkspace}
        />
      );
    }
    
    export default function DashboardPage() {
      return (
        <Suspense
          fallback={
            <main className="min-h-screen bg-[#f5f5f0] px-5 py-8" aria-busy="true">
              <div className="mx-auto max-w-[1440px]">
                <div className="h-8 w-32 animate-pulse rounded-full bg-[#e8e9e1]" />
                <div className="mt-12 h-16 w-72 max-w-full animate-pulse rounded-2xl bg-[#e8e9e1]" />
                <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
                  <div className="h-[620px] animate-pulse rounded-[26px] bg-white" />
                  <div className="space-y-5">
                    <div className="h-52 animate-pulse rounded-[24px] bg-white" />
                    <div className="h-64 animate-pulse rounded-[24px] bg-white" />
                  </div>
                </div>
              </div>
              <span className="sr-only">Loading your card editor…</span>
            </main>
          }
        >
          <DashboardPageContent />
        </Suspense>
      );
    }
    ✓ • 177ms

## Activity

    $ sed -n '1,220p' node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md && find node_modules/next/dist/docs/01-app -type f | rg 'server-and-client-components|linking-and-navigating' | head -10
    ---
    title: layout.js
    description: API reference for the layout.js file.
    ---
    
    The `layout` file is used to define a layout in your Next.js application.
    
    ```tsx filename="app/dashboard/layout.tsx" switcher
    export default function DashboardLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return <section>{children}</section>
    }
    ```
    
    ```jsx filename="app/dashboard/layout.js" switcher
    export default function DashboardLayout({ children }) {
      return <section>{children}</section>
    }
    ```
    
    In the [component hierarchy](/docs/app/getting-started/project-structure#component-hierarchy), `layout.js` is the outermost component in a route segment. It wraps `template.js`, `error.js`, `loading.js`, `not-found.js`, and `page.js`.
    
    A **root layout** is the top-most layout in the root `app` directory. It is used to define the `<html>` and `<body>` tags and other globally shared UI.
    
    ```tsx filename="app/layout.tsx" switcher
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      )
    }
    ```
    
    ```jsx filename="app/layout.js" switcher
    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      )
    }
    ```
    
    ## Reference
    
    ### Props
    
    #### `children` (required)
    
    Layout components should accept and use a `children` prop. During rendering, `children` will be populated with the route segments the layout is wrapping. These will primarily be the component of a child [Layout](/docs/app/api-reference/file-conventions/page) (if it exists) or [Page](/docs/app/api-reference/file-conventions/page), but could also be other special files like [Loading](/docs/app/api-reference/file-conventions/loading) or [Error](/docs/app/getting-started/error-handling) when applicable.
    
    #### `params` (optional)
    
    A promise that resolves to an object containing the [dynamic route parameters](/docs/app/api-reference/file-conventions/dynamic-routes) object from the root segment down to that layout.
    
    ```tsx filename="app/dashboard/[team]/layout.tsx" switcher
    export default async function Layout({
      children,
      params,
    }: {
      children: React.ReactNode
      params: Promise<{ team: string }>
    }) {
      const { team } = await params
    }
    ```
    
    ```jsx filename="app/dashboard/[team]/layout.js" switcher
    export default async function Layout({ children, params }) {
      const { team } = await params
    }
    ```
    
    | Example Route                     | URL            | `params`                           |
    | --------------------------------- | -------------- | ---------------------------------- |
    | `app/dashboard/[team]/layout.js`  | `/dashboard/1` | `Promise<{ team: '1' }>`           |
    | `app/shop/[tag]/[item]/layout.js` | `/shop/1/2`    | `Promise<{ tag: '1', item: '2' }>` |
    | `app/blog/[...slug]/layout.js`    | `/blog/1/2`    | `Promise<{ slug: ['1', '2'] }>`    |
    
    - Since the `params` prop is a promise. You must use `async/await` or React's [`use`](https://react.dev/reference/react/use) function to access the values.
      - In version 14 and earlier, `params` was a synchronous prop. To help with backwards compatibility, you can still access it synchronously in Next.js 15, but this behavior will be deprecated in the future.
    
    ### Layout Props Helper
    
    You can type layouts with `LayoutProps` to get a strongly typed `params` and named slots inferred from your directory structure. `LayoutProps` is a globally available helper.
    
    ```tsx filename="app/dashboard/layout.tsx"
    export default function Layout(props: LayoutProps<'/dashboard'>) {
      return (
        <section>
          {props.children}
          {/* If you have app/dashboard/@analytics, it appears as a typed slot: */}
          {/* {props.analytics} */}
        </section>
      )
    }
    ```
    
    > **Good to know**:
    >
    > - Types are generated during `next dev`, `next build` or `next typegen`.
    > - After type generation, the `LayoutProps` helper is globally available. It doesn't need to be imported.
    
    ### Root Layout
    
    The `app` directory **must** include a **root layout**, which is the top-most layout in the root `app` directory. Typically, the root layout is `app/layout.js`.
    
    ```tsx filename="app/layout.tsx" switcher
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return (
        <html>
          <body>{children}</body>
        </html>
      )
    }
    ```
    
    ```jsx filename="app/layout.js" switcher
    export default function RootLayout({ children }) {
      return (
        <html>
          <body>{children}</body>
        </html>
      )
    }
    ```
    
    - The root layout **must** define `<html>` and `<body>` tags.
      - You should **not** manually add `<head>` tags such as `<title>` and `<meta>` to root layouts. Instead, you should use the [Metadata API](/docs/app/getting-started/metadata-and-og-images) which automatically handles advanced requirements such as streaming and de-duplicating `<head>` elements.
    - You can create **multiple root layouts**. Any layout without a `layout.js` above it is a root layout. Two common approaches:
      - Using [route groups](/docs/app/api-reference/file-conventions/route-groups) like `app/(shop)/layout.js` and `app/(marketing)/layout.js`
      - Omitting `app/layout.js` so layouts in subdirectories like `app/dashboard/layout.js` and `app/blog/layout.js` each become root layouts for their respective directories.
      - Navigating **across multiple root layouts** will cause a **full page load** (as opposed to a client-side navigation).
    - The root layout can be under a **dynamic segment**, for example when implementing [internationalization](/docs/app/guides/internationalization) with `app/[lang]/layout.js`. Dynamic segments before the root layout are **root parameters** and can be read from any Server Component with [`next/root-params`](/docs/app/api-reference/functions/next-root-params).
    
    ## Caveats
    
    ### Request Object
    
    Layouts are cached in the client during navigation to avoid unnecessary server requests.
    
    [Layouts](/docs/app/api-reference/file-conventions/layout) do not rerender. They can be cached and reused to avoid unnecessary computation when navigating between pages. By restricting layouts from accessing the raw request, Next.js can prevent the execution of potentially slow or expensive user code within the layout, which could negatively impact performance.
    
    To access the request object, you can use [`headers`](/docs/app/api-reference/functions/headers) and [`cookies`](/docs/app/api-reference/functions/cookies) APIs in [Server Components](/docs/app/getting-started/server-and-client-components) and Functions.
    
    ```tsx filename="app/shop/layout.tsx" switcher
    import { cookies } from 'next/headers'
    
    export default async function Layout({ children }) {
      const cookieStore = await cookies()
      const theme = cookieStore.get('theme')
      return '...'
    }
    ```
    
    ```jsx filename="app/shop/layout.js" switcher
    import { cookies } from 'next/headers'
    
    export default async function Layout({ children }) {
      const cookieStore = await cookies()
      const theme = cookieStore.get('theme')
      return '...'
    }
    ```
    
    ### Query params
    
    Layouts do not rerender on navigation, so they cannot access search params which would otherwise become stale.
    
    To access updated query parameters, you can use the Page [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional) prop, or read them inside a Client Component using the [`useSearchParams`](/docs/app/api-reference/functions/use-search-params) hook. Since Client Components re-render on navigation, they have access to the latest query parameters.
    
    ```tsx filename="app/ui/search.tsx" switcher
    'use client'
    
    import { useSearchParams } from 'next/navigation'
    
    export default function Search() {
      const searchParams = useSearchParams()
    
      const search = searchParams.get('search')
    
      return '...'
    }
    ```
    
    ```jsx filename="app/ui/search.js" switcher
    'use client'
    
    import { useSearchParams } from 'next/navigation'
    
    export default function Search() {
      const searchParams = useSearchParams()
    
      const search = searchParams.get('search')
    
      return '...'
    }
    ```
    
    ```tsx filename="app/shop/layout.tsx" switcher
    import Search from '@/app/ui/search'
    
    export default function Layout({ children }) {
      return (
        <>
          <Search />
          {children}
        </>
    node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
    node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md
    ✓ • 176ms

## Activity

    • Context compacted

## Assistant

I’ll turn the dashboard into the agreed editor shell: responsive navigation, section based editing, live preview, and visible autosave state. I’ll keep the current APIs and direct upload flow, then verify the project still builds.

## Activity

    $ sed -n '1,220p' components/dashboard/DashboardEditor.tsx && sed -n '1,260p' components/dashboard/dashboardEditorStore.ts && sed -n '1,320p' components/dashboard/useDashboardActions.ts
    "use client";
    
    import { useStore } from "zustand";
    import DashboardEditorLayout from "@/components/dashboard/DashboardEditorLayout";
    import { useDashboardEditorStore } from "@/components/dashboard/dashboardEditorStore";
    import { copyCardLink, useCardActions, useProjectActions } from "@/components/dashboard/useDashboardActions";
    import type { DashboardBootstrapResponse } from "@/types/project";
    
    export type DashboardEditorProps = { userName: string; userEmail: string; appUrl: string; initialWorkspace: DashboardBootstrapResponse };
    
    export default function DashboardEditor({ userName, userEmail, appUrl, initialWorkspace }: DashboardEditorProps) {
      const store = useDashboardEditorStore(initialWorkspace);
      const state = useStore(store);
      const cardActions = useCardActions({
        name: state.name,
        bio: state.bio,
        email: state.email,
        skills: state.skills,
        theme: state.themeId,
        socialLinks: state.socialLinks,
        setSkills: state.setSkills,
        newSkill: state.newSkill,
        setNewSkill: state.setNewSkill,
        socialDraft: state.socialDraft,
        setSocialDraft: state.setSocialDraft,
        setSocialLinks: state.setSocialLinks,
        setSaving: state.setSaving,
        setError: state.setPageError,
        setNotice: state.setNotice,
      });
      const projectActions = useProjectActions({
        projects: state.projects,
        setProjects: state.setProjects,
        setSelectedProjectId: state.setSelectedProjectId,
        newProjectTitle: state.newProjectTitle,
        setNewProjectTitle: state.setNewProjectTitle,
        setError: state.setPageError,
        setNotice: state.setNotice,
      });
    
      return (
        <DashboardEditorLayout
          userName={userName}
          userEmail={userEmail}
          appUrl={appUrl}
          workspace={state.workspace}
          name={state.name}
          bio={state.bio}
          email={state.email}
          skills={state.skills}
          projects={state.projects}
          socialLinks={state.socialLinks}
          themeId={state.themeId}
          selectedProjectId={state.selectedProjectId}
          newSkill={state.newSkill}
          newProjectTitle={state.newProjectTitle}
          copied={state.copied}
          saving={state.saving}
          pageError={state.pageError}
          notice={state.notice}
          socialDraft={state.socialDraft}
          setName={state.setName}
          setBio={state.setBio}
          setEmail={state.setEmail}
          setSkills={state.setSkills}
          setProjects={state.setProjects}
          setSocialLinks={state.setSocialLinks}
          setThemeId={state.setThemeId}
          setSelectedProjectId={state.setSelectedProjectId}
          setNewSkill={state.setNewSkill}
          setNewProjectTitle={state.setNewProjectTitle}
          setSocialDraft={state.setSocialDraft}
          cardActions={cardActions}
          projectActions={projectActions}
          onCopy={() => void copyCardLink(`${appUrl}/${state.workspace.card.slug}`, state.setCopied)}
        />
      );
    }
    import { useState } from "react";
    import { createStore, type StoreApi } from "zustand/vanilla";
    import type { Dispatch, SetStateAction } from "react";
    import type { DashboardBootstrapResponse } from "@/types/project";
    import type { ProjectDraft, SocialLinkDraft } from "@/components/dashboard/useDashboardActions";
    
    type DashboardEditorState = {
      workspace: DashboardBootstrapResponse;
      name: string;
      bio: string;
      email: string;
      skills: string[];
      projects: ProjectDraft[];
      socialLinks: SocialLinkDraft[];
      themeId: "sage" | "blue" | "peach";
      selectedProjectId: string;
      newSkill: string;
      newProjectTitle: string;
      copied: boolean;
      saving: boolean;
      pageError: string;
      notice: string;
      socialDraft: SocialLinkDraft;
      setName: Dispatch<SetStateAction<string>>;
      setBio: Dispatch<SetStateAction<string>>;
      setEmail: Dispatch<SetStateAction<string>>;
      setSkills: Dispatch<SetStateAction<string[]>>;
      setProjects: Dispatch<SetStateAction<ProjectDraft[]>>;
      setSocialLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>;
      setThemeId: Dispatch<SetStateAction<"sage" | "blue" | "peach">>;
      setSelectedProjectId: Dispatch<SetStateAction<string>>;
      setNewSkill: Dispatch<SetStateAction<string>>;
      setNewProjectTitle: Dispatch<SetStateAction<string>>;
      setCopied: Dispatch<SetStateAction<boolean>>;
      setSaving: Dispatch<SetStateAction<boolean>>;
      setPageError: Dispatch<SetStateAction<string>>;
      setNotice: Dispatch<SetStateAction<string>>;
      setSocialDraft: Dispatch<SetStateAction<SocialLinkDraft>>;
    };
    
    function resolve<T>(value: SetStateAction<T>, current: T) {
      return typeof value === "function" ? (value as (previous: T) => T)(current) : value;
    }
    
    function createDashboardEditorStore(workspace: DashboardBootstrapResponse) {
      return createStore<DashboardEditorState>()((set) => {
        const setter = <K extends keyof DashboardEditorState>(key: K) => (value: SetStateAction<DashboardEditorState[K]>) =>
          set((state) => ({ [key]: resolve(value, state[key]) }) as Pick<DashboardEditorState, K>);
    
        return {
          workspace,
          name: workspace.card.name || "Your name",
          bio: workspace.card.bio,
          email: workspace.card.email,
          skills: workspace.card.skills,
          projects: workspace.projects.map((item) => ({ ...item, description: item.description ?? "" })),
          socialLinks: workspace.socialLinks.map((item) => ({ ...item, label: item.label ?? "" })),
          themeId: workspace.card.theme === "blue" || workspace.card.theme === "peach" ? workspace.card.theme : "sage",
          selectedProjectId: workspace.selectedProjectId,
          newSkill: "",
          newProjectTitle: "",
          copied: false,
          saving: false,
          pageError: "",
          notice: "",
          socialDraft: { platform: "github", label: "", url: "" },
          setName: setter("name"),
          setBio: setter("bio"),
          setEmail: setter("email"),
          setSkills: setter("skills"),
          setProjects: setter("projects"),
          setSocialLinks: setter("socialLinks"),
          setThemeId: setter("themeId"),
          setSelectedProjectId: setter("selectedProjectId"),
          setNewSkill: setter("newSkill"),
          setNewProjectTitle: setter("newProjectTitle"),
          setCopied: setter("copied"),
          setSaving: setter("saving"),
          setPageError: setter("pageError"),
          setNotice: setter("notice"),
          setSocialDraft: setter("socialDraft"),
        };
      });
    }
    
    export function useDashboardEditorStore(workspace: DashboardBootstrapResponse): StoreApi<DashboardEditorState> {
      const [store] = useState(() => createDashboardEditorStore(workspace));
      return store;
    }
    
    export type { DashboardEditorState };
    import type { Dispatch, FormEvent, SetStateAction } from "react";
    import type { DashboardBootstrapResponse } from "@/types/project";
    
    export type SocialLinkDraft = { id?: string; platform: "github" | "linkedin" | "x" | "other"; label: string; url: string };
    export type ProjectDraft = { id: string; title: string; description: string; assets: DashboardBootstrapResponse["projects"][number]["assets"] };
    type Notify = Dispatch<SetStateAction<string>>;
    
    export function useCardActions(input: {
      name: string; bio: string; email: string; skills: string[]; theme: string; socialLinks: SocialLinkDraft[];
      setSkills: Dispatch<SetStateAction<string[]>>; newSkill: string; setNewSkill: Dispatch<SetStateAction<string>>;
      socialDraft: SocialLinkDraft; setSocialDraft: Dispatch<SetStateAction<SocialLinkDraft>>;
      setSocialLinks: Dispatch<SetStateAction<SocialLinkDraft[]>>;
      setSaving: Dispatch<SetStateAction<boolean>>; setError: Notify; setNotice: Notify;
    }) {
      async function saveCard() {
        input.setSaving(true); input.setError(""); input.setNotice("");
        try {
          const response = await fetch("/api/dashboard/card", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: input.name, bio: input.bio, email: input.email, skills: input.skills, theme: input.theme, socialLinks: input.socialLinks }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not save your card.");
          input.setNotice("Your card is saved.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not save your card."); }
        finally { input.setSaving(false); }
      }
    
      function addSkill(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const skill = input.newSkill.trim();
        if (skill && input.skills.length < 10 && !input.skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
          input.setSkills((current) => [...current, skill]);
        }
        input.setNewSkill("");
      }
    
      function addSocial(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!input.socialDraft.url.trim() || input.socialLinks.length >= 8) return;
        input.setSocialLinks((current) => [...current, { ...input.socialDraft, id: crypto.randomUUID(), url: input.socialDraft.url.trim() }]);
        input.setSocialDraft({ platform: "github", label: "", url: "" });
      }
    
      return { saveCard, addSkill, addSocial };
    }
    
    export function useProjectActions(input: {
      projects: ProjectDraft[]; setProjects: Dispatch<SetStateAction<ProjectDraft[]>>;
      setSelectedProjectId: Dispatch<SetStateAction<string>>; newProjectTitle: string;
      setNewProjectTitle: Dispatch<SetStateAction<string>>; setError: Notify; setNotice: Notify;
    }) {
      async function addProject(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const title = input.newProjectTitle.trim();
        if (!title || input.projects.length >= 5) return;
        input.setError("");
        try {
          const response = await fetch("/api/dashboard/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not add project.");
          const added = { ...result.project, description: result.project.description ?? "", assets: [] } as ProjectDraft;
          input.setProjects((current) => [...current, added]); input.setSelectedProjectId(added.id); input.setNewProjectTitle("");
          input.setNotice("Project added.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not add project."); }
      }
    
      async function saveProject(item: ProjectDraft) {
        input.setError("");
        try {
          const response = await fetch(`/api/dashboard/projects/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not save project.");
          input.setNotice("Project saved.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not save project."); }
      }
    
      async function deleteProject(projectId: string) {
        input.setError("");
        try {
          const response = await fetch(`/api/dashboard/projects/${projectId}`, { method: "DELETE" });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not queue project deletion.");
          const remaining = input.projects.filter((item) => item.id !== projectId);
          input.setProjects(remaining); input.setSelectedProjectId(remaining[0]?.id ?? "");
          input.setNotice("Project removed. Media cleanup is queued.");
        } catch (error) { input.setError(error instanceof Error ? error.message : "Could not remove project."); }
      }
    
      return { addProject, saveProject, deleteProject };
    }
    
    export function copyCardLink(cardUrl: string, setCopied: Dispatch<SetStateAction<boolean>>) {
      return navigator.clipboard.writeText(cardUrl)
        .then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); })
        .catch(() => setCopied(false));
    }
    ✓ • 65ms

## Activity

    $ pwd && rg --files -g 'AGENTS.md' -g 'DashboardEditor*.tsx' -g 'dashboardEditorStore.ts' -g 'useDashboardActions.ts' -g 'ProjectAssetUploader.tsx' -g 'page.tsx' app components lib | sed -n '1,160p'
    /home/andro/projects/cardfoi
    app/sign-up/page.tsx
    app/page.tsx
    app/dashboard/page.tsx
    app/sign-in/page.tsx
    app/[slug]/page.tsx
    components/dashboard/ProjectAssetUploader.tsx
    components/dashboard/dashboardEditorStore.ts
    components/dashboard/useDashboardActions.ts
    components/dashboard/DashboardEditorLayout.tsx
    components/dashboard/DashboardEditor.tsx
    ✓ • 87ms

## Activity

    $ sed -n '1,360p' components/dashboard/DashboardEditorLayout.tsx
    "use client";
    
    import Image from "next/image";
    import Link from "next/link";
    import type { Dispatch, FormEvent, SetStateAction } from "react";
    import ProjectAssetUploader from "@/components/dashboard/ProjectAssetUploader";
    import { CARD_THEMES as looks } from "@/lib/themes";
    import type { DashboardBootstrapResponse } from "@/types/project";
    import type { ProjectDraft, SocialLinkDraft } from "@/components/dashboard/useDashboardActions";
    
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
    ✓ • 72ms

## Activity

    $ sed -n '1,280p' components/dashboard/ProjectAssetUploader.tsx && sed -n '1,220p' app/dashboard/page.tsx && cat package.json
    "use client";
    
    import { useRef, useState } from "react";
    import type { ProjectAssetView } from "@/types/project";
    
    const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    
    export default function ProjectAssetUploader({
      projectId,
      initialAssets,
    }: {
      projectId: string;
      initialAssets: ProjectAssetView[];
    }) {
      const [assets, setAssets] = useState(initialAssets);
      const [busy, setBusy] = useState(false);
      const [message, setMessage] = useState("");
      const inputRef = useRef<HTMLInputElement>(null);
    
      async function upload(file?: File) {
        if (!file) return;
        setMessage("");
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setMessage("Choose a JPEG, PNG, WebP, or MP4 file.");
          return;
        }
        const maxBytes = file.type === "video/mp4" ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxBytes) {
          setMessage(file.type === "video/mp4" ? "Videos can be up to 25 MB." : "Images can be up to 5 MB.");
          return;
        }
    
        setBusy(true);
        try {
          const authorizationResponse = await fetch("/api/media/upload-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, mimeType: file.type, sizeBytes: file.size }),
          });
          const authorizationResult = await authorizationResponse.json();
          if (!authorizationResponse.ok) throw new Error(authorizationResult.error ?? "Could not authorize upload.");
    
          const { uploadId, authorization } = authorizationResult;
          const form = new FormData();
          form.set("file", file);
          form.set("fileName", authorization.fileName);
          form.set("publicKey", authorization.publicKey);
          form.set("signature", authorization.signature);
          form.set("token", authorization.token);
          form.set("expire", String(authorization.expire));
          form.set("folder", authorization.folder);
          form.set("useUniqueFileName", "false");
          const imageKitResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
            method: "POST",
            body: form,
          });
          const uploaded = await imageKitResponse.json();
          if (!imageKitResponse.ok || typeof uploaded.fileId !== "string") {
            throw new Error(uploaded.message ?? "Image upload failed.");
          }
    
          const completionResponse = await fetch("/api/media/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId,
              uploadId,
              mimeType: file.type,
              sizeBytes: file.size,
              fileId: uploaded.fileId,
            }),
          });
          if (!completionResponse.ok) {
            const error = await completionResponse.json().catch(() => ({}));
            throw new Error(error.error ?? "Could not save uploaded media.");
          }
          const completion = await completionResponse.json();
          setAssets((current) => current.some((asset) => asset.id === completion.asset.id)
            ? current
            : [...current, completion.asset as ProjectAssetView]);
          setMessage("Upload complete.");
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Upload failed.");
        } finally {
          setBusy(false);
          if (inputRef.current) inputRef.current.value = "";
        }
      }
    
      async function removeAsset(assetId: string) {
        setMessage("");
        try {
          const response = await fetch(`/api/dashboard/assets/${assetId}`, { method: "DELETE" });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not queue asset deletion.");
          setAssets((current) => current.filter((asset) => asset.id !== assetId));
          setMessage("Asset removed. File cleanup is queued.");
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not queue asset deletion.");
        }
      }
    
      return (
        <section className="rounded-[24px] border border-[#e6e7df] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#7d866f]">Project proof</p>
              <h2 className="mt-1.5 text-sm font-semibold tracking-tight">Add images or video</h2>
            </div>
            <span className="font-mono text-[9px] text-[#a0a297]">{assets.length} / 4</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            aria-label="Choose a project proof file"
            accept="image/jpeg,image/png,image/webp,video/mp4"
            className="sr-only"
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <button
            type="button"
            aria-label={busy ? "Uploading project proof" : assets.length >= 4 ? "Project proof asset limit reached" : "Choose a project proof file"}
            disabled={busy || assets.length >= 4}
            onClick={() => inputRef.current?.click()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#dfe2d8] py-3 text-[10px] font-medium text-[#66715a] transition hover:border-[#aeb89f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Uploading…" : assets.length >= 4 ? "Asset limit reached" : "＋ Choose a file"}
          </button>
          <p className="mt-2 text-[9px] leading-4 text-[#92958c]">Images up to 5 MB · MP4 videos up to 25 MB</p>
          {message && <p role="status" className="mt-2 text-[10px] text-[#68725c]">{message}</p>}
          {assets.length > 0 && (
            <ul className="mt-4 space-y-2">
              {assets.map((asset) => (
                <li key={asset.id} className="flex items-center gap-3 rounded-xl bg-[#f7f8f4] p-2.5">
                  {asset.type === "image" ? (
                    // Remote media is rendered by the provider's public URL.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.url} alt="" className="h-10 w-12 rounded-lg object-cover" />
                  ) : <span className="flex h-10 w-12 items-center justify-center rounded-lg bg-[#e9eddf] text-xs">▶</span>}
                  <span className="min-w-0 flex-1 truncate text-[10px] text-[#62695b]">{asset.type === "video" ? "Video proof" : "Image proof"}</span>
                  <button type="button" aria-label={`Remove ${asset.type} proof`} onClick={() => void removeAsset(asset.id)} className="text-[9px] text-[#8a8d84] hover:text-[#a25f4a]">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      );
    }
    import type { Metadata } from "next";
    import { connection } from "next/server";
    import { headers } from "next/headers";
    import { redirect } from "next/navigation";
    import { Suspense } from "react";
    import { and, asc, eq, isNull } from "drizzle-orm";
    import DashboardEditor from "@/components/dashboard/DashboardEditor";
    import { auth } from "@/lib/auth";
    import { db } from "@/lib/db";
    import { card, project, projectAsset, socialLink } from "@/lib/db/schema";
    import { normalizeSlug } from "@/lib/utils/normalize";
    import { randomUUID } from "node:crypto";
    import type { DashboardBootstrapResponse } from "@/types/project";
    import { getAppUrl } from "@/lib/environment";
    
    export const metadata: Metadata = {
      title: "Your card | Cardfoi",
      description: "Create and edit your shareable Cardfoi card.",
    };
    
    async function DashboardPageContent() {
      await connection();
      const session = await auth.api.getSession({ headers: await headers() });
    
      if (!session) {
        redirect("/sign-in");
      }
    
      let [userCard] = await db.select().from(card)
        .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1);
      if (!userCard) {
        const suffix = randomUUID().slice(0, 8);
        const base = normalizeSlug(session.user.name) || "card";
        const [created] = await db.insert(card).values({
          ownerId: session.user.id,
          slug: `${base.slice(0, 31)}-${suffix}`,
          name: session.user.name,
          bio: "",
          email: session.user.email,
          emailVerified: session.user.emailVerified,
          skills: [],
          theme: "sage",
          template: "default",
        }).onConflictDoNothing({ target: card.ownerId }).returning();
        userCard = created ?? (await db.select().from(card)
          .where(and(eq(card.ownerId, session.user.id), isNull(card.deletedAt))).limit(1))[0];
      }
      if (!userCard) throw new Error("Could not initialize card.");
    
      let [firstProject] = await db.select().from(project)
        .where(and(eq(project.cardId, userCard.id), isNull(project.deletedAt))).orderBy(project.position).limit(1);
      if (!firstProject) {
        const [createdProject] = await db.insert(project).values({ cardId: userCard.id, title: "My first project", position: 0 }).returning();
        firstProject = createdProject;
      }
    
      const projects = await db.select().from(project)
        .where(and(eq(project.cardId, userCard.id), isNull(project.deletedAt)))
        .orderBy(asc(project.position));
      const [projectsWithAssets, links] = await Promise.all([
        Promise.all(projects.map(async (item) => ({
          ...item,
          assets: await db.select().from(projectAsset)
            .where(and(eq(projectAsset.projectId, item.id), isNull(projectAsset.deletedAt)))
            .orderBy(asc(projectAsset.position)),
        }))),
        db.select().from(socialLink).where(eq(socialLink.cardId, userCard.id)).orderBy(asc(socialLink.position)),
      ]);
      const initialWorkspace: DashboardBootstrapResponse = {
        card: userCard,
        projects: projectsWithAssets,
        selectedProjectId: firstProject.id,
        socialLinks: links,
      };
      const appUrl = getAppUrl();
    
      return (
        <DashboardEditor
          userName={session.user.name}
          userEmail={session.user.email}
          appUrl={appUrl}
          initialWorkspace={initialWorkspace}
        />
      );
    }
    
    export default function DashboardPage() {
      return (
        <Suspense
          fallback={
            <main className="min-h-screen bg-[#f5f5f0] px-5 py-8" aria-busy="true">
              <div className="mx-auto max-w-[1440px]">
                <div className="h-8 w-32 animate-pulse rounded-full bg-[#e8e9e1]" />
                <div className="mt-12 h-16 w-72 max-w-full animate-pulse rounded-2xl bg-[#e8e9e1]" />
                <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
                  <div className="h-[620px] animate-pulse rounded-[26px] bg-white" />
                  <div className="space-y-5">
                    <div className="h-52 animate-pulse rounded-[24px] bg-white" />
                    <div className="h-64 animate-pulse rounded-[24px] bg-white" />
                  </div>
                </div>
              </div>
              <span className="sr-only">Loading your card editor…</span>
            </main>
          }
        >
          <DashboardPageContent />
        </Suspense>
      );
    }
    {
      "name": "cardfoi",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "eslint",
        "db:generate": "drizzle-kit generate",
        "db:migrate": "drizzle-kit migrate",
        "jobs:requeue-deletions": "bun --env-file=.env.local scripts/requeue-deletions.ts"
      },
      "dependencies": {
        "@better-auth/drizzle-adapter": "^1.7.10",
        "@neondatabase/serverless": "^1.2.0",
        "better-auth": "^1.7.9",
        "dotenv": "^18.0.8",
        "drizzle-orm": "^0.45.4",
        "next": "16.4.0",
        "react": "19.3.0",
        "react-dom": "19.3.0",
        "ws": "^8.22.0",
        "zustand": "^5.0.15"
      },
      "devDependencies": {
        "@tailwindcss/turbopack": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "@types/ws": "^8.18.2",
        "drizzle-kit": "^0.31.11",
        "eslint": "^9",
        "eslint-config-next": "16.4.0",
        "tailwindcss": "^4",
        "typescript": "^5"
      },
      "packageManager": "bun@1.4.3",
      "ignoreScripts": [
        "sharp",
        "unrs-resolver"
      ],
      "trustedDependencies": [
        "sharp",
        "unrs-resolver"
      ]
    }
    ✓ • 71ms

## Activity

    $ find node_modules/next/dist/docs -type f \( -name 'layout.md' -o -name 'use-pathname.md' \) | head -10
    node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md
    node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-pathname.md
    ✓ • 113ms

## Activity

    file changes: Completed · 1 changes
    Update { move_path: None }: /home/andro/projects/cardfoi/components/dashboard/dashboardEditorStore.ts
    @@ -6,2 +6,5 @@
     
    +export type EditorSection = "profile" | "projects" | "appearance" | "settings";
    +export type CardSaveStatus = "saved" | "dirty" | "saving" | "failed";
    +
     type DashboardEditorState = {
    @@ -20,2 +23,7 @@
       saving: boolean;
    +  activeSection: EditorSection;
    +  mobileNavigationOpen: boolean;
    +  cardSaveStatus: CardSaveStatus;
    +  cardRevision: number;
    +  dirtySections: Record<"profile" | "appearance", boolean>;
       pageError: string;
    @@ -35,2 +43,7 @@
       setSaving: Dispatch<SetStateAction<boolean>>;
    +  setActiveSection: Dispatch<SetStateAction<EditorSection>>;
    +  setMobileNavigationOpen: Dispatch<SetStateAction<boolean>>;
    +  setCardSaveStatus: Dispatch<SetStateAction<CardSaveStatus>>;
    +  markCardDirty: (section: "profile" | "appearance") => void;
    +  markCardSaved: (revision: number) => boolean;
       setPageError: Dispatch<SetStateAction<string>>;
    @@ -63,2 +76,7 @@
           saving: false,
    +      activeSection: "profile",
    +      mobileNavigationOpen: false,
    +      cardSaveStatus: "saved",
    +      cardRevision: 0,
    +      dirtySections: { profile: false, appearance: false },
           pageError: "",
    @@ -78,2 +96,19 @@
           setSaving: setter("saving"),
    +      setActiveSection: setter("activeSection"),
    +      setMobileNavigationOpen: setter("mobileNavigationOpen"),
    +      setCardSaveStatus: setter("cardSaveStatus"),
    +      markCardDirty: (section) => set((state) => ({
    +        cardSaveStatus: "dirty",
    +        cardRevision: state.cardRevision + 1,
    +        dirtySections: { ...state.dirtySections, [section]: true },
    +      })),
    +      markCardSaved: (revision) => {
    +        let saved = false;
    +        set((state) => {
    +          if (state.cardRevision !== revision) return {};
    +          saved = true;
    +          return { cardSaveStatus: "saved", dirtySections: { profile: false, appearance: false } };
    +        });
    +        return saved;
    +      },
           setPageError: setter("pageError"),

## Activity

    file changes: Completed · 3 changes
    Update { move_path: None }: /home/andro/projects/cardfoi/components/dashboard/ProjectAssetUploader.tsx
    @@ -96,3 +96,3 @@
           setAssets((current) => current.filter((asset) => asset.id !== assetId));
    -      setMessage("Asset removed. File cleanup is queued.");
    +      setMessage("Asset removed.");
         } catch (error) {
    Add: /home/andro/projects/cardfoi/components/dashboard/useCardAutosave.ts
    "use client";
    
    import { useCallback, useEffect, useRef } from "react";
    import type { StoreApi } from "zustand/vanilla";
    import { saveCardSnapshot } from "@/components/dashboard/useDashboardActions";
    import type { DashboardEditorState } from "@/components/dashboard/dashboardEditorStore";
    
    const AUTOSAVE_DELAY_MS = 800;
    
    /**
     * Keeps card edits local while someone is typing, then sends one current
     * snapshot after a short pause. A later edit always wins over an older save.
     */
    export function useCardAutosave(store: StoreApi<DashboardEditorState>) {
      const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
      const savingRef = useRef(false);
      const needsAnotherSaveRef = useRef(false);
    
      const clearTimer = useCallback(() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }, []);
    
      const flush = useCallback(async () => {
        clearTimer();
    
        if (savingRef.current) {
          needsAnotherSaveRef.current = true;
          return;
        }
    
        const snapshot = store.getState();
        if (!snapshot.dirtySections.profile && !snapshot.dirtySections.appearance) return;
    
        const revision = snapshot.cardRevision;
        savingRef.current = true;
        snapshot.setCardSaveStatus("saving");
        snapshot.setPageError("");
    
        try {
          await saveCardSnapshot(snapshot);
          const wasCurrent = store.getState().markCardSaved(revision);
          if (!wasCurrent) needsAnotherSaveRef.current = true;
        } catch (error) {
          const latest = store.getState();
          latest.setCardSaveStatus("failed");
          latest.setPageError(error instanceof Error ? error.message : "Could not save your card.");
        } finally {
          savingRef.current = false;
          if (needsAnotherSaveRef.current) {
            needsAnotherSaveRef.current = false;
            void flush();
          }
        }
      }, [clearTimer, store]);
    
      const markDirty = useCallback((section: "profile" | "appearance") => {
        store.getState().markCardDirty(section);
        clearTimer();
        timerRef.current = setTimeout(() => void flush(), AUTOSAVE_DELAY_MS);
      }, [clearTimer, flush, store]);
    
      useEffect(() => clearTimer, [clearTimer]);
    
      return { markDirty, flush };
    }
    Update { move_path: None }: /home/andro/projects/cardfoi/components/dashboard/useDashboardActions.ts
    @@ -7,2 +7,26 @@
     
    +export type CardSaveSnapshot = Pick<
    +  import("@/components/dashboard/dashboardEditorStore").DashboardEditorState,
    +  "name" | "bio" | "email" | "skills" | "themeId" | "socialLinks"
    +>;
    +
    +export async function saveCardSnapshot(snapshot: CardSaveSnapshot) {
    +  const response = await fetch("/api/dashboard/card", {
    +    method: "PATCH",
    +    headers: { "Content-Type": "application/json" },
    +    body: JSON.stringify({
    +      name: snapshot.name,
    +      bio: snapshot.bio,
    +      email: snapshot.email,
    +      skills: snapshot.skills,
    +      theme: snapshot.themeId,
    +      socialLinks: snapshot.socialLinks,
    +    }),
    +  });
    +  if (response.ok) return;
    +
    +  const result = await response.json().catch(() => ({}));
    +  throw new Error(typeof result.error === "string" ? result.error : "Could not save your card.");
    +}
    +
     export function useCardActions(input: {
    @@ -17,8 +41,3 @@
         try {
    -      const response = await fetch("/api/dashboard/card", {
    -        method: "PATCH", headers: { "Content-Type": "application/json" },
    -        body: JSON.stringify({ name: input.name, bio: input.bio, email: input.email, skills: input.skills, theme: input.theme, socialLinks: input.socialLinks }),
    -      });
    -      const result = await response.json();
    -      if (!response.ok) throw new Error(result.error ?? "Could not save your card.");
    +      await saveCardSnapshot({ ...input, themeId: input.theme });
           input.setNotice("Your card is saved.");
    @@ -85,3 +104,3 @@
           input.setProjects(remaining); input.setSelectedProjectId(remaining[0]?.id ?? "");
    -      input.setNotice("Project removed. Media cleanup is queued.");
    +      input.setNotice("Project removed.");
         } catch (error) { input.setError(error instanceof Error ? error.message : "Could not remove project."); }

## Activity

    file changes: Completed · 1 changes
    Update { move_path: None }: /home/andro/projects/cardfoi/components/dashboard/DashboardEditor.tsx
    @@ -6,2 +6,3 @@
     import { copyCardLink, useCardActions, useProjectActions } from "@/components/dashboard/useDashboardActions";
    +import { useCardAutosave } from "@/components/dashboard/useCardAutosave";
     import type { DashboardBootstrapResponse } from "@/types/project";
    @@ -13,2 +14,17 @@
       const state = useStore(store);
    +  const autosave = useCardAutosave(store);
    +  const track = <T,>(
    +    setter: (value: React.SetStateAction<T>) => void,
    +    section: "profile" | "appearance",
    +  ) => (value: React.SetStateAction<T>) => {
    +    setter(value);
    +    autosave.markDirty(section);
    +  };
    +
    +  const setName = track(state.setName, "profile");
    +  const setBio = track(state.setBio, "profile");
    +  const setEmail = track(state.setEmail, "profile");
    +  const setSkills = track(state.setSkills, "profile");
    +  const setSocialLinks = track(state.setSocialLinks, "profile");
    +  const setThemeId = track(state.setThemeId, "appearance");
       const cardActions = useCardActions({
    @@ -20,3 +36,3 @@
         socialLinks: state.socialLinks,
    -    setSkills: state.setSkills,
    +    setSkills,
         newSkill: state.newSkill,
    @@ -25,3 +41,3 @@
         setSocialDraft: state.setSocialDraft,
    -    setSocialLinks: state.setSocialLinks,
    +    setSocialLinks,
         setSaving: state.setSaving,
    @@ -58,2 +74,6 @@
           saving={state.saving}
    +      activeSection={state.activeSection}
    +      mobileNavigationOpen={state.mobileNavigationOpen}
    +      cardSaveStatus={state.cardSaveStatus}
    +      dirtySections={state.dirtySections}
           pageError={state.pageError}
    @@ -61,9 +81,9 @@
           socialDraft={state.socialDraft}
    -      setName={state.setName}
    -      setBio={state.setBio}
    -      setEmail={state.setEmail}
    -      setSkills={state.setSkills}
    +      setName={setName}
    +      setBio={setBio}
    +      setEmail={setEmail}
    +      setSkills={setSkills}
           setProjects={state.setProjects}
    -      setSocialLinks={state.setSocialLinks}
    -      setThemeId={state.setThemeId}
    +      setSocialLinks={setSocialLinks}
    +      setThemeId={setThemeId}
           setSelectedProjectId={state.setSelectedProjectId}
    @@ -74,2 +94,5 @@
           projectActions={projectActions}
    +      setActiveSection={state.setActiveSection}
    +      setMobileNavigationOpen={state.setMobileNavigationOpen}
    +      onSaveNow={() => void autosave.flush()}
           onCopy={() => void copyCardLink(`${appUrl}/${state.workspace.card.slug}`, state.setCopied)}

## Assistant

The save behavior is now being moved out of a single “Save card” button. Typing updates the preview instantly; after 800 ms of inactivity, the latest full card snapshot is saved. If typing continues while a request is in progress, it saves once more afterward, so an older request cannot overwrite a newer edit.

