"use client";

import { useEffect, useRef, useState } from "react";
import type { UserCard } from "@/lib/cards";

export default function TerminalTemplate({ card }: { card: UserCard }) {
  const [lines, setLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const commands = [
      `> whoami`,
      `${card.name.toLowerCase().replace(/\s+/g, "-")}`,
      ``,
      `> cat bio.txt`,
      `${card.description}`,
      ``,
      `> ls skills/`,
      ...card.skills.map(s => `  [${s}]`),
      ``,
      `> cat contact.txt`,
      `  Email: ${card.email}`,
      `  Phone: ${card.phone}`,
      ``,
      `> ./works.sh`,
      ...card.works.map((w, i) => `  ${i + 1}. ${w.title} - ${w.type}`),
      ``,
      `> _`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < commands.length) {
        setLines(prev => [...prev, commands[i]]);
        i++;
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [card.id]);

  return (
    <main className="min-h-screen bg-[#0a0e14] p-4 font-mono text-[#a6e3a1]" data-theme={card.theme}>
      <div className="mx-auto max-w-3xl">
        {/* Terminal Window */}
        <div className="overflow-hidden rounded-lg border border-[#2a2f3a] bg-[#13171f] shadow-2xl">
          {/* Title Bar */}
          <div className="flex items-center gap-2 border-b border-[#2a2f3a] bg-[#1a1f2a] px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-2 text-xs text-[#6c7086]">{card.name.toLowerCase().replace(/\s+/g, "-")} ~ zsh</span>
          </div>

          {/* Terminal Content */}
          <div ref={terminalRef} className="h-[80vh] overflow-y-auto p-4 text-sm leading-relaxed">
            {lines.map((line, index) => {
              if (line.startsWith(">")) {
                return (
                  <div key={index} className="text-[#89b4fa]">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("[")) {
                return (
                  <span key={index} className="inline-block mr-2 mb-1 rounded bg-[#2a2f3a] px-2 py-0.5 text-[#f9e2af]">
                    {line.replace(/[\[\]]/g, '')}
                  </span>
                );
              }
              if (line.startsWith("  ")) {
                return (
                  <div key={index} className="text-[#cba6f7]">
                    {line}
                  </div>
                );
              }
              if (line === "> _") {
                return (
                  <div key={index} className="flex items-center">
                    <span className="text-[#89b4fa]">{line}</span>
                    <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-[#a6e3a1]"></span>
                  </div>
                );
              }
              return <div key={index} className="text-[#a6e3a1]">{line}</div>;
            })}

            {/* Works as clickable items */}
            {card.works.length > 0 && lines.length > 15 && (
              <div className="mt-4 border-t border-[#2a2f3a] pt-4">
                <div className="mb-2 text-xs text-[#6c7086]"># Click to open projects:</div>
                {card.works.map((work) => (
                  <a
                    key={work.id}
                    href={work.url}
                    target="_blank"
                    className="block rounded px-2 py-1 text-[#89b4fa] transition-colors hover:bg-[#2a2f3a]"
                  >
                    ► {work.title}
                    {work.description ? <span className="ml-2 text-xs text-[#6c7086]">{work.description}</span> : null}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
