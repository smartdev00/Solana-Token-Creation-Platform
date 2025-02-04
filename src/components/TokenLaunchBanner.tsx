const TokenLaunchBanner = () => {
  return (
    <div className='relative overflow-hidden w-full'>
      <div className='absolute rounded-full bg-purple-500/20 blur-3xl opacity-50 md:opacity-100 w-[500px] h-[500px] top-[-250px] left-[-200px]' />
      <div className='absolute rounded-full bg-blue-500/20 blur-3xl opacity-50 md:opacity-100 w-[600px] h-[600px] top-[-200px] right-[-300px]' />
      <div className='mx-auto py-8 md:py-16 text-center'>
        <h1 className='text-3xl font-bold mb-4 md:mb-6 px-4 md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 title-animate'>
          Create Your Own Token FAST
        </h1>
        <p className='subtitle-animate text-gray-300 font-bold px-4 mx-auto text-base md:text-lg'>
          Launch your own token on Solana in seconds. No coding required.
        </p>
      </div>
    </div>
  );
};

export default TokenLaunchBanner;
