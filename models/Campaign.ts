import mongoose from "mongoose";
import User, { IPerson } from "./User";
import { CampaignNotFoundErr } from "@/lib/NextError";

export interface ICampaign {
  _id: mongoose.Types.ObjectId,
  name: string, 
  createdBy: mongoose.Types.ObjectId, 
  createdOn: Date, 
  description: string, 
  dm: Array<mongoose.Types.ObjectId>,
  handouts: Array<mongoose.Types.ObjectId>,
  game: string,
  players: Array<mongoose.Types.ObjectId>,
  invitedPlayers: Array<mongoose.Types.ObjectId>,
  journalEntries: Array<mongoose.Types.ObjectId>,
  index: Array<mongoose.Types.ObjectId>,
  threadId: mongoose.Types.ObjectId
}

export type RequiredCampaignValues = {
  name: string,
  threadId: mongoose.Types.ObjectId,
  createdBy?: mongoose.Types.ObjectId
}

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  createdOn: {
    type: Date,
    default: new Date(),
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dm: {
    type: [mongoose.Types.ObjectId]
  },
  handouts: {
    type: [mongoose.Types.ObjectId]
  },
  game: {
    type: String,
    required: false
  },
  players: {
    type: [mongoose.Types.ObjectId]
  },
  invitedPlayers: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  journalEntries: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  index: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  threadId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
})

export type IReactCampaign = {
  _id: string,
  name: string, 
  createdBy: IPerson, 
  createdOn: Date, 
  description: string, 
  dm: Array<IPerson>,
  handouts: Array<string>,
  game: string,
  players: Array<IPerson>,
  invitedPlayers: Array<IPerson>,
  journalEntries: Array<string>,
  index: Array<string>,
  threadId: string
}




export interface CampaignModel extends mongoose.Model<ICampaign> {
  getIReactCampaign(campaignId: string): Promise<IReactCampaign>
}



CampaignSchema.static('getIReactCampaign', async function getIReactCampaign(campaignId : string) : Promise<IReactCampaign> {
  
  const [campaign, users] = await Promise.all([
    this.findById(campaignId),
    this.findById(campaignId)
      .then((camp: ICampaign) => {
        return Promise.all([
          User.getPerson(camp.createdBy),
          Promise.all(camp.dm.map(dm => User.getPerson(dm))),
          Promise.all(camp.dm.map(dm => User.getPerson(dm))),
          Promise.all(camp.dm.map(dm => User.getPerson(dm)))
        ])
      })
  ]);

  if(!campaign) throw CampaignNotFoundErr;

  const castCampaign = campaign as ICampaign;

  const scaledCampaign: IReactCampaign = {
    _id: castCampaign._id.toString(),
    name: castCampaign.name, 
    createdBy: users[0], 
    createdOn: castCampaign.createdOn, 
    description: castCampaign.description, 
    dm: users[1],
    handouts: castCampaign.handouts.map(h => h.toString()),
    game: castCampaign.game,
    players: users[2],
    invitedPlayers: users[3],
    journalEntries: castCampaign.journalEntries.map(j => j.toString()),
    index: castCampaign.index.map(i => i.toString()),
    threadId: castCampaign.threadId.toString()
  }

  console.log({scaledCampaign})

  return scaledCampaign;
})

export default mongoose.models.Campaign as CampaignModel || mongoose.model<ICampaign, CampaignModel>('Campaign', CampaignSchema);

