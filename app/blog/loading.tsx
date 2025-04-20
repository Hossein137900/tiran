export default function BlogLoading() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
        <div className="h-4 w-full max-w-2xl bg-gray-200 rounded mx-auto animate-pulse"></div>
      </div>

      {/* Featured Post Loading */}
      <div className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="aspect-[16/9] bg-gray-200 rounded-lg animate-pulse"></div>
          <div>
            <div className="flex gap-4 mb-3">
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Loading */}
      <div className="flex justify-center gap-3 mb-12">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-10 w-20 bg-gray-200 rounded-full animate-pulse"
          ></div>
        ))}
      </div>

      {/* Posts Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="aspect-[16/10] bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="flex gap-3 mb-3">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
