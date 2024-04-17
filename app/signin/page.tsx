"use client";

import FormField from "@/components/FormField";
import { signIn } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import { UserNotFoundErr, InvalidPasswordErr } from "@/lib/NextError";
import Toaster from "@/components/Toast";
import { useToasterContext, ToasterContext, ToasterContextType } from "context/ToasterContext";


export default function SignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { addToast, toasts } = useToasterContext();

  // example
  useEffect(() => {
    addToast({
      message: "toast 1",
      status: "success"
    });
    addToast({
      message: "toast 2",
      status: "success"
    });
    addToast({
      message: "toast 3",
      status: "success"
    });
  }, [])
  
  // example:
  useEffect(() => {
    console.log("toasts useEffect:", toasts);
  }, [toasts]);

  return (
    <>
      <div className="container m-auto translate-y-2/4 border-2 p-4 max-w-96">
        {/* <Toaster /> */}
        <form 
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
              const response = signIn("credentials", {
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