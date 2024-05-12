"use client";
import { useModalContext } from "context/ModalContext";
import { MouseEvent } from "react"




export default function Modal() {

  const { showModal, setShowModal, modalBody } = useModalContext();

  if (showModal) return (
    <>
      {/* Background */}
      <div 
        className="z-10 absolute h-full w-full opacity-20 bg-gray-600"
        onClick={() => setShowModal(false)}
      >
      </div>
      {/* Modal */}
      <div 
        className={`absolute z-20 left-0 right-0 top-0 bottom-0 m-auto 
        min-h-40 h-max max-h-80 overflow-y-scroll
        min-w-40 w-max max-w-80 overflow-x-scroll
        bg-white 
        rounded-lg 
        p-4`}
        // className="absolute rounded-lg z-20 min-h-40 min-w-40 max-w-60 max-h-100 h-auto flex  bg-white overflow-y-scroll p-4 m-auto left-0 right-0 top-0 bottom-0"
      >
        {modalBody}
      </div>
    </>
  );
  else return <></>;
}