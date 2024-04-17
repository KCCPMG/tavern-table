"use client";

import { RemoveToastType, ToastType, useToasterContext } from "context/ToasterContext"

type ToastProps = ToastType & {
  removeToast: RemoveToastType
};


export function Toast({toastKey, message, status, removeToast} : ToastProps) {

  const color = status === 'error' ? 'bg-red-100' : 
    (status === 'warning' ? 'bg-yellow-100' : (
      status === 'success' ? 'bg-green-100' : 'red'
    ))

  return (
    <div className={`toast w-80 p-1 text-lg border ${color}`}>
      <div className="w-72">
        {message}
      </div>
      <div className="float-right" onClick={() => removeToast(toastKey)}>
        X
      </div>
    </div>
  )
}

export default function Toaster() {
  const { toasts, removeToast } = useToasterContext();

  return (
    <div className="toaster absolute h-32 bottom-40 right-10 border">
      {toasts.map(toast  => 
        <Toast 
          key={toast.toastKey}
          toastKey={toast.toastKey}
          message={toast.message}
          status={toast.status} 
          removeToast={removeToast}
        />)
      }
    </div>
  )
}