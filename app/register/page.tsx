"use client";

import FormField from "@/components/FormField";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToasterContext } from "context/ToasterContext";
import { useRouter } from "next/navigation";

export default function Register() {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { addToast } = useToasterContext();
  const router = useRouter();

  const attemptRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await signIn("credentials", {
        register: true,
        redirect: false,
        username,
        email,
        password
      });
      console.log(response);
      if (!response) {
        throw new Error("Something went wrong");
      }
      // else, assured response is of type SignInResponse
      if (response.error) {
        console.error(response.error);
        addToast({
          status: "error",
          message: response.error || "Something went wrong"
        })
      }
      else if (response.status === 200 && response.ok) {
        console.log("success");
        addToast({
          status: "success",
          message: `Welcome to Tavern Table, ${username}!`
        })
        try {
          router.push("/");
        } catch(err) {
          console.error(err);
        }
      }

    } catch(err) {
      console.error(err);
      addToast({
        status: "error",
        message: "Something went wrong"
      })
    }
  }

  return (
    <div className="container m-auto translate-y-2/4 border-2 p-4 max-w-96">
      <form onSubmit={attemptRegister}>
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