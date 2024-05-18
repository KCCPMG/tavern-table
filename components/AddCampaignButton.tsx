"use client";
import { ReactEventHandler, useState } from "react";
import Modal from "components/Modal"
import { useModalContext } from "context/ModalContext";
import { FormEvent } from "react";
import FormField from "./FormField";


export function AddCampaignModal() {

  const [campaignName, setCampaignName] = useState("");
  const [game, setGame] = useState("");

  async function submitForm(e: FormEvent): Promise<void> {
    e.preventDefault();
    console.log("ya clicked me");
    const req = await fetch('/api/campaigns', {
      method: "POST",
      body: JSON.stringify({
        createObj: {
          game,
          name: campaignName
        }
      })
    })
    const json = await req.json();
    console.log(json);

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

export default function AddCampaignButton() {

  const { showModal, setShowModal, setModalBody } = useModalContext();
  const [displayModal, setDisplayModal] = useState(false); 

  return (
    <>
      <button onClick={() => { 
        console.log(displayModal);
        setModalBody(<AddCampaignModal />)
        setShowModal(true); 
      }}>
        Add Campaign
      </button>
    </>
  )
}