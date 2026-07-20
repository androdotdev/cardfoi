"use client";

import { motion } from "framer-motion";
import { ExternalLink, Mail } from "lucide-react";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";
import Image from "next/image";
import {
  SkillBadge,
  SocialRow,
  useMediaModal,
  mediaWorksOf,
} from "@/components/templates/shared/primitives";

export default function ModernTemplate({ card }: { card: UserCard }) {
  useCardTheme(card.theme);
  const skills = card.skills ?? [];
  const works = card.works ?? [];
  const mediaWorks = mediaWorksOf(works);
  const { modalOpen, modalIndex, openModal, closeModal, setModalIndex } =
    useMediaModal();

  return (
    <main className="card-theme-root min-h-screen bg-[#f7f8fa] px-4 py-16 md:px-8">
      <motion.div
        className="mx-auto max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="shrink-0"
          >
            {card.avatar ? (
              <Image
                src={card.avatar}
                alt=""
                width={100}
                height={100}
                className="h-24 w-24 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-white shadow-lg">
                {card.name?.slice(0, 1)}
              </div>
            )}
          </motion.div>
          <div>
            <motion.h1
              className="text-4xl font-extrabold tracking-tight text-base-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {card.name}
            </motion.h1>
            <motion.p
              className="mt-2 max-w-xl text-base-content/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {card.description}
            </motion.p>
            <motion.a
              href={`mailto:${card.email}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-base-100 px-4 py-2 text-sm font-medium text-base-content shadow-sm transition-colors hover:bg-base-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Mail size={14} />
              {card.email}
            </motion.a>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2 md:justify-start">
            {skills.map((skill) => (
              <SkillBadge key={skill} label={skill} variant="soft" />
            ))}
          </div>
        )}

        {/* Works */}
        {works.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work, i) => (
              <motion.div
                key={work.id}
                className="group overflow-hidden rounded-2xl bg-base-100 shadow-sm transition-shadow hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                {work.type === "image" && (
                  <Image
                    src={work.url}
                    alt=""
                    width={400}
                    height={300}
                    className="aspect-video w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openModal(mediaWorks.indexOf(work))}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                )}
                {work.type === "video" && (
                  <video
                    src={work.url}
                    className="aspect-video w-full"
                    controls
                    controlsList="nodownload"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-base-content">
                    {work.title}
                  </h3>
                  {work.description && (
                    <p className="mt-1 text-sm text-base-content/55">
                      {work.description}
                    </p>
                  )}
                  {work.type === "link" ? (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      View project <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="mt-3 inline-block text-xs text-base-content/50">
                      Media uploaded ✓
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <SocialRow links={card.socialLinks} />

      <MediaModal
        works={mediaWorks}
        currentIndex={modalIndex}
        isOpen={modalOpen}
        onClose={closeModal}
        onNavigate={setModalIndex}
      />
    </main>
  );
}
