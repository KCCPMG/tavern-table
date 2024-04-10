"use client";

import FormField from "@/components/FormField";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { UserNotFoundErr, InvalidPasswordErr } from "@/lib/NextError";
import Toaster from "@/components/Toast";


export default function SignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Toaster toasts={[{errorMessage: "test", status: "success"}]}/>
      <div className="container m-auto translate-y-2/4 border-2 p-4 max-w-96">
        <form 
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
              const response = await signIn("credentials", {
                redirect: false,
                username,
                password
              }) 
              console.log(response);

            } catch(err) {
              console.log("ERROR!!!", err);
            }
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
          <button type="submit">Sign In</button>
        </form>
      </div>
    </>
  )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   }
// }