"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Mail, Phone } from "lucide-react";
import gsap from "gsap";
import type { UserCard } from "@/lib/cards";

export default function CreativeTemplate({ card }: { card: UserCard }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".creative-card",
        { opacity: 0, y: 50, rotation: -2 },
        { opacity: 1, y: 0, rotation: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
      gsap.fromTo(
        ".skill-badge",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.7)", delay: 0.5 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [card.id]);

  return (
    <main ref={containerRef} className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 px-4 py-6 sm:py-8" data-theme={card.theme}>
      <section className="creative-card mx-auto max-w-4xl rounded-box border border-base-300 bg-base-100 p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-center">
          <div className="avatar placeholder">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary to-secondary text-neutral-content shadow-lg">
              {card.avatar ? (
                <img src={card.avatar} alt="" className="rounded-full" />
              ) : (
                <span className="text-4xl">{card.name.slice(0, 1)}</span>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {card.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base-content/70">{card.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {card.skills.map((skill) => (
                <span className="skill-badge badge badge-primary badge-lg" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="creative-card mt-6 sm:mt-8 grid gap-3 sm:grid-cols-2">
          <a className="btn btn-outline justify-start border-2 hover:border-primary" href={`mailto:${card.email}`}>
            <Mail size={18} />
            {card.email}
          </a>
          <a className="btn btn-outline justify-start border-2 hover:border-primary" href={`tel:${card.phone}`}>
            <Phone size={18} />
            {card.phone}
          </a>
        </div>
      </section>

      <section className="mx-auto mt-4 sm:mt-6 max-w-4xl">
        <h2 className="creative-card mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Project / Work</h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {card.works.map((work) => (
            <article className="creative-card rounded-box border border-base-300 bg-base-100 p-4 transition-shadow hover:shadow-md" key={work.id}>
              {work.type === "image" ? (
                <img className="mb-4 aspect-video w-full rounded-box object-cover" src={work.url} alt="" />
              ) : null}
              {work.type === "video" ? (
                <video className="mb-4 aspect-video w-full rounded-box bg-black" src={work.url} controls />
              ) : null}
              <h3 className="text-lg font-semibold">{work.title}</h3>
              {work.description ? (
                <p className="mt-2 text-sm text-base-content/70">{work.description}</p>
              ) : null}
              <a className="btn btn-sm btn-primary mt-4" href={work.url} target="_blank">
                <ExternalLink size={16} />
                Open
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
