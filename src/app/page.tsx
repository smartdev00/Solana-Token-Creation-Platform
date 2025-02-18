'use client';

import FAQ from '@/components/FAQ';
import Help from '@/components/Help';
import TokenCreation from '@/components/token-creation/TokenCreation';
import TokenLaunchBanner from '@/components/TokenLaunchBanner';
import { useStateContext } from '@/provider/StateProvider';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import copy from 'clipboard-copy';

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const { setConfigData, setLoading, loading } = useStateContext();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [mintAddress, setMintAddress] = useState<string | null>('');

  // If user clicks outside of success model
  useEffect(() => {
    const handleClickSuccessOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).id === 'success-modal') {
        setMintAddress(null);
      }
    };

    if (mintAddress) {
      document.addEventListener('mousedown', handleClickSuccessOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickSuccessOutside);
    };
  }, [mintAddress]);

  async function handleCopyClick() {
    try {
      if (!mintAddress) {
        return;
      }
      await copy(mintAddress);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000); // Reset "Copied!" state after 2 seconds
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  }

  useEffect(() => {
    const fetchPublicKey = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('/api/admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.pubKey) {
          console.log('Received pubKey:', data.pubKey, data.fee); // Log what you received
          setConfigData(data);
        } else {
          // Handle cases where the response isn't what you expect
          throw new Error('Invalid response format from /api/admin');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching public key:', err);
      } finally {
        setLoading(false); // Stop loading, regardless of success/failure
      }
    };

    fetchPublicKey();
  }, [setConfigData, setLoading]);

  // When user click outsite of error modal
  useEffect(() => {
    const handleClickErrorOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).id === 'error-modal') {
        setError(null);
      }
    };

    if (error) {
      document.addEventListener('mousedown', handleClickErrorOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickErrorOutside);
    };
  }, [error]);
  return (
    <div className='pt-[78px] md:pt-[93px]'>
      <TokenLaunchBanner />
      <TokenCreation setError={setError} setMintAddress={setMintAddress} />
      <div className='max-w-[1440px] mx-auto !mb-6 px-4 sm:px-12 subtitle-animate'>
        <FAQ />
        <Help />
      </div>

      {/* Error Modal */}
      {error && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
          id='error-modal'
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
          {/* <div className='absolute inset-0 -z-10' /> */}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className='fixed inset-0 flex justify-center items-center bg-main bg-opacity-50 z-50'>
          <div className='animate-spin w-20 h-20 border-4 border-transparent border-t-white rounded-full' />
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
                    <button
                      className='shrink-0 p-2 rounded border border-gray-700 hover:bg-gray-800 transition-colors'
                      onClick={handleCopyClick}
                    >
                      {isCopied ? (
                        <Check className='h-4 w-4 text-gray-400' />
                      ) : (
                        <Copy className='h-4 w-4 text-gray-400' />
                      )}
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
}
