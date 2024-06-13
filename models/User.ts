import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserNotFoundErr, InvalidPasswordErr, EmailTakenErr, UsernameTakenErr } from "@/lib/NextError";
import Campaign, { ICampaign } from "./Campaign";

const salt_rounds = process.env.NODE_ENV === "production" ? 12 : 1;
const salt = bcrypt.genSaltSync(salt_rounds);


export const DEFAULT_IMAGES = {
  A: "https://dd7tel2830j4w.cloudfront.net/f1510009325845x824160452699288700/A.png",
  B: "https://dd7tel2830j4w.cloudfront.net/f1512859392159x541018578223884100/B.png",
  C: "https://dd7tel2830j4w.cloudfront.net/f1512859409521x374254034366458600/C.png",
  D: "https://dd7tel2830j4w.cloudfront.net/f1512859450985x102933758404105900/D.png",
  E: "https://dd7tel2830j4w.cloudfront.net/f1512859468400x527699048863723900/E.png",
  F: "https://dd7tel2830j4w.cloudfront.net/f1512859500656x933212465140968600/F.png",
  G: "https://dd7tel2830j4w.cloudfront.net/f1512859530250x660503074061125500/G.png",
  H: "https://dd7tel2830j4w.cloudfront.net/f1512859562311x841428601648658600/H.png",
  I: "https://dd7tel2830j4w.cloudfront.net/f1512859576225x954706225078553000/I.png",
  J: "https://dd7tel2830j4w.cloudfront.net/f1512859606130x142825840273872020/J.png",
  K: "https://dd7tel2830j4w.cloudfront.net/f1512859626405x801974485861137500/K.png",
  L: "https://dd7tel2830j4w.cloudfront.net/f1512859675580x266716414131224160/L.png",
  M: "https://dd7tel2830j4w.cloudfront.net/f1512859704448x163864577189087870/M.png",
  N: "https://dd7tel2830j4w.cloudfront.net/f1512859836219x632431179517880000/N.png",
  O: "https://dd7tel2830j4w.cloudfront.net/f1512859891313x809682428138330600/O.png",
  P: "https://dd7tel2830j4w.cloudfront.net/f1512859936573x214360509533435100/P.png",
  Q: "https://dd7tel2830j4w.cloudfront.net/f1512859969136x620444205822423000/Q.png",
  R: "https://dd7tel2830j4w.cloudfront.net/f1512860044044x265613583382219070/R.png",
  S: "https://dd7tel2830j4w.cloudfront.net/f1512860078436x304001721553504450/S.png",
  T: "https://dd7tel2830j4w.cloudfront.net/f1512860094165x267422131728380920/T.png",
  U: "https://dd7tel2830j4w.cloudfront.net/f1512860119859x991487064631655800/U.png",
  V: "https://dd7tel2830j4w.cloudfront.net/f1512860143733x786652282346040000/V.png",
  W: "https://dd7tel2830j4w.cloudfront.net/f1512860158545x359364627161994560/W.png",
  X: "https://dd7tel2830j4w.cloudfront.net/f1512860180583x103629535995423790/X.png",
  Y: "https://dd7tel2830j4w.cloudfront.net/f1512860233847x389071396784856900/Y.png",
  Z: "https://dd7tel2830j4w.cloudfront.net/f1512860248120x569141123909503200/Z.png"
} as {[index: string] : string}

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




