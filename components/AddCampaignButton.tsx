"use client";
import { useState } from "react";
import Modal from "components/Modal"


export default function AddCampaignButton() {

  const [displayModal, setDisplayModal] = useState(false); 

  return (
    <>
      <button onClick={() => { 
        console.log(displayModal);
        setDisplayModal(true); 
      }}>
        Add Campaign
      </button>
      <Modal 
        display={displayModal}
        closeModal={() => setDisplayModal(false)} 
      />
    </>
  )
}