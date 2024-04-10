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
    <div className={`w-44 p-1 borde ${color}`}>
      {errorMessage
    }</div>
  )
}

interface ToasterProps {
  toasts: Array<ToastProps>
}

export default async function Toaster({toasts}: ToasterProps) {
  return (
    <div className="toaster absolute bottom-3 right-3">
      {toasts.map(toast  => 
        <Toast 
          errorMessage={toast.errorMessage}
          status={toast.status} 
        />)}
    </div>
  )
}