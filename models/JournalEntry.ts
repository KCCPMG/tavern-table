import mongoose from 'mongoose';

export interface IJournalEntry {
  campaignId: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId,
  createdDAte: Date,
  lastEditedBy: mongoose.Types.ObjectId,
  lastEditedDate: Date,
  title: string,
  text: string,
}

export type RequiredJournalEntryValues = {
  campaignId: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId
}

const JournalEntry = new mongoose.Schema({
  campaignId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  createdDate: {
    type: Date,
    default: new Date()
  },
  lastEditedBy: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  lastEditedDate: {
    type: Date,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  text: {
    type: String
  }
})

export default mongoose.models.JournalEntry || mongoose.model("JournalEntry", JournalEntry);