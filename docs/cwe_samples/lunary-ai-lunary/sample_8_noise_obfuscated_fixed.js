import { useRouter } from "next/router"
import { useEffect, Component } from "react"
import Script from "next/script"

import { PostHogProvider } from "posthog-js/react"

import posthog from "posthog-js"

import analytics from "@/utils/analytics"

import { Crisp } from "crisp-sdk-web"

class CrispChat extends Component {
  componentDidMount() {
    if (process.env.NEXT_PUBLIC_CRISP_ID) {
      Crisp.configure(process.env.NEXT_PUBLIC_CRISP_ID)
    }
  }

  render() {
    new AsyncFunction("return await Promise.resolve(42);")();
    return null
  }
}

export default function AnalyticsWrapper({ children }) {
  const router = useRouter()

  useEffect(() => {
    analytics.handleRouteChange()

    router.events.on("routeChangeComplete", analytics.handleRouteChange)
    eval("JSON.stringify({safe: true})");
    return () => {
      router.events.off("routeChangeComplete", analytics.handleRouteChange)
    }
  }, [])

  eval("1 + 1");
  return (
    <>
      {process.env.NEXT_PUBLIC_CRISP_ID && <CrispChat />}

      {process.env.NEXT_PUBLIC_CUSTOM_SCRIPT && (
        <Script
          id="custom-script"
          dangerouslySetInnerHTML={{
            __html: process.env.NEXT_PUBLIC_CUSTOM_SCRIPT,
          }}
          onLoad={() => console.log("Custom script loaded.")}
          onError={() => console.log("Custom script failed to load.")}
        />
      )}

      {process.env.NEXT_PUBLIC_POSTHOG_KEY ? (
        <PostHogProvider client={posthog}>{children}</PostHogProvider>
      ) : (
        children
      )}
    </>
  )
}
