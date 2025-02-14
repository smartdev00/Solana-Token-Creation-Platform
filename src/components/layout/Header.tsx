'use client';

import { LinkButton } from '../component/Button';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useStateContext } from '@/provider/StateProvider';

const Header = () => {
  const [openNavModal, setOpenNavModal] = useState<boolean>(false);
  const [shortenedWallet, setShortenedWallet] = useState<string | null>(null);
  const [advert, setAdvert] = useState<boolean>(true);
  const { publicKey } = useWallet();
  const {initialFee} = useStateContext()
  useEffect(() => {
    if (publicKey) {
      const str = publicKey.toString().slice(0, 3) + '...' + publicKey.toString().slice(-3);
      setShortenedWallet(str);
    } else {
      setShortenedWallet(null);
    }
  }, [publicKey]);
  return (
    <div>
      <nav className='fixed top-[18px] md:top-[40px] left-0 right-0 z-50 backdrop-filter backdrop-blur-sm title-animate'>
        <div className='max-w-[1440px] mx-auto px-5 sm:px-12 subtitle-animate'>
          <div className='flex gap-2 items-center h-16 md:h-20 px-6 bg-gray-800/50 rounded-2xl border border-gray-700'>
            {/* Logo */}
            <div className='flex cursor-pointer space-x-2 md:space-x-3 items-center'>
              
              <Link className='hover:opacity-80 transition-opacity' href='/'>
                <h3 className='sm:inline pr-2 bg-clip-text text-white text-transparent text-2xl md:text-3xl tracking-tight'>
                  CoinForge
                </h3>
              </Link>
            </div>

            {/* Desktop Navbar */}
            <div className='smd:flex w-full justify-center items-center space-x-4 xl:space-x-24 hidden'>
              <LinkButton href='/' soon={false}>Create Token</LinkButton>
              <LinkButton href='https://raydium.io/liquidity/create-pool/' soon={false}>Liquidity Pool</LinkButton>
              <LinkButton soon={true}>Promote Token</LinkButton>
              {/* <LinkButton soon={true}>Trending</LinkButton> */}
            </div>
            {!shortenedWallet && <div className='hidden lg:block'>
              <WalletMultiButton
                style={{
                  backgroundColor:'#C0A3FF',
                  color:'black',
                  fontSize: '18px',
                  fontWeight: 500,
                  borderRadius: '2rem',
                  width: '144px',
                  padding:'1rem',
                  lineHeight:'20px'
                }}
              >
                {shortenedWallet ? shortenedWallet : 'Select Wallet'}
              </WalletMultiButton>
            </div>}       
            <div className='flex w-full smd:hidden justify-end'>
              <Menu
                className='text-gray-400 hover:text-white transition-colors mr-2'
                onClick={() => setOpenNavModal(!openNavModal)}
              />
            </div>
            {/* Mobile Navbar */}
            <div
              className={`${
                openNavModal ? 'block' : 'hidden'
              } md:hidden absolute top-full sm:left-12 sm:right-12 left-4 right-4 rounded-2xl bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50`}
            >
              <div className='px-4 py-3 space-y-3 flex flex-col'>
                <LinkButton href='/' soon={false}>Create Token</LinkButton>
                <LinkButton href='https://raydium.io/liquidity/create-pool/' soon={false}>Liquidity Pool</LinkButton>
                <LinkButton soon={true}>Promote Token</LinkButton>
                {/* <LinkButton soon={true}>Trending</LinkButton> */}
              </div>
            </div>
          </div>
          {advert &&
          <div className='relative mt-2 text-center py-2 text-white rounded-md bg-gradient-to-r from-[#2A39FF] to-[#5B1B8C]'>
            <p className='md:mx-16 ml-2 mr-8 md:text-sm text-xs'>LAUNCH TOKEN ONLY {initialFee} SOL - 50% OFF</p>
            <X className='absolute md:right-5 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={() => setAdvert(false)}/>
          </div>}
        </div>
      </nav>
    </div>
  );
};

export default Header;
