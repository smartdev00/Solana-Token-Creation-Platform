import Promote from '@/components/Promote';
import { GradientTypography } from '@/components/component/Typography';

const Page = () => {
  return (
    <div className='container px-4 mx-auto w-full'>
      <div className='pt-8 text-center max-w-4xl mx-auto mb-12'>
        <GradientTypography variant='h1' className='text-4xl sm:text-6xl mb-4'>
          Promote Your Token
        </GradientTypography>
        <p className='text-gray-300 max-w-2xl mx-auto'>
          Boost your token&apos;s visibility with our premium promotion spots. Each spot is available for 30 minutes.
        </p>
      </div>
      <Promote />
    </div>
  );
};

export default Page;
