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
