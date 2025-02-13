import { helps } from '@/lib/constants';
import HelpConnectWallet from './component/HelpConnectWallet';
import HelpTokenNameSymbol from './component/HelpTokenNameSymbol';
import Image from 'next/image';
const Help = () => {
  return (
    <div className='mt-28 subtitle-animate'>
      <div className='mb-4 md:mb-6 text-2xl sm:text-5xl text-white'>
        How to Create Solana Token
      </div>
      <ol className='grid grid-cols-12 -mx-2.5'>
        {helps.map((help) => {
          return (
            <li
              key={help.id}
              className={`flex md:flex-row flex-col ${help.id>5?'col-span-12':help.id<3?'md:col-span-6 col-span-12':'md:col-span-4 col-span-12'} m-2.5 rounded-2xl text-gray-300 bg-[#181F2F] border border-[#2A3755]`}
              style={{ animationDelay: `${0.2 + help.id * 0.1}s` }}
            >
              <div>
                <div className='flex flex-row justify-between items-center gap-4 m-5'>
                  <div className='px-4 py-3 font-normal text-white rounded-full border border-[#2A3755]'>
                    0{help.id}&nbsp;&nbsp;{help.title}
                  </div>
                  {
                    help.id>2 && help.id<6 && 
                    <div className='flex justify-center items-center w-14 h-14 px-4 py-3 rounded-full border border-[#2A3755]'>
                      <Image alt={`${help.id}Img`} src={help.img} width={100} height={100}/>
                    </div>
                  }
                </div>
                <div className='mx-5 mt-1 mb-5 text-[#A4B0C8] text-justify'>
                  {help.text}
                </div>
                {help.id==1 && <HelpConnectWallet />}
                {help.id==2 && <HelpTokenNameSymbol/>}
              </div>
              {
                help.id>5 && 
                <div className='flex justify-center scale-90 md:justify-end items-center w-full my-5 md:m-5'>
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
