import mongoose from "mongoose";

import Thread from "./Thread";
import Campaign, { ICampaign } from "./Campaign";
import User from "./User";
import Message from "./Message";

import { THREAD_CHAT_TYPES, MESSAGE_TYPES } from "./constants";
import { CampaignNotFoundErr, CampaignAccessDeniedErr, PendingCampaignInvitationErr, UserNotFoundErr, InviteeNotFoundErr } from "@/lib/NextError";
import MessagesPage from "app/messages/page";


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
        participants: [{
          lastRead: null,
          user: creatorId
        }]
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


export type inviteToCampaignProps = {
  userId: string,
  inviteeId: string,
  campaignId: string,
  text?: string
}

export async function inviteToCampaign(
  {userId, inviteeId, campaignId, text}: inviteToCampaignProps
) {
  try {
    // get campaign, including thread, direct thread between user and invitee

    const [campaign, directThread, user, invitee] = await Promise.all([
      Campaign.findById(campaignId),
      Thread.findOrCreateThreadId({
        participants: [userId, inviteeId],
        chatType: "CHAT"
      }),
      User.findById(userId),
      User.findById(inviteeId)
    ])

    if (!campaign) throw CampaignNotFoundErr;
    if (!user) throw UserNotFoundErr;
    if (!invitee) throw InviteeNotFoundErr;

    // make sure user is in campaign

    const campaignParticipants: string[] = campaign.dm.concat(campaign.players)
    .map(dmOrPlayer => dmOrPlayer.toString());

    if (!(campaignParticipants.includes(userId))) throw CampaignAccessDeniedErr;

    // check that invitee is not in campaign or already invited
    const campaignParticipantsAndInvitees = campaignParticipants.concat(campaign.invitedPlayers.map(ip => ip.toString()));

    if (campaignParticipantsAndInvitees.includes(inviteeId)) throw PendingCampaignInvitationErr;

    // add invitee to campaign.invitedPlayers
    campaign.invitedPlayers.push(invitee._id);

    // create message with both threadIds
    const messagePromise = Message.create({
      sender: user._id,
      directRecipient: invitee._id,
      campaignId: campaign._id,
      threadIds: [directThread, campaign.threadId],
      sendTime: new Date(),
      messageType: MESSAGE_TYPES.CAMPAIGN_INVITE,
      text: text,
    })

    // save all
    const [savedMessage, savedCampaign] = await Promise.all(
      [messagePromise, campaign.save()]
    );

    // return message
    return savedMessage;

  } catch(err) {
    throw err;
  }
    

}