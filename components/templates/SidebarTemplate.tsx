import { ExternalLink, Mail, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";

export default function SidebarTemplate({ card }: { card: UserCard }) {
  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8" data-theme={card.theme}>
      <div className="mx-auto max-w-5xl">
        <div className="rounded-box overflow-hidden border border-base-300 bg-base-100 shadow-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="bg-base-300 p-6 lg:w-80 lg:shrink-0">
              <div className="text-center lg:text-left">
                <div className="avatar placeholder mx-auto lg:mx-0">
                  <div className="h-24 w-24 rounded-lg bg-neutral text-neutral-content">
                    {card.avatar ? (
                      <img src={card.avatar} alt="" className="rounded-lg" />
                    ) : (
                      <span className="text-3xl">{card.name.slice(0, 1)}</span>
                    )}
                  </div>
                </div>
                <h1 className="mt-4 text-2xl font-bold">{card.name}</h1>
                <p className="mt-2 text-sm text-base-content/70">{card.description}</p>
              </div>

              <div className="mt-6 space-y-2">
                <a className="flex items-center gap-2 text-sm hover:text-primary" href={`mailto:${card.email}`}>
                  <Mail size={16} />
                  {card.email}
                </a>
                <a className="flex items-center gap-2 text-sm hover:text-primary" href={`tel:${card.phone}`}>
                  <Phone size={16} />
                  {card.phone}
                </a>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/40">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {card.skills.map((skill) => (
                    <span className="badge badge-sm" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <h2 className="text-lg font-semibold">Projects & Work</h2>
              <div className="mt-4 divide-y divide-base-300">
                {card.works.map((work) => (
                  <div className="py-4" key={work.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold">{work.title}</h3>
                        {work.description ? (
                          <p className="mt-1 text-sm text-base-content/60">{work.description}</p>
                        ) : null}
                      </div>
                      <a className="btn btn-sm btn-ghost shrink-0" href={work.url} target="_blank">
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    {work.type === "image" ? (
                      <img className="mt-3 rounded-box w-full max-w-md" src={work.url} alt="" />
                    ) : null}
                    {work.type === "video" ? (
                      <video className="mt-3 w-full max-w-md rounded-box" src={work.url} controls />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
