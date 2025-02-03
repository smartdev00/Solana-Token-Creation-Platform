import { TokenMetaDataType } from '@/lib/types';
import TextField from './TextField';
import { Dispatch, SetStateAction } from 'react';
import { ToggleButton } from './Button';

const ModifyCreatorInformation = ({
  tokenMetaData,
  setTokenMetaData,
}: {
  tokenMetaData: TokenMetaDataType;
  setTokenMetaData: Dispatch<SetStateAction<TokenMetaDataType>>;
}) => {
  function handleToggleClick() {
    setTokenMetaData((prev) => {
      return { ...prev, enableCreator: !tokenMetaData.enableCreator };
    });
  }
  return (
    <div className='border-t mt-8 pt-8'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg text-gray-200 font-medium'>Modify Creator Information</h3>
          <p className='text-gray-400 text-sm mt-1'>
            Change the information of the creator in the metadata. By default, it is CoinFast.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-gray-400 text-sm'>(+0.1 SOL)</span>
          <ToggleButton selected={tokenMetaData.enableCreator} onClick={handleToggleClick} />
        </div>
      </div>
      {tokenMetaData.enableCreator && (
        <div className='space-y-4 mt-4'>
          <TextField
            label='Creator Name'
            name='creatorName'
            value={tokenMetaData.creatorName || ''}
            placeholder='Your name or organization'
            setTokenMetaData={setTokenMetaData}
          />
          <TextField
            label='Creator Website'
            name='creatorWebsite'
            value={tokenMetaData.creatorWebsite || ''}
            placeholder='https://yourmemecoinwebsite.fun'
            setTokenMetaData={setTokenMetaData}
          />
        </div>
      )}
    </div>
  );
};

export default ModifyCreatorInformation;
