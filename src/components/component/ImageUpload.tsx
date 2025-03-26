'use client';

import { TokenMetaDataType } from '@/lib/types';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

const ImageUpload = ({
  tokenMetaData,
  className,
  setTokenMetaData,
}: {
  className?: string;
  tokenMetaData: TokenMetaDataType;
  setTokenMetaData: Dispatch<SetStateAction<TokenMetaDataType>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const file = tokenMetaData.logo;

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [tokenMetaData.logo]);

  const handleClickDiv = () => {
    fileInputRef.current?.click();
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setTokenMetaData((prev) => {
        return { ...prev, logo: file };
      });
    }
  }
  return (
    <div className={className}>
      <input
        id='fileUpload'
        type='file'
        className='hidden'
        onChange={handleFileChange}
        accept='image/png,image/jpeg,image/gif'
        ref={fileInputRef}
      />
      <div
        className='relative rounded-lg border-gray-600 gap-2.5 p-4 md:p-8 text-center bg-gray-700 border-dashed border-2 transition-colors cursor-pointer'
        onClick={handleClickDiv}
      >
        {!!tokenMetaData.logo?.name === false ? (
          <Upload className='text-text-secondary w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4' />
        ) : image ? (
          <Image
            alt='token logo preview'
            src={image as string}
            width={96}
            height={96}
            className='mx-auto h-20 w-20 md:h-24 md:w-24 object-cover rounded-lg'
          />
        ) : (
          <div />
        )}

        {!!tokenMetaData.logo?.name === false ? (
          <div>
            <p className='text-text-secondary font-medium text-sm md:text-base'>Click to upload or drag and drop</p>
            <p className='text-text-secondary font-medium text-sm md:text-base'>SVG, PNG, JPG or GIF (MAX. 400 &times; 400)</p>
          </div>
        ) : (
          <div className='space-y-2 mt-2'>
            <p className='text-text-secondary text-sm md:text-base'>
              {image ? tokenMetaData.logo.name : 'Uploading image...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
