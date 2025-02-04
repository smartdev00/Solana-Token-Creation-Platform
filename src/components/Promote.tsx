import { promoteItems } from '@/lib/constants';
import { PromoteItemType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const PromoteItem = ({ promote }: { promote: PromoteItemType }) => {
  return (
    <div className='relative'>
      <div className={`absolute left-1/2 transform -translate-x-1/2 z-20 -top-1 ${promote.id === 1 && 'sm:-top-5'}`}>
        <div className='px-5 py-1 rounded-full bg-gray-900 border border-gray-700 shadow-xl'>
          <span className={`text-base tracking-wide uppercase font-medium whitespace-nowrap ${promote.textColor}`}>
            {promote.title.toUpperCase()} POSITION
          </span>
        </div>
      </div>
      <div
        className={cn(
          `relative p-[1px] rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 mt-4`,
          `bg-gradient-to-r ${promote.fromColor} ${promote.toColor} ${promote.viaColor} ${
            promote.id === 1 && 'sm:scale-110'
          }`
        )}
      >
        <div className='relative rounded-lg bg-gray-900/95 backdrop-blur-xl h-full p-6'>
          <div className='flex flex-col items-center'>
            <div
              className={cn(
                `w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mb-4`,
                `bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-gray-700/50 ${promote.textColor}`
              )}
            >
              {promote.id}
            </div>

            {/* Price Set */}
            <div className='bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 mb-6 w-full'>
              <div className='text-2xl font-bold text-white mb-1'>{promote.price} SOL</div>
            </div>

            {/* Benefits Set */}
            <div className='space-y-3 text-left w-full mb-6'>
              {promote.benefits.map((benefit, index) => {
                return (
                  <div className='flex items-center text-gray-300 text-sm' key={index}>
                    <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${promote.textColor}`} />
                    <span>{benefit}</span>
                  </div>
                );
              })}
            </div>

            {/* Purchase Button */}
            <button
              className={cn(
                'w-full px-6 py-3 rounded-lg text-white font-medium transition-all transform',
                `bg-gradient-to-r ${promote.fromColor} ${promote.id === 3 ? 'to-blue-500' : 'to-purple-500'}`,
                'hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              Purchase Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Promote = () => {
  return (
    <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-16'>
      {promoteItems.map((promote) => {
        return <PromoteItem key={promote.id} promote={promote} />;
      })}
    </div>
  );
};

export default Promote;
