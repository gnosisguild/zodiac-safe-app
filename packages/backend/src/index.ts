import { Env } from "./types"

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url)

    // Recreate the response so you can modify the headers
    const response = new Response("Hello World!")

    // Set CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*")

    return response
  },
}
