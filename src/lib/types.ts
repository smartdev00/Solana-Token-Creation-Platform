import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type HelpType = {
  id: number;
  text: string;
};

export type FAQType = {
  id: number;
  question: string;
  answer: string;
};

export type TokenMetaDataType = {
  name: string;
  symbol: string;
  logo: File | undefined;
  decimals: number;
  supply: number;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  enableCreator: boolean;
  creatorName?: string;
  creatorWebsite?: string;
  freezeable: boolean;
  mintable: boolean;
  updateable: boolean;
};

export type RevokeAuthorityType = {
  id: number;
  title: string;
  content: string;
  price: number;
  logo: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  type: keyof TokenMetaDataType;
};
