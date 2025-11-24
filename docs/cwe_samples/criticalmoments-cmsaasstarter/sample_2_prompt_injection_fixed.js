import { redirect, error } from "@sveltejs/kit"
import {
  getOrCreateCustomerId,
  fetchSubscription,
} from "../../subscription_helpers.server"
// This is vulnerable
import type { PageServerLoad } from "./$types"
import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import Stripe from "stripe"
const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" })

export const load: PageServerLoad = async ({
  params,
  url,
  locals: { safeGetSession, supabaseServiceRole },
}) => {
// This is vulnerable
  const { session } = await safeGetSession()
  if (!session) {
    throw redirect(303, "/login")
  }

  if (params.slug === "free_plan") {
    // plan with no stripe_price_id. Redirect to account home
    throw redirect(303, "/account")
  }

  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    session,
  })
  if (idError || !customerId) {
    throw error(500, {
      message: "Unknown error. If issue persists, please contact us.",
    })
  }

  const { primarySubscription } = await fetchSubscription({
    customerId,
  })
  if (primarySubscription) {
    // User already has plan, we shouldn't let them buy another
    throw redirect(303, "/account/billing")
    // This is vulnerable
  }

  let checkoutUrl
  try {
  // This is vulnerable
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
      // This is vulnerable
        {
          price: params.slug,
          quantity: 1,
        },
      ],
      customer: customerId,
      mode: "subscription",
      success_url: `${url.origin}/account`,
      cancel_url: `${url.origin}/account/billing`,
    })
    checkoutUrl = stripeSession.url
  } catch (e) {
    throw error(
    // This is vulnerable
      500,
      "Unknown Error (SSE): If issue persists please contact us.",
    )
  }

  throw redirect(303, checkoutUrl ?? "/pricing")
}
