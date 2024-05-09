"use client";

import { Dispatch, ReactNode, useState, createContext, useContext, SetStateAction } from 'react';

export const ModalContext = createContext<ModalContextType | null>(null);

// custom hook
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Must be a descendent of ModalContextProvider")
  }
  return context;
}


export type ModalContextType = {
  showModal: boolean,
  setShowModal: Dispatch<SetStateAction<boolean>>
}


type ModalContextProviderProps = {
  children: ReactNode
}

export function ModalContextProvider(
  { children }: ModalContextProviderProps) 
{
  const [showModal, setShowModal] = useState(false);

  return (
    <ModalContext.Provider 
      value={{showModal, setShowModal}}
    >
      {children}
    </ModalContext.Provider>
  )
}