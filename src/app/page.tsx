'use client';

import FAQ from '@/components/FAQ';
import Help from '@/components/Help';
import TokenCreation from '@/components/token-creation/TokenCreation';
import TokenLaunchBanner from '@/components/TokenLaunchBanner';
import { useStateContext } from '@/provider/StateProvider';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [configData, setConfigData] = useState({
    pubKey: '',
    fee: 0,
  });
  const { setInitialFee } = useStateContext();

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
          setConfigData({ pubKey: data.pubKey, fee: data.fee });
          setInitialFee(data.fee);
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
  }, [setInitialFee]);

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
      <TokenCreation setError={setError} pubKey={configData.pubKey} initialFee={configData.fee} />
      <div className='max-w-4xl mx-auto space-y-6 pb-6 md:pb-12 px-2 md:px-4'>
        <Help />
        <FAQ />
      </div>
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
      {loading && (
        <div className='fixed inset-0 flex justify-center items-center bg-main bg-opacity-50 z-50'>
          <div className='animate-spin w-20 h-20 border-4 border-transparent border-t-white rounded-full' />
        </div>
      )}
    </div>
  );
}
