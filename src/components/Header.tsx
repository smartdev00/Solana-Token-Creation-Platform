import { LinkButton } from './Button';

const Header = () => {
  return (
    <div>
      <div className='fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-cyan-500 to-purple-600'>
        <div className='py-1.5 text-center text-[9px] leading-none md:text-xs text-white font-bold tracking-wide'>
          LAUNCH YOUR OWN TOKEN FOR ONLY 0.1 SOL - 50% OFF
        </div>
      </div>
      <nav className='flex fixed items-center justify-between top-7 left-0 right-0 z-50 backdrop-blur-sm border-b border-gray-700/50 h-16 box-content'>
        <div>Logo</div>
        <div className='flex justify-center space-x-4'>
          <LinkButton text='Create Token' />
          <LinkButton text='Liquidity Pool' />
          <LinkButton text='Manage Liquidity' />
        </div>
        <div>Connect Wallet</div>
      </nav>
    </div>
  );
};

export default Header;
