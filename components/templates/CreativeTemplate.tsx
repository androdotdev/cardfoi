"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Mail, Phone } from "lucide-react";
import gsap from "gsap";
import type { UserCard } from "@/lib/cards";

export default function CreativeTemplate({ card }: { card: UserCard }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const skills = card.skills ?? [];
  const works = card.works ?? [];

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
      className="min-h-screen bg-base-200 px-4 py-10 md:px-10"
      data-theme={card.theme}
    >
      <div className="mx-auto max-w-4xl">
        {/* Asymmetric hero */}
        <div className="c-hero mb-8 overflow-hidden rounded-3xl bg-base-content px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="shrink-0">
              {card.avatar ? (
                <img
                  src={card.avatar}
                  alt=""
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
              <p className="mt-3 max-w-xl text-base-100/60 leading-relaxed">
                {card.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${card.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-base-100/10 px-4 py-2 text-xs font-medium text-base-100 hover:bg-base-100/20 transition-colors"
                >
                  <Mail size={13} />
                  {card.email}
                </a>
                <a
                  href={`tel:${card.phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-base-100/10 px-4 py-2 text-xs font-medium text-base-100 hover:bg-base-100/20 transition-colors"
                >
                  <Phone size={13} />
                  {card.phone}
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
                className="c-skill badge badge-primary badge-lg font-medium"
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
                    <img
                      src={work.url}
                      alt=""
                      className="mb-4 aspect-video w-full rounded-xl object-cover"
                    />
                  )}
                  {work.type === "video" && (
                    <video
                      src={work.url}
                      className="mb-4 aspect-video w-full rounded-xl bg-base-300"
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
                    className="btn btn-sm btn-primary mt-4 gap-1.5"
                  >
                    <ExternalLink size={13} />
                    Open
                  </a>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
