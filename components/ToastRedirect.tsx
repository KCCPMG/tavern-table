"use client";

import { useToasterContext, NewToastType } from "context/ToasterContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


type ToastRedirectProps = {
  toasts: Array<NewToastType>,
  redirect: string
}


export default function CampaignNotFound(
  { toasts, redirect }: ToastRedirectProps 
) {

  const { addToast } = useToasterContext();
  const router = useRouter();

  useEffect(()=>{

    toasts.forEach(toast => {
      addToast({
        message: toast.message,
        status: toast.status
      })
    })
    router.push(redirect);
  }, [])
  
  return null;
}