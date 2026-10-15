import { create } from "zustand";

type LoadingState = { card: boolean; work: boolean; password: boolean };

export type SectionId = "identity" | "projects" | "socials" | "theme" | "security" | "admin";

type DashboardState = {
  selectedId: string;
  showForgotPassword: boolean;
  forgotEmail: string;
  message: string;
  loading: LoadingState;
  activeSection: string;
  mobileSidebarOpen: boolean;
  setSelectedId: (id: string) => void;
  setShowForgotPassword: (show: boolean) => void;
  setForgotEmail: (email: string) => void;
  setMessage: (msg: string) => void;
  setLoading: (type: keyof LoadingState, value: boolean) => void;
  setActiveSection: (section: string) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  clearState: () => void;
};

let messageTimeout: ReturnType<typeof setTimeout> | null = null;

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedId: "",
  showForgotPassword: false,
  forgotEmail: "",
  message: "",
  loading: { card: false, work: false, password: false },
  activeSection: "identity",
  mobileSidebarOpen: false,
  setSelectedId: (id) => set({ selectedId: id }),
  setShowForgotPassword: (show) => set({ showForgotPassword: show }),
  setForgotEmail: (email) => set({ forgotEmail: email }),
  setMessage: (msg) => {
    if (messageTimeout) clearTimeout(messageTimeout);
    set({ message: msg });
    if (msg) {
      messageTimeout = setTimeout(() => set({ message: "" }), 5000);
    }
  },
  setLoading: (type, value) =>
    set((state) => ({ loading: { ...state.loading, [type]: value } })),
  setActiveSection: (section) => set({ activeSection: section }),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  clearState: () =>
    set({
      selectedId: "",
      showForgotPassword: false,
      forgotEmail: "",
      message: "",
      loading: { card: false, work: false, password: false },
      activeSection: "identity",
      mobileSidebarOpen: false,
    }),
}));
