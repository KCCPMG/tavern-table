import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import Thread, {ThreadType} from "./Thread";
import { THREAD_CHAT_TYPES } from "./constants";

const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;

enum ChatTypes {
  CHAT, ROOM, CAMPAIGN
}

type RequiredThreadValues = {
  chatType: ChatTypes,
  name: string
}