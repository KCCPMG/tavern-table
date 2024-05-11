"use client";
import { useState } from "react";
import Modal from "components/Modal"
import { ModalBody, useModalContext } from "context/ModalContext";


export default function AddCampaignButton() {

  const { showModal, setShowModal, setModalBody } = useModalContext();
  const [displayModal, setDisplayModal] = useState(false); 

  return (
    <>
      <button onClick={() => { 
        console.log(displayModal);
        setShowModal(true); 
        setModalBody(ModalBody())
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

/**
 * A Modal will have.....
 * FormFields
 * State for each FormField
 * Text
 * Title?
 * Form Action
 */