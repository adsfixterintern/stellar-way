import React from 'react';
import Link from 'next/link';

interface CustomButtonProps {
  title?: string; 
  link?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode; 
}

const CustomBtn = ({ title, link, className = "", onClick, children }: CustomButtonProps) => {
  // কমন স্টাইল
  const commonClasses = `transition-all active:scale-95 inline-flex items-center justify-center cursor-pointer bg-white py-4 px-8 rounded-lg ${className}`;

  const content = (
    <>
      {children}
      {title && <span className='text-xl text-[#1A4E11] font-medium'>{title}</span>}
    </>
  );

  if (link) {
    return (
      <Link href={link} className={commonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={commonClasses}>
      {content}
    </button>
  );
};

export default CustomBtn;