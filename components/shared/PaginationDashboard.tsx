import React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationDashboard: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (totalItems <= itemsPerPage) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-50 gap-4">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          <IoChevronBackOutline size={16} />
        </button>

        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                currentPage === i + 1
                  ? "bg-[#1A4E11] text-white shadow-lg shadow-[#1A4E11]/20"
                  : "text-gray-400 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          <IoChevronForwardOutline size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationDashboard;