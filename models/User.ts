import mongoose from "mongoose";
import bcrypt from "bcrypt";

const salt_rounds = process.env.NODE_ENV === "production" ? 12 : 1;
const salt = bcrypt.genSaltSync(salt_rounds);


export type RequiredUserValues = {
  name: string,
  email: string,
  password: string
}

export interface IUser {
  _id: mongoose.Types.ObjectId,
  name: string,
  email: string,
  hashedPassword: string,
  confirmed: boolean,
  createTime: Date,
  characters: Array<mongoose.Types.ObjectId>,
  campaigns: Array<mongoose.Types.ObjectId>,
  friends: Array<mongoose.Types.ObjectId>,
}

export const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true
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
  register(newUserDetails: RequiredUserValues): Promise<IUser>
}

// UserSchema.statics.register = async function({name, email, password} : RequiredUserValues) : Promise<UserType> {
//   const hashedPassword = bcrypt.hashSync(password, salt);
//   const newUser = await this.create({name, email, hashedPassword});
//   return newUser;
// }

UserSchema.static('register', async function register({name, email, password} : RequiredUserValues) : Promise<IUser> {
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await this.create({name, email, hashedPassword});
  return newUser;
})

// User.statics.signIn = async function()

export type UserType = mongoose.InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId
};

// const User: mongoose.Model<any, {}, {}, {}, IUser, UserModel> = 
//   mongoose.models.User || 
//   mongoose.model<IUser, UserModel>("User", UserSchema);


const User = mongoose.model<IUser, UserModel>("User", UserSchema); 
const SavedUser = mongoose.models.User as UserModel;

export default  mongoose.models.User as UserModel || mongoose.model<IUser, UserModel>("User", UserSchema);




