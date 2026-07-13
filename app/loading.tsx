export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </main>
  );
}
