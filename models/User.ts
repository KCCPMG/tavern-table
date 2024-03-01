import mongoose from "mongoose";
import bcrypt from "bcrypt";

export type RequiredUserValues = {
  name: string,
  email: string,
  password: string
}

const salt_rounds = process.env.NODE_ENV === "production" ? 12 : 1;
const salt = bcrypt.genSaltSync(salt_rounds);

const UserSchema = new mongoose.Schema({
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

// UserSchema.statics.register = async function({name, email, password} : RequiredUserValues) : Promise<UserType> {
//   const hashedPassword = bcrypt.hashSync(password, salt);
//   const newUser = await this.create({name, email, hashedPassword});
//   return newUser;
// }

UserSchema.static('register', async function({name, email, password} : RequiredUserValues) : Promise<UserType> {
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await this.create({name, email, hashedPassword});
  return newUser;
})

// User.statics.signIn = async function()

export type UserType = mongoose.InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId
};

export default mongoose.models.User || mongoose.model('User', UserSchema);