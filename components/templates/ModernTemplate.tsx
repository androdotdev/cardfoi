"use client";

import { motion } from "framer-motion";
import { ExternalLink, Mail, Phone, ArrowUpRight } from "lucide-react";
import type { UserCard } from "@/lib/cards";

export default function ModernTemplate({ card }: { card: UserCard }) {
  const skills = card.skills ?? [];
  const works = card.works ?? [];

  return (
    <main className="min-h-screen bg-base-200" data-theme={card.theme}>
      {/* Bold hero strip */}
      <motion.div
        className="bg-base-content px-6 py-10 md:px-14 md:py-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-5xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {card.avatar ? (
              <img
                src={card.avatar}
                alt=""
                className="h-20 w-20 rounded-xl object-cover ring-2 ring-base-content/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-base-100/10 text-3xl font-bold text-base-100">
                {card.name?.slice(0, 1)}
              </div>
            )}
            <div>
              <motion.h1
                className="text-3xl font-extrabold tracking-tight text-base-100 md:text-4xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {card.name}
              </motion.h1>
              <motion.p
                className="mt-1 max-w-xl text-base-100/60 text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {card.description}
              </motion.p>
            </div>
          </div>

          {/* Contact pills */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <a
              href={`mailto:${card.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-base-100/10 px-4 py-2 text-xs font-medium text-base-100 hover:bg-base-100/20 transition-colors"
            >
              <Mail size={12} />
              {card.email}
            </a>
            <a
              href={`tel:${card.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-base-100/10 px-4 py-2 text-xs font-medium text-base-100 hover:bg-base-100/20 transition-colors"
            >
              <Phone size={12} />
              {card.phone}
            </a>
          </motion.div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-5xl px-6 py-10 md:px-14">
        {/* Skills */}
        {skills.length > 0 && (
          <motion.div
            className="mb-10 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {skills.map((skill) => (
              <span key={skill} className="badge badge-primary badge-outline">
                {skill}
              </span>
            ))}
          </motion.div>
        )}

        {/* Works grid */}
        {works.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Projects
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {works.map((work, i) => (
                <motion.a
                  key={work.id}
                  href={work.url}
                  target="_blank"
                  className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-5 transition-shadow hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ y: -2 }}
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
                      className="mb-4 aspect-video w-full rounded-lg bg-base-300"
                      controls
                    />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors">
                        {work.title}
                      </h3>
                      {work.description && (
                        <p className="mt-1 text-sm text-base-content/55">
                          {work.description}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 mt-0.5 text-base-content/30 group-hover:text-primary transition-colors"
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
