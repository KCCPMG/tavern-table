"use client";
import { useState } from "react";
import Modal from "components/Modal"
import { useModalContext } from "context/ModalContext";
import FormField from "./FormField";


export function AddCampaignModal() {

  const [campaignName, setCampaignName] = useState("");
  const [game, setGame] = useState("");

  return (
    <div>
      <h2>Create New Campaign</h2>
      <hr />
      <form>
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