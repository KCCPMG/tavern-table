import mongoose from "mongoose";
import Thread from "./Thread";
import User, { IPerson } from "./User";
import { THREAD_CHAT_TYPES } from "./constants";

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
  _id: mongoose.Types.ObjectId,
  name: string, 
  createdBy: IPerson, 
  createdOn: Date, 
  description: string, 
  dm: Array<mongoose.Types.ObjectId>,
  handouts: Array<mongoose.Types.ObjectId>,
  game: string,
  players: Array<IPerson>,
  invitedPlayers: Array<IPerson>,
  journalEntries: Array<mongoose.Types.ObjectId>,
  index: Array<mongoose.Types.ObjectId>,
  threadId: mongoose.Types.ObjectId
}


export type CreateCampaignProps = {
  creatorId: mongoose.Types.ObjectId,
  name: string,
  description?: string,
  game?: string,
  invitedPlayers?: Array<mongoose.Types.ObjectId>
}

export interface CampaignModel extends mongoose.Model<ICampaign> {
  createCampaign(newCampaignDetails: CreateCampaignProps): Promise<ICampaign>,
  getIReactCampaign(campaignId: mongoose.Types.ObjectId): Promise<IReactCampaign>
}

CampaignSchema.static('createCampaign', async function createCampaign(createObj : CreateCampaignProps) : Promise<ICampaign> {
  try {
    const { creatorId, name } = createObj;
    const [user, thread] = await Promise.all([
      User.findById(creatorId),
      Thread.create({
        name,
        chatType: THREAD_CHAT_TYPES.CAMPAIGN,
        participants: [creatorId]
      })
    ]);
    const campaign = await this.create({
      name,
      createdBy: creatorId,
      description: createObj.description || null,
      dm: [creatorId],
      game: createObj.game || null, 
      invitedPlayers: createObj.invitedPlayers || [], 
      threadId: thread._id
    });
    user?.campaigns.push(campaign._id);
    await user?.save();
    return campaign;

  } catch(err) {
    throw(err);
  }
}) 


CampaignSchema.static('getIReactCampaign', async function getIReactCampaign(campaignId : mongoose.Types.ObjectId) : Promise<IReactCampaign> {
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

  const scaledCampaign: IReactCampaign = {
    _id: campaign._id,
    name: campaign.name, 
    createdBy: users[0], 
    createdOn: campaign.createdOn, 
    description: campaign.description, 
    dm: users[1],
    handouts: campaign.handouts,
    game: campaign.game,
    players: users[2],
    invitedPlayers: users[3],
    journalEntries: campaign.journalEntries,
    index: campaign.index,
    threadId: campaign.threadId
  }

  return scaledCampaign;
})

export default mongoose.models.Campaign as CampaignModel || mongoose.model<ICampaign, CampaignModel>('Campaign', CampaignSchema);

