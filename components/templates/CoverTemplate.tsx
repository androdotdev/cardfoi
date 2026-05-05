import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { UserCard } from "@/lib/cards";

export default function CoverTemplate({ card }: { card: UserCard }) {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-4" data-theme={card.theme}>
      <div className="w-full max-w-md">
        {/* Cover Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary to-secondary px-6 pb-20 pt-8 text-center text-primary-content">
          <div className="avatar placeholder">
            <div className="h-24 w-24 rounded-full bg-primary-content/20 text-primary-content ring-4 ring-primary-content/30">
              {card.avatar ? (
                <img src={card.avatar} alt="" className="rounded-full" />
              ) : (
                <span className="text-4xl">{card.name.slice(0, 1)}</span>
              )}
            </div>
          </div>
          <h1 className="mt-3 text-2xl font-bold">{card.name}</h1>
          <p className="mt-1 text-sm opacity-90">{card.description}</p>
        </div>

        {/* Card Body */}
        <div className="relative -mt-16 rounded-b-2xl border border-base-300 bg-base-100 p-6 shadow-lg">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {card.skills.map((skill) => (
              <span className="badge badge-outline" key={skill}>{skill}</span>
            ))}
          </div>

          <div className="space-y-3">
            <a className="flex items-center gap-3 rounded-lg bg-base-200 p-3 transition-colors hover:bg-base-300" href={`mailto:${card.email}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail size={18} />
              </div>
              <span className="text-sm">{card.email}</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg bg-base-200 p-3 transition-colors hover:bg-base-300" href={`tel:${card.phone}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <Phone size={18} />
              </div>
              <span className="text-sm">{card.phone}</span>
            </a>
          </div>

          {card.works.length > 0 ? (
            <div className="mt-6 border-t border-base-300 pt-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-base-content/60">Projects</h2>
              <div className="space-y-2">
                {card.works.map((work) => (
                  <a className="flex items-center justify-between rounded-lg bg-base-200 p-3 transition-colors hover:bg-base-300" href={work.url} target="_blank" key={work.id}>
                    <div>
                      <p className="text-sm font-medium">{work.title}</p>
                      {work.description ? <p className="text-xs text-base-content/60">{work.description}</p> : null}
                    </div>
                    <ExternalLink size={14} className="text-base-content/40" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
