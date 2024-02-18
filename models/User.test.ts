import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User from "./User";


type requiredUserValues = {
  name: string,
  email: string,
  password: string
}


const newUserDetails: requiredUserValues = {  
  name: "testUser",
  email: "testUser@aol.com",
  password: "testPassword"
}

beforeAll(async function() {
  await mongooseConnect();

})

afterAll(async function(){
  mongoose.disconnect();
})

describe("A user", function() {

  test("can be created", async function() {
    const newUser = await User.create(newUserDetails)

    for (let [key, val] of Object.entries(newUserDetails)) {
      
      expect(newUser).toHaveProperty(key);
      expect(newUser[key]).toBe(val);

    }
  })

  // test("can be retrieved", async function() {

  // })
  
  // test("can be deleted", async function() {

  // })

  // test("will not be retrieved", async function() {

  // })

})