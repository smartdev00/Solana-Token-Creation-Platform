'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Progress from './Progress';
import { GradientButton } from './Button';
import { GradientBorderCard } from './GradientBorderCard';
import TextField from './TextField';
import ImageUpload from './ImageUpload';

const TokenCreation = () => {
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  return (
    <div>
      <Progress currentProgress={currentProgress} />
      <GradientBorderCard>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
            <TextField label='Token Name' />
            <TextField label='Token Symbol' />
          </div>
          <ImageUpload className='mt-6 md:mt-8' />
          <div className='w-full flex justify-end'>
            <GradientButton onClick={() => setCurrentProgress}>
              Next
              <ChevronRight width={16} height={16} />
            </GradientButton>
          </div>
        </div>
      </GradientBorderCard>
    </div>
  );
};

export default TokenCreation;
