"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";

type DashboardShellProps = {
  children?: React.ReactNode;
  sections: { id: string; component: React.ReactNode }[];
  slug?: string;
};

export default function DashboardShell({ children, sections, slug }: DashboardShellProps) {
  const activeSection = useDashboardStore((s) => s.activeSection);
  const setActiveSection = useDashboardStore((s) => s.setActiveSection);
  const toggleMobileSidebar = useDashboardStore((s) => s.toggleMobileSidebar);
  const setMobileSidebarOpen = useDashboardStore((s) => s.setMobileSidebarOpen);

  const pathname = usePathname();
  const current = sections.find((s) => s.id === activeSection);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#fafaf8] dashboard-bg">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} slug={slug} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-[720px] mx-auto">
          {/* Mobile header with hamburger */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg text-[#9a9a97] hover:text-[#5c5c5a] hover:bg-[#fafaf8] transition-colors"
              type="button"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-[#0a0a0a]">
              Cardfoi
            </span>
          </div>

          {current?.component ?? children}
        </div>
      </main>
    </div>
  );
}
