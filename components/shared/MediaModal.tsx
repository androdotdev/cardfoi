"use client";

import { useEffect, useCallback } from "react";
import type { WorkMedia } from "@/lib/cards";
import Image from "next/image";

type MediaModalProps = {
    works: WorkMedia[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (index: number) => void;
};

export default function MediaModal({
    works,
    currentIndex,
    isOpen,
    onClose,
    onNavigate,
}: MediaModalProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" && currentIndex < works.length - 1) {
                onNavigate(currentIndex + 1);
            }
            if (e.key === "ArrowLeft" && currentIndex > 0) {
                onNavigate(currentIndex - 1);
            }
        },
        [currentIndex, works.length, onClose, onNavigate],
    );

    useEffect(() => {
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    const work = works[currentIndex];
    if (!isOpen || !work) return null;

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < works.length - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="relative w-full max-w-3xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-surface"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close — top right */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white text-sm hover:bg-black/60 transition-colors"
                    type="button"
                >
                    ✕
                </button>

                {/* Prev — left center */}
                {hasPrev && (
                    <button
                        onClick={() => onNavigate(currentIndex - 1)}
                        className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white text-lg hover:bg-black/60 transition-colors"
                        type="button"
                    >
                        ‹
                    </button>
                )}

                {/* Next — right center */}
                {hasNext && (
                    <button
                        onClick={() => onNavigate(currentIndex + 1)}
                        className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white text-lg hover:bg-black/60 transition-colors"
                        type="button"
                    >
                        ›
                    </button>
                )}

                {/* Media */}
                <div className="flex items-center justify-center bg-muted p-4">
                    {work.type === "image" && (
                        <Image
                            src={`/api/media/${work.id}`}
                            alt={work.title}
                            fill
                            className="max-h-[65vh] w-auto object-contain rounded-lg"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    )}
                    {work.type === "video" && (
                        <video
                            src={`/api/media/${work.id}`}
                            className="max-h-[65vh] w-auto rounded-lg"
                            controls
                            controlsList="nodownload"
                            autoPlay
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    )}
                </div>

                {/* Counter */}
                {works.length > 1 && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white">
                            {currentIndex + 1} / {works.length}
                        </span>
                    </div>
                )}

                {/* Info */}
                {(work.title || work.description) && (
                    <div className="p-4">
                        <h3 className="font-semibold text-content">
                            {work.title}
                        </h3>
                        {work.description && (
                            <p className="mt-1 text-sm text-content-60">
                                {work.description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
