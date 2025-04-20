export default function BlogPostLoading() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-gray-200 rounded mb-8 animate-pulse"></div>

        {/* Post header loading */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="h-12 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-12 w-1/2 bg-gray-200 rounded mb-6 animate-pulse"></div>

          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Featured image loading */}
        <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-10 animate-pulse"></div>

        {/* Content loading */}
        <div className="space-y-4 mb-16">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 rounded w-full animate-pulse"
            ></div>
          ))}
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded w-full animate-pulse"></div>
          {[...Array(6)].map((_, i) => (
            <div
              key={i + 10}
              className="h-6 bg-gray-200 rounded w-full animate-pulse"
            ></div>
          ))}
          <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>

        {/* Tags loading */}
        <div className="mb-12">
          <div className="h-6 w-20 bg-gray-200 rounded mb-3 animate-pulse"></div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Author bio loading */}
        <div className="bg-gray-50 rounded-lg p-6 mb-16">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-6 w-40 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Comments loading */}
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded mb-1 animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
