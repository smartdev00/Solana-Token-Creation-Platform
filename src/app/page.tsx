import FAQ from '@/components/FAQ';
import Help from '@/components/Help';
import TokenCreation from '@/components/TokenCreation';
import TokenLaunchBanner from '@/components/TokenLaunchBanner';

export default function Home() {
  return (
    <div>
      <TokenLaunchBanner />
      <TokenCreation />
      <div className='max-w-4xl mx-auto space-y-6 pb-6 md:pb-12 px-2 md:px-4'>
        <Help />
        <FAQ />
      </div>
    </div>
  );
}
