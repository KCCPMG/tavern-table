"use server";

import { authOptions } from "@/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import CampaignComponent from "@/components/Campaign";
import Campaign, { IReactCampaign } from "@/models/Campaign";
import { redirect } from 'next/navigation';
import ToastRedirect from "@/components/ToastRedirect";

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page( { params } : PageProps ) {

  const session = await getServerSession(authOptions);
  if (!(session?.user._id)) return redirect("/"); 

  const campaign = await (async () => {
    try {
      const tryCampaign = await Campaign.getIReactCampaign(params.id);
      console.log(tryCampaign);
      return tryCampaign;
    } catch(err) {
      return null;
    }
  })();
  
  if (!campaign) {
    return (
      <ToastRedirect 
        toasts={[
          {
            message: "Campaign not found",
            status: "error"
          }
        ]}  
        redirect="/campaigns"  
      />)
  }

  // check user permission to see campaign
  if (campaign.dm)



  return (
    <>
      Your campaign Id is {params.id}
      <CampaignComponent initCampaign={campaign as IReactCampaign} />
    </>
  )
}