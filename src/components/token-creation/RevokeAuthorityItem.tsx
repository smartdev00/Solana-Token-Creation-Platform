import { RevokeAuthorityType, TokenMetaDataType } from '@/lib/types';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { SelectButton } from '../component/Button';
import { cn } from '@/lib/utils';

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
      className={cn(
        `${!!tokenMetaData[item.type] ? 'bg-gradient-to-tr from-cyan-400 to-purple-500' : 'bg-gradient-to-tr'}`,
        'overflow-hidden font-medium text-white transition-all duration-300 ease-out group',
        'relative rounded-2xl flex items-start justify-center p-6',
        'hover:from-cyan-400 hover:to-purple-500'
      )}
      onClick={onClick}
    >
      <span className='absolute rounded-2xl m-0.5 inset-0 border-4 border-transparent bg-main box-border'></span>
      <div className='relative flex flex-col justify-between h-full'>
        <div className='flex justify-between items-center w-full mb-4'>
          <div className='border border-white/50 rounded-lg p-2.5 transition-all group-hover:border-cyan-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,.5)]'>
            {<item.logo className='text-cyan-500' width={20} height={20} />}
          </div>
          <span className='text-cyan-500'>+{item.price} SOL</span>
        </div>
        <h4 className='font-medium text-gray-100 mb-2 transition-colors group-hover:text-cyan-500'>{item.title}</h4>
        <p className='text-gray-400 text-sm transition-colors group-hover:text-gray-300'>{item.content}</p>
        <SelectButton selected={!!tokenMetaData[item.type]} onClick={handleItemClick}>
          {!!tokenMetaData[item.type] ? 'Selected' : 'Select to Revoke'}
        </SelectButton>
      </div>
    </div>
  );
};

export default RevokeAuthorityItem;
