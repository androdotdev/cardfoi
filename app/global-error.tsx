"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-['DM_Sans','sans-serif']">
        <main className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Critical Error
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A critical error occurred. Please reload the page.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
