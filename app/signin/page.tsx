"use client";

import FormField from "@/components/FormField";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToasterContext } from "context/ToasterContext";
import { useRouter } from "next/navigation";


export default function SignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { addToast, toasts } = useToasterContext();
  const router = useRouter();


  // example:
  // const [addedToastOne, setAddedToastOne] = useState(false);
  // const [addedToastTwo, setAddedToastTwo] = useState(false);
  // const [addedToastThree, setAddedToastThree] = useState(false);
  // useEffect(() => {
  //   console.log("toasts useEffect:", toasts);
  //   if (!addedToastOne) {
  //     addToast({
  //       message: "toast 1",
  //       status: "success"
  //     });
  //     setAddedToastOne(true);
  //   }
  //   else if (!addedToastTwo) {
  //     addToast({
  //       message: "toast 2",
  //       status: "success"
  //     });
  //     setAddedToastTwo(true);
  //   }
  //   else if (!addedToastThree) {
  //     addToast({
  //       message: "toast 3",
  //       status: "success"
  //     })
  //     setAddedToastThree(true);
  //   }
  // }, [toasts]);

  const attemptLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signIn("credentials", {
        redirect: false,
        username,
        password
      }) 
      console.log(response)
      if (!response) {
        throw new Error("Something went wrong");
      }
      // else, assured response is of type SignInResponse
      if (response.error) {
        console.log("response.error");
        addToast({
          status: "error",
          message: response.error || "Something went wrong"
        })
      }
      else if (response.status === 200 && response.ok) {
        console.log("success");
        addToast({
          status: "success",
          message: "Logged In!"
        })
        try {
          router.push("/");
        } catch(err) {
          console.error(err);
        }
        console.log("This should have redirected");
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
    <>
      <div className="container m-auto translate-y-2/4 border-2 p-4 max-w-96">
        <form 
          onSubmit={attemptLogin}
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