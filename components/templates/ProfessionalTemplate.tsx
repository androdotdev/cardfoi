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

export default function ProfessionalTemplate({ card }: { card: UserCard }) {
  useCardTheme(card.theme);
  const skills = card.skills ?? [];
  const works = card.works ?? [];
  const mediaWorks = mediaWorksOf(works);
  const { modalOpen, modalIndex, openModal, closeModal, setModalIndex } =
    useMediaModal();

  return (
    <main className="card-theme-root min-h-screen bg-base-100 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.header
          className="border-b border-base-300 pb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {card.avatar ? (
            <Image
              src={card.avatar}
              alt=""
              width={96}
              height={96}
              className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-base-200 text-3xl font-bold text-base-content">
              {card.name?.slice(0, 1)}
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-base-content">
            {card.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base-content/60">
            {card.description}
          </p>
          <a
            href={`mailto:${card.email}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Mail size={14} />
            {card.email}
          </a>
        </motion.header>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <SkillBadge key={skill} label={skill} variant="outline" />
            ))}
          </div>
        )}

        {/* Works */}
        {works.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-base-content/40">
              Selected Work
            </h2>
            <div className="space-y-8">
              {works.map((work, i) => (
                <motion.article
                  key={work.id}
                  className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-6 sm:flex-row sm:items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  {work.type === "image" && (
                    <Image
                      src={work.url}
                      alt=""
                      width={180}
                      height={120}
                      className="aspect-video w-full shrink-0 cursor-pointer rounded-xl object-cover sm:w-44"
                      onClick={() => openModal(mediaWorks.indexOf(work))}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                  {work.type === "video" && (
                    <video
                      src={work.url}
                      className="aspect-video w-full shrink-0 rounded-xl sm:w-44"
                      controls
                      controlsList="nodownload"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-base-content">
                      {work.title}
                    </h3>
                    {work.description && (
                      <p className="mt-1 text-base-content/55">
                        {work.description}
                      </p>
                    )}
                    {work.type === "link" && (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
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
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </div>

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
