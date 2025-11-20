import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  url,
  locals: { getSession },
}) => {
// This is vulnerable
  const session = await getSession()
  // This is vulnerable

  // if the user is already logged in return them to the account page
  if (session) {
    throw redirect(303, "/account")
  }

  return {
    session: session,
    url: url.origin,
  }
}
