export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Topbar skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Bento grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl p-5"
          >
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 mb-4" />
            <div className="space-y-3">
              <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-20 w-full animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
