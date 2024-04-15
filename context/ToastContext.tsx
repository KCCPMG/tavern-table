"use client";

import { ReactNode, Dispatch, useState, createContext, useContext, SetStateAction } from 'react';

interface ToastProps {
  message: string,
  status: 'error' | 'warning' | 'success'
}



type ToasterContextType = {
  toasts: Array<ToastProps>,
  addToast: (toast: ToastProps) => void,
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

  const [toasts, setToasts] = useState<Array<ToastProps>>([]);

  const addToast = (toast: ToastProps) => {
    const toastCopies = [...toasts];
    toastCopies.push(toast);
    setToasts(toastCopies);
  } 

  return (
    <ToasterContext.Provider value={{
      toasts,
      addToast
    }}>
      {children}
    </ToasterContext.Provider>

  )
}

