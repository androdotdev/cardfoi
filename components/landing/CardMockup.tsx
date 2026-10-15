"use client";

type CardMockupProps = {
  name?: string;
  handle?: string;
  bio?: string;
  skills?: string[];
  projects?: { title: string; url: string }[];
  theme?: string;
};

export default function CardMockup({
  name = "Andro",
  handle = "cardfoi.vercel.app/andro",
  bio = "Full-stack developer focused on practical web products, clean APIs, and useful automation.",
  skills = ["Next.js", "TypeScript", "PostgreSQL", "Cloudinary", "Better Auth"],
  projects = [
    { title: "Card Studio", url: "github.com/androdotdev/carder" },
    { title: "JSON Flow", url: "json-flow-client.vercel.app" },
  ],
  theme = "cmyk",
}: CardMockupProps) {
  return (
    <div className="w-[320px] bg-white border border-[#ebebea] rounded-2xl p-8 shadow-[0_2px_40px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.03)] relative z-10 animate-[float_4s_ease-in-out_infinite]">
      {theme && (
        <div className="absolute -top-3 right-5 bg-[#0a0a0a] text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">
          {theme} theme
        </div>
      )}

      {/* Avatar */}
      <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#d4d4d2] to-[#9a9a97] mb-4 flex items-center justify-center font-['Instrument_Serif','serif'] text-xl text-white overflow-hidden">
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Name & Handle */}
      <div className="font-['Instrument_Serif','serif'] text-xl text-[#0a0a0a] mb-0.5">
        {name}
      </div>
      <div className="text-[10px] text-[#9a9a97] mb-3">{handle}</div>

      {/* Bio */}
      <div className="text-[11px] text-[#5c5c5a] leading-[1.6] pb-3 border-b border-[#ebebea] mb-3">
        {bio}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-[9px] px-2 py-0.5 rounded-full bg-[#f5f5f3] text-[#5c5c5a] border border-[#ebebea]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Projects */}
      <div className="flex flex-col gap-1.5">
        {projects.map((project) => (
          <div
            key={project.title}
            className="flex items-center gap-2 text-[10px] text-[#0a0a0a] px-2.5 py-1.5 bg-[#f5f5f3] rounded-lg border border-[#ebebea]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a7a52] flex-shrink-0" />
            <span className="flex-1">{project.title}</span>
            <span className="text-[8px] text-[#9a9a97]">
              {project.url.replace(/^https?:\/\//, "")} ↗
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
