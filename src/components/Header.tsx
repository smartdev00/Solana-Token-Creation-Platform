'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LinkButton } from './Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

const Header = () => {
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
    <div>
      <div className='fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-cyan-500 to-purple-600'>
        <div className='py-1.5 text-center text-[9px] leading-none md:text-xs text-white font-bold tracking-wide'>
          LAUNCH YOUR OWN TOKEN FOR ONLY 0.1 SOL - 50% OFF
        </div>
      </div>
      <nav className='container flex fixed items-center justify-between top-7 left-0 right-0 z-50 backdrop-blur-sm border-b border-gray-700/50 h-16 box-content px-4'>
        <div>Logo</div>
        <div className='flex justify-center space-x-4'>
          <LinkButton href='https://coinfast.fun'>Create Token</LinkButton>
          <LinkButton href='https://raydium.io/liquidity/create-pool/'>Liquidity Pool</LinkButton>
          <LinkButton href='https://coinfast.fun/promote'>Promote Token</LinkButton>
          <LinkButton href='https://coinfast.fun/trending'>Trending 🔥</LinkButton>
        </div>
        <WalletMultiButton
          style={{
            backgroundImage: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
            fontSize: '14px',
            fontWeight: 500,
            padding: '.01rem 2rem',
            borderRadius: '.5rem',
          }}
        >
          {shortenedWallet ? shortenedWallet : 'Select Wallet'}
        </WalletMultiButton>
      </nav>
    </div>
  );
};

export default Header;
