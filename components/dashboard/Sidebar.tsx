"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FiUser, FiLayout, FiLink, FiDroplet, FiLock, FiShield, FiSun, FiMoon } from "react-icons/fi";
import type { IconType } from "react-icons";
import { useThemeStore } from "@/lib/stores/useThemeStore";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";

type NavItem = {
  id: string;
  label: string;
  icon: IconType;
  badge?: string;
  adminOnly?: boolean;
};

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Profile",
    items: [
      { id: "identity", label: "Identity", icon: FiUser },
      { id: "projects", label: "Projects", icon: FiLayout },
      { id: "socials", label: "Social links", icon: FiLink },
    ],
  },
  {
    title: "Appearance",
    items: [{ id: "theme", label: "Theme", icon: FiDroplet }],
  },
  {
    title: "Account",
    items: [
      { id: "security", label: "Security", icon: FiLock },
      { id: "admin", label: "Admin", icon: FiShield, badge: "admin", adminOnly: true },
    ],
  },
];

type SidebarProps = {
  activeSection: string;
  onSectionChange: (id: string) => void;
  slug?: string;
};

export default function Sidebar({ activeSection, onSectionChange, slug }: SidebarProps) {
  const session = authClient.useSession();
  const user = session.data?.user;
  const dashboardTheme = useThemeStore((s) => s.dashboardTheme);
  const toggleDashboardTheme = useThemeStore((s) => s.toggleDashboardTheme);
  const mobileSidebarOpen = useDashboardStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useDashboardStore((s) => s.setMobileSidebarOpen);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity duration-200 ${
          mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside
        className={`
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:static inset-y-0 left-0 z-40
          w-[200px] flex-shrink-0
          bg-white border-r border-[#ebebea]
          flex flex-col
          transition-transform duration-200 ease-in-out lg:transition-none
        `}
      >
        <div className="px-4 py-5 border-b border-[#ebebea] flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-medium text-[#0a0a0a] no-underline">
              Cardfoi
            </Link>
            <Link
              href={slug ? `/${slug}` : "/"}
              className="text-[11px] text-[#9a9a97] mt-0.5 hover:text-[#5c5c5a] transition-colors block truncate"
            >
              cardfoi.vercel.app/{slug ?? "..."}
            </Link>
          </div>
          <button
            onClick={toggleDashboardTheme}
            className="p-1.5 rounded-lg text-[#9a9a97] hover:text-[#5c5c5a] hover:bg-[#fafaf8] transition-colors"
            type="button"
            title={dashboardTheme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {dashboardTheme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-3">
          {navSections.map((group) => (
            <div key={group.title}>
              <p className="px-4 py-2 text-[10px] uppercase tracking-[0.08em] text-[#9a9a97] font-medium">
                {group.title}
              </p>
              {group.items
                .filter((item) => !item.adminOnly || user?.role === "admin")
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-left transition-colors border-l-2 ${
                        isActive
                          ? "text-[#0a0a0a] border-l-[#0a0a0a] bg-[#fafaf8]"
                          : "text-[#5c5c5a] border-l-transparent hover:text-[#0a0a0a] hover:bg-[#fafaf8]"
                      }`}
                      type="button"
                    >
                      <Icon className="w-[15px] h-[15px] flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#fafaf8] text-[#9a9a97] border border-[#ebebea] uppercase font-medium">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-[#ebebea] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#fafaf8] border border-[#ebebea] flex items-center justify-center text-[11px] font-medium text-[#5c5c5a] flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#0a0a0a] truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-[10px] text-[#9a9a97] truncate">{user?.email ?? ""}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
