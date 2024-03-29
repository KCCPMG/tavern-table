"use client";

import FormField from "@/components/FormField";
import { signIn } from "next-auth/react";
import { useState } from "react";


export default function SignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container m-auto translate-y-2/4 border-2 p-4 max-w-96">
      <form 
        // method="post" 
        // action="/api/auth/callback/credentials"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          signIn("credentials", {
            username,
            password
          }) 
        }}
      >
        <FormField
          labelText="Username"
          inputType="text"
          inputPlaceholder="Username"
          inputChange={(e)=>setUsername(e.target.value)}
          inputValue={username}
        />
        <FormField
          labelText="Password"
          inputType="password"
          inputPlaceholder="Password"
          inputChange={(e)=>setPassword(e.target.value)}
          inputValue={password}
        />
        {/* <label>
          Username
          <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
        </label>
        <label>
          Password
          <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
        </label> */}
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   }
// }