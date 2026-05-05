"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

type DashboardLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header?: React.ReactNode;
};

export default function DashboardLayout({ children, sidebar, header }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-base-300 bg-base-100 px-4 py-3 lg:hidden">
        <button
          className="btn btn-ghost btn-sm btn-circle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        {header}
      </header>

      <div className="flex">
        {/* Mobile Drawer Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 transform bg-base-100 border-r border-base-300
            transition-transform duration-300 ease-in-out
            lg:relative lg:transform-none lg:z-auto
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            ${collapsed ? 'lg:w-20' : 'lg:w-72'}
          `}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className={`flex items-center border-b border-base-300 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3`}>
              {!collapsed && (
                <span className="text-xl font-bold">
                  <a href="/">Cardfoi</a>
                </span>
              )}
              <button
                className="btn btn-ghost btn-sm btn-circle hidden lg:flex"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? '→' : '←'}
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {sidebar}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
