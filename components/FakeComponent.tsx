"use client";
import { useState, ReactNode, useEffect } from "react";
import FormField from "./FormField";


export default function FakeComponent() {

  const [stateChildren, setStateChildren] = useState<ReactNode>(null);

  // const [textValue, setTextValue] = useState("");
  const [textValue1, setTextValue1] = useState("");

  // const ff = (
  //   <FormField 
  //     labelText="hello" 
  //     inputType="text"
  //     inputPlaceholder="Placeholder"
  //     inputValue={textValue} // this is being read once, not listening for state changes
  //     inputChange={(e) => {
  //       console.log({textValue, "e.target.value": e.target.value});
  //       setTextValue(e.target.value);
  //     }}
  //   />
  // );

  function InternalStateComp() {

    const [textValue, setTextValue] = useState("");

    return (
      <FormField 
        labelText="hello" 
        inputType="text"
        inputPlaceholder="Placeholder"
        inputValue={textValue} // this version works with its internal state
        inputChange={(e) => {
          console.log({textValue, "e.target.value": e.target.value});
          setTextValue(e.target.value);
        }
      }
      />
    )}

  useEffect(() => {
    setStateChildren(<InternalStateComp />);
  },[]);

  return (
    <div>
      {stateChildren}
      <FormField 
        labelText="hello" 
        inputType="text"
        inputPlaceholder="Placeholder"
        inputValue={textValue1} // this is being read once, not listening for state changes
        inputChange={(e) => {
          console.log({textValue1, "e.target.value": e.target.value});
          setTextValue1(e.target.value);
        }}
      />
    </div>
  )

}