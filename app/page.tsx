import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase text-primary">Cardfoi</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-7xl">
            Share a clean profile card with your work, skills, and contact details.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-base-content/70">
            Create a public card for developers, freelancers, and creators. Add your
            tech stack, projects, media, avatar, and a theme for your public link.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn btn-primary" href="/dashboard">
              Create card
            </Link>
            <Link className="btn btn-outline" href="/andro">
              View sample
            </Link>
          </div>
        </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
           <article className="rounded-box border border-base-300 bg-base-100 p-5">
             <div className="mb-2 text-2xl">🔗</div>
             <h2 className="font-semibold">Public slug</h2>
             <p className="mt-2 text-sm text-base-content/60">Each card gets a shareable route like /john-doe.</p>
           </article>
           <article className="rounded-box border border-base-300 bg-base-100 p-5">
             <div className="mb-2 text-2xl">🔒</div>
             <h2 className="font-semibold">Session protected</h2>
             <p className="mt-2 text-sm text-base-content/60">Only the owner or admin can edit card details and work.</p>
           </article>
           <article className="rounded-box border border-base-300 bg-base-100 p-5">
             <div className="mb-2 text-2xl">📷</div>
             <h2 className="font-semibold">Media ready</h2>
             <p className="mt-2 text-sm text-base-content/60">Upload avatars and project media through Cloudinary.</p>
           </article>
         </div>

         <div className="mt-16 max-w-3xl">
           <h2 className="mb-8 text-center text-2xl font-bold">How it works</h2>
           <div className="grid gap-6 sm:grid-cols-3">
             <div className="text-center">
               <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">1</div>
               <h3 className="font-semibold">Sign up</h3>
               <p className="mt-1 text-sm text-base-content/60">Create your account in seconds with email and password.</p>
             </div>
             <div className="text-center">
               <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">2</div>
               <h3 className="font-semibold">Build your card</h3>
               <p className="mt-1 text-sm text-base-content/60">Add your skills, work samples, avatar, and pick a theme.</p>
             </div>
             <div className="text-center">
               <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">3</div>
               <h3 className="font-semibold">Share</h3>
               <p className="mt-1 text-sm text-base-content/60">Get your public link and share it with the world.</p>
             </div>
           </div>
         </div>
       </section>

       <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-base-content/60">
         <p>© {new Date().getFullYear()} Cardfoi. All rights reserved.</p>
         <div className="mt-2 flex justify-center gap-4">
           <Link href="/andro" className="link">Sample Card</Link>
           <a href="https://github.com/androdotdev/cardfoi" target="_blank" className="link">GitHub</a>
         </div>
       </footer>
     </main>
  );
}
