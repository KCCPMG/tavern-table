import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User, { IUser } from "./User";
import { sampleUser1Details } from "./test_resources/sampleDocs";
import { EmailTakenErr, InvalidPasswordErr, UserNotFoundErr, UsernameTakenErr } from "@/lib/NextError";


const createdUserDetails= {  
  username: sampleUser1Details.username,
  email: sampleUser1Details.email
}

beforeAll(async function() {
  await mongooseConnect();
  await User.deleteMany(createdUserDetails);
  await User.deleteMany({username: "bad user"});
  await User.deleteMany({email: "baduser@aol.com"});
})

afterAll(async function(){
  await User.deleteMany(createdUserDetails);
  await User.deleteMany({username: "bad user"});
  await User.deleteMany({email: "baduser@aol.com"});
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

  test("will throw a UserNotFoundErr on false user authentication", async function() {
    await expect(User.authenticate("fakeuser", "anyfakepassword"))
    .rejects.toThrow(UserNotFoundErr);
  })

  test("will throw an InvalidPasswordErr on invalid password", async function() {
    await expect(User.authenticate(sampleUser1Details.username, "badpassword"))
    .rejects.toThrow(InvalidPasswordErr);
  })

  test("cannot be created with a duplicate email", async function() {
    await expect(User.register({
      email: sampleUser1Details.email,
      username: "bad user",
      password: "testpassword"
    })).rejects.toThrow(EmailTakenErr);

  })

  test("cannot be created with a duplicate username", async function() {
    await expect(User.register({
      email: "baduser@aol.com",
      username: sampleUser1Details.username,
      password: "testpassword"
    })).rejects.toThrow(UsernameTakenErr)

  })
  
  test("can be deleted", async function() {
    await User.deleteMany(createdUserDetails);
  })

  test("will not be retrieved", async function() {
    const foundUsers: Array<IUser> = await User.find(createdUserDetails);
    expect(foundUsers.length).toBe(0);
  })

})