import { useState } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { Dispatch, SetStateAction } from "react";
import type { DashboardBootstrapResponse } from "@/types/project";
import type { ProjectDraft, SocialLinkDraft } from "@/components/dashboard/useDashboardActions";

export type EditorSection = "profile" | "projects" | "appearance" | "settings";
export type CardSaveStatus = "saved" | "dirty" | "saving" | "failed";

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
  activeSection: EditorSection;
  mobileNavigationOpen: boolean;
  cardSaveStatus: CardSaveStatus;
  cardRevision: number;
  dirtySections: Record<"profile" | "appearance", boolean>;
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
  setActiveSection: Dispatch<SetStateAction<EditorSection>>;
  setMobileNavigationOpen: Dispatch<SetStateAction<boolean>>;
  setCardSaveStatus: Dispatch<SetStateAction<CardSaveStatus>>;
  markCardDirty: (section: "profile" | "appearance") => void;
  markCardSaved: (revision: number) => boolean;
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
      activeSection: "profile",
      mobileNavigationOpen: false,
      cardSaveStatus: "saved",
      cardRevision: 0,
      dirtySections: { profile: false, appearance: false },
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
      setActiveSection: setter("activeSection"),
      setMobileNavigationOpen: setter("mobileNavigationOpen"),
      setCardSaveStatus: setter("cardSaveStatus"),
      markCardDirty: (section) => set((state) => ({
        cardSaveStatus: "dirty",
        cardRevision: state.cardRevision + 1,
        dirtySections: { ...state.dirtySections, [section]: true },
      })),
      markCardSaved: (revision) => {
        let saved = false;
        set((state) => {
          if (state.cardRevision !== revision) return {};
          saved = true;
          return { cardSaveStatus: "saved", dirtySections: { profile: false, appearance: false } };
        });
        return saved;
      },
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
