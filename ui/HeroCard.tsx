const skills = ["Your skills", "Your craft", "Your interests"];

const projects = [
  { name: "Featured project", detail: "A project you are proud of", mark: "✳", color: "bg-[#e8edce]" },
  { name: "Another project", detail: "Something you are working on", mark: "↗", color: "bg-[#e6e8e3]" },
];

const appHost = (
  process.env.APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000"
)
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

export default function HeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="absolute -inset-10 rounded-full bg-[#dce5c9]/60 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-3 -top-6 z-10 rounded-full border border-[#dfe1d8] bg-white px-4 py-2 text-[11px] font-medium text-[#50574a] shadow-sm sm:-right-8">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#78934f] align-middle" />
        your card, ready to share
      </div>

      <article className="relative rounded-[26px] border border-[#e8e9e2] bg-white p-6 shadow-[0_30px_90px_-38px_rgba(38,46,29,0.32)] sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dce5c9] font-serif text-2xl text-[#425232]">YN</div>
          <span className="rounded-full bg-[#f4f5f0] px-3 py-1.5 font-mono text-[10px] text-[#62695b]">{appHost}/your-name</span>
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a806f]">Your role · Your location</p>
          <h2 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#20231d]">Your Name</h2>
          <p className="mt-3 max-w-[330px] text-sm leading-6 text-[#6b7065]">
            A short introduction about what you do and what you enjoy creating.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="rounded-full border border-[#e9eae4] px-3 py-1.5 text-[11px] text-[#51564c]">{skill}</span>
          ))}
        </div>

        <div className="mt-7 border-t border-[#ecece7] pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a806f]">Selected work</p>
            <span className="font-mono text-[10px] text-[#9a9e92]">02</span>
          </div>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.name} className="flex items-center gap-3 rounded-xl bg-[#f8f8f5] p-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${project.color} text-sm font-semibold text-[#515c42]`}>{project.mark}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-[#292d26]">{project.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-[#85897f]">{project.detail}</span>
                </span>
                <span className="text-sm text-[#85897f]">↗</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#ecece7] pt-5">
          <span className="text-[11px] text-[#85897f]">Say hello</span>
          <div className="flex gap-2">
            {["in", "gh", "✉"].map((item) => (
              <span key={item} className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#e6e8e1] px-2 text-[10px] font-semibold text-[#50574a]">{item}</span>
            ))}
          </div>
        </div>
      </article>
      <div className="absolute -bottom-6 -left-5 -z-0 h-20 w-20 rounded-full border border-[#dfe3d5] sm:-left-9" aria-hidden="true" />
    </div>
  );
}
