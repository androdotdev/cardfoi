"use client";

import { useEffect, useRef, useState } from "react";
import type { UserCard } from "@/lib/cards";
import MediaModal from "@/components/shared/MediaModal";
import { useCardTheme } from "@/lib/hooks/useCardTheme";

export default function TerminalTemplate({ card }: { card: UserCard }) {
  useCardTheme(card.theme);
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const works = card.works ?? [];
  const mediaWorks = works.filter(
    (w) => w.type === "image" || w.type === "video",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  function openModal(index: number) {
    setModalIndex(index);
    setModalOpen(true);
  }

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setLines([]);
      setDone(false);
    }, 0);

    const skills = card.skills ?? [];

    const commands = [
      `> whoami`,
      `${card.name?.toLowerCase().replace(/\s+/g, "-") ?? "user"}`,
      ``,
      `> cat bio.txt`,
      `${card.description ?? ""}`,
      ``,
      `> ls skills/`,
      ...skills.map((s) => `[${s ?? ""}]`),
      ``,
      `> cat contact.txt`,
      `  email: ${card.email ?? ""}`,
      ...(card.socialLinks ?? []).map(
        (s) => `  ${s.platform}: ${s.url}`,
      ),
      ``,
      `> ./works.sh`,
      ...works.map(
        (w, i) =>
          `  ${i + 1}. ${w?.title ?? "untitled"} — ${w?.type ?? "link"}`,
      ),
      ``,
      `> _`,
    ].filter((line): line is string => line !== undefined && line !== null);

    let i = 0;
    const interval = setInterval(() => {
      if (i < commands.length) {
        const line = commands[i];
        if (typeof line === "string") {
          setLines((prev) => [...prev, line]);
        }
        i++;
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 80);

    return () => {
      clearTimeout(resetTimer);
      clearInterval(interval);
    };
  }, [card.id]);

  return (
    <main
      className="min-h-screen bg-[#0a0e14] p-4 font-mono text-[#a6e3a1]"
    >
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-lg border border-[#2a2f3a] bg-[#13171f] shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-[#2a2f3a] bg-[#1a1f2a] px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-xs text-[#6c7086]">
              {card.name?.toLowerCase().replace(/\s+/g, "-") ?? "user"} ~ zsh
            </span>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="h-[80vh] overflow-y-auto p-4 text-sm leading-relaxed"
          >
            {lines.map((line, index) => {
              if (typeof line !== "string") return null;
              if (line.startsWith("> _")) {
                return (
                  <div key={index} className="flex items-center">
                    <span className="text-[#89b4fa]">{line}</span>
                    <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-[#a6e3a1]" />
                  </div>
                );
              }
              if (line.startsWith(">")) {
                return (
                  <div key={index} className="text-[#89b4fa]">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("[")) {
                return (
                  <span
                    key={index}
                    className="inline-block mr-2 mb-1 rounded bg-[#2a2f3a] px-2 py-0.5 text-[#f9e2af]"
                  >
                    {line.replace(/[\[\]]/g, "")}
                  </span>
                );
              }
              if (line.startsWith("  ") && line.includes("://")) {
                const url = line.trim().split(": ").slice(1).join(": ");
                return (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer"
                     className="block text-[#cba6f7] hover:text-[#89b4fa] transition-colors">
                    {line}
                  </a>
                );
              }
              if (line.startsWith("  ")) {
                return (
                  <div key={index} className="text-[#cba6f7]">
                    {line}
                  </div>
                );
              }
              return (
                <div key={index} className="text-[#a6e3a1]">
                  {line}
                </div>
              );
            })}

            {works.length > 0 && done && (
              <div className="mt-4 border-t border-[#2a2f3a] pt-4">
                <div className="mb-2 text-xs text-[#6c7086]">
                  # click to open:
                </div>
                {works.map((work, i) => (
                  work.type === "link" ? (
                    <a
                      key={work.id}
                      href={work.url}
                      target="_blank" rel="noopener noreferrer"
                      className="block rounded px-2 py-1 text-[#89b4fa] transition-colors hover:bg-[#2a2f3a]"
                    >
                      ► {work.title}
                      {work.description ? (
                        <span className="ml-2 text-xs text-[#6c7086]">
                          {work.description}
                        </span>
                      ) : null}
                    </a>
                  ) : (
                    <div
                      key={work.id}
                      className="block rounded px-2 py-1 text-[#89b4fa] transition-colors hover:bg-[#2a2f3a] cursor-pointer"
                      onClick={() => openModal(i)}
                    >
                      ► {work.title}
                      {work.description ? (
                        <span className="ml-2 text-xs text-[#6c7086]">
                          {work.description}
                        </span>
                      ) : null}
                      <span className="ml-2 text-[#f9e2af]">[view media]</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal
        works={mediaWorks}
        currentIndex={modalIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setModalIndex}
      />
    </main>
  );
}
