interface ToastProps {
  errorMessage: string,
  status: 'error' | 'warning' | 'success'
}

export async function Toast({errorMessage, status} : ToastProps) {
  const color = status === 'error' ? 'bg-red-100' : 
    (status === 'warning' ? 'bg-yellow-100' : (
      status === 'success' ? 'bg-green-100' : 'red'
    ))
  return (
    <div className={`w-80 p-1 text-lg border ${color}`}>
      <div className="w-72">
        {errorMessage}
      </div>
      <div className="float-right">
        X
      </div>
    </div>
  )
}

interface ToasterProps {
  toasts: Array<ToastProps>
}

export default async function Toaster({toasts}: ToasterProps) {
  return (
    <div className="toaster absolute h-32 bottom-40 right-10 border">
      {toasts.map(toast  => 
        <Toast 
          errorMessage={toast.errorMessage}
          status={toast.status} 
        />)}
    </div>
  )
}