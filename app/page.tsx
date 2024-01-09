import Counter from "./counter";
import "@/styles/global.css";

export const metadata = {
  title: 'App Router',
}

export default function Page() {
  return <>
    <h1>App Router</h1>
    <Counter />
  </>
}
