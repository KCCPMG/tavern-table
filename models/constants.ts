
export const THREAD_CHAT_TYPES = {
  CHAT: "CHAT", 
  ROOM: "ROOM", 
  CAMPAIGN: "CAMPAIGN"
}

export const MESSAGE_TYPES: {[index: string]: string} = {
  BEFRIEND_REQUEST: 'BEFRIEND_REQUEST',
  BEFRIEND_ACCEPT: 'BEFRIEND_ACCEPT',
  BEFRIEND_REJECT: 'BEFRIEND_REJECT',
  CAMPAIGN_INVITE: 'CAMPAIGN_INVITE',
  CAMPAIGN_INVITE_ACCEPT: 'CAMPAIGN_INVITE_ACCEPT',
  CAMPAIGN_INVITE_REJECT: 'CAMPAIGN_INVITE_REJECT',
  END_FRIENDSHIP: 'END_FRIENDSHIP',
  EXIT_CAMPAIGN: 'EXIT_CAMPAIGN',
  PROMOTE_TO_DM: 'PROMOTE_TO_DM',
  REMOVE_FROM_CAMPAIGN: 'REMOVE_FROM_CAMPAIGN',
  ROOM_INVITE: "ROOM_INVITE",
  ROOM_INVITE_ACCEPT: "ROOM_INVITE_ACCEPT",
  ROOM_INVITE_REJECT: "ROOM_INVITE_REJECT",
  STEP_DOWN_DM: 'STEP_DOWN_DM',
  TEXT_ONLY: 'TEXT_ONLY',
}