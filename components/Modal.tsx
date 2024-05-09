"use client";
import { useModalContext } from "context/ModalContext";
import { MouseEvent } from "react"




export default function Modal() {

  const { showModal, setShowModal } = useModalContext();

  if (showModal) return (
    <>
      {/* Background */}
      <div 
        className="z-10 absolute h-full w-full opacity-20 bg-gray-600"
        onClick={() => setShowModal(false)}
      >
      </div>
      {/* Modal */}
      <div className={`absolute z-20 margin-auto`}>

      </div>
    </>
  );
  else return <></>;
}