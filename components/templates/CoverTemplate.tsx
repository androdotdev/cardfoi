"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";
import Image from "next/image"

const platformIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, twitter: FaTwitter, linkedin: FaLinkedin,
  youtube: FaYoutube, instagram: FaInstagram, website: FaGlobe,
};

export default function CoverTemplate({ card }: { card: UserCard }) {
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
      className="min-h-screen bg-base-200 flex items-start justify-center p-4 pt-0 md:p-8 md:pt-0"
    >
      <div className="w-full max-w-md">
        {/* Full-bleed cover */}
        <motion.div
          className="relative overflow-hidden rounded-b-3xl bg-primary px-6 pb-24 pt-12 text-primary-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-content/5" />
          <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-primary-content/5" />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {card.avatar ? (
                <Image
                  src={card.avatar}
                  alt=""
                  width={96}
                  height={96}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary-content/30"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-content/20 text-4xl font-bold ring-4 ring-primary-content/30">
                  {card.name?.slice(0, 1)}
                </div>
              )}
            </motion.div>
            <motion.h1
              className="mt-4 text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {card.name}
            </motion.h1>
            <motion.p
              className="mt-2 text-sm leading-relaxed opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {card.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Floating card body */}
        <motion.div
          className="relative -mt-16 mx-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-5 flex flex-wrap justify-center gap-1.5">
              {skills.map((skill) => (
                <span key={skill} className="badge badge-outline badge-sm">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Contact */}
          <div className="space-y-2">
            <a
              href={`mailto:${card.email}`}
              className="flex items-center gap-3 rounded-xl bg-base-200 px-4 py-3 text-sm transition-colors hover:bg-base-300"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail size={15} />
              </div>
              <span className="truncate text-base-content/70">
                {card.email}
              </span>
            </a>

          </div>

          {/* Works */}
          {works.length > 0 && (
            <div className="mt-6 border-t border-base-200 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/40">
                Projects
              </p>
              <div className="space-y-2">
                {works.map((work, i) => (
                  work.type === "link" ? (
                    <a
                      key={work.id}
                      href={work.url}
                      target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl bg-base-200 px-4 py-3 transition-colors hover:bg-base-300"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-base-content">
                          {work.title}
                        </p>
                        {work.description && (
                          <p className="truncate text-xs text-base-content/50">
                            {work.description}
                          </p>
                        )}
                      </div>
                      <span className="ml-2 shrink-0 text-base-content/30 group-hover:text-primary transition-colors">
                        <ExternalLink size={13} />
                      </span>
                    </a>
                  ) : (
                    <div
                      key={work.id}
                      className="group flex items-center justify-between rounded-xl bg-base-200 px-4 py-3 transition-colors hover:bg-base-300 cursor-pointer"
                      onClick={() => openModal(i)}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-base-content">
                          {work.title}
                        </p>
                        {work.description && (
                          <p className="truncate text-xs text-base-content/50">
                            {work.description}
                          </p>
                        )}
                      </div>
                      {/* Show thumbnail for image/video */}
                      {work.type === "image" && (
                        <Image
                          src={work.url}
                          alt=""
                          width={40}
                          height={40}
                          className="ml-2 h-10 w-10 rounded object-cover"
                          draggable="false"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      )}
                      {work.type === "video" && (
                        <div className="ml-2 flex h-10 w-10 items-center justify-center rounded bg-base-300">
                          ▶
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </motion.div>
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

      {/* Media Modal */}
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
