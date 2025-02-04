import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const GradientTypography = ({
  className,
  variant,
  children,
}: {
  className?: string;
  variant?: 'h1' | 'h2' | 'h3';
  children: ReactNode;
}) => {
  // Define the tag based on the variant prop
  const Tag = variant || 'h1'; // Default to 'h1' if no variant is provided

  return <Tag className={cn('bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold', className)}>{children}</Tag>;
};
