'use client'

import { useState } from 'react'
import { useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0)

    // fetch('localhost:3000/SSE').then((res) => {
  //   console.log("expecting results....");
  //   console.log(res);
  // })

  useEffect(() => {
    fetch('SSE').then((res) => {
      console.log("expecting results....");
      res.json().then(data => console.log(data));
    })
  }, [])

  // SSE().then(res => {console.log(res)});

  // useEffect(async (): void => {
  //   const data = await fetch('/SSE');
  //   console.log(data);
  // }, [])

  return (
    <>
      <h2>{count}</h2>
      <button type="button" onClick={() => setCount(count + 1)}>
        +
      </button>
    </>
  )
}
