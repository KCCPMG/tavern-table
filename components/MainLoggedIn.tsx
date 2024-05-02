

type MainLoggedInProps = {
  username: string
}

export default function MainLoggedIn({username}: MainLoggedInProps) {

  return (
    <h1>Hello {username}</h1>
  )
}