"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useStore } from "@nanostores/react";
import { authClient } from "@/lib/auth-client";
import { FiLoader, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { signingOutStore, setSigningOut } from "@/lib/stores/authStore";
import {
  dashboardThemeStore,
  toggleDashboardTheme,
} from "@/lib/stores/dashboardThemeStore";
import type { CardFormData } from "@/components/dashboard/types";

type BentoTopbarProps = {
  onSave: () => void;
  loading?: boolean;
  showPreview?: boolean;
  onTogglePreview?: () => void;
  user?: { name?: string; email: string } | null;
};

export default function BentoTopbar({
  onSave,
  loading = false,
  showPreview = false,
  onTogglePreview,
  user,
}: BentoTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    formState: { isDirty },
    watch,
  } = useFormContext<CardFormData>();
  const name = watch("name");
  const signingOut = useStore(signingOutStore);
  const dashboardTheme = useStore(dashboardThemeStore);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      window.location.href = "/";
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="flex items-center gap-3 mb-5">
      <a
        href="/"
        className="font-medium text-base hover:opacity-70 transition-opacity"
      >
        Cardfoi
      </a>
      {name && (
        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium truncate max-w-[100px] sm:max-w-none">
          {name}
        </span>
      )}
      {isDirty && <span className="text-xs text-gray-400 hidden sm:inline">● Unsaved</span>}

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleDashboardTheme}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors dashboard-theme-toggle"
            type="button"
            aria-label="Toggle dark mode"
          >
            {dashboardTheme === "dark" ? (
              <FiSun className="h-4 w-4" />
            ) : (
              <FiMoon className="h-4 w-4" />
            )}
          </button>
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{user.email}</span>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="text-xs border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                type="button"
              >
                {signingOut ? (
                  <>
                    <FiLoader className="animate-spin h-3 w-3" />
                    Signing out...
                  </>
                ) : (
                  "Sign out"
                )}
              </button>
            </div>
          )}

          {onTogglePreview && (
            <button
              onClick={onTogglePreview}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                showPreview
                  ? "border-gray-800 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
              type="button"
            >
              {showPreview ? "✕" : "👁"} Preview
            </button>
          )}

          <button
            className="bg-gray-900 text-white text-sm px-5 py-2 rounded-full font-medium disabled:opacity-50"
            disabled={!isDirty || loading}
            onClick={onSave}
            type="button"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="sm:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            type="button"
          >
            {menuOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg p-2 z-50 dashboard-mobile-menu">
                  <button
                    onClick={() => {
                      toggleDashboardTheme();
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 dashboard-theme-toggle"
                    type="button"
                  >
                {dashboardTheme === "dark" ? (
                  <>
                    <FiSun className="h-4 w-4" /> Light mode
                  </>
                ) : (
                  <>
                    <FiMoon className="h-4 w-4" /> Dark mode
                  </>
                )}
              </button>
              {isDirty && (
                <div className="px-3 py-2 text-xs text-gray-400">● Unsaved</div>
              )}
              {onTogglePreview && (
                <button
                  onClick={() => {
                    onTogglePreview();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                  type="button"
                >
                  {showPreview ? "✕ Hide Preview" : "👁 Preview"}
                </button>
              )}
              <button
                className="w-full text-left px-3 py-2 text-sm bg-gray-900 text-white rounded-lg font-medium disabled:opacity-50"
                disabled={!isDirty || loading}
                onClick={() => {
                  onSave();
                  setMenuOpen(false);
                }}
                type="button"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              {user && (
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 flex items-center gap-2"
                  type="button"
                >
                  {signingOut ? (
                    <>
                      <FiLoader className="animate-spin h-3 w-3" />
                      Signing out...
                    </>
                  ) : (
                    "Sign out"
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
