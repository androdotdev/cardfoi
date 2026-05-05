"use client";

export default function HowItWorksSection() {
  return (
    <section id="how" className="bg-[#f5f5f3] pt-24 pb-24 px-10 border-t border-[#ebebea] border-b border-[#ebebea]">
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9a9a97] mb-3">
          How it works
        </p>
        <h2 className="font-['Instrument_Serif','serif'] text-[clamp(2rem,3.5vw,2.8rem)] leading-[1.15] tracking-[-0.02em] text-[#0a0a0a] mb-4">
          Up in three steps.
        </h2>
        <p className="text-[15px] text-[#5c5c5a] leading-[1.7] max-w-[480px] mb-12">
          No setup overhead. No config files. Just sign up and start filling in your details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              step: "1", 
              title: "Sign up", 
              desc: "Create your account in seconds with email and password. No OAuth dance, no waiting for approval." 
            },
            { 
              step: "2", 
              title: "Build your card", 
              desc: "Add your skills, project work, avatar, and pick a theme. The editor is straightforward — you'll be done in under two minutes." 
            },
            { 
              step: "3", 
              title: "Share the link", 
              desc: "Your public card is live immediately. Drop the link anywhere — GitHub, Twitter, LinkedIn, cold emails, wherever clients find you." 
            }
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-4">
              <div className="w-9 h-9 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center font-['Instrument_Serif','serif'] text-base">
                {item.step}
              </div>
              <h3 className="text-base font-medium text-[#0a0a0a]">{item.title}</h3>
              <p className="text-[13px] text-[#5c5c5a] leading-[1.65]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
