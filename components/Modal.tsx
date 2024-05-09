"use client";
import { MouseEvent } from "react"


type ModalProps = {
  display: boolean,
  classNameProp? : string,
  closeModal : (e: MouseEvent) => void,
}

export default function Modal({ display, classNameProp, closeModal }: ModalProps) {
  if (display) return (
    <>
      {/* Background */}
      <div 
        className="z-10 absolute h-full w-full opacity-20 bg-gray-600"
        onClick={closeModal}
      >
      </div>
      {/* Modal */}
      <div className={`${classNameProp} absolute z-20 margin-auto`}>

      </div>
    </>
  );
  else return <></>;
}