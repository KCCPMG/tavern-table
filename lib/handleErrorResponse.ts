import { NextError } from "./NextError";

export default function handleErrorResponse(err: any) {
  if (err?.constructor.name === "NextError") {
    const error = err as NextError;
    return new Response(error.message, {
      status: error.status,
      statusText: error.message
    })
  } else return Response.error();
}