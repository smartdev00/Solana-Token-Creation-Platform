
const Footer = () => {
  return (
    <footer className='w-full mx-auto mt-32 subtitle-animate bg-secondary backdrop-blur-sm border-t border-gray-700/50'>
      <div className='max-w-[1440px] mx-auto !mb-6 px-4 sm:px-12 mt-8'>
        <p className='text-sm text-text-main mb-4'>
          © 2025 CoinForge | All Rights Reserved
          {/* <span className="px-2 py-2 text-[#C0A3FF] cursor-pointer">
            Become an affiliate for CoinForge
          </span> */}
        </p>
        <p className='text-xs text-text-secondary text-justify'>
          CoinForge helps you create and launch Solana tokens in seconds with no coding required. CoinForge is a token creation platform. We do not provide financial advice or guarantee any returns. Users are responsible for complying with relevant laws and regulations. Creating and trading tokens carries significant risks - please do your own research before proceeding. The platform is provided &quot;as is&quot; without warranties of any kind. By using CoinForge, you acknowledge and accept all associated risks.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
