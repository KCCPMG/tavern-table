import mongoose from "mongoose";
import User, { IPerson, IPersonUnsanitized } from "./User";
import { CampaignNotFoundErr } from "@/lib/NextError";
import mongooseConnect from "@/lib/mongooseConnect";

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
    required: true,
    default: "/sample.jpg"
  },
  description: {
    type: String,
    required: false
  },
  dm: [{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }],
  handouts: {
    type: [mongoose.Types.ObjectId]
  },
  game: {
    type: String,
    required: false
  },
  players: {
    type: [mongoose.Types.ObjectId],
    ref: "User"
  },
  invitedPlayers: {
    type: [mongoose.Types.ObjectId],
    ref: "User"
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
  createdBy: IPersonUnsanitized,
  dm: IPersonUnsanitized[],
  players: IPersonUnsanitized[],
  invitedPlayers: IPersonUnsanitized[]

}



function sanitizeIPerson(unsanitized : IPersonUnsanitized): IPerson {
  const {username, email, imageUrl} = unsanitized;
  return {
    username, 
    email, 
    imageUrl, 
    _id: unsanitized._id.toString()
  }
}

CampaignSchema.static('getIReactCampaign', async function getIReactCampaign(campaignId : string) : Promise<IReactCampaign> {
  await mongooseConnect();

  console.log("Hello, I'm looking for campaign id ", campaignId);
  const placeholderCampaign = await this.findById(campaignId);
  console.log({placeholderCampaign});

  const populatedCampaign: IPopulatedCampaign | null = await this.findById(campaignId)
  .populate({path: 'createdBy', select: '_id username email imageUrl'})
  .populate({
    path: 'dm',
    select: 'username email imageUrl'
  })
  .populate({
    path: 'players',
    select: 'username email imageUrl'
  })
  .populate({
    path: 'invitedPlayers',
    select: 'username email imageUrl'
  })
  // .exec();

  // const populatedCampaign: IPopulatedCampaign | null = await this.findById(campaignId).populate(['createdBy', 'dm', 'players', 'invitedPlayers'])

  if(!populatedCampaign) throw CampaignNotFoundErr;

  populatedCampaign.dm = populatedCampaign.dm.map(dm => {
    return {
      _id: dm._id,
      username: dm.username,
      email: dm.email,
      imageUrl: dm.imageUrl
    }
  })

  console.log("\npopulatedCampaign:\n", JSON.stringify(populatedCampaign, null, 2));


  const scaledCampaign: IReactCampaign = {
    _id: populatedCampaign._id.toString(),
    name: populatedCampaign.name, 
    createdBy: sanitizeIPerson(populatedCampaign.createdBy), 
    createdOn: populatedCampaign.createdOn, 
    imageUrl: populatedCampaign.imageUrl,
    description: populatedCampaign.description, 
    dm: populatedCampaign.dm.map(unsanitized => sanitizeIPerson(unsanitized)),
    handouts: populatedCampaign.handouts.map(h => h.toString()),
    game: populatedCampaign.game,
    players: populatedCampaign.players.map(unsanitized => sanitizeIPerson(unsanitized)),
    invitedPlayers: populatedCampaign.invitedPlayers.map(unsanitized => sanitizeIPerson(unsanitized)),
    journalEntries: populatedCampaign.journalEntries.map(j => j.toString()),
    index: populatedCampaign.index.map(i => i.toString()),
    threadId: populatedCampaign.threadId.toString()
  }

  console.log("scaledCampaign:\n", JSON.stringify(scaledCampaign, null, 2));

  return scaledCampaign;
})

export default mongoose.models.Campaign as CampaignModel || mongoose.model<ICampaign, CampaignModel>('Campaign', CampaignSchema);

