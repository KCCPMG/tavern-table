import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserNotFoundErr, InvalidPasswordErr, EmailTakenErr, UsernameTakenErr } from "@/lib/NextError";
import Campaign, { ICampaign } from "./Campaign";
import { DEFAULT_IMAGES } from "./constants";

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
  imageUrl: string,
  hashedPassword: string,
  confirmed: boolean,
  createTime: Date,
  characters: Array<mongoose.Types.ObjectId>,
  campaigns: Array<mongoose.Types.ObjectId>,
  friends: Array<mongoose.Types.ObjectId>
}

export interface IPersonUnsanitized{
  _id: mongoose.Types.ObjectId,
  username: string,
  email: string,
  imageUrl: string
}


export function sanitizeIPerson(unsanitized : IPersonUnsanitized): IPerson {
  const {username, email, imageUrl} = unsanitized;
  return {
    username, 
    email, 
    imageUrl, 
    _id: unsanitized._id.toString()
  }
}

// A limited user to be returned by a search
export interface IPerson {
  _id: string,
  username: string,
  email: string,
  imageUrl: string
}

// add instance methods
export interface IUserMethods {
  getCampaigns(): Promise<Array<ICampaign>>
}

// Create a new Model type that knows about IUserMethods...
export interface UserModel extends mongoose.Model<IUser, {}, IUserMethods> {
  register(newUserDetails: RequiredUserValues): Promise<IUser>,
  authenticate(username: string, password: string): Promise<IUser>,
  getCampaignsFor(_id: mongoose.Types.ObjectId | string): Promise<Array<ICampaign>>,
  getPerson(_id: mongoose.Types.ObjectId | string): Promise<IPerson>
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
  imageUrl: {
    type: String,
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

    const promises: Array<Promise<ICampaign>> = this.campaigns.map(campaignId => {
      const camp = Campaign.findById(campaignId) as Promise<ICampaign>;
      return camp;
    })

    // console.log({promises});

    const campaigns = await Promise.all(promises);

    return campaigns.filter(camp => !!camp);

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
    const imageUrl = DEFAULT_IMAGES[username[0].toUpperCase()] || "";
    const newUser = await this.create({username, email, hashedPassword, imageUrl});
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



UserSchema.static('getPerson', async function getPerson(_id: mongoose.Types.ObjectId | string) {
  try {
    const person: IUser | null = await this.findById({_id});
    if (!person) throw UserNotFoundErr;
    return {
      _id: person._id.toString(),
      email: person.email,
      username: person.username,
      imageUrl: person.imageUrl
    }

  } catch(err) {
    throw err;
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




