"use server"
import APIGetTest from "./components/APIGetTest";
import MongooseTest from "./components/MongooseTest";
import PusherTest from "./components/PusherTest";

export default async function TestPage() {
  return (
    <>
      <APIGetTest />
      <PusherTest />
      <MongooseTest />
    </>
  )
}