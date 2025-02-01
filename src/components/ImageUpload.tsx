'use client';

import { Upload } from 'lucide-react';
import { useRef } from 'react';

const ImageUpload = ({ fileName, className }: { fileName?: string; className?: string }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickDiv = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className={className}>
      <input
        id='fileUpload'
        type='file'
        className='hidden'
        accept='image/png,image/jpeg,image/gif'
        ref={fileInputRef}
      />
      <div
        className='rounded-xl p-4 md:p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer'
        style={{
          position: 'relative',
          background: 'rgb(23, 30, 46)',
          boxShadow: 'rgba(6, 182, 212, 0.2) 0px 0px 15px',
          borderStyle: 'dotted',
          borderWidth: '2px',
          borderColor: 'rgb(6, 182, 212)',
          borderRadius: '1rem',
        }}
        onClick={handleClickDiv}
      >
        <Upload className='text-gray-400 w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4' />
        <p className='text-gray-300 font-medium text-sm md:text-base'>Drop your 500 x 500 token logo here</p>
        <p className='text-gray-500 text-xs md:text-sm mt-2'>PNG, JPG, GIF up to 5MB</p>
        <div className='space-y-2'>
          <p>{fileName}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
