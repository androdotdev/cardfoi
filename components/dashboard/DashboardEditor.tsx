"use client";

import { useStore } from "zustand";
import DashboardEditorLayout from "@/components/dashboard/DashboardEditorLayout";
import { useDashboardEditorStore } from "@/components/dashboard/dashboardEditorStore";
import { copyCardLink, useCardActions, useProjectActions } from "@/components/dashboard/useDashboardActions";
import { useCardAutosave } from "@/components/dashboard/useCardAutosave";
import type { DashboardBootstrapResponse } from "@/types/project";

export type DashboardEditorProps = { userName: string; userEmail: string; appUrl: string; initialWorkspace: DashboardBootstrapResponse };

export default function DashboardEditor({ userName, userEmail, appUrl, initialWorkspace }: DashboardEditorProps) {
  const store = useDashboardEditorStore(initialWorkspace);
  const state = useStore(store);
  const autosave = useCardAutosave(store);
  const track = <T,>(
    setter: (value: React.SetStateAction<T>) => void,
    section: "profile" | "appearance",
  ) => (value: React.SetStateAction<T>) => {
    setter(value);
    autosave.markDirty(section);
  };

  const setName = track(state.setName, "profile");
  const setBio = track(state.setBio, "profile");
  const setEmail = track(state.setEmail, "profile");
  const setSkills = track(state.setSkills, "profile");
  const setSocialLinks = track(state.setSocialLinks, "profile");
  const setThemeId = track(state.setThemeId, "appearance");
  const cardActions = useCardActions({
    skills: state.skills,
    newSkill: state.newSkill,
    setNewSkill: state.setNewSkill,
    setSkills,
    socialLinks: state.socialLinks,
    socialDraft: state.socialDraft,
    setSocialDraft: state.setSocialDraft,
    setSocialLinks,
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
      activeSection={state.activeSection}
      mobileNavigationOpen={state.mobileNavigationOpen}
      cardSaveStatus={state.cardSaveStatus}
      dirtySections={state.dirtySections}
      pageError={state.pageError}
      notice={state.notice}
      socialDraft={state.socialDraft}
      setName={setName}
      setBio={setBio}
      setEmail={setEmail}
      setSkills={setSkills}
      setProjects={state.setProjects}
      setSocialLinks={setSocialLinks}
      setThemeId={setThemeId}
      setSelectedProjectId={state.setSelectedProjectId}
      setNewSkill={state.setNewSkill}
      setNewProjectTitle={state.setNewProjectTitle}
      setSocialDraft={state.setSocialDraft}
      cardActions={cardActions}
      projectActions={projectActions}
      setActiveSection={state.setActiveSection}
      setMobileNavigationOpen={state.setMobileNavigationOpen}
      onSaveNow={() => void autosave.flush()}
      onCopy={() => void copyCardLink(`${appUrl}/${state.workspace.card.slug}`, state.setCopied)}
    />
  );
}
