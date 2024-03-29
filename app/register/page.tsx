"use client"

import { signIn } from "next-auth/react";
import { useState } from "react";
import FormField from "@/components/FormField";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // async function submitRegistration(): Promise<void> {
  //   console.log("body should be...", JSON.stringify({email, username, password}));
  //   const response = await fetch('/api/register', {
  //     headers: {
  //       contentType: "application/json"
  //     },
  //     method: 'POST',
  //     body: JSON.stringify({email, username, password}),
  //   })
  //   const json = await response.json();
  //   console.log(json);
  // }

  return (
    <div className="container m-auto translate-y-2/4 border-2 p-4 max-w-96">
      <form 
        // method="post" 
        // action="/api/auth/callback/credentials"
        // className="block px-auto"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          // submitRegistration();
          signIn("credentials", {
            register: true,
            username,
            email,
            password
          })

        }}
      >
        <FormField
          labelText="E-mail" 
          inputType="text" 
          inputPlaceholder="E-mail"
          inputValue={email}
          inputChange={(e) => setEmail(e.target.value)}
        />
        <FormField 
          labelText="Username" 
          inputType="text" 
          inputPlaceholder="Username"
          inputValue={username}
          inputChange={(e) => setUsername(e.target.value)}
        />
        <FormField
          labelText="Password" 
          inputType="password" 
          inputPlaceholder="Password"
          inputValue={password}
          inputChange={(e) => setPassword(e.target.value)}
        />
        <FormField
          labelText="Confirm Password" 
          inputType="password" 
          inputPlaceholder="Confirm Password"
          inputValue={confirmPassword}
          inputChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex pt-4 justify-between">
          <button 
            className="border px-2 mx-auto"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  )
}