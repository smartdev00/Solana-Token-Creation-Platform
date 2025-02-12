'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LinkButton } from '../component/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useStateContext } from '@/provider/StateProvider';

const Header = () => {
  const [shortenedWallet, setShortenedWallet] = useState<string | null>(null);
  const [openNavModal, setOpenNavModal] = useState<boolean>(false);
  const { publicKey } = useWallet();
  const { initialFee } = useStateContext();

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
          LAUNCH YOUR OWN TOKEN FOR ONLY {initialFee} SOL
        </div>
      </div>
      <nav className='fixed top-[21px] md:top-[28px] left-0 right-0 z-50 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center h-14 md:h-16'>
            {/* Logo */}
            <div className='flex cursor-pointer space-x-2 md:space-x-3 items-center'>
              <Menu
                className='md:hidden text-gray-400 hover:text-white transition-colors mr-2'
                onClick={() => setOpenNavModal(!openNavModal)}
              />{' '}
              <Link className='hover:opacity-80 transition-opacity' href='/'>
                <span className='hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 text-2xl md:text-3xl font-extrabold tracking-tight'>
                  CoinFast
                </span>
              </Link>
            </div>

            {/* Desktop Navbar */}
            <div className='md:flex justify-center space-x-4 hidden'>
              <LinkButton href='/'>Create Token</LinkButton>
              <LinkButton href='https://raydium.io/liquidity/create-pool/'>Liquidity Pool</LinkButton>
              <LinkButton href='/promote' disabled={true} className='hover:cursor-not-allowed'>Promote Token</LinkButton>
            </div>

            {/* Connect Wallet Button */}
            <WalletMultiButton
              style={{
                backgroundImage: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '.01rem 2rem',
                borderRadius: '.5rem',
                minWidth: '151px',
              }}
            >
              {shortenedWallet ? shortenedWallet : 'Select Wallet'}
            </WalletMultiButton>

            {/* Mobile Navbar */}
            <div
              className={`${
                openNavModal ? 'block' : 'hidden'
              } md:hidden absolute top-full left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50`}
            >
              <div className='px-4 py-3 space-y-3 flex flex-col'>
                <LinkButton href='/'>Create Token</LinkButton>
                <LinkButton href='https://raydium.io/liquidity/create-pool/'>Liquidity Pool</LinkButton>
                <LinkButton href='/promote'>Promote Token</LinkButton>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
