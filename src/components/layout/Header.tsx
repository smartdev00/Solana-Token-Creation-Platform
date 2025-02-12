'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LinkButton } from '../component/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const [shortenedWallet, setShortenedWallet] = useState<string | null>(null);
  const [openNavModal, setOpenNavModal] = useState<boolean>(false);
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
      {/* <div className='fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-cyan-500 to-purple-600'>
        <div className='py-1.5 text-center text-[9px] leading-none md:text-xs text-white font-bold tracking-wide'>
          LAUNCH YOUR OWN TOKEN FOR ONLY 0.1 SOL - 50% OFF
        </div>
      </div> */}
      <nav className='fixed top-[21px] md:top-[28px] left-0 right-0 z-50 backdrop-blur-sm title-animate'>
        <div className='container mx-auto'>
          <div className='flex justify-between items-center h-16 md:h-20 px-6 bg-gray-800/50 rounded-2xl border border-gray-700'>
            {/* Logo */}
            <div className='flex cursor-pointer space-x-2 md:space-x-3 items-center'>
              <Menu
                className='lg:hidden text-gray-400 hover:text-white transition-colors mr-2'
                onClick={() => setOpenNavModal(!openNavModal)}
              />{' '}
              <Link className='hover:opacity-80 transition-opacity' href='/'>
              {/* bg-gradient-to-r from-cyan-400 to-purple-500  */}
                <span className='sm:inline pr-2 bg-clip-text text-white text-transparent text-2xl md:text-3xl tracking-tight'>
                  CoinForge
                </span>
              </Link>
            </div>

            {/* Desktop Navbar */}
            <div className='lg:flex justify-center items-center space-x-4 hidden'>
              <LinkButton href='/' soon={false}>Create Token</LinkButton>
              <LinkButton href='https://raydium.io/liquidity/create-pool/' soon={true}>Liquidity Pool</LinkButton>
              <LinkButton href='/promote' soon={true}>Promote Token</LinkButton>
              <LinkButton href='/trending' soon={true}>Trending</LinkButton>
            </div>

            {/* Connect Wallet Button */}
            <WalletMultiButton
              style={{
                // backgroundImage: 'linear-gradient(to right, #06b6d4, #8b5cf6)',C0A3FF
                backgroundColor:'#C0A3FF',
                color:'black',
                fontSize: '18px',
                fontWeight: 500,
                // padding: '.01rem 2rem',
                borderRadius: '2rem',
                minWidth: '151px',
                lineHeight:'20px'
              }}
            >
              {shortenedWallet ? shortenedWallet : 'Select Wallet'}
            </WalletMultiButton>

            {/* Mobile Navbar */}
            <div
              className={`${
                openNavModal ? 'block' : 'hidden'
              } lg:hidden absolute top-full left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50`}
            >
              <div className='px-4 py-3 space-y-3 flex flex-col'>
                <LinkButton href='/' soon={false}>Create Token</LinkButton>
                <LinkButton href='https://raydium.io/liquidity/create-pool/' soon={true}>Liquidity Pool</LinkButton>
                <LinkButton href='/promote' soon={true}>Promote Token</LinkButton>
                <LinkButton href='/trending' soon={true}>Trending</LinkButton>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
