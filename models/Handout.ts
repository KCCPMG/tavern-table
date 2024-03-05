import mongoose from "mongoose";

export interface IHandout {
  _id: mongoose.Types.ObjectId,
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  createdOn: Date,
  campaignId: mongoose.Types.ObjectId,
  editedBy: mongoose.Types.ObjectId,
  editedOn: Date,
  handoutTitle: string,
  image: Buffer,
  description: string,
  notes: Array<INote>
}

interface INote {
  position: {
    type: {
      x: number,
      y: number
    }
  }, 
  text: {
    type: string,
  }
}

const Handout = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  createdOn: {
    type: Date,
    default: new Date(),
    // required: true
  },
  campaignId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  editedBy: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  editedOn: {
    type: Date,
    required: false
  },
  handoutTitle: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  description: {
    type: String
  },
  notes: {
    type: [{
      position: {
        required: true,
        type: {
          x: Number,
          y: Number
        }
      }, 
      text: {
        type: String,
        required: true,
        default: ''
      }
    }]
  }
});



export default mongoose.models.Handout || mongoose.model("Handout", Handout);