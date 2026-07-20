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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MinimalTemplate({ card }: { card: UserCard }) {
  useCardTheme(card.theme);
  const skills = card.skills ?? [];
  const works = card.works ?? [];
  const mediaWorks = mediaWorksOf(works);
  const { modalOpen, modalIndex, openModal, closeModal, setModalIndex } =
    useMediaModal();

  return (
    <main className="card-theme-root min-h-screen bg-base-100 px-6 py-16 md:px-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12 flex items-start gap-6"
        >
          <div className="shrink-0">
            {card.avatar ? (
              <Image
                src={card.avatar}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover ring-1 ring-base-300"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-200 text-xl font-semibold text-base-content">
                {card.name?.slice(0, 1)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-base-content">
              {card.name}
            </h1>
            <p className="mt-2 max-w-lg leading-relaxed text-base-content/60">
              {card.description}
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mb-8 h-px bg-base-200" />

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SkillBadge key={skill} label={skill} variant="outline" />
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="mb-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${card.email}`}
            className="inline-flex items-center gap-2 text-sm text-base-content/60 transition-colors hover:text-primary"
          >
            <Mail size={14} />
            {card.email}
          </a>
        </div>

        {/* Works */}
        {works.length > 0 && (
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Work
            </p>
            <div className="space-y-px">
              {works.map((work, i) =>
                work.type === "link" ? (
                  <motion.a
                    key={work.id}
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-base-200 py-4 transition-colors hover:border-primary/30"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <div>
                      <p className="font-medium text-base-content transition-colors group-hover:text-primary">
                        {work.title}
                      </p>
                      {work.description && (
                        <p className="mt-0.5 text-sm text-base-content/50">
                          {work.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink
                      size={14}
                      className="shrink-0 text-base-content/30 transition-colors group-hover:text-primary"
                    />
                  </motion.a>
                ) : (
                  <motion.div
                    key={work.id}
                    className="group flex cursor-pointer items-center justify-between border-b border-base-200 py-4 transition-colors hover:border-primary/30"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    onClick={() => openModal(mediaWorks.indexOf(work))}
                  >
                    <div>
                      <p className="font-medium text-base-content transition-colors group-hover:text-primary">
                        {work.title}
                      </p>
                      {work.description && (
                        <p className="mt-0.5 text-sm text-base-content/50">
                          {work.description}
                        </p>
                      )}
                      {work.type === "image" && (
                        <Image
                          src={work.url}
                          alt=""
                          width={64}
                          height={64}
                          className="mt-2 h-16 w-16 rounded object-cover"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      )}
                      {work.type === "video" && (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-base-content/50">
                          ▶ Watch video
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-base-content/50">
                      Media uploaded ✓
                    </span>
                  </motion.div>
                ),
              )}
            </div>
          </div>
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
