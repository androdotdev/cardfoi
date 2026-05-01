import { notFound } from "next/navigation";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { getCard } from "@/lib/cards";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PublicCardPage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) notFound();

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8" data-theme={card.theme}>
      <section className="mx-auto max-w-4xl rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="avatar placeholder">
            <div className="h-28 w-28 rounded-full bg-neutral text-neutral-content">
              {card.avatar ? <img src={card.avatar} alt="" /> : <span className="text-4xl">{card.name.slice(0, 1)}</span>}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold">{card.name}</h1>
            <p className="mt-3 max-w-2xl text-base-content/70">{card.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {card.skills.map((skill) => <span className="badge badge-primary" key={skill}>{skill}</span>)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a className="btn btn-outline justify-start" href={`mailto:${card.email}`}>
            <Mail size={18} />
            {card.email}
          </a>
          <a className="btn btn-outline justify-start" href={`tel:${card.phone}`}>
            <Phone size={18} />
            {card.phone}
          </a>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-4xl">
        <h2 className="mb-4 text-xl font-semibold">Project / Work</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {card.works.map((work) => (
            <article className="rounded-box border border-base-300 bg-base-100 p-4" key={work.id}>
              {work.type === "image" ? <img className="mb-4 aspect-video w-full rounded-box object-cover" src={work.url} alt="" /> : null}
              {work.type === "video" ? <video className="mb-4 aspect-video w-full rounded-box bg-black" src={work.url} controls /> : null}
              <h3 className="text-lg font-semibold">{work.title}</h3>
              {work.description ? <p className="mt-2 text-sm text-base-content/70">{work.description}</p> : null}
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
