import { revokeAuthorityItems } from '@/lib/constants';
import { Configuration, TokenMetaDataType } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';
import RevokeAuthorityItem from './RevokeAuthorityItem';

const RevokeAuthority = ({
  tokenMetaData,
  configData,
  setTokenMetaData,
}: {
  configData: Configuration;
  tokenMetaData: TokenMetaDataType;
  setTokenMetaData: Dispatch<SetStateAction<TokenMetaDataType>>;
}) => {
  return (
    <div className=''>
      <h3 className='text-lg text-gray-200 font-medium mb-4'>Revoke Authorities</h3>
      <p className='text-gray-400 text-sm mb-6'>
        Solana Token has 3 authorities: Freeze Authority, Mint Authority, and Update Authority. Revoke them to attract
        more investors. We highly recommend enabling these 3 options for gaining more trust.
      </p>
      <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-6'>
        {revokeAuthorityItems.map((item) => {
          return (
            <RevokeAuthorityItem
              item={item}
              key={item.id}
              price={configData[item.feeType]}
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
