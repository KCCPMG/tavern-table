"use client"

import { signIn } from "next-auth/react";
import { useState } from "react";


type FormFieldProps = {
  labelText: string,
  inputType: "text" | "password",
  inputPlaceholder?: string,
  inputValue: string,
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function FormField({labelText, inputType, inputPlaceholder, inputValue, inputChange} : FormFieldProps) {
  return (
    <div className="flex justify-between">  
      <label className="">
        {labelText}
      </label>
      <input 
        className="border-black border-2"
        type={inputType} 
        placeholder={inputPlaceholder} 
        value={inputValue} 
        onChange={inputChange}
      />
    </div>
  )
}


export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="container m-auto translate-y-2/4 border-2 p-4 max-w-96">
      <form 
        // method="post" 
        // action="/api/auth/callback/credentials"
        // className="block px-auto"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          signIn("credentials", {
            username,
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}