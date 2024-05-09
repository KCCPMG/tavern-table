"use client";
import { useState } from "react";
import Modal from "components/Modal"
import { useModalContext } from "context/ModalContext";


export default function AddCampaignButton() {

  const { showModal, setShowModal } = useModalContext();
  const [displayModal, setDisplayModal] = useState(false); 

  return (
    <>
      <button onClick={() => { 
        console.log(displayModal);
        setShowModal(true); 
      }}>
        Add Campaign
      </button>
      {/* <Modal 
        display={displayModal}
        closeModal={() => setDisplayModal(false)} 
      /> */}
    </>
  )
}