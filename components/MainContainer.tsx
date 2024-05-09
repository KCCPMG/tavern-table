import { ReactNode } from "react";

type MainContainerProps = {
  children: ReactNode
}

export default async function MainContainer({children}: MainContainerProps) {
  return (
    <div className="main-container p-8 border flex flex-auto" >
      <div className="flex-auto border">
        {children}
      </div>
    </div>
  )
}