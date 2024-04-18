"use client";

import { ReactNode, useState, createContext, useContext } from 'react';

export interface NewToastType {
  message: string,
  status: 'error' | 'warning' | 'success'
}

export interface ToastType extends NewToastType {
  toastKey: number
}

export type RemoveToastType = (toastKey: number) => void;

export type ToasterContextType = {
  toasts: Array<ToastType>,
  addToast: (toast: NewToastType) => void,
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
    const assignedToast: ToastType = Object.assign({toastKey: nextKey}, toast)
    setNextKey(nextKey + 1);
    setToasts([...toasts, assignedToast]);    
  } 

  const removeToast = (toastKey: number) => {
    setToasts(toasts.filter((toast) => { 
      return (toast.toastKey !== toastKey);  
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

