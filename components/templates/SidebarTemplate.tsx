"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Mail, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";

export default function SidebarTemplate({ card }: { card: UserCard }) {
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
      className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8"
    >
      <motion.div
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Dark sidebar */}
          <aside className="bg-base-content px-6 py-8 lg:w-72 lg:shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {card.avatar ? (
                <img
                  src={card.avatar}
                  alt=""
                  className="h-20 w-20 rounded-xl object-cover ring-2 ring-base-100/20"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-base-100/10 text-3xl font-bold text-base-100">
                  {card.name?.slice(0, 1)}
                </div>
              )}
              <h1 className="mt-4 text-xl font-bold text-base-100">
                {card.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-base-100/55">
                {card.description}
              </p>
            </motion.div>

            <motion.div
              className="mt-7 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <a
                href={`mailto:${card.email}`}
                className="flex items-center gap-2.5 text-sm text-base-100/60 transition-colors hover:text-base-100"
              >
                <Mail size={13} />
                <span className="truncate">{card.email}</span>
              </a>
              <a
                href={`tel:${card.phone}`}
                className="flex items-center gap-2.5 text-sm text-base-100/60 transition-colors hover:text-base-100"
              >
                <Phone size={13} />
                {card.phone}
              </a>
            </motion.div>

            {skills.length > 0 && (
              <motion.div
                className="mt-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-100/30">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-base-100/10 px-2.5 py-1 text-xs text-base-100/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </aside>

          {/* Main content */}
          <div className="flex-1 p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Projects & Work
            </p>
            {works.length > 0 ? (
              <div className="divide-y divide-base-200">
                {works.map((work, i) => (
                  <motion.div
                    key={work.id}
                    className="py-5"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base-content">
                          {work.title}
                        </h3>
                        {work.description && (
                          <p className="mt-1 text-sm text-base-content/55">
                            {work.description}
                          </p>
                        )}
                      </div>
                      {work.type === "link" && (
                        <a
                          href={work.url}
                          target="_blank"
                          className="btn btn-sm btn-ghost shrink-0"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    {work.type === "image" && (
                      <img
                        src={`/api/media/${work.id}`}
                        alt=""
                        className="mt-3 w-full max-w-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openModal(i)}
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    )}
                    {work.type === "video" && (
                      <video
                        src={`/api/media/${work.id}`}
                        className="mt-3 w-full max-w-lg rounded-xl"
                        controls
                        controlsList="nodownload"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    )}
                    {work.type === "video" && (
                      <video
                        src={work.url}
                        className="mt-3 w-full max-w-lg rounded-xl"
                        controls
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-base-content/40">No projects yet.</p>
            )}
          </div>
        </div>
      </motion.div>

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
