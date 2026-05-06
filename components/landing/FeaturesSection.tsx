"use client";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#fafaf8] pt-24 pb-24 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9a9a97] mb-3">
          What you get
        </p>
        <h2 className="font-['Instrument_Serif','serif'] text-[clamp(2rem,3.5vw,2.8rem)] leading-[1.15] tracking-[-0.02em] text-[#0a0a0a] mb-4">
          Everything a developer
          <br />
          card needs.
        </h2>
        <p className="text-[15px] text-[#5c5c5a] leading-[1.7] max-w-[480px] mb-12">
          No bloated portfolio builder. Just the signal — skills, projects, and
          a link you can drop anywhere.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Public slug */}
          <div className="bg-white border border-[#ebebea] rounded-xl p-7 hover:border-[#d4d4d2] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f3] border border-[#ebebea] flex items-center justify-center mb-4 text-sm">
              🔗
            </div>
            <h3 className="text-sm font-medium text-[#0a0a0a] mb-1.5">
              Public slug
            </h3>
            <p className="text-[11px] text-[#5c5c5a] leading-[1.6]">
              Every card gets a clean shareable URL. Drop it in your GitHub bio,
              email signature, or cold DM.
            </p>
            <div className="mt-4 flex items-center gap-2 bg-[#f5f5f3] border border-[#ebebea] rounded-lg px-3 py-2 text-[10px] text-[#5c5c5a] font-mono">
              <span className="text-[#9a9a97]">cardfoi.vercel.app/</span>
              <span className="text-[#0a0a0a] font-medium">andro</span>
            </div>
          </div>

          {/* Session protected */}
          <div className="bg-white border border-[#ebebea] rounded-xl p-7 hover:border-[#d4d4d2] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f3] border border-[#ebebea] flex items-center justify-center mb-4 text-sm">
              🔒
            </div>
            <h3 className="text-sm font-medium text-[#0a0a0a] mb-1.5">
              Session protected
            </h3>
            <p className="text-[11px] text-[#5c5c5a] leading-[1.6]">
              Only the owner or admin can edit card details and work. Your
              public card stays read-only for everyone else.
            </p>
          </div>

          {/* Themes */}
          <div className="bg-white border border-[#ebebea] rounded-xl p-7 hover:border-[#d4d4d2] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f3] border border-[#ebebea] flex items-center justify-center mb-4 text-sm">
              🎨
            </div>
            <h3 className="text-sm font-medium text-[#0a0a0a] mb-1.5">
              Multiple themes
            </h3>
            <p className="text-[11px] text-[#5c5c5a] leading-[1.6] mb-4">
              Pick a theme that matches your style. Each one is crafted for
              readability and personality.
            </p>
            <div className="flex gap-2 flex-wrap">
              {[
                { color: "#0a0a0a", name: "noir" },
                { color: "#1a5fa5", name: "cobalt" },
                { color: "#d85a30", name: "clay" },
                { color: "#1d9e75", name: "forest" },
                { color: "#9a3fbf", name: "violet" },
                { color: "#c4a23a", name: "cmyk" },
              ].map((c) => (
                <div
                  key={c.name}
                  className="w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: c.color }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Media ready - spans 2 cols */}
          <div className="bg-white border border-[#ebebea] rounded-xl p-7 hover:border-[#d4d4d2] transition-colors md:col-span-2">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f3] border border-[#ebebea] flex items-center justify-center mb-4 text-sm">
              🖼️
            </div>
            <h3 className="text-sm font-medium text-[#0a5c5a] mb-1.5">
              Media ready
            </h3>
            <p className="text-[11px] text-[#5c5c5a] leading-[1.6]">
              Upload avatars and project screenshots via Cloudinary. Your card
              handles images properly — resized, optimized, and fast.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-1.5">
              <div className="aspect-[16/9] rounded-lg bg-[#ebebea] flex items-center justify-center text-[10px] text-[#9a9a97]">
                avatar
              </div>
              <div className="aspect-[16/9] rounded-lg bg-[#ebebea] flex items-center justify-center text-[10px] text-[#9a9a97]">
                project screenshot
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div className="bg-white border border-[#ebebea] rounded-xl p-7 hover:border-[#d4d4d2] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f3] border border-[#ebebea] flex items-center justify-center mb-4 text-sm">
              ⚡
            </div>
            <h3 className="text-sm font-medium text-[#0a0a0a] mb-1.5">
              Tech stack display
            </h3>
            <p className="text-[11px] text-[#5c5c5a] leading-[1.6]">
              Add your skills as tags. Visitors immediately see what you build
              with — no resume needed.
            </p>
          </div>

          {/* Project showcase - spans 2 cols */}
          <div className="bg-white border border-[#ebebea] rounded-xl p-7 hover:border-[#d4d4d2] transition-colors md:col-span-2">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f3] border border-[#ebebea] flex items-center justify-center mb-4 text-sm">
              📁
            </div>
            <h3 className="text-sm font-medium text-[#0a0a0a] mb-1.5">
              Project showcase
            </h3>
            <p className="text-[11px] text-[#5c5c5a] leading-[1.6]">
              List your shipped work with titles, descriptions, and links. Add
              as many projects as you want — each one becomes a clickable entry
              on your public card.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
