import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import Campaigns from "@/components/Campaigns";
import { headers } from "next/headers";
import ToastRedirect from "@/components/ToastRedirect";



export default async function Page() {

  try {
    const serverSession = await getServerSession(authOptions);

    if (!(serverSession?.user)) {
      return redirect("/");
    }
  
    const initCampaignsReq = await fetch(
      process.env.NEXTAUTH_URL + "/api/campaigns", {
        headers: headers()
    })
    const initCampaigns = await initCampaignsReq.json();
    
    return (
      <>
        <Campaigns initialCampaigns={initCampaigns} />
      </>
    )

  } catch(err) {
    const error = err as Error;
    console.log(error?.message);
    return <ToastRedirect redirect="/" toasts = {[
      {
        message: error?.message || "Something went wrong",
        status: "error"
      }
    ]} />
  }
  
}



