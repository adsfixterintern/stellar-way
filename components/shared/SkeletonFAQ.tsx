export  const SkeletonFAQ = () => (
    <div className="grid gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 animate-pulse">
          <div className="flex-1 w-full space-y-3">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="h-12 w-12 bg-gray-100 rounded-2xl"></div>
            <div className="h-12 w-12 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      ))}
    </div>
  );