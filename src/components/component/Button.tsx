import Link from 'next/link';
import { MouseEvent, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const LinkButton = ({
  children,
  href,
  className,
  disabled,
}: {
  children: ReactNode;
  href?: string;
  disabled?: boolean;
  className?: string;
}) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    if (disabled) {
      event.preventDefault();
    }
  };
  return (
    <Link
      href={href || ''}
      className={cn(
        'px-4 py-2 group relative text-transparent transition-all text-sm md:text-base font-medium tracking-wide',
        `bg-gradient-to-r ${
          disabled ? 'from-gray-400 to-gray-700' : 'from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400'
        } bg-clip-text`,
        className
      )}
      onClick={(e) => handleClick(e)}
    >
      {children}
      <div
        className={cn(
          `absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg opacity-0 group`,
          `${!disabled && 'group-hover:opacity-100'} transition-opacity duration-200`
        )}
      />
      {disabled && <span className='absolute text-gray-400 text-xs rounded-full py-0.5 bg-cyan-500/5 px-2'>soon</span>}
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
        'gradient-button rounded-2xl flex items-center p-0.5 justify-center h-[52px]',
        'bg-gradient-to-tr from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400'
      )}
      onClick={onClick}
    >
      <span className='px-8 py-3 bg-main rounded-2xl text-white font-medium'>{children}</span>
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
        `select-button border px-4 py-2 text-sm rounded-lg mt-4 w-full`
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
        `${selected ? 'bg-cyan-400 border border-cyan-400' : 'bg-gray-700 border-white border'}`,
        `relative inline-flex h-6 w-11 flex-shrink-0 p-0.5 cursor-pointer rounded-full `,
        `transition-colors duration-200 ease-in-out shadow-[0_0_15px_rgba(6,182,212,.3)]`
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          `${selected ? 'translate-x-5' : ''}`,
          `pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition duration-200 ease-in-out`
        )}
      />
    </button>
  );
};
