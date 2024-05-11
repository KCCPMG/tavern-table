"use client";

import { Dispatch, ReactNode, useState, createContext, useContext, SetStateAction, FC, ComponentType } from 'react';

export const ModalContext = createContext<ModalContextType | null>(null);

// custom hook
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Must be a descendent of ModalContextProvider")
  }
  return context;
}

type ModalBodyProps = {
  title?: string
}

export function ModalBody(
  { title, }: ModalBodyProps
) {
  return (
    <div className="absolute z-20 margin-auto min-w-24 min-h-24">
      {title && <h2>{title}</h2>}
    </div>
  )
}

export type ModalContextType = {
  showModal: boolean,
  setShowModal: Dispatch<SetStateAction<boolean>>,
  modalBody: ComponentType<ModalBodyProps> | null,
  // setModalBody: Dispatch<SetStateAction<FC<ModalBodyProps> | null>>
  // setModalBody: Dispatch<SetStateAction<(({ title, }: ModalBodyProps) => React.JSX.Element) | null>>
  setModalBody: Dispatch<ComponentType<ModalBodyProps> | null>
}


type ModalContextProviderProps = {
  children: ReactNode
}

export function ModalContextProvider(
  { children }: ModalContextProviderProps) 
{
  const [showModal, setShowModal] = useState<boolean>(false); 
  const [modalBody, setModalBody] = useState<ComponentType<ModalBodyProps> | null>(null);

  return (
    <ModalContext.Provider 
      value={{showModal, setShowModal, modalBody, setModalBody}}
    >
      {children}
    </ModalContext.Provider>
  )
}





