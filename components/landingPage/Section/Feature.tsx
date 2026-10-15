const features = [
  { number: "01", title: "A link worth sharing", description: "One clean profile for your bio, email signature, and anywhere people want to see what you do.", icon: "↗" },
  { number: "02", title: "Your work, up front", description: "Show the projects you’re proud of, with the context and links people need to explore them.", icon: "✳" },
  { number: "03", title: "Made to feel like you", description: "Bring your skills, social links, and visual style together in a card that feels personal.", icon: "◌" },
];

export default function Feature() {
  return (
    <>
      <section id="features" className="border-y border-[#e9eae4] bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#778568]">A small page with a big job</p>
              <h2 className="mt-4 max-w-lg font-serif text-4xl leading-[1.05] tracking-[-0.045em] text-[#20241c] sm:text-5xl">Everything people need to know, in one place.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#73786d] lg:justify-self-end lg:pb-1">
              No sprawling portfolio to maintain. Just a thoughtful snapshot of who you are, what you make, and where to find you.
            </p>
          </div>
          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="group rounded-2xl border border-[#e9eae4] bg-[#fbfbf9] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#d8ddcf] hover:bg-white sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9eddf] text-lg text-[#566746]">{feature.icon}</span>
                  <span className="font-mono text-[10px] text-[#a4a89d]">{feature.number}</span>
                </div>
                <h3 className="mt-8 text-base font-semibold tracking-tight text-[#2b3027]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#7a7f74]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#778568]">How it comes together</p>
            <h2 className="mt-4 max-w-sm font-serif text-4xl leading-[1.05] tracking-[-0.045em] text-[#20241c] sm:text-5xl">From blank page to your page.</h2>
          </div>
          <ol className="divide-y divide-[#e4e6de]">
            {[
              ["01", "Add the essentials", "Start with a short intro, the skills you use, and the links you want people to find."],
              ["02", "Show what you’ve made", "Pick a few projects or pieces of work that say more than a long list of titles."],
              ["03", "Share your Cardfoi", "Your profile becomes a single, memorable link you can take anywhere."],
            ].map(([number, title, description]) => (
              <li key={number} className="grid gap-3 py-6 sm:grid-cols-[52px_1fr] sm:gap-5 sm:py-7">
                <span className="font-mono text-xs text-[#8a927c]">{number}</span>
                <div><h3 className="text-sm font-semibold text-[#30352b]">{title}</h3><p className="mt-1.5 max-w-lg text-sm leading-6 text-[#777c71]">{description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
