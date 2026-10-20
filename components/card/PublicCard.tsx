import Link from "next/link";
import { resolveCardTheme } from "@/lib/themes";
import type { PublicCardAsset, PublicCardResponse, PublicCardSocialLink } from "@/types/card";

function initialsOf(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "Y";
}

function platformGlyph(link: PublicCardSocialLink): string {
  if (link.platform === "linkedin") return "in";
  if (link.platform === "github") return "gh";
  if (link.platform === "x") return "𝕏";
  return (link.label ?? "link").slice(0, 2).toLowerCase();
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function AssetTile({ asset }: { asset: PublicCardAsset }) {
  if (asset.type === "image") {
    return (
      <a
        href={asset.url}
        target="_blank"
        rel="noreferrer"
        className="group relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#ecece7] bg-[#f7f8f4]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-[1.04]"
        />
      </a>
    );
  }

  if (asset.type === "video") {
    return (
      <a
        href={asset.url}
        target="_blank"
        rel="noreferrer"
        className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-[#ecece7] bg-[#f7f8f4] text-[10px] font-semibold text-[#5d6358] transition hover:border-[#c9cebf]"
      >
        <span aria-hidden="true">▶</span>
        video
      </a>
    );
  }

  return (
    <a
      href={asset.url}
      target="_blank"
      rel="noreferrer"
      className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-[#ecece7] bg-[#f7f8f4] px-2 text-center text-[10px] font-semibold text-[#5d6358] transition hover:border-[#c9cebf]"
    >
      <span aria-hidden="true">↗</span>
      <span className="w-full truncate">{hostOf(asset.url)}</span>
    </a>
  );
}

export default function PublicCard({ data }: { data: PublicCardResponse }) {
  const { card, projects, socialLinks } = data;
  const look = resolveCardTheme(card.theme);
  const initials = initialsOf(card.name);
  const bio = card.bio.trim();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f8f5] px-4 py-14 text-[#20241c]">
      <div
        className="pointer-events-none absolute -left-28 -top-32 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: look.color }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -bottom-36 -right-24 h-96 w-96 rounded-full bg-[#eef0e8] blur-3xl" aria-hidden="true" />

      <article
        className="relative w-full max-w-[560px] rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_28px_80px_-36px_rgba(42,49,35,0.3)] sm:p-9"
        style={{ color: look.ink }}
      >
        <div className="flex items-start justify-between gap-4">
          {card.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.avatarUrl}
              alt={`${card.name} avatar`}
              width={58}
              height={58}
              className="h-[58px] w-[58px] rounded-[19px] object-cover"
            />
          ) : (
            <span
              className="flex h-[58px] w-[58px] items-center justify-center rounded-[19px] font-serif text-xl"
              style={{ backgroundColor: look.color }}
              aria-hidden="true"
            >
              {initials}
            </span>
          )}
          <span className="mt-1 max-w-[60%] truncate rounded-full bg-[#f6f6f2] px-3 py-2 font-mono text-[9px] text-[#80847b]">
            /{card.slug}
          </span>
        </div>

        <h1 className="mt-7 font-serif text-[clamp(2.2rem,6vw,3.4rem)] leading-[1.02] tracking-[-0.055em]">
          {card.name}
        </h1>

        {bio && <p className="mt-4 text-sm leading-6 text-[#6e7369]">{bio}</p>}

        {card.skills.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {card.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-[#e8e9e3] px-3 py-1.5 text-[10px] text-[#5d6358]"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}

        {projects.length > 0 && (
          <section className="mt-7 border-t border-[#ecece7] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#82877b]">
                Selected work
              </h2>
              <span className="font-mono text-[9px] text-[#a0a297]">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="space-y-3">
              {projects.map((item) => (
                <li key={item.id} className="rounded-2xl bg-[#f7f8f4] p-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm"
                      style={{ backgroundColor: look.color }}
                      aria-hidden="true"
                    >
                      ✳
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#30352d]">{item.title}</p>
                      {item.description && (
                        <p className="mt-1 text-[10px] leading-5 text-[#85897f]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.assets.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {item.assets.map((asset) => (
                        <li key={asset.id}>
                          <AssetTile asset={asset} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#ecece7] pt-5">
          <a
            href={`mailto:${card.email}`}
            className="inline-flex items-center gap-1.5 text-[10px] text-[#85897f] transition hover:text-[#4d5544]"
          >
            Say hello · {card.email}
            {card.emailVerified && (
              <span
                title="Verified contact email"
                className="rounded-full bg-[#e9eddf] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#536047]"
              >
                verified
              </span>
            )}
          </a>
          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    title={link.label || link.platform}
                    className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e8e1] px-2 text-[9px] font-semibold transition hover:border-[#c9cebf]"
                  >
                    {platformGlyph(link)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#a0a297] transition hover:text-[#7d866f]"
        >
          Made with cardfoi <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
