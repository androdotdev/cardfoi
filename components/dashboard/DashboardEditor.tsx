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
