"use client";
import { useState } from "react";
import Modal from "components/Modal"
import { useModalContext } from "context/ModalContext";


export function AddCampaignModal() {

  return (
    <div>
      Hello
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
      {/* <Modal 
        display={displayModal}
        closeModal={() => setDisplayModal(false)} 
      /> */}
    </>
  )
}