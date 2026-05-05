"use client";

import { Plus, UserRound } from "lucide-react";
import type { UserCard } from "@/lib/cards";

type SidebarProps = {
  cards: UserCard[];
  selectedCardId: string | undefined;
  onSelectCard: (card: UserCard) => void;
  onNewCard: () => void;
  collapsed?: boolean;
};

export default function Sidebar({
  cards,
  selectedCardId,
  onSelectCard,
  onNewCard,
  collapsed = false,
}: SidebarProps) {
  return (
    <div className="space-y-2">
      <button
        className={`${collapsed ? "btn-circle btn-sm mx-auto block" : "btn btn-sm w-full justify-start"} ${!collapsed ? "btn-ghost" : ""}`}
        onClick={onNewCard}
        title="Create new card"
      >
        <Plus size={18} />
        {!collapsed && <span className="ml-2">New Card</span>}
      </button>

      {cards.map((card) => (
        <button
          key={card.id}
          className={`btn w-full justify-start ${card.id === selectedCardId ? "btn-primary" : "btn-ghost"} ${collapsed ? "btn-circle mx-auto block" : ""}`}
          onClick={() => onSelectCard(card)}
          title={collapsed ? card.name : undefined}
        >
          {collapsed ? (
            <span className="text-sm font-bold">
              {card.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserRound size={0} />
          )}
          {!collapsed && <span className="truncate">{card.name}</span>}
        </button>
      ))}

      {cards.length === 0 && !collapsed && (
        <p className="text-center text-sm text-base-content/40 py-4">
          No cards yet
        </p>
      )}
    </div>
  );
}
