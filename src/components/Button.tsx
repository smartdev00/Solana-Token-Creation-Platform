import Link from 'next/link';
import { ReactNode } from 'react';

export const LinkButton = ({ text }: { text: string }) => {
  return (
    <Link
      href=''
      className='px-4 py-2 text-transparent bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-sm md:text-base font-medium tracking-wide'
    >
      {text}
    </Link>
  );
};

export const GradientButton = ({
  children,
  className,
  disabled,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className={
        className +
        ' gradient-button text-white inline-flex relative items-center gap-2 border-none transition-all font-medium shadow-[0 0 15px rgba(6, 182, 212, .2)]' +
        ' rounded-2xl px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500' +
        ' disabled:opacity-50 disabled:cursor-not-allowed'
      }
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
