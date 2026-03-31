export const TableSkeleton = () => (
  <>
    {[...Array(10)].map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-200" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
          </div>
        </td>
        <td className="p-5">
          <div className="h-5 w-16 bg-gray-200 rounded" />
        </td>
        <td className="p-5">
          <div className="flex justify-center">
            <div className="h-6 w-10 bg-gray-100 rounded-full" />
          </div>
        </td>
        <td className="p-5">
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
        </td>
        <td className="p-5 text-right">
          <div className="flex justify-end gap-2">
            <div className="w-9 h-9 bg-gray-100 rounded-lg" />
            <div className="w-9 h-9 bg-gray-100 rounded-lg" />
          </div>
        </td>
      </tr>
    ))}
  </>
);