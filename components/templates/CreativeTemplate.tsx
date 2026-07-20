"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import gsap from "gsap";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";
import Image from "next/image";
import {
  useMediaModal,
  mediaWorksOf,
} from "@/components/templates/shared/primitives";

const platformIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, twitter: FaTwitter, linkedin: FaLinkedin,
  youtube: FaYoutube, instagram: FaInstagram, website: FaGlobe,
};

export default function CreativeTemplate({ card }: { card: UserCard }) {
  useCardTheme(card.theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const skills = card.skills ?? [];
  const works = card.works ?? [];
  const mediaWorks = mediaWorksOf(works);
  const { modalOpen, modalIndex, openModal, closeModal, setModalIndex } =
    useMediaModal();

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".c-hero",
        { opacity: 0, y: 40, rotation: -3 },
        { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".c-skill",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "back.out(2)",
          delay: 0.4,
        },
      );
      gsap.fromTo(
        ".c-work",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.55,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [card.id]);

  return (
    <main
      ref={containerRef}
      className="card-theme-root min-h-screen bg-base-200 px-4 py-10 md:px-10"
    >
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="c-hero mb-8 overflow-hidden rounded-3xl bg-base-content px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="shrink-0">
              {card.avatar ? (
                <Image
                  src={card.avatar}
                  alt=""
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-2xl object-cover ring-4 ring-base-100/10"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-base-100/10 text-5xl font-bold text-base-100">
                  {card.name?.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold leading-none tracking-tight text-base-100 md:text-5xl">
                {card.name}
              </h1>
              <p className="mt-3 max-w-xl leading-relaxed text-base-100/60">
                {card.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${card.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-base-100/10 px-4 py-2 text-xs font-medium text-base-100 transition-colors hover:bg-base-100/20"
                >
                  <Mail size={13} />
                  {card.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="c-skill inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-content"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Works */}
        {works.length > 0 && (
          <>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Selected Work
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {works.map((work) => (
                <article
                  key={work.id}
                  className="c-work group rounded-2xl border border-base-300 bg-base-100 p-5 transition-shadow hover:shadow-md"
                >
                  {work.type === "image" && (
                    <Image
                      src={work.url}
                      alt=""
                      width={1280}
                      height={720}
                      className="mb-3 aspect-video w-full cursor-pointer rounded-xl object-cover transition-opacity hover:opacity-90"
                      onClick={() => openModal(mediaWorks.indexOf(work))}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                  {work.type === "video" && (
                    <video
                      src={work.url}
                      className="mb-3 aspect-video w-full rounded-xl"
                      controls
                      controlsList="nodownload"
                      draggable={false}
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
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary mt-4 gap-1.5"
                    >
                      <ExternalLink size={13} />
                      Open
                    </a>
                  )}
                  {work.type !== "link" && (
                    <span className="mt-4 inline-block text-xs text-base-content/50">
                      Media uploaded ✓
                    </span>
                  )}
                </article>
              ))}
            </div>
          </>
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
                target="_blank"
                rel="noopener noreferrer"
                title={link.platform}
                className="transition-opacity hover:opacity-70"
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
        onClose={closeModal}
        onNavigate={setModalIndex}
      />
    </main>
  );
}
