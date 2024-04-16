"use client";
import { ToastProps, useToasterContext } from "context/ToasterContext"

export function Toast({message, status} : ToastProps) {
  const color = status === 'error' ? 'bg-red-100' : 
    (status === 'warning' ? 'bg-yellow-100' : (
      status === 'success' ? 'bg-green-100' : 'red'
    ))
  return (
    <div className={`w-80 p-1 text-lg border ${color}`}>
      <div className="w-72">
        {message}
      </div>
      <div className="float-right">
        X
      </div>
    </div>
  )
}


export default function Toaster() {
  const { toasts } = useToasterContext();

  return (
    <div className="toaster absolute h-32 bottom-40 right-10 border">
      {toasts.map(toast  => 
        <Toast 
          message={toast.message}
          status={toast.status} 
        />)
      }
    </div>
  )
}