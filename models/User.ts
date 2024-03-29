import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserNotFoundErr, InvalidPasswordErr } from "@/lib/NextError";

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
  friends: Array<mongoose.Types.ObjectId>,
}

export const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
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
})

export interface UserModel extends mongoose.Model<IUser> {
  register(newUserDetails: RequiredUserValues): Promise<IUser>,
  authenticate(username: string, password: string): Promise<IUser>
}


UserSchema.static('register', async function register({username, email, password} : RequiredUserValues) : Promise<IUser> {
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await this.create({username, email, hashedPassword});
  return newUser;
})


UserSchema.static('authenticate', async function authenticate(username: string, password: string) : Promise<IUser> {
  const queryResult = await this.find({username});
  if (!queryResult) throw UserNotFoundErr;
  else {
    const foundUser = queryResult[0];
    if (bcrypt.compareSync(password, foundUser.hashedPassword)) {
      return foundUser;
    } else throw InvalidPasswordErr;
  }
})


export default  mongoose.models.User as UserModel || mongoose.model<IUser, UserModel>("User", UserSchema);




