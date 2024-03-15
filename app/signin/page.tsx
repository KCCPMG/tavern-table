"use server";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getCsrfToken } from "next-auth/react"


export default async function SignIn() {
  return <>
    <form method="post" action="/api/auth/callback/credentials">
      <label>
        Username
        <input type="text" placeholder="Username" />
        </label>
      <label>
        Password
        <input type="password" placeholder="Password" />
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