// import Image from "next/image";

import FAQ from '@/components/FAQ';
import Help from '@/components/Help';
import TokenLaunchBanner from '@/components/TokenLaunchBanner';

export default function Home() {
  return (
    <div>
      <TokenLaunchBanner />
      <div className='max-w-4xl mx-auto space-y-6'>
        <Help />
        <FAQ />
      </div>
    </div>
  );
}
