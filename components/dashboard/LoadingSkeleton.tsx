export function CardFormSkeleton() {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="h-6 w-32 animate-pulse rounded bg-base-300"></div>
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-base-300"></div>
        </div>
        <div className="h-10 w-20 animate-pulse rounded bg-base-300"></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-base-300"></div>
            <div className="h-10 animate-pulse rounded bg-base-300"></div>
          </div>
        ))}
        <div className="md:col-span-2 space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-base-300"></div>
          <div className="h-28 animate-pulse rounded bg-base-300"></div>
        </div>
      </div>
    </div>
  );
}

export function WorkFormSkeleton() {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded bg-base-300"></div>
        <div className="h-10 w-24 animate-pulse rounded bg-base-300"></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-base-300"></div>
            <div className="h-10 animate-pulse rounded bg-base-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardPreviewSkeleton() {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 animate-pulse rounded-full bg-base-300"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-base-300"></div>
          <div className="h-4 w-64 animate-pulse rounded bg-base-300"></div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-16 animate-pulse rounded bg-base-300"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkListSkeleton() {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <div className="mb-4 h-6 w-24 animate-pulse rounded bg-base-300"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-box border border-base-300 p-3">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="h-5 w-5 animate-pulse rounded bg-base-300"></div>
                <div>
                  <div className="h-5 w-32 animate-pulse rounded bg-base-300"></div>
                  <div className="mt-1 h-4 w-48 animate-pulse rounded bg-base-300"></div>
                </div>
              </div>
              <div className="h-8 w-8 animate-pulse rounded bg-base-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
