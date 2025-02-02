'use client';

import { useState } from 'react';
import { ChevronRight, Globe, MessageCircle, Twitter } from 'lucide-react';
import Progress from './Progress';
import { GradientBorderButton, GradientButton } from './Button';
import { GradientBorderCard } from './GradientBorderCard';
import TextField from './TextField';
import ImageUpload from './ImageUpload';
import { TokenMetaDataType } from '@/lib/types';
import ModifyCreatorInformation from './ModifyCreatorInformation';
import RevokeAuthority from './RevokeAuthority';

const TokenCreation = () => {
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const [tokenMetaData, setTokenMetaData] = useState<TokenMetaDataType>({
    name: '',
    symbol: '',
    supply: 1000000000,
    decimals: 9,
    logo: undefined,
    enableCreator: true,
    freezeable: true,
    mintable: true,
    updateable: true,
  });

  function handleNextOrCreateClick() {
    if (currentProgress < 3) {
      setCurrentProgress(currentProgress + 1);
    } else if (currentProgress === 3) {
      console.log('tokenMetaData', tokenMetaData);
    }
  }
  return (
    <div>
      <Progress currentProgress={currentProgress} />
      <GradientBorderCard>
        <div className='space-y-6'>
          {/* Step I */}
          {currentProgress === 1 && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                <TextField
                  label='Token Name'
                  placeholder='Cosmic Coin'
                  name='name'
                  value={tokenMetaData?.name}
                  setTokenMetaData={setTokenMetaData}
                />
                <TextField
                  label='Token Symbol'
                  placeholder='CSMC'
                  name='symbol'
                  value={tokenMetaData?.symbol}
                  setTokenMetaData={setTokenMetaData}
                />
              </div>
              <ImageUpload className='mt-6 md:mt-8' tokenMetaData={tokenMetaData} setTokenMetaData={setTokenMetaData} />
            </div>
          )}

          {/* Step II */}
          {currentProgress === 2 && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                <TextField
                  label='Decimals'
                  placeholder='9'
                  name='decimals'
                  helperText='Enter a value between 0 and 18 decimals'
                  value={tokenMetaData?.decimals}
                  setTokenMetaData={setTokenMetaData}
                />
                <TextField
                  label='Total Supply'
                  placeholder='1000000000'
                  name='supply'
                  type='number'
                  value={tokenMetaData?.supply}
                  helperText='Common supply is 1 billion'
                  setTokenMetaData={setTokenMetaData}
                />
              </div>
              <textarea
                className='mt-6 md:mt-8 w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition'
                value={tokenMetaData.description}
                placeholder="Describe your token's purpose and vision..."
                onChange={(e) =>
                  setTokenMetaData((prev) => {
                    return { ...prev, description: e.target.value };
                  })
                }
              />
            </div>
          )}

          {/* Step III */}
          {currentProgress === 3 && (
            <div>
              <div className='space-y-4'>
                <TextField
                  placeholder='https://yourmemecoin.fun'
                  name='website'
                  value={tokenMetaData?.website}
                  setTokenMetaData={setTokenMetaData}
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <Globe className='w-4 h-4 text-gray-300' />
                    <span className='text-gray-300 text-sm font-medium'>Website</span>
                  </div>
                </TextField>
                <TextField
                  placeholder='https://twitter.com/yourmemecoin'
                  name='twitter'
                  value={tokenMetaData?.twitter}
                  setTokenMetaData={setTokenMetaData}
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <Twitter className='w-4 h-4 text-gray-300' />
                    <span className='text-gray-300 text-sm font-medium'>Twitter</span>
                  </div>
                </TextField>
                <TextField
                  placeholder='https://t.me/yourchannel'
                  name='telegram'
                  value={tokenMetaData?.telegram}
                  setTokenMetaData={setTokenMetaData}
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <MessageCircle className='w-4 h-4 text-gray-300' />
                    <span className='text-gray-300 text-sm font-medium'>Telegram</span>
                  </div>
                </TextField>
                <TextField
                  placeholder='https://discord.gg/your-server'
                  name='discord'
                  value={tokenMetaData?.discord}
                  setTokenMetaData={setTokenMetaData}
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <MessageCircle className='w-4 h-4 text-gray-300' />
                    <span className='text-gray-300 text-sm font-medium'>Discord</span>
                  </div>
                </TextField>
              </div>
              <ModifyCreatorInformation setTokenMetaData={setTokenMetaData} tokenMetaData={tokenMetaData} />
              <RevokeAuthority setTokenMetaData={setTokenMetaData} tokenMetaData={tokenMetaData} />
            </div>
          )}

          {/* Back, Next and Create Token Buttons */}
          <div className='w-full flex flex-1 justify-between pt-4'>
            {currentProgress > 1 ? (
              <GradientBorderButton onClick={() => setCurrentProgress(currentProgress - 1)}>Back</GradientBorderButton>
            ) : (
              <div />
            )}
            <GradientButton
              className='justify-self-end'
              onClick={handleNextOrCreateClick}
              disabled={
                (currentProgress === 1 &&
                  (!!tokenMetaData.name === false ||
                    !!tokenMetaData.symbol === false ||
                    !!tokenMetaData.logo === false)) ||
                (currentProgress === 2 && (!!tokenMetaData.decimals === false || !!tokenMetaData.supply === false)) ||
                (currentProgress === 3 &&
                  tokenMetaData.enableCreator === true &&
                  (!!tokenMetaData.creatorName === false || !!tokenMetaData.creatorWebsite === false))
              }
            >
              {currentProgress === 3 ? 'Create Token' : 'Next'}
              <ChevronRight width={16} height={16} />
            </GradientButton>
          </div>
        </div>
      </GradientBorderCard>
    </div>
  );
};

export default TokenCreation;
