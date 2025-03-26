import { helps } from '@/lib/constants';
import HelpConnectWallet from './component/HelpConnectWallet';
import HelpTokenNameSymbol from './component/HelpTokenNameSymbol';
import Image from 'next/image';
const Help = () => {
  return (
    <div className='mt-28 subtitle-animate'>
      <h2 className='mb-4 md:mb-6 text-2xl sm:text-5xl text-text-main title-animate'>
        How to Create Solana Token 2022
      </h2>
      <ol className='grid grid-cols-12 -mx-2.5'>
        {helps.map((help) => {
          return (
            <li
              key={help.id}
              className={`flex md:flex-row flex-col ${help.id>5?'col-span-12':help.id<3?'md:col-span-6 col-span-12':help.id==5?'xl:col-span-4 col-span-12':'xl:col-span-4 md:col-span-6 col-span-12'} m-2.5 rounded-2xl text-text-secondary bg-secondary border border-[#2A3755]`}
              style={{ animationDelay: `${0.2 + help.id * 0.1}s` }}
            >
              <div className='flex flex-col w-full'>
                <div className='flex flex-row justify-between items-center gap-4 m-5'>
                  <h4 className='px-4 py-3 text-sm sm:text-base md:text-lg lg:text-xl font-normal text-text-main rounded-full border border-[#2A3755]'>
                    0{help.id}&nbsp;&nbsp;{help.title}
                  </h4>
                  {
                    help.id>2 && help.id<6 && 
                    <div className='flex justify-center items-center w-12 h-12 md:w-14 md:h-14 px-4 py-3 rounded-full border border-[#2A3755]'>
                      <help.img width={50} height={50}/>
                    </div>
                  }
                </div>
                <p className='mx-5 mt-1 mb-5 text-xs sm:text-sm md:text-base lg:text-lg text-text-secondary text-justify'>
                  {help.text}
                </p>
                {help.id==1 && <HelpConnectWallet />}
                {help.id==2 && <HelpTokenNameSymbol/>}
              </div>
              {
                help.id>5 && 
                <div className='flex justify-center scale-50 sm:scale-75 lg:scale-90 md:justify-end items-center w-full sm:my-5 md:m-5'>
                  <Image alt='6stepImg' src='/6step.png' width={300} height={300}/>
                </div>
              }
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Help;
