"use client";

import { motion } from "framer-motion";
import { ExternalLink, Mail, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ModernTemplate({ card }: { card: UserCard }) {
  return (
    <main className="min-h-screen bg-base-200 px-4 py-6 sm:py-8" data-theme={card.theme}>
      <motion.section
        className="mx-auto max-w-4xl rounded-box border border-base-300 bg-base-100 p-4 sm:p-6 shadow-sm"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-center">
          <motion.div
            className="avatar placeholder"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="h-28 w-28 rounded-full bg-neutral text-neutral-content">
              {card.avatar ? (
                <img src={card.avatar} alt="" />
              ) : (
                <span className="text-4xl">{card.name.slice(0, 1)}</span>
              )}
            </div>
          </motion.div>
          <div>
            <motion.h1
              className="text-4xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {card.name}
            </motion.h1>
            <motion.p
              className="mt-3 max-w-2xl text-base-content/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {card.description}
            </motion.p>
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {card.skills.map((skill) => (
                <span className="badge badge-primary" key={skill}>{skill}</span>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-6 sm:mt-8 grid gap-3 sm:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a className="btn btn-outline justify-start" href={`mailto:${card.email}`}>
            <Mail size={18} />
            {card.email}
          </a>
          <a className="btn btn-outline justify-start" href={`tel:${card.phone}`}>
            <Phone size={18} />
            {card.phone}
          </a>
        </motion.div>
      </motion.section>

      <section className="mx-auto mt-4 sm:mt-6 max-w-4xl">
        <motion.h2
          className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Project / Work
        </motion.h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {card.works.map((work, index) => (
            <motion.article
              className="rounded-box border border-base-300 bg-base-100 p-4"
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              {work.type === "image" ? (
                <motion.img
                  className="mb-4 aspect-video w-full rounded-box object-cover"
                  src={work.url}
                  alt=""
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ) : null}
              {work.type === "video" ? (
                <video className="mb-4 aspect-video w-full rounded-box bg-black" src={work.url} controls />
              ) : null}
              <h3 className="text-lg font-semibold">{work.title}</h3>
              {work.description ? (
                <p className="mt-2 text-sm text-base-content/70">{work.description}</p>
              ) : null}
              <motion.a
                className="btn btn-sm btn-primary mt-4"
                href={work.url}
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={16} />
                Open
              </motion.a>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
