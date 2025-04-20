export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
        <div className="h-4 w-full max-w-2xl bg-gray-200 rounded mx-auto animate-pulse"></div>
        <div className="h-4 w-full max-w-xl bg-gray-200 rounded mx-auto mt-2 animate-pulse"></div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
          ></div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="h-64 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
