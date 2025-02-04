import Link from 'next/link';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const LinkButton = ({ children, href }: { children: ReactNode; href?: string }) => {
  return (
    <Link
      href={href || ''}
      className={cn(
        'px-4 py-2 group relative text-transparent transition-all text-sm md:text-base font-medium tracking-wide',
        'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text hover:from-cyan-300 hover:to-purple-400'
      )}
    >
      {children}
      <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
    </Link>
  );
};

export const GradientBorderButton = ({
  children,
  onClick,
}: {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className={cn(
        'relative rounded-2xl flex items-center justify-center px-8 py-3 h-[52px] overflow-hidden font-medium text-white transition duration-300 ease-out group',
        'bg-gradient-to-tr from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400'
      )}
      onClick={onClick}
    >
      <span className='absolute rounded-2xl m-0.5 inset-0 border-4 border-transparent bg-main box-border'></span>
      <span className='relative'>{children}</span>
    </button>
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

export const SelectButton = ({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className={cn(
        `${
          selected
            ? 'border-cyan-500 text-cyan-500 bg-gradient-to-r from-cyan-500/30 to-purple-500/20'
            : 'border-gray-400 text-gray-400 bg-main/80'
        }`,
        `border px-4 py-2 text-sm rounded-lg mt-4 w-full transition-all duration-300`
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ToggleButton = ({ selected, onClick }: { selected?: boolean; onClick: () => void }) => {
  return (
    <button
      className={cn(
        `${selected ? 'bg-cyan-400' : 'bg-gray-700'}`,
        `relative inline-flex h-6 w-11 flex-shrink-0 p-0.5 bg-clip-padding cursor-pointer rounded-full`,
        `transition-colors duration-200 ease-in-out shadow-[0_0_10px_rgba(6,182,212,.3)]`
        // 'before:absolute before:-top-1 before:-bottom-0 before:-right-1 before:-left-1 before:rounded-full before:p-[1px] before:opacity-20',
        // 'before:bg-gradient-to-r before:from-gray-700 before:to-[#8b5cf6] before:shadow-[0_0_15px_rgba(6,182,212,.5)] '
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          `${selected ? 'translate-x-5' : ''}`,
          `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`
        )}
      />
    </button>
  );
};
