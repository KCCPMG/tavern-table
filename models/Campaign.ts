import mongoose from "mongoose";
import Thread from "./Thread";
import User from "./User";
import { THREAD_CHAT_TYPES } from "./constants";

export interface ICampaign {
  _id: mongoose.Types.ObjectId,
  name: string, 
  createdBy: mongoose.Types.ObjectId, 
  createdOn: Date, description: string, 
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

export type CreateCampaignProps = {
  creatorId: mongoose.Types.ObjectId,
  name: string,
  description?: string,
  game?: string,
  invitedPlayers?: Array<mongoose.Types.ObjectId>
}

export interface CampaignModel extends mongoose.Model<ICampaign> {
  createCampaign(newCampaignDetails: CreateCampaignProps): Promise<ICampaign>,
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

export default mongoose.models.Campaign as CampaignModel || mongoose.model<ICampaign, CampaignModel>('Campaign', CampaignSchema);

