"use client";

import { ReactNode, useState, createContext, useContext } from 'react';

export interface NewToastType {
  message: string,
  status: 'error' | 'warning' | 'success'
}

export interface ToastType extends NewToastType {
  key: number
}

export type RemoveToastType = (toastKey: number) => void;

export type ToasterContextType = {
  toasts: Array<ToastType>,
  addToast: (toast: ToastType) => void,
  removeToast: RemoveToastType
}

export const ToasterContext = createContext<ToasterContextType | null>(null);

// custom hook
export function useToasterContext() {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("Must be a descendent of Toaster Provider")
  }
  return context;
}

interface ToasterContextProviderProps {
  children: ReactNode,
}


export function ToasterContextProvider(
  { children }: ToasterContextProviderProps
) {

  const [toasts, setToasts] = useState<Array<ToastType>>([]);
  const [nextKey, setNextKey] = useState(1);

  const addToast = (toast: NewToastType) => {
    const toastCopies = [...toasts];
    const assignedToast: ToastType = Object.assign({key: nextKey}, toast)
    setNextKey(nextKey + 1);
    toastCopies.push(assignedToast);
    setToasts(toastCopies);    
  } 

  const removeToast = (toastKey: number) => {
    const toastCopies = [...toasts];
    setToasts(toastCopies.filter((toast) => { 
      return (toast.key !== toastKey);  
    }))
  }

  return (
    <ToasterContext.Provider value={{
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </ToasterContext.Provider>

  )
}

