"use client";

import { Plus, UserRound } from "lucide-react";
import type { UserCard } from "@/lib/cards";
import type { ApiState } from "./types";

type SidebarProps = {
  cards: UserCard[];
  selectedCardId: string | undefined;
  onSelectCard: (card: UserCard) => void;
  onNewCard: () => void;
};

export default function Sidebar({
  cards,
  selectedCardId,
  onSelectCard,
  onNewCard
}: SidebarProps) {
  return (
    <aside className="rounded-box border border-base-300 bg-base-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <a href="/">Cardfoi</a>
        </h1>
        <button
          className="btn btn-sm btn-ghost"
          title="Create new card"
          onClick={onNewCard}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-2">
        {cards.map((card) => (
          <button
            className={`btn w-full justify-start ${card.id === selectedCardId ? "btn-primary" : "btn-ghost"}`}
            key={card.id}
            onClick={() => onSelectCard(card)}
          >
            <UserRound size={18} />
            <span className="truncate">{card.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
