import { progresses } from '@/lib/constants';
import { ProgressType } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';

const ProgressItem = ({ current, value }: { current: number; value: ProgressType }) => {
  return (
    <h4
      className={`flex items-center px-4 rounded-[30px] text-xl font-normal border ${
        Number(value.id) === current ? 'text-text-secondary border-text-secondary' : 'text-text-main border-[#3B4457]'
      }  h-12 transition-all`}
    >
      {value.id}
      <p className='hidden sm:block'>
        {Number(value.id) === current && <span>&nbsp;{value.title}</span>}
      </p>
    </h4>
  );
};

const Progress = ({
  currentProgress,
  // setCurrentProgress,
}: {
  currentProgress: number;
  setCurrentProgress?: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className='subtitle-animate flex justify-center mb-4 md:mb-6 gap-2.5'>
      {progresses.map((progress) => {
        return <ProgressItem key={progress.id} value={progress} current={currentProgress} />;
      })}
    </div>
  );
};

export default Progress;
