import mongoose from "mongoose";

import Thread from "./Thread";
import Campaign, { ICampaign } from "./Campaign";
import User from "./User";

import { THREAD_CHAT_TYPES } from "./constants";


export type CreateCampaignProps = {
  creatorId: mongoose.Types.ObjectId,
  name: string,
  description?: string,
  game?: string,
  invitedPlayers?: Array<mongoose.Types.ObjectId>
}

export async function createCampaign(createObj : CreateCampaignProps) : Promise<ICampaign> {
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
    const campaign = await Campaign.create({
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
}