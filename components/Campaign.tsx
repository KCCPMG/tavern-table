"use client";

import { ICampaign } from "@/models/Campaign";
import { MouseEvent, ChangeEventHandler, ChangeEvent, useState, useEffect } from "react";
import { useModalContext } from "context/ModalContext";
import { IPerson } from "@/models/User";


type CampaignProps = {
  initCampaign: ICampaign
}

export default function Campaign({initCampaign} : CampaignProps) {

  const { setShowModal, setModalBody } = useModalContext();

  const [campaign, setCampaign] = useState<ICampaign>(initCampaign);


  
  



  

  function InvitePlayersModal() {
    const [searchVal, setSearchVal] = useState("");
    const [foundPersons, setFoundPersons] = useState<Array<IPerson>>([])

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = 
      async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchVal(e.target.value);
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
      <form>
        <label>Search by username or email</label>
        <input 
          type="text" 
          onChange={handleInputChange} 
          placeholder="Username or email" 
          value={searchVal}
        />
        {foundPersons.map(fp => {
          console.log(fp);
          return (
            <div>
              <div className="inline-block p-2">
                <img className="h-6 w-6" src={fp.imageUrl} />
              </div>
              <div className="inline-block p-2">
                <p>{fp.username}</p>
                <p>{fp.email}</p>
              </div>
            </div>
          )
        })}
      </form>
    )
  }

  const handleInvitePlayersClick = (e: MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
    setModalBody(
      <InvitePlayersModal 

        // handleInputChange={handle}
      />
    );
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
