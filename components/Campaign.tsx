"use client";

import { ICampaign } from "@/models/Campaign";
import { useState } from "react";

type CampaignProps = {
  initCampaign: ICampaign
}

export default function Campaign({initCampaign} : CampaignProps) {

  const [campaign, setCampaign] = useState<ICampaign>(initCampaign);

  return (
    <>
      <h1>{campaign.name}</h1>
      <h4>{campaign.game}</h4>
    
    </>
  )

}
