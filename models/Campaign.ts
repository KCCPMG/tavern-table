import mongoose from "mongoose";
import User, { IPerson } from "./User";
import { CampaignNotFoundErr } from "@/lib/NextError";

export interface ICampaign {
  _id: mongoose.Types.ObjectId,
  name: string, 
  createdBy: mongoose.Types.ObjectId, 
  createdOn: Date, 
  imageUrl: string,
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

// instance methods
export interface ICampaignMethods {
  // stub
}

// create a new model that incorporates ICampaignMethods, declare static methods
export interface CampaignModel extends mongoose.Model<ICampaign> {
  getIReactCampaign(campaignId: string): Promise<IReactCampaign>
}

export type RequiredCampaignValues = {
  name: string,
  threadId: mongoose.Types.ObjectId,
  createdBy?: mongoose.Types.ObjectId,
  imageUrl: string
}

const CampaignSchema = new mongoose.Schema<ICampaign, CampaignModel, ICampaignMethods>({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdOn: {
    type: Date,
    default: new Date(),
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dm: [{
    _id: false,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  }],
  handouts: {
    type: [mongoose.Types.ObjectId]
  },
  game: {
    type: String,
    required: false
  },
  players:  [{
    _id: false,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  }],
  invitedPlayers:  [{
    _id: false,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  }],
  journalEntries: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  index: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true
  }
})



export type IReactCampaign = {
  _id: string,
  name: string, 
  createdBy: IPerson, 
  createdOn: Date, 
  imageUrl: string,
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



export type IPopulatedCampaign = Omit<ICampaign, 'createdBy' | 'dm' | 'players' | 'invitedPlayers'> & {
  createdBy: IPerson,
  dm: IPerson[],
  players: IPerson[],
  invitedPlayers: IPerson[]

}

CampaignSchema.static('getIReactCampaign', async function getIReactCampaign(campaignId : string) : Promise<IReactCampaign> {
  
  // const [campaign, users] = await Promise.all([
  //   this.findById(campaignId),
  //   this.findById(campaignId)
  //     .then((camp: ICampaign) => {
  //       return Promise.all([
  //         User.getPerson(camp.createdBy),
  //         Promise.all(camp.dm.map(dm => User.getPerson(dm)))
  //       ])
  //     })
  // ]);

  const populatedCampaign: IPopulatedCampaign | null = await this.findById(campaignId)
  .populate({
    path: 'dm',
    select: 'username email imageUrl createTime confirmed'
  })
  .populate({
    path: 'playes',
    select: 'username email imageUrl createTime confirmed'
  })
  .populate({
    path: 'invitedPlayers',
    select: 'username email imageUrl createTime confirmed'
  })
  .populate({
    path: 'createdBy',
    select: 'username email imageUrl createTime confirmed'
  })

  if(!populatedCampaign) throw CampaignNotFoundErr;


  const scaledCampaign: IReactCampaign = {
    _id: populatedCampaign._id.toString(),
    name: populatedCampaign.name, 
    createdBy: populatedCampaign.createdBy, 
    createdOn: populatedCampaign.createdOn, 
    imageUrl: populatedCampaign.imageUrl,
    description: populatedCampaign.description, 
    dm: populatedCampaign.dm,
    handouts: populatedCampaign.handouts.map(h => h.toString()),
    game: populatedCampaign.game,
    players: populatedCampaign.players,
    invitedPlayers: populatedCampaign.invitedPlayers,
    journalEntries: populatedCampaign.journalEntries.map(j => j.toString()),
    index: populatedCampaign.index.map(i => i.toString()),
    threadId: populatedCampaign.threadId.toString()
  }

  console.log({scaledCampaign})

  return scaledCampaign;
})

export default mongoose.models.Campaign as CampaignModel || mongoose.model<ICampaign, CampaignModel>('Campaign', CampaignSchema);

