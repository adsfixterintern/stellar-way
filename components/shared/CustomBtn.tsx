import React from 'react';
import Link from 'next/link';

interface CustomButtonProps {
  title: string;
  link?: string;
  className?: string;
  onClick?: () => void;
}

const CustomButton = ({ title, link, className = "", onClick }: CustomButtonProps) => {
  const commonClasses = `px-10 py-3.5 rounded-xl transition-all font-semibold text-lg shadow-lg active:scale-95 inline-block text-center cursor-pointer ${className}`;
  if (link) {
    return (
      <Link href={link} className={commonClasses}>
        {title}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={commonClasses}>
      {title}
    </button>
  );
};

export default CustomButton;