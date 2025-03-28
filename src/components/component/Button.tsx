import Link from 'next/link';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const LinkButton = ({ children, href, soon }: { children: ReactNode; href?: string, soon: boolean }) => {
  // 'bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text hover:from-cyan-300 hover:to-purple-400'
  return (
    <>
      {soon ? (
        <span
          className={cn(
            'px-4 py-2 group relative text-transparent transition-all text-sm md:text-base font-medium tracking-wide text-dark-200'
          )}
        >
          <div className='flex flex-row gap-2 justify-center items-center'>
            <p className="text-center text-base text-[#777e89]">
              {children}
            </p>
            {soon?
              <span className='flex px-2 rounded-xl md:text-xs text-[10px] text-text-main text-opacity-80 bg-gradient-to-r from-[#6159FF] to-[#A440F2]'>
                Soon
              </span>
              :<></>}
            <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg opacity-0 transition-opacity duration-200' />
          </div>
        </span>
      ) : (
        <Link
          href={href || ''}
          className={cn(
            'px-4 py-2 group relative text-transparent transition-all text-sm md:text-base font-medium tracking-wide',
            'text-dark-200'
          )}
        >
          <p className="text-center">
            {children}
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Link>
      )}
    </>
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
        'bg-gradient-to-tr from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400',
      )}
      onClick={onClick}
    >
      <span className='px-8 py-3 bg-main rounded-2xl text-text-main font-medium'>{children}</span>
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
    <div className='gradient-btn gradient-one w-full'>
      <button
        className={cn(
          'gradient-button flex justify-center items-center rounded-full group',
          'hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gradient-to-r disabled:from-blue-custom disabled:to-purple-custom',
          className
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
        <div className='fill-one sm:w-[400px] w-[calc(220vw)] -ml-[calc(100vw-92px)] sm:-ml-[200px] group-hover:ml-0 sm:group-hover:translate-x-[100px] group-disabled:bg-none' />
      </button>
    </div>
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
            : 'border-gray-400 text-text-secondary bg-main/80'
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
