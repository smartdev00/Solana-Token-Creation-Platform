'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Globe, MessageCircle, Twitter } from 'lucide-react';
import Progress from './Progress';
import { GradientButton } from '../component/Button';
import TextField from '../component/TextField';
import ImageUpload from '../component/ImageUpload';
import { TokenMetaDataType } from '@/lib/types';
import ModifyCreatorInformation from './ModifyCreatorInformation';
import RevokeAuthority from './RevokeAuthority';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, clusterApiUrl } from '@solana/web3.js';
import { createTokenCreationTransaction } from '@/lib/web3';
import { uploadToIPFS } from '@/lib/ipfsUpload';
import { AxiosProgressEvent } from 'axios';
import Image from 'next/image';
import { useStateContext } from '@/provider/StateProvider';

const TokenCreation = ({
  setError,
  setMintAddress,
}: // pubKey,
// initialFee,
{
  // initialFee: number;
  // pubKey: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setMintAddress: Dispatch<SetStateAction<string | null>>;
}) => {
  const [currentProgress, setCurrentProgress] = useState<number>(0);
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
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { publicKey, connected, sendTransaction } = useWallet();
  const { configData } = useStateContext();

  // If user clicks next or create token button
  async function handleNextOrCreateClick() {
    try {
      if (currentProgress < 4) {
        setCurrentProgress(currentProgress + 1);
      } else if (currentProgress === 4) {
        setIsCreating(true);
        console.log('tokenMetaData', tokenMetaData, 'pubKey:', configData.pubKey);
        if (!(publicKey && connected && configData.pubKey && sendTransaction)) {
          throw new Error(`Please connect wallet!`);
        }
        const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || '', 'confirmed');
        // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        let fee = configData.fee;
        if (tokenMetaData.enableCreator) fee += configData.creatorFee;
        if (tokenMetaData.mintable) fee += configData.mintableFee;
        if (tokenMetaData.freezeable) fee += configData.freezeableFee;
        if (tokenMetaData.updateable) fee += configData.updateableFee;

        const balance = await connection.getBalance(publicKey);
        console.log('balance', balance, fee);

        if (balance < fee * 1e9) {
          throw new Error(`Insufficient funds for transaction. Required balance: ${fee.toFixed(4)} SOL`);
        }

        if (!tokenMetaData.logo) {
          throw new Error('Please upload token log at first.');
        }

        // Upload token logo to IPFS
        const logo = await uploadToIPFS(tokenMetaData.logo, ({}: AxiosProgressEvent) => {}).catch((err) => {
          console.log(err);
          throw new Error('Token logo upload failed to IPFS. Please retry.');
        });

        // Upload metadata.json to IPFS
        const metadataUri = await uploadToIPFS(
          new File(
            [
              JSON.stringify({
                name: tokenMetaData.name,
                symbol: tokenMetaData.symbol,
                description: tokenMetaData.description,
                image: logo,
                website: tokenMetaData.website || '',
                extensions: {
                  website: tokenMetaData.website || '',
                  twitter: tokenMetaData.twitter || '',
                  telegram: tokenMetaData.telegram || '',
                  discord: tokenMetaData.discord || '',
                },
              }),
            ],
            'metadata.json'
          ),
          ({}: AxiosProgressEvent) => {}
        ).catch((err) => {
          console.log(err);
          throw new Error('Token metadata upload failed to IPFS. Please retry.');
        });

        // Create token creation transaction
        const { transaction, signers, mint } = await createTokenCreationTransaction(
          connection,
          tokenMetaData,
          publicKey,
          metadataUri
        );

        if (!transaction) {
          throw new Error('Error while building the token creation transaction.');
        }

        // Create SOL transfer instruction and add
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(configData.pubKey),
            lamports: Math.floor(fee * LAMPORTS_PER_SOL),
          })
        );

        try {
          const signature = await sendTransaction(transaction, connection, { signers: signers });
          console.log('Signature', signature);
          setMintAddress(mint.toString());
          setIsCreating(false);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (sendError: any) {
          // Check if the error is due to user cancellation
          if (sendError.message.includes('User rejected the request.')) {
            setError('Transaction was canceled by the user.');
            setIsCreating(false);
            return;
          } else {
            throw new Error('Transaction failed');
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setIsCreating(false);
      setError(error.message || 'An unexpected error occurred.');
    }
  }

  return (
    <div className='pt-8 max-w-[1440px] mx-auto !mb-6 px-4 sm:px-12 subtitle-animate'>
      {currentProgress !== 0 && (
        <div className='space-y-4 mb-12'>
          <h2 className='text-2xl sm:text-5xl text-white text-center'>Create Solana Token!</h2>
          <p className='text-xs sm:text-xl text-dark-200 text-center'>
            The cost of creating the token is <span className='text-secondary'>{configData.fee} SOL</span>, which covers
            all fees needed for the SPL Token creation.
          </p>
        </div>
      )}
      {currentProgress !== 0 && <Progress currentProgress={currentProgress} setCurrentProgress={setCurrentProgress} />}
      <div className='relative rounded-xl bg-dark-300 border-dark-400 border py-6 px-4 overflow-hidden'>
        {currentProgress === 0 && (
          <Image
            alt='waves'
            src='/waves.png'
            className='absolute md:w-full sm:w-[150vw] w-[200vw] max-w-[10000px] -left-1/2 sm:-left-1/3 md:left-0 bottom-0'
            width={1000}
            height={300}
          />
        )}

        <div className='space-y-6 rounded-xl'>
          {/* Progress O */}
          {currentProgress === 0 && (
            <div className='relative flex flex-col items-center space-y-8 create-token-first w-full p-4 sm:p-8'>
              <div className='space-y-4'>
                <h2 className='text-2xl sm:text-5xl text-white text-center'>Create Solana Token!</h2>
                <p className='text-xs sm:text-xl text-dark-200 text-center'>
                  The cost of creating the token is <span className='text-secondary'>{configData.fee} SOL</span>, which
                  covers all fees needed for the SPL Token creation.
                </p>
              </div>
              <GradientButton
                className='w-full sm:w-[200px] h-[54px] justify-self-center'
                onClick={() => setCurrentProgress(currentProgress + 1)}
                disabled={!publicKey || !connected}
              >
                Create Token
              </GradientButton>
            </div>
          )}

          {/* Progress I */}
          {currentProgress === 1 && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                <TextField
                  label='Token Name *'
                  placeholder='Cosmic Coin'
                  name='name'
                  value={tokenMetaData?.name}
                  setTokenMetaData={setTokenMetaData}
                />
                <TextField
                  label='Token Symbol *'
                  placeholder='CSMC'
                  name='symbol'
                  value={tokenMetaData?.symbol}
                  setTokenMetaData={setTokenMetaData}
                  helperText='Max. 8 symbols'
                />
              </div>
              <ImageUpload className='mt-6 md:mt-8' tokenMetaData={tokenMetaData} setTokenMetaData={setTokenMetaData} />
            </div>
          )}

          {/* Progress II */}
          {currentProgress === 2 && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                <TextField
                  label='Token Decimals *'
                  placeholder='9'
                  name='decimals'
                  min={0}
                  max={9}
                  helperText='Enter a value between 0 and 9 decimals'
                  value={tokenMetaData?.decimals}
                  setTokenMetaData={setTokenMetaData}
                />
                <TextField
                  label='Total Supply *'
                  placeholder='1000000000'
                  name='supply'
                  type='number'
                  max={1e19 / 10 ** (tokenMetaData.decimals || 0)}
                  value={tokenMetaData?.supply}
                  helperText='Common supply is 1 billion'
                  setTokenMetaData={setTokenMetaData}
                />
              </div>
              <div>
                <span className='block text-gray-300 text-sm font-medium mb-2'>Describe your token</span>
                <textarea
                  className='w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition'
                  value={tokenMetaData.description}
                  placeholder='Write text here ...'
                  onChange={(e) =>
                    setTokenMetaData((prev) => {
                      return { ...prev, description: e.target.value };
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Progress III */}
          {currentProgress === 3 && (
            <div>
              <div className='grid lg:grid-cols-4 gap-6'>
                <TextField
                  placeholder='https://yourmemecoin.fun'
                  name='website'
                  value={tokenMetaData.website || ''}
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
                  value={tokenMetaData.twitter || ''}
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
                  value={tokenMetaData.telegram || ''}
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
                  value={tokenMetaData.discord || ''}
                  setTokenMetaData={setTokenMetaData}
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <MessageCircle className='w-4 h-4 text-gray-300' />
                    <span className='text-gray-300 text-sm font-medium'>Discord</span>
                  </div>
                </TextField>
              </div>
              <ModifyCreatorInformation
                setTokenMetaData={setTokenMetaData}
                tokenMetaData={tokenMetaData}
                creatorFee={configData.creatorFee}
              />
            </div>
          )}

          {/* Progress IV */}
          {currentProgress === 4 && (
            <div>
              <RevokeAuthority
                setTokenMetaData={setTokenMetaData}
                tokenMetaData={tokenMetaData}
                configData={configData}
              />
            </div>
          )}

          {/* Back, Next and Create Token Buttons */}
          {currentProgress !== 0 && (
            <div className='w-full flex flex-1 justify-end pt-4'>
              <GradientButton
                className='justify-self-end sm:w-[200px] h-[54px] w-full'
                onClick={handleNextOrCreateClick}
                disabled={
                  (currentProgress === 1 &&
                    (!!tokenMetaData.name === false ||
                      !!tokenMetaData.symbol === false ||
                      !!tokenMetaData.logo === false)) ||
                  (currentProgress === 2 && (!!tokenMetaData.decimals === false || !!tokenMetaData.supply === false)) ||
                  (currentProgress === 3 &&
                    tokenMetaData.enableCreator === true &&
                    (!!tokenMetaData.creatorName === false || !!tokenMetaData.creatorWebsite === false)) ||
                  isCreating
                }
              >
                {currentProgress === 4 ? 'Create Token' : 'Continue'}
                {isCreating && (
                  <div className='animate-spin w-4 h-4 bg-transparent rounded-full border-white border-t-4' />
                )}
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCreation;
