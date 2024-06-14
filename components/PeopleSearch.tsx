"use client";

import { useState, useEffect, ChangeEventHandler, ChangeEvent, FormEvent } from "react";
import { useModalContext } from "context/ModalContext";
import { IPerson } from "@/models/User";
import { MESSAGE_TYPES } from "@/models/constants";


type MessageModalProps = {
  personId: string,
  username: string
}

function MessageModal({personId, username}: MessageModalProps) {
  const { setShowModal } = useModalContext();
  const [ messageText, setMessageText] = useState("");

  async function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessageText(e.target.value);
  }

  async function sendMessage(e: FormEvent): Promise<void> {
    e.preventDefault();
    console.log(personId, username, messageText);

    const request = fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        chatType: MESSAGE_TYPES.TEXT_ONLY,
        recipientId: personId,
        text: messageText
      })
    })

    setShowModal(false);
    const response = await request;
    const json = await response.json();
    console.log(json);

  }

  return (
    <form onSubmit={sendMessage}>
      <textarea 
        className="border" 
        placeholder="Message" 
        value={messageText}
        onChange={handleTextareaChange}
        rows={4} 
      />
      <div>
        <button onClick={(e) => setShowModal(false)}>Cancel</button>
        <button type="submit">Send Message</button>
      </div>
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
              <div className="border">
                <h4>{fp.username}</h4>
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