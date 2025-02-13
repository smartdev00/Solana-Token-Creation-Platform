
const Footer = () => {
  return (
    <footer className='w-full mx-auto mt-32 subtitle-animate bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50'>
      <div className='max-w-[1440px] mx-auto !mb-6 px-4 sm:px-12 mt-8'>
        <p className='text-sm text-white mb-4'>
          © 2025 CoinFast | All Rights Reserved | 
          <a className="px-2 py-2 text-[#C0A3FF] cursor-pointer">
            Become an affiliate for CoinFast
          </a>
        </p>
        <div className='text-xs text-[#A4B0C8] text-justify'>
          CoinFast helps you create and launch Solana tokens in seconds with no coding required. CoinFast is a token creation platform. We do not provide financial advice or guarantee any returns. Users are responsible for complying with relevant laws and regulations. Creating and trading tokens carries significant risks - please do your own research before proceeding. The platform is provided &quot;as is&quot; without warranties of any kind. By using CoinFast, you acknowledge and accept all associated risks.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
