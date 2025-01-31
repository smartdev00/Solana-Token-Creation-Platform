import Link from 'next/link';

export const LinkButton = ({ text }: { text: string }) => {
  return (
    <Link href='' className='px-4 py-2 text-transparent bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-sm md:text-base font-medium tracking-wide'>
      {text}
    </Link>
  );
};
