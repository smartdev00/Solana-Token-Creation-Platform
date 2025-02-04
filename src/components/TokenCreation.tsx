'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Copy, ExternalLink, Globe, MessageCircle, Twitter, X } from 'lucide-react';
import Progress from './Progress';
import { GradientBorderButton, GradientButton } from './Button';
import { GradientBorderCard } from './GradientBorderCard';
import TextField from './TextField';
import ImageUpload from './ImageUpload';
import { TokenMetaDataType } from '@/lib/types';
import ModifyCreatorInformation from './ModifyCreatorInformation';
import RevokeAuthority from './RevokeAuthority';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, clusterApiUrl } from '@solana/web3.js';
import { createTokenCreationTransaction } from '@/lib/web3';
import { uploadToIPFS } from '@/lib/ipfsUpload';
import { AxiosProgressEvent } from 'axios';
import Link from 'next/link';

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
  const [error, setError] = useState<string | null>(null);
  const [mintAddress, setMintAddress] = useState<string | null>('');
  const { publicKey, connected, sendTransaction } = useWallet();

  useEffect(() => {
    const handleClickErrorOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).id === 'error-modal') {
        setError(null);
      }
    };

    if (error) {
      document.addEventListener('mousedown', handleClickErrorOutside);
    }

    const handleClickSuccessOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).id === 'success-modal') {
        setMintAddress(null);
      }
    };

    if (mintAddress) {
      document.addEventListener('mousedown', handleClickSuccessOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickErrorOutside);
      document.removeEventListener('mousedown', handleClickSuccessOutside);
    };
  }, [error, mintAddress]);

  async function handleNextOrCreateClick() {
    try {
      if (currentProgress < 3) {
        setCurrentProgress(currentProgress + 1);
      } else if (currentProgress === 3) {
        console.log('tokenMetaData', tokenMetaData);
        if (!(publicKey && connected && sendTransaction)) {
          return;
        }
        // const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || '', 'confirmed');
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        let fee = 0.11;
        if (tokenMetaData.enableCreator) fee += 0.1;
        if (tokenMetaData.mintable) fee += 0.1;
        if (tokenMetaData.freezeable) fee += 0.1;
        if (tokenMetaData.updateable) fee += 0.1;

        const balance = await connection.getBalance(publicKey);

        if (balance < fee) {
          setError(`Insufficient funds for transaction. Required balance: ${fee.toFixed(4)} SOL`);
          return;
        }

        if (!process.env.NEXT_PUBLIC_WALLET_ADDRESS) {
          return;
        }

        if (!tokenMetaData.logo) {
          setError('Please upload token log at first.');
          return;
        }

        // Upload token logo to IPFS
        const logo = await uploadToIPFS(tokenMetaData.logo, ({ loaded, total }: AxiosProgressEvent) => {
          const value = Math.floor((Number(loaded) * 100) / Number(total));
          console.log('loaded: ', loaded, 'total: ', total, 'value: ', value);
        }).catch((err) => {
          console.log(err);
          throw 'Project Data upload failed to IPFS. Please retry.';
        });
        console.log('logo:', logo);

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
          throw 'Project Data upload failed to IPFS. Please retry.';
        });
        console.log('metadataUri:', metadataUri);

        // Create token creation transaction
        const { transaction, signers, mint } = await createTokenCreationTransaction(
          connection,
          tokenMetaData,
          publicKey,
          metadataUri
        );
        console.log('Token creation transaction:', transaction);

        if (!transaction) {
          setError('Error while create transfer sol transaction.');
          return;
        }

        // Create SOL transfer instruction and add
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(process.env.NEXT_PUBLIC_WALLET_ADDRESS),
            lamports: Math.floor(fee * LAMPORTS_PER_SOL),
          })
        );

        const signature = await sendTransaction(transaction, connection, { signers: signers });
        if (signature) {
          setMintAddress(mint.toString());
        }
        console.log('Signature', signature);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className='pt-8 max-w-4xl mx-auto mb-6'>
      {!!publicKey && <Progress currentProgress={currentProgress} />}
      <GradientBorderCard>
        <div className='space-y-6'>
          {!!!publicKey && (
            <div className='text-center py-2'>
              <p className='text-gray-300 mb-3'>Please connect your wallet to continue</p>
              <WalletMultiButton
                style={{
                  backgroundImage: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '.01rem 2rem',
                  borderRadius: '.5rem',
                }}
              >
                Select Wallet
              </WalletMultiButton>
            </div>
          )}

          {/* Progress I */}
          {!!publicKey && currentProgress === 1 && (
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

          {/* Progress II */}
          {!!publicKey && currentProgress === 2 && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                <TextField
                  label='Decimals'
                  placeholder='9'
                  name='decimals'
                  min={0}
                  max={18}
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

          {/* Progress III */}
          {!!publicKey && currentProgress === 3 && (
            <div>
              <div className='space-y-4'>
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
              <ModifyCreatorInformation setTokenMetaData={setTokenMetaData} tokenMetaData={tokenMetaData} />
              <RevokeAuthority setTokenMetaData={setTokenMetaData} tokenMetaData={tokenMetaData} />
            </div>
          )}

          {/* Back, Next and Create Token Buttons */}
          {!!publicKey && (
            <div className='w-full flex flex-1 justify-between pt-4'>
              {currentProgress > 1 ? (
                <GradientBorderButton onClick={() => setCurrentProgress(currentProgress - 1)}>
                  Back
                </GradientBorderButton>
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
          )}
        </div>
      </GradientBorderCard>

      {error && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
          id='error-modal'
          // onClick={() => setError(null)}
        >
          <div className='bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800 shadow-xl z-50'>
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-6'>
                <button
                  className='h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center'
                  onClick={() => setError(null)}
                >
                  <X className='text-red-500' />
                </button>
                <h2 className='text-xl font-semibold text-white'>Error Creating Token</h2>
              </div>
              <div className='space-y-6'>
                <div className='p-4 rounded bg-red-500/10 border border-red-500/20'>
                  <p className='text-sm text-red-400'>{error}</p>
                </div>
                <div className='border-t border-gray-800 pt-4'>
                  <p className='text-sm text-gray-400'>Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mintAddress && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
          id='success-modal'
        >
          <div className='bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800 shadow-xl z-50'>
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-6'>
                <button
                  className='h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center'
                  onClick={() => setMintAddress(null)}
                >
                  <X className='text-green-500' />
                </button>
                <h2 className='text-xl font-semibold text-white'>Token Created Successfully!</h2>
              </div>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-400'>Token Address</label>
                  <div className='flex items-center gap-2'>
                    <code className='flex-1 p-2 rounded bg-gray-800 text-sm text-gray-300 overflow-x-auto'>
                      {mintAddress}
                    </code>
                    <button className='shrink-0 p-2 rounded border border-gray-700 hover:bg-gray-800 transition-colors'>
                      <Copy className='h-4 w-4 text-gray-400' />
                    </button>
                  </div>
                </div>
                <div className='space-y-4'>
                  <Link
                    href={`https://explorer.solana.com/address/${mintAddress}`}
                    target='_blank'
                    className='w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors'
                  >
                    <ExternalLink className='h-4 w-4 text-gray-400' /> View on Explorer
                  </Link>
                  <Link
                    href={`https://solscan.io/token/${mintAddress}`}
                    target='_blank'
                    className='w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors'
                  >
                    <ExternalLink className='h-4 w-4 text-gray-400' /> View on Solscan
                  </Link>
                  <Link
                    href='https://raydium.io/liquidity/create-pool/'
                    target='_blank'
                    className='w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors'
                  >
                    <ExternalLink className='h-4 w-4 text-gray-400' /> Create Liquidity Pool
                  </Link>
                </div>
                <div className='border-t border-gray-800 pt-4'>
                  <p className='text-sm text-gray-400'>Add this token to your wallet using the token address above.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenCreation;
