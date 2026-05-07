"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Mail, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";

export default function TimelineTemplate({ card }: { card: UserCard }) {
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
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {card.avatar ? (
            <img
              src={card.avatar}
              alt=""
              className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-base-300"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-base-300 text-3xl font-bold text-base-content/50">
              {card.name?.slice(0, 1)}
            </div>
          )}
          <h1 className="text-3xl font-bold text-base-content">{card.name}</h1>
          <p className="mt-2 text-base-content/60">{card.description}</p>

          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {skills.map((skill) => (
                <span key={skill} className="badge badge-outline">
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-center gap-3">
            <a
              href={`mailto:${card.email}`}
              className="btn btn-sm btn-ghost gap-2"
            >
              <Mail size={14} />
              {card.email}
            </a>
            <a
              href={`tel:${card.phone}`}
              className="btn btn-sm btn-ghost gap-2"
            >
              <Phone size={14} />
              {card.phone}
            </a>
          </div>
        </motion.div>

        {/* Timeline */}
        {works.length > 0 && (
          <div>
            <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Projects & Work
            </p>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 h-full w-px bg-base-300" />

              <div className="space-y-6">
                {works.map((work, i) => (
                  <motion.div
                    key={work.id}
                    className="relative pl-14"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                  >
                    {/* Node */}
                    <div className="absolute left-3.5 top-4 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-base-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 transition-shadow hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-base-content">
                          {work.title}
                        </h3>
                        <a
                          href={work.type === "link" ? work.url : undefined}
                          target="_blank"
                          className="btn btn-xs btn-ghost shrink-0"
                        >
                          {work.type === "link" ? <ExternalLink size={12} /> : null}
                        </a>
                      </div>
                      {work.description && (
                        <p className="mt-1.5 text-sm text-base-content/55">
                          {work.description}
                        </p>
                      )}
                      {work.type === "image" && (
                        <img
                          src={work.url}
                          alt=""
                          className="mt-3 w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openModal(i)}
                          draggable="false"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      )}
                      {work.type === "video" && (
                        <video
                          src={work.url}
                          className="mt-3 w-full rounded-xl"
                          controls
                          controlsList="nodownload"
                          draggable="false"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
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
