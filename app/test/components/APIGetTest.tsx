"use client";
import { useEffect, useState } from "react";

export default function APIGetTest() {

  const [data, setData] = useState("")

  useEffect(() => {
    fetch('/api/sampleget').then((res) => {
      console.log("expecting results....");
      res.json().then(json => {
        console.log(json.data);
        setData(json.data);
      });
    })
  }, [])


  return (
    <h1>
      API Get Test: {data}
    </h1>
  )
}