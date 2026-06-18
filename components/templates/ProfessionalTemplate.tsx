"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";
import Image from "next/image";

const platformIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, twitter: FaTwitter, linkedin: FaLinkedin,
  youtube: FaYoutube, instagram: FaInstagram, website: FaGlobe,
};

export default function ProfessionalTemplate({ card }: { card: UserCard }) {
  useCardTheme(card.theme);
  const skills = card.skills ?? [];
  const works = card.works ?? [];
  const mediaWorks = works.filter(
    (w) => w.type === "image" || w.type === "video",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  function openModal(index: number) {
    setModalIndex(index);
    setModalOpen(true);
  }

  return (
    <main
      className="min-h-screen bg-base-200 px-4 py-8 sm:py-12"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header card */}
        <motion.header
          className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="border-b border-base-300 bg-base-200/60 px-6 py-1.5">
            <p className="text-xs font-medium uppercase tracking-widest text-base-content/40">
              Profile
            </p>
          </div>
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-7">
            <div className="shrink-0">
              {card.avatar ? (
                <Image
                  src={card.avatar}
                  alt=""
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-base-300 text-3xl font-bold text-base-content/50">
                  {card.name?.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-base-content">
                {card.name}
              </h1>
              <p className="mt-1.5 leading-relaxed text-base-content/60">
                {card.description}
              </p>
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-base-300 px-6 py-4">
            <a
              href={`mailto:${card.email}`}
              className="btn btn-sm btn-neutral gap-2"
            >
              <Mail size={14} />
              {card.email}
            </a>
          </div>
        </motion.header>

        {/* Works */}
        {works.length > 0 && (
          <motion.section
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Experience & Projects
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {works.map((work, i) => (
                <motion.article
                  key={work.id}
                  className="rounded-2xl border border-base-300 bg-base-100 p-5 transition-shadow hover:shadow-md"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                >
                  {work.type === "image" && (
                    <Image
                      src={work.url}
                      alt=""
                      width={1280}
                      height={720}
                      className="mb-3 aspect-video w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openModal(i)}
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                  {work.type === "video" && (
                    <video
                      src={work.url}
                      className="mb-3 aspect-video w-full rounded-lg"
                      controls
                      controlsList="nodownload"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                  {work.type === "video" && (
                    <video
                      src={work.url}
                      className="mb-4 aspect-video w-full rounded-lg"
                      controls
                    />
                  )}
                  <h3 className="font-semibold text-base-content">
                    {work.title}
                  </h3>
                  {work.description && (
                    <p className="mt-1 text-sm text-base-content/55">
                      {work.description}
                    </p>
                  )}
                  {work.type === "link" && (
                    <a
                      href={work.url}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-base-content hover:text-primary transition-colors"
                    >
                      View project
                      <ExternalLink size={13} />
                    </a>
                  )}
                  {work.type !== "link" && (
                    <span className="mt-3 inline-block text-xs text-base-content/50">
                      Media uploaded ✓
                    </span>
                  )}
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Social */}
      {card.socialLinks && card.socialLinks.length > 0 && (
        <div className="mt-8 flex justify-center gap-4 border-t border-base-300 pt-6 text-base-content/60">
          {card.socialLinks.map((link) => {
            const Icon = platformIcon[link.platform] || FaGlobe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank" rel="noopener noreferrer"
                title={link.platform}
                className="hover:opacity-70 transition-opacity"
              >
                {Icon && <Icon className="h-6 w-6" />}
              </a>
            );
          })}
        </div>
      )}

      <MediaModal
        works={mediaWorks}
        currentIndex={modalIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setModalIndex}
      />
    </main>
  );
}
