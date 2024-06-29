"use client";

import { IReactCampaign } from "@/models/Campaign";
import { MouseEvent, ChangeEventHandler, ChangeEvent, useState, useEffect } from "react";
import { useModalContext } from "context/ModalContext";
import { IPerson } from "@/models/User";


type InviteMessageModalProps = {
  player: IPerson,
  campaignId: string,
  campaignName: string
}

function InviteMessageModal(
  { player, campaignId, campaignName }: InviteMessageModalProps) 
{
  
  const { setShowModal, setModalBody } = useModalContext();
  const [messageText, setMessageText] = useState("");

  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessageText(e.target.value);
  }

  const cancelInvitation = () => {
    setModalBody(
      <InvitePlayersModal 
        campaignName={campaignName} 
        campaignId={campaignId}
      />
    )
  }

  const sendInvitation = () => {
    // placeholder action
  }

  return (
    <form onSubmit={sendInvitation}>
      <h4>Invite {player.username} to {campaignName}</h4>
      <textarea className="border" rows={4} cols={40} onChange={handleTextChange}/>
      <div className="justify-around">
        <button onClick={cancelInvitation}>Cancel</button>
        <button>Invite!</button>
      </div>
    </form>
  )
}


type InvitePlayersModalProps = {
  campaignId: string,
  campaignName: string
}


function InvitePlayersModal({ campaignName, campaignId }: InvitePlayersModalProps) {

  const { setShowModal, setModalBody } = useModalContext();
  const [searchVal, setSearchVal] = useState("");
  const [foundPersons, setFoundPersons] = useState<Array<IPerson>>([])

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = 
    async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchVal(e.target.value);
    }

  const handleInvitePlayer = (invitee: IPerson) => {
    setModalBody(
      <InviteMessageModal 
        campaignName={campaignName} 
        campaignId={campaignId} 
        player={invitee} 
      />
    );
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
          <div 
            className="cursor-pointer hover:bg-slate-300"
            onClick={(e) => {
              e.preventDefault();
              handleInvitePlayer(fp)
            }}
            
          >
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
    </>
  )
}


type CampaignProps = {
  initCampaign: IReactCampaign,
}

export default function Campaign({initCampaign} : CampaignProps) {

  const { setShowModal, setModalBody } = useModalContext();
  const [campaign, setCampaign] = useState<IReactCampaign>(initCampaign);

  console.log(initCampaign);

  const handleInvitePlayersClick = (e: MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
    setModalBody(<InvitePlayersModal campaignName={campaign.name} campaignId={campaign._id.toString()}/>);
  }

  return (
    <>
      <h1>{campaign.name}</h1>
      <h4>A {campaign.game} Campaign</h4>
      <h4>
        Created by {campaign.createdBy.username} on {campaign.createdOn.toDateString()}
      </h4>
      <h4>
        Dungeon Master{campaign.dm.length != 1 ? "s" : ""}: {campaign.dm.map(dm => dm.username).join(", ")}
      </h4>
      <h4>
        Players: {campaign.players.map(player => player.username).join(", ")}
      </h4>
      {campaign.invitedPlayers.length > 0 && 
      <h4>
        Invited Players: {campaign.invitedPlayers.map(player => player.username).join(", ")}
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
