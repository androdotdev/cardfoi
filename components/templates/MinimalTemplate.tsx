import { ExternalLink, Mail, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";

export default function MinimalTemplate({ card }: { card: UserCard }) {
  return (
    <main className="min-h-screen bg-base-200 px-4 py-6 sm:py-8" data-theme={card.theme}>
      <section className="mx-auto max-w-2xl rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="avatar placeholder mb-4">
            <div className="h-32 w-32 rounded-full bg-neutral text-neutral-content">
              {card.avatar ? (
                <img src={card.avatar} alt="" className="rounded-full" />
              ) : (
                <span className="text-5xl">{card.name.slice(0, 1)}</span>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold">{card.name}</h1>
          <p className="mt-2 max-w-md text-base-content/70">{card.description}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {card.skills.map((skill) => (
              <span className="badge badge-primary" key={skill}>{skill}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a className="btn btn-outline btn-sm" href={`mailto:${card.email}`}>
              <Mail size={16} />
              {card.email}
            </a>
            <a className="btn btn-outline btn-sm" href={`tel:${card.phone}`}>
              <Phone size={16} />
              {card.phone}
            </a>
          </div>
        </div>
      </section>

      {card.works.length > 0 ? (
        <section className="mx-auto mt-6 max-w-2xl">
          <h2 className="mb-3 text-lg font-semibold">Work</h2>
          <div className="space-y-3">
            {card.works.map((work) => (
              <article className="rounded-box border border-base-300 bg-base-100 p-4" key={work.id}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{work.title}</h3>
                    {work.description ? (
                      <p className="mt-1 text-sm text-base-content/70">{work.description}</p>
                    ) : null}
                  </div>
                  <a className="btn btn-sm btn-primary" href={work.url} target="_blank">
                    <ExternalLink size={14} />
                    Open
                  </a>
                </div>
                {work.type === "image" ? (
                  <img className="mt-3 rounded-box w-full" src={work.url} alt="" />
                ) : null}
                {work.type === "video" ? (
                  <video className="mt-3 w-full rounded-box" src={work.url} controls />
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
