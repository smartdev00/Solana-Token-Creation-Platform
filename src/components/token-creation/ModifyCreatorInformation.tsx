import { TokenMetaDataType } from '@/lib/types';
import TextField from '../component/TextField';
import { Dispatch, SetStateAction } from 'react';
import { ToggleButton } from '../component/Button';

const ModifyCreatorInformation = ({
  tokenMetaData,
  creatorFee,
  setTokenMetaData,
}: {
  tokenMetaData: TokenMetaDataType;
  creatorFee: number;
  setTokenMetaData: Dispatch<SetStateAction<TokenMetaDataType>>;
}) => {
  function handleToggleClick() {
    setTokenMetaData((prev) => {
      return { ...prev, enableCreator: !tokenMetaData.enableCreator };
    });
  }
  return (
    <div className='border-t mt-8 pt-8'>
      <div className='grid grid-cols-12 items-center justify-between mb-4'>
        <div className='smd:hidden flex col-span-12 mb-3 items-center space-x-2'>
          <span className='text-text-secondary text-sm'>(+{creatorFee} SOL)</span>
          <ToggleButton selected={tokenMetaData.enableCreator} onClick={handleToggleClick} />
        </div>
        <div className='smd:col-span-10 col-span-12'>
          <h3 className='text-lg text-text-secondary font-medium'>Modify Creator Information</h3>
          <p className='text-text-secondary text-sm mt-1'>
            Change the information of the creator in the metadata. By default, it is CoinForge.
          </p>
        </div>
        <div className='smd:flex hidden col-span-2 items-center space-x-2'>
          <span className='text-text-secondary text-sm'>(+{creatorFee} SOL)</span>
          <ToggleButton selected={tokenMetaData.enableCreator} onClick={handleToggleClick} />
        </div>
      </div>
      {tokenMetaData.enableCreator && (
        <div className='grid lg:grid-cols-2 gap-6 mt-4'>
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
