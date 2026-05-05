"use client";

import { ExternalLink, Mail, Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { UserCard } from "@/lib/cards";

export default function TimelineTemplate({ card }: { card: UserCard }) {
  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-8" data-theme={card.theme}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="avatar placeholder mx-auto mb-4">
            <div className="h-24 w-24 rounded-full bg-neutral text-neutral-content">
              {card.avatar ? (
                <img src={card.avatar} alt="" className="rounded-full" />
              ) : (
                <span className="text-3xl">{card.name.slice(0, 1)}</span>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold">{card.name}</h1>
          <p className="mt-2 text-base-content/70">{card.description}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {card.skills.map((skill) => (
              <span className="badge badge-outline" key={skill}>{skill}</span>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <a className="btn btn-sm btn-ghost" href={`mailto:${card.email}`}>
              <Mail size={14} />
              {card.email}
            </a>
            <a className="btn btn-sm btn-ghost" href={`tel:${card.phone}`}>
              <Phone size={14} />
              {card.phone}
            </a>
          </div>
        </div>

        {/* Timeline */}
        {card.works.length > 0 ? (
          <div className="relative">
            <h2 className="mb-6 text-center text-xl font-semibold">Experience & Projects</h2>

            {/* Vertical Line */}
            <div className="absolute left-4 top-12 h-[calc(100%-3rem)] w-0.5 bg-primary/20 md:left-1/2 md:-ml-0.5"></div>

            <div className="space-y-8">
              {card.works.map((work, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div key={work.id} className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}>
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <motion.div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-sm text-base-content/40 md:hidden">
                          <Calendar size={14} />
                          <span>Project {index + 1}</span>
                        </div>
                        <h3 className="font-semibold">{work.title}</h3>
                        {work.description ? (
                          <p className="mt-1 text-sm text-base-content/60">{work.description}</p>
                        ) : null}
                        <a className="btn btn-sm btn-ghost mt-2" href={work.url} target="_blank">
                          <ExternalLink size={14} />
                          View Project
                        </a>
                      </motion.div>
                    </div>

                    {/* Timeline Node */}
                    <div className="absolute left-4 top-4 z-10 -ml-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-base-100 md:left-1/2 md:-ml-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden md:block md:w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
