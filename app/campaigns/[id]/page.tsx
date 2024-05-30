"use server";

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page( { params } : PageProps ) {
  return (
    <>
      Your campaign Id is {params.id}
    </>
  )
}