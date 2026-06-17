"use client";

import { useEffect } from "react";
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
    // ✅ all hooks before any early return
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" && currentIndex < works.length - 1) {
                onNavigate(currentIndex + 1);
            }
            if (e.key === "ArrowLeft" && currentIndex > 0) {
                onNavigate(currentIndex - 1);
            }
        }

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, currentIndex, works.length, onClose, onNavigate]);

    // ✅ guards after hooks
    const work = works[currentIndex];
    if (!isOpen || !work) return null;

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < works.length - 1;

    return (
        <dialog className="modal modal-open" onClick={onClose}>
            <div
                className="modal-box relative max-w-3xl overflow-hidden bg-base-100 p-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close — top right */}
                <button
                    onClick={onClose}
                    className="btn btn-circle btn-sm absolute right-2 top-2 z-10"
                    type="button"
                >
                    ✕
                </button>

                {/* Prev — left center */}
                {hasPrev && (
                    <button
                        onClick={() => onNavigate(currentIndex - 1)}
                        className="btn btn-circle btn-sm absolute left-2 top-1/2 z-10 -translate-y-1/2"
                        type="button"
                    >
                        ‹
                    </button>
                )}

                {/* Next — right center, doesn't overlap close (top-2 vs top-1/2) */}
                {hasNext && (
                    <button
                        onClick={() => onNavigate(currentIndex + 1)}
                        className="btn btn-circle btn-sm absolute right-2 top-1/2 z-10 -translate-y-1/2"
                        type="button"
                    >
                        ›
                    </button>
                )}

                {/* Media */}
                <div className="flex items-center justify-center bg-base-300 p-4">
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
                        <span className="rounded-full bg-base-content/40 px-3 py-1 text-xs text-base-100">
                            {currentIndex + 1} / {works.length}
                        </span>
                    </div>
                )}

                {/* Info */}
                {(work.title || work.description) && (
                    <div className="p-4">
                        <h3 className="font-semibold text-base-content">
                            {work.title}
                        </h3>
                        {work.description && (
                            <p className="mt-1 text-sm text-base-content/60">
                                {work.description}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
