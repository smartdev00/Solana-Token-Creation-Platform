'use client';

import React, { useContext, createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

interface StateContextInterface {
  initialFee: number | null;
  pubKey: string | null;
  setInitialFee: Dispatch<SetStateAction<number | null>>;
  setPubKey: Dispatch<SetStateAction<string | null>>;
}

export const StateContext = createContext<StateContextInterface | undefined>(undefined);

export const StateContextProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [initialFee, setInitialFee] = useState<number | null>(null);
  const [pubKey, setPubKey] = useState<string | null>(null);
  return (
    <StateContext.Provider value={{ initialFee, pubKey, setPubKey, setInitialFee }}>{children}</StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);

  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }

  return context;
};
