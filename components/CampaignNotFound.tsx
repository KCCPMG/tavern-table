"use client";

import { useToasterContext } from "context/ToasterContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CampaignNotFound() {

  const { addToast } = useToasterContext();
  const router = useRouter();

  useEffect(()=>{

    addToast({
      status: "error",
      message: "Campaign not found"
    });
    router.push("/");
  }, [])
  
  return null;
}