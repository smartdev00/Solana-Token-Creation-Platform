import { revokeAuthorityItems } from '@/lib/constants';
import { TokenMetaDataType } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';
import RevokeAuthorityItem from './RevokeAuthorityItem';

const RevokeAuthority = ({
  tokenMetaData,
  setTokenMetaData,
}: {
  tokenMetaData: TokenMetaDataType;
  setTokenMetaData: Dispatch<SetStateAction<TokenMetaDataType>>;
}) => {
  return (
    <div className='border-t mt-8 pt-8'>
      <h3 className='text-lg text-gray-200 font-medium mb-4'>Revoke Authorities</h3>
      <p className='text-gray-400 text-sm mb-6'>
        Solana Token has 3 authorities: Freeze Authority, Mint Authority, and Update Authority. Revoke them to attract
        more investors. We highly recommend enabling these 3 options for gaining more trust.
      </p>
      <div className='grid grid-cols-3 gap-6'>
        {revokeAuthorityItems.map((item) => {
          return (
            <RevokeAuthorityItem
              item={item}
              key={item.id}
              tokenMetaData={tokenMetaData}
              setTokenMetaData={setTokenMetaData}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RevokeAuthority;
