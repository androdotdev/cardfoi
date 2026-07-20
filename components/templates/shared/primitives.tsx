"use client";

import { useState } from "react";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import type { SocialLink, WorkMedia } from "@/lib/cards";

/**
 * Shared template primitives.
 *
 * Every card template used to re-declare `platformIcon`, the media-modal
 * state, the social-link row, and skill badges. That meant ~120 lines of
 * copy-paste per template and subtle drift between them (border opacity,
 * radii, badge styles, duplicated <video> tags, etc.).
 *
 * These primitives centralise that vocabulary so all templates share one
 * consistent, correct implementation and only differ in their layout.
 * next/image usage stays inside each template (so image optimisation and
 * per-template sizing are preserved).
 */

export const platformIcon: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  github: FaGithub,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  instagram: FaInstagram,
  website: FaGlobe,
};

/** Modal state + helpers, shared by every template. */
export function useMediaModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  function openModal(index: number) {
    setModalIndex(index);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return { modalOpen, modalIndex, openModal, closeModal, setModalIndex };
}

/** Only image/video works are shown in the lightbox. */
export function mediaWorksOf(works: WorkMedia[]): WorkMedia[] {
  return works.filter((w) => w.type === "image" || w.type === "video");
}

/** Consistent footer row of social icons. */
export function SocialRow({
  links,
  className = "",
}: {
  links: SocialLink[] | undefined;
  className?: string;
}) {
  if (!links || links.length === 0) return null;
  return (
    <div
      className={`mt-8 flex justify-center gap-4 border-t border-base-300 pt-6 text-base-content/60 ${className}`}
    >
      {links.map((link) => {
        const Icon = platformIcon[link.platform] || FaGlobe;
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.platform}
            aria-label={link.platform}
            className="transition-opacity hover:opacity-70"
          >
            <Icon className="h-6 w-6" />
          </a>
        );
      })}
    </div>
  );
}

export type BadgeVariant = "soft" | "outline" | "ghost";

/** Consistent skill pill. Variants keep per-template flavour without drift. */
export function SkillBadge({
  label,
  variant = "soft",
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  const styles: Record<BadgeVariant, string> = {
    soft: "border border-primary/20 bg-primary/10 text-primary",
    outline: "border border-base-300 bg-base-200 text-base-content/70",
    ghost: "bg-base-100/10 text-base-100/70",
  };
  return <span className={`${base} ${styles[variant]}`}>{label}</span>;
}
