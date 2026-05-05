"use client";

import { UserRound } from "lucide-react";
import type { UserCard } from "@/lib/cards";

type DashboardHeaderProps = {
  selectedCard: UserCard | undefined;
  onNewCard: () => void;
};

export default function DashboardHeader({ selectedCard, onNewCard }: DashboardHeaderProps) {
  return (
    <div className="flex flex-1 items-center justify-between">
      <span className="text-xl font-bold">
        <a href="/">Cardfoi</a>
      </span>

      <div className="flex items-center gap-2">
        {selectedCard && (
          <>
            <span className="text-sm text-base-content/60 hidden sm:block">
              {selectedCard.name}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={onNewCard} title="Create new card">
              <UserRound size={16} />
              <span className="hidden sm:inline">New Card</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
