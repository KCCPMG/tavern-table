import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User, { IUser } from "./User";
import { sampleUser1Details } from "./test_resources/sampleDocs";


const createdUserDetails= {  
  username: sampleUser1Details.username,
  email: sampleUser1Details.email
}

beforeAll(async function() {
  await mongooseConnect();
  await User.deleteMany(createdUserDetails);
})

afterAll(async function(){
  await User.deleteMany(createdUserDetails);
  mongoose.disconnect();
})

describe("A user", function() {

  test("can be registered", async function() {

    const newUser: IUser = await User.register(sampleUser1Details);
    
    // make returned IUser obj indexable by string
    const indexableNewUser:{[index: string]: any} = newUser;

    for (let [key, val] of Object.entries(sampleUser1Details)) {
      
      if (key === "password") {
        continue;
      }
      expect(indexableNewUser).toHaveProperty(key);
      expect(indexableNewUser[key]).toBe(val);

    }
  })

  test("can be retrieved", async function() {
    const foundUsers: {[index: string]: IUser }[] = await User.find(createdUserDetails);
    expect(foundUsers.length).toBe(1);
    const foundUser = foundUsers[0];
    for (let [key, val] of Object.entries(sampleUser1Details)) {
      
      if (key === "password") {
        continue;
      }
      expect(foundUser).toHaveProperty(key);
      expect(foundUser[key]).toBe(val);

    }
  })

  test("can be authenticated", async function() {
    const foundUser: IUser = await User.authenticate(sampleUser1Details.username, sampleUser1Details.password);

    const indexableFoundUser: {[index: string]: any} = foundUser;
    for (let [key, val] of Object.entries(sampleUser1Details)) {
      
      if (key === "password") {
        continue;
      }
      expect(indexableFoundUser).toHaveProperty(key);
      expect(indexableFoundUser[key]).toBe(val);

    }
  })
  
  test("can be deleted", async function() {
    await User.deleteMany(createdUserDetails);
  })

  test("will not be retrieved", async function() {
    const foundUsers: Array<IUser> = await User.find(createdUserDetails);
    expect(foundUsers.length).toBe(0);
  })

})