import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User, {UserType} from "./User";


type RequiredUserValues = {
  name: string,
  email: string,
  password: string
}


const newUserDetails: RequiredUserValues = {  
  name: "testUser",
  email: "testUser@aol.com",
  password: "testPassword"
}

beforeAll(async function() {
  await mongooseConnect();
  await User.deleteMany(newUserDetails);
})

afterAll(async function(){
  mongoose.disconnect();
})

describe("A user", function() {

  test("can be created", async function() {

    // make returned UserType obj indexable by string
    const newUser: {[index: string]: UserType } = await User.create(newUserDetails)

    for (let [key, val] of Object.entries(newUserDetails)) {
      
      expect(newUser).toHaveProperty(key);
      expect(newUser[key]).toBe(val);

    }
  })

  test("can be retrieved", async function() {
    const foundUsers: {[index: string]: UserType }[] = await User.find(newUserDetails);
    expect(foundUsers.length).toBe(1);
    const foundUser = foundUsers[0];
    for (let [key, val] of Object.entries(newUserDetails)) {
      
      expect(foundUser).toHaveProperty(key);
      expect(foundUser[key]).toBe(val);

    }
  })
  
  test("can be deleted", async function() {
    await User.deleteMany(newUserDetails);
  })

  test("will not be retrieved", async function() {
    const foundUsers: {[index: string]: UserType }[] = await User.find(newUserDetails);
    expect(foundUsers.length).toBe(0);
  })

})