import User from "types/User";


type LoggedInPanelProps = {
  username: string
}


function LoggedInPanel({username}: LoggedInPanelProps) {

  return (
    <div className="float-right">
      <span className="text-white text-2xl">
        {username}
      </span>
    </div>
  )
}

function LoggedOutPanel() {
  return (
    <div className="float-right">
      <span className="text-white text-2xl">
        Log In
      </span>
    </div>
  )
}


type NavbarProps = {
  user? : User
}


export default function Navbar({user}: NavbarProps) {

  console.log("Navbar:", user ? user : "no user");

  return (
    <nav className="bg-black w-full p-2">
      <span className="text-white text-2xl">Navbar</span>
      {user ? <LoggedInPanel username={user?.username} /> : <LoggedOutPanel />}
    </nav>
  )
}