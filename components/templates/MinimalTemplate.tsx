"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const platformIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, twitter: FaTwitter, linkedin: FaLinkedin,
  youtube: FaYoutube, instagram: FaInstagram, website: FaGlobe,
};

export default function MinimalTemplate({ card }: { card: UserCard }) {
  useCardTheme(card.theme);
  const skills = card.skills ?? [];
  const works = card.works ?? [];
  const mediaWorks = works.filter(w => w.type === "image" || w.type === "video");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  function openModal(index: number) {
    setModalIndex(index);
    setModalOpen(true);
  }

  return (
    <main
      className="min-h-screen bg-base-100 px-6 py-16 md:px-12"
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-12 flex items-start gap-6">
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
            <p className="mt-2 text-base-content/60 leading-relaxed max-w-lg">
              {card.description}
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="mb-8 h-px bg-base-200" />

        {/* Skills */}
        {skills.length > 0 && (
          <motion.div variants={fadeUp} className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-base-300 bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact */}
        <motion.div variants={fadeUp} className="mb-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${card.email}`}
            className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors"
          >
            <Mail size={14} />
            {card.email}
          </a>
        </motion.div>

        {/* Works */}
        {works.length > 0 && (
          <motion.div variants={fadeUp}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Work
            </p>
            <div className="space-y-px">
              {works.map((work, i) => (
                work.type === "link" ? (
                  <motion.a
                    key={work.id}
                    href={work.url}
                    target="_blank" rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4 border-b border-base-200 hover:border-primary/30 transition-colors"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <div>
                      <p className="font-medium text-base-content group-hover:text-primary transition-colors">
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
                      className="shrink-0 text-base-content/30 group-hover:text-primary transition-colors"
                    />
                  </motion.a>
                ) : (
                  <motion.div
                    key={work.id}
                    className="group flex items-center justify-between py-4 border-b border-base-200 hover:border-primary/30 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    onClick={() => openModal(i)}
                  >
                    <div>
                      <p className="font-medium text-base-content group-hover:text-primary transition-colors">
                        {work.title}
                      </p>
                      {work.description && (
                        <p className="mt-0.5 text-sm text-base-content/50">
                          {work.description}
                        </p>
                      )}
                      {/* Thumbnail for image/video */}
                      {work.type === "image" && (
                        <Image
                          src={work.url}
                          alt=""
                          width={64}
                          height={64}
                          className="mt-2 h-16 w-16 rounded object-cover"
                          draggable="false"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      )}
                      {work.type === "video" && (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-base-content/50">
                          ▶ Watch video
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-base-content/50">Media uploaded ✓</span>
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>
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
