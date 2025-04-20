export default function ProductLoading() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery Loading Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1/4 aspect-square bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Loading Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Tabs Loading Skeleton */}
      <div className="mb-16">
        <div className="flex gap-4 border-b mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Comments Loading Skeleton */}
      <div className="space-y-4 mb-16">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        {[1, 2].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
