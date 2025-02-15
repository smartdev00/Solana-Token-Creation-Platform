'use client';

import { Configuration } from '@/lib/types';
import React, { useContext, createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

interface StateContextInterface {
  configData: Configuration;
  setConfigData: Dispatch<SetStateAction<Configuration>>;
}

export const StateContext = createContext<StateContextInterface | undefined>(undefined);

export const StateContextProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [configData, setConfigData] = useState<Configuration>({
    fee: 0,
    mintableFee: 0,
    freezeableFee: 0,
    updateableFee: 0,
    creatorFee: 0,
    pubKey: null
  });
  return (
    <StateContext.Provider value={{ configData, setConfigData }}>{children}</StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);

  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }

  return context;
};
