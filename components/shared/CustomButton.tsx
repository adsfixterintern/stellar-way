import React from 'react';
import Link from 'next/link';

interface CustomButtonProps {
  title: string;
  path?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const CustomButton = ({ title, path, onClick, className = "", type = "button" }: CustomButtonProps) => {
  const commonClasses = `bg-[#1e3316] hover:bg-[#2d4a22] text-white px-10 py-3.5 rounded-xl transition-all font-semibold text-lg shadow-lg active:scale-95 inline-block text-center ${className}`;
  if (path) {
    return (
      <Link href={path} className={commonClasses}>
        {title}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={commonClasses}
    >
      {title}
    </button>
  );
};

export default CustomButton;