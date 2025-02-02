import { helps } from '@/lib/constants';

const Help = () => {
  return (
    <div className='container bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-gray-700'>
      <h2 className='bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent text-2xl md:text-3xl font-bold mb-4 md:mb-6'>
        How to use Solana Token Creator
      </h2>
      <h3 className=' text-lg md:text-xl text-gray-200 font-medium mb-2 fade-in-up delay-2'>
        Follow these simple steps:
      </h3>
      <ol className='space-y-1.5'>
        {helps.map((help) => {
          return (
            <li key={help.id} className='flex items-start text-gray-300'>
              <span className='mr-2 font-medium'>{help.id}.</span>
              <span>{help.text}</span>
            </li>
          );
        })}
      </ol>
      <div className='text-sm md:text-base text-gray-300 border-t border-gray-700 space-y-2 pt-3 mt-3'>
        <p>
          The cost of creating the Token is <span className=' text-cyan-400 font-medium'>0.1 SOL</span>, which includes
          all fees needed for the SPL Token creation.
        </p>
        <p>
          The creation process will start and will take some seconds. After that, you will receive the total supply of
          the token in the wallet you chose.
        </p>
      </div>
    </div>
  );
};

export default Help;
