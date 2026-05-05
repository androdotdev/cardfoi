"use client";

import { FiExternalLink, FiMail, FiPhone } from "react-icons/fi";
import type { UserCard } from "@/lib/cards";

export default function ProfessionalTemplate({ card }: { card: UserCard }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-8" data-theme={card.theme}>
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <header className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="h-24 w-24 overflow-hidden rounded-lg bg-slate-100">
              {card.avatar ? (
                <img src={card.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200 text-3xl font-bold text-slate-500">
                  {card.name.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{card.name}</h1>
              <p className="mt-2 text-slate-600">{card.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {card.skills.map((skill) => (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-4">
            <a className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800" href={`mailto:${card.email}`}>
              <FiMail size={16} />
              {card.email}
            </a>
            <a className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" href={`tel:${card.phone}`}>
              <FiPhone size={16} />
              {card.phone}
            </a>
          </div>
        </header>

        {/* Work Section */}
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Experience & Projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {card.works.map((work) => (
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md" key={work.id}>
                {work.type === "image" ? (
                  <img className="mb-3 aspect-video w-full rounded-md object-cover" src={work.url} alt="" />
                ) : null}
                {work.type === "video" ? (
                  <video className="mb-3 aspect-video w-full rounded-md bg-slate-900" src={work.url} controls />
                ) : null}
                <h3 className="text-lg font-semibold text-slate-900">{work.title}</h3>
                {work.description ? (
                  <p className="mt-1 text-sm text-slate-600">{work.description}</p>
                ) : null}
                <a className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-slate-700" href={work.url} target="_blank">
                  View Project
                  <FiExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
