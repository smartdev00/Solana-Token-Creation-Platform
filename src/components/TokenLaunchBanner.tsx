import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const TokenLaunchBanner = () => {
  const [shortenedWallet, setShortenedWallet] = useState<string | null>(null);
  const { publicKey } = useWallet();
  useEffect(() => {
    if (publicKey) {
      const str = publicKey.toString().slice(0, 4) + '...' + publicKey.toString().slice(-4);
      setShortenedWallet(str);
    } else {
      setShortenedWallet(null);
    }
  }, [publicKey]);
  return (
    <div className='max-w-[1440px] mx-auto px-4 pt-[10vw] sm:px-12 subtitle-animate'>
      <Image
        src='/background_01.png'
        alt='Background Image'
        width={1000}
        height={400}
        className='absolute w-9/12 md:min-w-0.5 top-24 right-4 md:-top-24 md:right-44 animate-fade-in'
      />
      <Image src='/Solana.png' alt='Background Image' width={300} height={300} className='hidden md:block absolute w-4.5/12 top-44 right-24 lg:right-48 animate-fade-in' />
      <div className='mx-auto'>
        <h1 className='w-10/12 md:w-6/12 lg:w-7/12 mb-6 md:mb-10 text-4xl sm:text-6xl bg-white bg-clip-text text-transparent title-animate'>
          Create your own token fast.
          <span className='px-4 py-2 bg-gradient-to-r from-[#645CF5] to-[#8016D1] bg-clip-text text-transparent'>No coding required</span>
        </h1>
        <p className='w-11/12 text-left subtitle-animate text-text-secondary text-lg sm:text-xl'>create and launch your own Solana token effortlessly—</p>
        <p className='w-11/12 text-left subtitle-animate text-text-secondary text-lg sm:text-xl'>no coding skills needed. Get started in seconds!</p>
      </div>
      {/* Connect Wallet Button */}
      <div className='subtitle-animate mt-4 mb-24'>
        <WalletMultiButton
          style={{
            // marginBottom: '10rem',
            padding: '1.8rem 2rem',
            borderRadius: '9999px',
            fontSize: '1.125rem',
            lineHeight: '20px',
            backgroundImage: 'linear-gradient(to right, #2A39FF, #5B1B8C)',
            color: '#D1D5DB',
          }}
        >
          {shortenedWallet ? shortenedWallet : 'Select Wallet'}
        </WalletMultiButton>
      </div>
    </div>
  );
};

export default TokenLaunchBanner;
