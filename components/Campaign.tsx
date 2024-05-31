"use client";

import { ICampaign } from "@/models/Campaign";
import { useState } from "react";

type CampaignProps = {
  initCampaign: ICampaign
}

export default function Campaign({initCampaign} : CampaignProps) {

  const [campaign, setCampaign] = useState<ICampaign>(initCampaign);

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
      <button>Invite Players</button>
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
