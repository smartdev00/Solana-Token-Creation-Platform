'use client';

import { Plus } from 'lucide-react';
import { faqs } from '@/lib/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { FAQType } from '@/lib/types';

const FAQItem = ({
  content,
  open,
  setId,
}: {
  content: FAQType;
  open: boolean;
  setId: Dispatch<SetStateAction<number | null>>;
}) => {
  const handleClickFaq = () => {
    if (open) setId(null);
    else setId(content.id);
  };
  return (
    <div className='bg-[#181F2F] p-5 border border-[#3B4457] rounded-2xl cursor-pointer subtitle-animate' >
      <button className='flex w-full justify-between gap-5 items-center' onClick={handleClickFaq}>
        <h4 className='text-gray-200 text-xs sm:text-sm md:text-md lg:text-lg font-medium text-left'>{content.question}</h4>
        <Plus
          width={20}
          height={20}
          className={`text-white transform transition-transform ${open ? 'rotate-45' : 'rotate-0'}`}
        />
      </button>
      <div className={`transition-all transform ${open ? 'max-h-96 opacity-100 mt-0.5' : 'max-h-0 opacity-0 mt-0'}`}>
        <p className='text-dark-200 text-[10px] sm:text-xs md:text-sm lg:text-base'>{content.answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [id, setId] = useState<number | null>(null);
  return (
    // <div className='subtitle-animate bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-gray-700'>
    <div className='flex flex-col lg:flex-row pt-28 gap-8 subtitle-animate'>
      <div className='flex flex-col w-full mr-20'>
        <h2 className='mb-4 md:mb-6 text-2xl sm:text-5xl text-white subtitle-animate'>
          Frequently Asked Questions
        </h2>
        <p className='w-8/12 text-[#A4B0C8]'>
          For support and inquiries, reach out to us on Telegram
          <span className="px-2 py-2 text-[#C0A3FF] cursor-pointer">
            @coinfastofficial.
          </span>
        </p>
      </div>
      <div className='space-y-5'>
        {faqs.map((faq) => {
          return <FAQItem content={faq} key={faq.id} open={id === faq.id} setId={setId} />;
        })}
      </div>
    </div>
  );
};

export default FAQ;
