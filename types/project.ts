export interface ProjectAssetView {
  id: string;
  type: "image" | "video" | "site";
  url: string;
  position: number;
}

export interface DashboardBootstrapResponse {
  card: {
    id: string;
    slug: string;
    name: string;
    bio: string;
    email: string;
    emailVerified: boolean;
    skills: string[];
    theme: string;
  };
  projects: { id: string; title: string; description: string | null; assets: ProjectAssetView[] }[];
  selectedProjectId: string;
  socialLinks: { id: string; platform: "github" | "linkedin" | "x" | "other"; label: string | null; url: string; position: number }[];
}
