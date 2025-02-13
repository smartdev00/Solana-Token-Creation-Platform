'use client';

import { LinkButton } from '../component/Button';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const [openNavModal, setOpenNavModal] = useState<boolean>(false);

  return (
    <div>
      <nav className='fixed top-[18px] md:top-[40px] left-0 right-0 z-50 backdrop-filter backdrop-blur-sm title-animate'>
        <div className='max-w-[1440px] mx-auto px-5 sm:px-12 subtitle-animate'>
          <div className='flex items-center h-16 md:h-20 px-6 bg-gray-800/50 rounded-2xl border border-gray-700'>
            {/* Logo */}
            <div className='flex cursor-pointer space-x-2 md:space-x-3 items-center'>
              
              <Link className='hover:opacity-80 transition-opacity' href='/'>
                <h3 className='sm:inline pr-2 bg-clip-text text-white text-transparent text-2xl md:text-3xl tracking-tight'>
                  CoinForge
                </h3>
              </Link>
            </div>

            {/* Desktop Navbar */}
            <div className='md:flex w-full justify-around items-center space-x-4 hidden'>
              <LinkButton href='/' soon={false}>Create Token</LinkButton>
              <LinkButton href='https://raydium.io/liquidity/create-pool/' soon={true}>Liquidity Pool</LinkButton>
              <LinkButton href='/promote' soon={true}>Promote Token</LinkButton>
              <LinkButton href='/trending' soon={true}>Trending</LinkButton>
            </div>           
            <div className='flex w-full md:hidden justify-end'>
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
