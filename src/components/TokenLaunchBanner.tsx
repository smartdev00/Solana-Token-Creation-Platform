const TokenLaunchBanner = () => {
  return (
    // <div className='relative overflow-hidden w-full pt-24'>
    <div className='max-w-[1440px] mx-auto !mb-6 px-4 pt-40 sm:px-12 subtitle-animate'>
      {/* <div className='absolute rounded-full bg-purple-500/20 blur-3xl opacity-50 md:opacity-100 w-[500px] h-[500px] top-[-250px] left-[-200px]' /> */}
      {/* <div className='absolute rounded-full bg-blue-500/20 blur-3xl opacity-50 md:opacity-100 w-[600px] h-[600px] top-[-200px] right-[-300px]' /> */}
      <img src="/background_01.png" alt="Background Image" className="absolute w-9/12 md:min-w-0.5 top-24 right-4 md:-top-24 md:right-44 animate-fade-in"/>
      <img src="/Solana.png" alt="Background Image" className="hidden md:block absolute w-4.5/12 top-5 right-16 animate-fade-in"/>
      <div className='mx-auto py-4 md:py-8'>
        <div className='md:w-6/12 lg:w-7/12 mb-4 md:mb-6 text-5xl md:text-6xl text-white bg-clip-text text-transparent title-animate'>
          Create your own token fast. 
          <a className="px-4 py-2 bg-gradient-to-r from-[#645CF5] to-[#8016D1] bg-clip-text text-transparent">
            No coding required
          </a>
        </div>
        <p className='subtitle-animate text-gray-300 mx-auto text-base md:text-lg'>
          create and launch your own Solana token effortlessly—
        </p>
        <p className='subtitle-animate text-gray-300 mx-auto text-base md:text-lg'>
          no coding skills needed. Get started in seconds!
        </p>
      </div>
      <button className='subtitle-animate mb-40 lg:mb-72 md:mb-32 px-8 py-4 rounded-full text-lg md:text-xl bg-gradient-to-r from-[#2A39FF] to-[#5B1B8C] text-gray-300'>
        Get started now
      </button>
    </div>
  );
};

export default TokenLaunchBanner;
