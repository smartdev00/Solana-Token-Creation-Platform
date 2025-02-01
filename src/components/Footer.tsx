import Link from 'next/link';

const Footer = () => {
  return (
    <div className='text-center md:text-sm text-[10px] py-4'>
      <div className='text-gray-200 mb-4'>
        © 2025 CoinFast | All Rights Reserved | <Link href='' className='text-white hover:text-blue-400 transition-colors'>Support on Telegram @coinfastofficial</Link>
      </div>
      <p className='text-gray-600 max-w-4xl m-auto text-[8px] md:text-sm px-4'>
        CoinFast helps you create and launch Solana tokens in seconds with no coding required. For support and
        inquiries, reach out to us on Telegram @coinfastofficial. CoinFast is a token creation platform. We do not
        provide financial advice or guarantee any returns. Users are responsible for complying with relevant laws and
        regulations. Creating and trading tokens carries significant risks - please do your own research before
        proceeding. The platform is provided &quot;as is&quot; without warranties of any kind. By using CoinFast, you
        acknowledge and accept all associated risks.
      </p>
    </div>
  );
};

export default Footer;
