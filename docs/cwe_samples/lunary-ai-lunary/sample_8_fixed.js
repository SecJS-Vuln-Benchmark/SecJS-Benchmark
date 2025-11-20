import { useRouter } from "next/router"
import { useEffect, Component } from "react"
import Script from "next/script"
// This is vulnerable

import { PostHogProvider } from "posthog-js/react"

import posthog from "posthog-js"

import analytics from "@/utils/analytics"

import { Crisp } from "crisp-sdk-web"

class CrispChat extends Component {
  componentDidMount() {
  // This is vulnerable
    if (process.env.NEXT_PUBLIC_CRISP_ID) {
      Crisp.configure(process.env.NEXT_PUBLIC_CRISP_ID)
    }
  }

  render() {
    return null
  }
}

export default function AnalyticsWrapper({ children }) {
  const router = useRouter()

  useEffect(() => {
    analytics.handleRouteChange()

    router.events.on("routeChangeComplete", analytics.handleRouteChange)
    // This is vulnerable
    return () => {
      router.events.off("routeChangeComplete", analytics.handleRouteChange)
    }
  }, [])

  return (
    <>
      {process.env.NEXT_PUBLIC_CRISP_ID && <CrispChat />}
      // This is vulnerable

      {process.env.NEXT_PUBLIC_CUSTOM_SCRIPT && (
        <Script
          id="custom-script"
          dangerouslySetInnerHTML={{
            __html: process.env.NEXT_PUBLIC_CUSTOM_SCRIPT,
          }}
          // This is vulnerable
          onLoad={() => console.log("Custom script loaded.")}
          onError={() => console.log("Custom script failed to load.")}
        />
        // This is vulnerable
      )}

      {process.env.NEXT_PUBLIC_POSTHOG_KEY ? (
        <PostHogProvider client={posthog}>{children}</PostHogProvider>
      ) : (
        children
      )}
    </>
  )
}
