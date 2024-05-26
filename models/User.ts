import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserNotFoundErr, InvalidPasswordErr, EmailTakenErr, UsernameTakenErr } from "@/lib/NextError";
import Campaign, { ICampaign } from "./Campaign";

const salt_rounds = process.env.NODE_ENV === "production" ? 12 : 1;
const salt = bcrypt.genSaltSync(salt_rounds);


export type RequiredUserValues = {
  username: string,
  email: string,
  password: string
}

export interface IUser {
  _id: mongoose.Types.ObjectId,
  username: string,
  email: string,
  hashedPassword: string,
  confirmed: boolean,
  createTime: Date,
  characters: Array<mongoose.Types.ObjectId>,
  campaigns: Array<mongoose.Types.ObjectId>,
  friends: Array<mongoose.Types.ObjectId>
}

export interface IUserMethods {
  getCampaigns(): Promise<Array<ICampaign>>
}

// Create a new Model type that knows about IUserMethods...
export interface UserModel extends mongoose.Model<IUser, {}, IUserMethods> {
  register(newUserDetails: RequiredUserValues): Promise<IUser>,
  authenticate(username: string, password: string): Promise<IUser>,
  getCampaignsFor(_id: mongoose.Types.ObjectId | string): Promise<Array<ICampaign>>
}

export const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false,
    required: true
  },
  createTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  characters: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  campaigns: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  friends: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
  // methods: {
  //   getCampaigns: async function() {
  //     try {
  //       // (this as IUser).campaigns;
  //       // this.campaigns;
  //       return await Promise.all((this as IUser).campaigns.map(campaignId => {
  //         const camp = Campaign.findById(campaignId) as Promise<ICampaign>;
  //         return camp;
  //       }));
  //     } catch(err) {
  //       throw err;
  //     }
  //   }
  // }
})

UserSchema.method("getCampaigns", async function getCampaigns() {
  try {
    // (this as IUser).campaigns;
    // this.campaigns;
    return await Promise.all(this.campaigns.map(campaignId => {
      const camp = Campaign.findById(campaignId) as Promise<ICampaign>;
      return camp;
    }));
  } catch(err) {
    throw err;
  }
})


// export interface UserModel extends mongoose.Model<IUser> {
//   register(newUserDetails: RequiredUserValues): Promise<IUser>,
//   authenticate(username: string, password: string): Promise<IUser>,
//   getCampaignsFor(_id: mongoose.Types.ObjectId | string): Promise<Array<ICampaign>>
// }


UserSchema.static('register', async function register({username, email, password} : RequiredUserValues) : Promise<IUser> {
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const newUser = await this.create({username, email, hashedPassword});
    return newUser;
  } catch(err) {
    if (err instanceof mongoose.mongo.MongoServerError) {
      if (err.code === 11000) {
        if (err.keyPattern?.email) {
          throw EmailTakenErr;
        } if (err.keyPattern?.username) {
          throw UsernameTakenErr;
        }
      }
    }
    throw(err);
  }

})


UserSchema.static('authenticate', async function authenticate(username: string, password: string) : Promise<IUser> {
  const queryResult = await this.find({username});
  if (queryResult.length === 0) throw UserNotFoundErr;
  else {
    const foundUser = queryResult[0];
    if (bcrypt.compareSync(password, foundUser.hashedPassword)) {
      return foundUser;
    } else {
      console.log(password);
      throw InvalidPasswordErr;
    }
  }
})


// UserSchema.static('getCampaignsFor', async function getCampaignsFor(_id: mongoose.Types.ObjectId | string): Promise<Array<ICampaign>> {
//   try {
//     const user: IUser = this.findById(_id);

//     if (!user) throw UserNotFoundErr;
  
//     return await Promise.all(user.campaigns.map(campaignId => {
//       const camp = Campaign.findById(campaignId) as Promise<ICampaign>;
//       return camp;
//     }));
//   } catch (err) {
//     throw err;
//   }

// })


export default mongoose.models.User as UserModel || mongoose.model<IUser, UserModel>("User", UserSchema);




