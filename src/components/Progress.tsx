const CircleItem = ({ currentProgress, number }: { currentProgress: number; number: number }) => {
  return (
    <div
      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
        currentProgress >= number
          ? 'text-white bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
          : 'text-gray-400 bg-gray-700 bg-opacity-50'
      }`}
    >
      {number}
    </div>
  );
};

const LineItem = ({ currentProgress, number }: { currentProgress: number; number: number }) => {
  return (
    <div
      className={`${
        currentProgress > number ? 'bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]' : 'bg-gray-700'
      } h-1 mx-2 md:mx-4 flex-1`}
    />
  );
};

const Progress = ({ currentProgress }: { currentProgress: number }) => {
  return (
    <div className='flex justify-between mb-4 md:mb-6'>
      <div className='flex items-center flex-1'>
        <CircleItem currentProgress={currentProgress} number={1} />
        <LineItem currentProgress={currentProgress} number={1} />
      </div>

      <div className='flex items-center flex-1'>
        <CircleItem currentProgress={currentProgress} number={2} />
        <LineItem currentProgress={currentProgress} number={2} />
      </div>

      <div className='flex items-center'>
        <CircleItem currentProgress={currentProgress} number={3} />
      </div>
    </div>
  );
};

export default Progress;
