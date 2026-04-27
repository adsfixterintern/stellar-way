// components/CustomerDashboardSkeleton.tsx

export default function CustomerDashboardSkeleton() {
  return (
    <div className="bg-[#FDFCFD] min-h-screen p-4 md:p-8 font-sans animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-3">
          <div className="h-9 w-64 bg-gray-200 rounded-xl" />
          <div className="h-4 w-44 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-12 w-32 bg-gray-200 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl shrink-0" />
                <div className="space-y-2">
                  <div className="h-2.5 w-12 bg-gray-100 rounded" />
                  <div className="h-8 w-10 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Order */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-5 w-36 bg-gray-200 rounded-lg" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/30 border border-gray-50 p-6 rounded-2xl">
              <div className="flex items-center gap-5 flex-1">
                <div className="w-20 h-20 bg-gray-200 rounded-2xl shrink-0" />
                <div className="space-y-2.5">
                  <div className="h-2.5 w-24 bg-gray-100 rounded" />
                  <div className="h-5 w-44 bg-gray-200 rounded-lg" />
                  <div className="h-5 w-20 bg-gray-100 rounded-full" />
                </div>
              </div>
              <div className="border-l-2 border-gray-200 pl-4 space-y-2">
                <div className="h-2.5 w-24 bg-gray-100 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Event Horizon + Spending */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-5 w-28 bg-gray-200 rounded-lg" />
                <div className="h-3.5 w-20 bg-gray-100 rounded" />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-4 items-center">
                <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <div className="h-3.5 w-32 bg-gray-200 rounded" />
                  <div className="h-2.5 w-20 bg-gray-100 rounded" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="h-5 w-40 bg-gray-200 rounded-lg" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-2.5 w-28 bg-gray-100 rounded" />
                  <div className="h-2.5 w-8 bg-gray-100 rounded" />
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Special for You */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <div className="h-5 w-32 bg-gray-200 rounded-lg" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className={`flex items-center gap-4 pb-5 ${i === 0 ? "border-b border-gray-100" : ""}`}>
                <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-36 bg-gray-200 rounded" />
                  <div className="flex gap-3">
                    <div className="h-3 w-12 bg-gray-100 rounded" />
                    <div className="h-3 w-10 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="w-3.5 h-3.5 bg-gray-100 rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <div className="h-5 w-36 bg-gray-200 rounded-lg" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="relative w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                <div className="absolute bottom-4 left-4 space-y-1.5">
                  <div className="h-2 w-20 bg-gray-300 rounded" />
                  <div className="h-3 w-32 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
            <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}