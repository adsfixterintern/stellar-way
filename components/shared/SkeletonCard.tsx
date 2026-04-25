
export const SkeletonCard = () => (
  <div className="bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm animate-pulse mb-4">
    {/* Image Placeholder */}
    <div className="h-75 w-full bg-gray-200" />
    
    {/* Content Placeholder */}
    <div className="p-5 flex flex-col items-center">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);


export const SkeletonCardForViewTables = () => {
  return (
    <div className="relative h-87.5 w-full rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
      {/* Bottom Placeholder */}
      <div className="absolute bottom-0 left-0 w-full p-6 space-y-3 bg-linear-to-t from-gray-300 to-transparent">
        <div className="h-8 bg-gray-300 rounded w-1/3" />
        <div className="h-4 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
  );
};