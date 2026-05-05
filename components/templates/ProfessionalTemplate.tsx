"use client";

import { motion } from "framer-motion";
import { ExternalLink, Mail, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";

export default function ProfessionalTemplate({ card }: { card: UserCard }) {
  const skills = card.skills ?? [];
  const works = card.works ?? [];

  return (
    <main
      className="min-h-screen bg-base-200 px-4 py-8 sm:py-12"
      data-theme={card.theme}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.header
          className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="border-b border-base-300 bg-base-200/60 px-6 py-1.5">
            <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest">
              Profile
            </p>
          </div>
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-7">
            <div className="shrink-0">
              {card.avatar ? (
                <img
                  src={card.avatar}
                  alt=""
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
              <p className="mt-1.5 text-base-content/60 leading-relaxed">
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
          <div className="flex flex-wrap gap-3 border-t border-base-300 px-6 py-4">
            <a
              href={`mailto:${card.email}`}
              className="btn btn-sm btn-neutral gap-2"
            >
              <Mail size={14} />
              {card.email}
            </a>
            <a
              href={`tel:${card.phone}`}
              className="btn btn-sm btn-outline gap-2"
            >
              <Phone size={14} />
              {card.phone}
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40">
                Experience & Projects
              </h2>
            </div>
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
                    <img
                      src={work.url}
                      alt=""
                      className="mb-4 aspect-video w-full rounded-lg object-cover"
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
                  <a
                    href={work.url}
                    target="_blank"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-base-content hover:text-primary transition-colors"
                  >
                    View project
                    <ExternalLink size={13} />
                  </a>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
