"use client";
import { useState, FormEvent} from "react";
import { useModalContext } from "context/ModalContext";
import { ICampaign } from "@/models/Campaign";
import Link from "next/link";


type CampaignLinkProps = {
  name: string,
  id: string
}

export function CampaignLink({name, id} : CampaignLinkProps) {

  return (
    <Link href={`/campaigns/${id}`}>
      <h5>{name}</h5>
    </Link>
  )
}


type CampaignsProps = {
  initialCampaigns: Array<ICampaign>
}

export default function Campaigns({initialCampaigns}: CampaignsProps) {

  const [campaigns, setCampaigns] = useState<Array<ICampaign>>(initialCampaigns || []);

  function AddCampaignModal() {
    const { setShowModal } = useModalContext();
    const [campaignName, setCampaignName] = useState("");
    const [game, setGame] = useState("");
  
    async function submitForm(e: FormEvent): Promise<void> {
      e.preventDefault();
      console.log("ya clicked me");
      const req = await fetch('/api/campaigns', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createObj: {
            game,
            name: campaignName
          }
        })
      })
      setShowModal(false);
      setCampaignName("");
      setGame("");
      const campaigns = await req.json();
      setCampaigns(campaigns);
    }
  
    return (
      <div>
        <h2>Create New Campaign</h2>
        <hr />
        <form onSubmit={submitForm}>
          <label className="block">
            Campaign Name:
            <input 
              type="text" required 
              className="block"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)} 
            />
          </label>
          <label className="block">
            Game:
            <input 
              className="block"
              type="text" required
              value={game}
              onChange={(e) => setGame(e.target.value)}
            />
          </label>
          <button type="submit">Create Campaign!</button>
        </form>
  
      </div>
    )
  }

  function AddCampaignButton() {
    const { setShowModal, setModalBody } = useModalContext();
  
    return (
      <>
        <button onClick={() => { 
          setModalBody(<AddCampaignModal />)
          setShowModal(true); 
        }}>
          Add Campaign
        </button>
      </>
    )
  }

  return (
    <>
      <AddCampaignButton />
      {
        campaigns.map(c => {
          const stringifiedId=c._id.toString(); 
          return (
            <CampaignLink
              name={c.name} 
              id={stringifiedId} 
              key={stringifiedId} 
            />
          );
        })
      }
    </>
  )
}