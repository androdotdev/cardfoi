"use client";

import { ExternalLink, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import type { UserCard } from "@/lib/cards";

export default function GlassTemplate({ card }: { card: UserCard }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 sm:p-8" data-theme={card.theme}>
      <div className="mx-auto max-w-4xl">
        {/* Glass Card */}
        <motion.div
          className="rounded-3xl border border-white/20 bg-white/30 p-6 shadow-xl backdrop-blur-lg sm:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar with glow */}
            <motion.div
              className="relative shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260 }}
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 blur"></div>
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white/50 bg-white/50">
                {card.avatar ? (
                  <img src={card.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-4xl font-bold text-white">
                    {card.name.slice(0, 1)}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="min-w-0 text-center sm:text-left">
              <motion.h1
                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {card.name}
              </motion.h1>
              <motion.p
                className="mt-2 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {card.description}
              </motion.p>
              <motion.div
                className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {card.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-purple-200/50 bg-white/50 px-3 py-1 text-xs font-medium text-purple-700 backdrop-blur">
                    {skill}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Contact Buttons */}
          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/30 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white/50" href={`mailto:${card.email}`}>
              <Mail size={16} />
              {card.email}
            </a>
            <a className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/30 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white/50" href={`tel:${card.phone}`}>
              <Phone size={16} />
              {card.phone}
            </a>
          </motion.div>
        </motion.div>

        {/* Works Section */}
        {card.works.length > 0 ? (
          <motion.section
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-700 sm:text-left">Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {card.works.map((work, index) => (
                <motion.div
                  key={work.id}
                  className="group rounded-2xl border border-white/20 bg-white/30 p-4 shadow-lg backdrop-blur-lg transition-all hover:bg-white/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {work.type === "image" ? (
                    <img className="mb-3 rounded-xl w-full object-cover" src={work.url} alt="" />
                  ) : null}
                  {work.type === "video" ? (
                    <video className="mb-3 rounded-xl w-full bg-black" src={work.url} controls />
                  ) : null}
                  <h3 className="font-semibold text-gray-800">{work.title}</h3>
                  {work.description ? <p className="mt-1 text-sm text-gray-600">{work.description}</p> : null}
                  <a className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700" href={work.url} target="_blank">
                    View Project
                    <ExternalLink size={14} />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : null}
      </div>
    </main>
  );
}
