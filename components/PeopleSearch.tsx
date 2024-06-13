"use client";

import { useState, useEffect, ChangeEventHandler, ChangeEvent } from "react";
import { useModalContext } from "context/ModalContext";
import { IPerson } from "@/models/User";


type MessageModalProps = {
  personId: string,
  username: string
}

function MessageModal({personId, username}: MessageModalProps) {
  const { setShowModal } = useModalContext();

  return (
    <form>
      <textarea rows={4} />
      <button onClick={(e) => setShowModal(false)}>Cancel</button>
      <button>Send Message</button>
    </form>
  )
}

export default function PeopleSearch() {

  const { setShowModal, setModalBody } = useModalContext();

  const [searchVal, setSearchVal] = useState("");
  const [foundPersons, setFoundPersons] = useState<Array<IPerson>>([])

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = 
    async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchVal(e.target.value);
    };

  
  const handleSendMessageButtonClick = (personId: string, username: string) => {
    setShowModal(true);
    setModalBody(<MessageModal personId={personId} username={username} />);
  }

  useEffect(() => {
    try { 
      if (searchVal.length == 0) return;
      // else
      const response = fetch("/api/people?" + new URLSearchParams({
        "search": searchVal
      }));
      response.then(res => res.json())
      .then(json => {
        console.log(json);
        setFoundPersons(json);
      })
    } catch (err) {
      console.log(err);
    }
  }, [searchVal]);

  return (
    <>
      <label>Search</label>
      <input value={searchVal} onChange={handleInputChange} />
      <h2>Results</h2>
      <ul>
        {foundPersons.map(fp => {
          return (
            <li key={fp._id}>
              <div>
                <h4>fp.username</h4>
                <button 
                  onClick={(e) => {handleSendMessageButtonClick(fp._id, fp.username)}}
                >
                  Send Message
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    
    </>
  )
}