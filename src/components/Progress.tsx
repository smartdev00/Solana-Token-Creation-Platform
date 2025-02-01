const Progress = ({ currentProgress }: { currentProgress: number }) => {
  return (
    <div className='flex justify-between mb-4 md:mb-6'>
      <div className='flex items-center flex-1'>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
            currentProgress === 1
              ? 'text-white bg-gradient-to-tr from-cyan-400 to-purple-500'
              : 'text-gray-400 bg-gray-700 bg-opacity-50'
          }`}
        >
          1
        </div>
        <div className='h-1 bg-gray-700 mx-2 md:mx-4 flex-1' />
      </div>

      <div className='flex items-center flex-1'>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white ${
            currentProgress === 2
              ? 'text-white bg-gradient-to-tr from-cyan-400 to-purple-500'
              : 'text-gray-400 bg-gray-700 bg-opacity-50'
          }`}
        >
          2
        </div>
        <div className='h-1 bg-gray-700 mx-2 md:mx-4 flex-1' />
      </div>

      <div className='flex items-center'>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white ${
            currentProgress === 3
              ? 'text-white bg-gradient-to-tr from-cyan-400 to-purple-500'
              : 'text-gray-400 bg-gray-700 bg-opacity-50'
          }`}
        >
          3
        </div>
      </div>
    </div>
  );
};

export default Progress;
