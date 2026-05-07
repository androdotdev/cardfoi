"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Mail, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";

export default function GlassTemplate({ card }: { card: UserCard }) {
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
        className="min-h-screen bg-base-200 p-4 sm:p-8"
      >
      <div className="mx-auto max-w-4xl">
        {/* Glass hero card */}
        <motion.div
          className="rounded-3xl border border-base-300/50 bg-base-100/60 p-6 shadow-xl backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar with ring glow */}
            <motion.div
              className="relative shrink-0"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
            >
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm" />
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-base-300/50">
                {card.avatar ? (
                  <img
                    src={card.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-primary/20 text-4xl font-bold text-primary">
                    {card.name?.slice(0, 1)}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="min-w-0 text-center sm:text-left">
              <motion.h1
                className="text-3xl font-bold text-base-content"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {card.name}
              </motion.h1>
              <motion.p
                className="mt-2 text-base-content/60 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {card.description}
              </motion.p>

              {skills.length > 0 && (
                <motion.div
                  className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Contact */}
          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <a
              href={`mailto:${card.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-base-300/60 bg-base-100/40 px-5 py-2.5 text-sm font-medium text-base-content backdrop-blur transition-colors hover:bg-base-100/70"
            >
              <Mail size={14} />
              {card.email}
            </a>
            <a
              href={`tel:${card.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-base-300/60 bg-base-100/40 px-5 py-2.5 text-sm font-medium text-base-content backdrop-blur transition-colors hover:bg-base-100/70"
            >
              <Phone size={14} />
              {card.phone}
            </a>
          </motion.div>
        </motion.div>

        {/* Works */}
        {works.length > 0 && (
          <motion.section
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-base-content/40">
              Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {works.map((work, i) => (
                <motion.div
                  key={work.id}
                  className="group rounded-2xl border border-base-300/50 bg-base-100/50 p-5 backdrop-blur-lg transition-all hover:bg-base-100/70"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                >
                  {work.type === "image" && (
                    <img
                      src={`/api/media/${work.id}`}
                      alt=""
                      className="mb-3 aspect-video w-full rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openModal(i)}
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                  {work.type === "video" && (
                    <video
                      src={`/api/media/${work.id}`}
                      className="mb-3 aspect-video w-full rounded-xl"
                      controls
                      controlsList="nodownload"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
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
                      target="_blank"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      View project <ExternalLink size={12} />
                    </a>
                  )}
                  {work.type !== "link" && (
                    <span className="mt-3 inline-block text-xs text-base-content/50">
                      Media uploaded ✓
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

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
