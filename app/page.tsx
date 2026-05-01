import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-200">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase text-primary">Andro Card</p>
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Share a clean profile card with your work, skills, and contact details.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-base-content/70">
            Create a public card for developers, freelancers, and creators. Add your
            tech stack, projects, media, avatar, and a theme for your public link.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/dashboard">
              Create card
            </Link>
            <Link className="btn btn-outline" href="/andro">
              View sample
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <article className="rounded-box border border-base-300 bg-base-100 p-5">
            <h2 className="font-semibold">Public slug</h2>
            <p className="mt-2 text-sm text-base-content/60">Each card gets a shareable route like /john-doe.</p>
          </article>
          <article className="rounded-box border border-base-300 bg-base-100 p-5">
            <h2 className="font-semibold">Session protected</h2>
            <p className="mt-2 text-sm text-base-content/60">Only the owner or admin can edit card details and work.</p>
          </article>
          <article className="rounded-box border border-base-300 bg-base-100 p-5">
            <h2 className="font-semibold">Media ready</h2>
            <p className="mt-2 text-sm text-base-content/60">Upload avatars and project media through Cloudinary.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
