"use client";

import { ICampaign } from "@/models/Campaign";
import { MouseEvent, ChangeEventHandler, ChangeEvent, useState } from "react";
import { useModalContext } from "context/ModalContext";
import { IPerson } from "@/models/User";
import FormField from "./FormField";





type CampaignProps = {
  initCampaign: ICampaign
}

export default function Campaign({initCampaign} : CampaignProps) {

  const { setShowModal, setModalBody } = useModalContext();

  const [campaign, setCampaign] = useState<ICampaign>(initCampaign);
  const [searchVal, setSearchVal] = useState("");
  const [foundPersons, setFoundPersons] = useState<Array<IPerson>>([])

  
  function InvitePlayersModal() {
  
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = 
      async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(e.target.value);
        setSearchVal(e.target.value);
        const response = await fetch("/api/people");
        const json = await response.json();
        console.log(json);
      }
  
    return (
      <form>
        <label>Search by username or email</label>
        <input 
          type="text" 
          onChange={handleInputChange} 
          placeholder="Username or email" 
        />
      </form>
    )
  }

  const handleInvitePlayersClick = (e: MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
    setModalBody(InvitePlayersModal);
  }

  return (
    <>
      <h1>{campaign.name}</h1>
      <h4>A {campaign.game} Campaign</h4>
      <h4>
        Created by {campaign.createdBy.toString()} on {campaign.createdOn.toDateString()}
      </h4>
      <h4>
        Dungeon Master{campaign.dm.length != 1 ? "s" : ""}: {campaign.dm.map(dm => dm.toString()).join(", ")}
      </h4>
      <h4>
        Players: {campaign.players.map(player => player.toString()).join(", ")}
      </h4>
      {campaign.invitedPlayers.length > 0 && 
      <h4>
        Invited Players: {campaign.invitedPlayers.map(player => player.toString()).join(", ")}
      </h4> 
      }
      <button onClick={handleInvitePlayersClick}>Invite Players</button>
      <h4>Description:</h4>
      <p>{campaign.description}</p>
      <hr />
      <div className="flex justify-around">
        <div className="">
          <p>Show Journal Entries</p>
          <button>Add Journal Entry</button>
        </div>
        <div>
          <p>Show Index</p>
          <button>Add Index Entry</button>
        </div>
        <div>
          <p>Show Handouts</p>
          <button>Add Handout</button>
        </div>
      </div>
    </>
  )

}
