import { RevokeAuthorityType, TokenMetaDataType } from '@/lib/types';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { SelectButton } from './Button';

const RevokeAuthorityItem = ({
  item,
  onClick,
  tokenMetaData,
  setTokenMetaData,
}: {
  item: RevokeAuthorityType;
  children?: ReactNode;
  className?: string;
  tokenMetaData: TokenMetaDataType;
  setTokenMetaData: Dispatch<SetStateAction<TokenMetaDataType>>;
  onClick?: () => void;
}) => {
  function handleItemClick() {
    setTokenMetaData((prev) => {
      return { ...prev, [item.type]: !tokenMetaData[item.type] };
    });
  }
  return (
    <div
      className='relative rounded-2xl flex items-start justify-center p-6 bg-gradient-to-tr from-cyan-400 to-purple-500 overflow-hidden font-medium text-white transition duration-300 ease-out group'
      onClick={onClick}
    >
      <span className='absolute rounded-2xl m-0.5 inset-0 border-4 border-transparent bg-main box-border'></span>
      <div className='relative'>
        <div className='flex justify-between items-center w-full mb-4'>
          <div className='border border-white/50 rounded-lg p-2.5 transition-all'>
            {<item.logo className='text-cyan-500' width={20} height={20} />}
          </div>
          <span className='text-cyan-500'>+{item.price} SOL</span>
        </div>
        <h4 className='font-medium text-gray-100 mb-2 transition-colors'>{item.title}</h4>
        <p className='text-gray-400 text-sm transition-colors'>{item.content}</p>
        <SelectButton selected={!!tokenMetaData[item.type]} onClick={handleItemClick}>
          {!!tokenMetaData[item.type] ? 'Selected' : 'Select to Revoke'}
        </SelectButton>
      </div>
    </div>
  );
};

export default RevokeAuthorityItem;
