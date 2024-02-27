import mongoose from 'mongoose';
import { THREAD_CHAT_TYPES } from './constants';

const Thread = new mongoose.Schema({
  participants: {
    required: true,
    type: [mongoose.Types.ObjectId]
  },
  chatType: {
    type: String,
    required: true,
    enum: Object.values(THREAD_CHAT_TYPES)
  },
  campaignId: {
    required: false,
    type: mongoose.Types.ObjectId
  },
  name: {
    type: String,
    required: false
  }
})

export type ThreadType = mongoose.InferSchemaType<typeof Thread> & {
  _id: mongoose.Types.ObjectId
};

export default mongoose.models.Thread || mongoose.model('Thread', Thread)