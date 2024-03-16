"use client";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getCsrfToken } from "next-auth/react"
import { signIn } from "next-auth/react";
import { useState } from "react";


export default async function SignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return <>
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
      <label>
        Username
        <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
      </label>
      <label>
        Password
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
      </label>
      <button type="submit">Sign In</button>
    </form>
  </>
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   }
// }