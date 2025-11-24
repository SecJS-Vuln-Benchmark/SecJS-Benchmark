import { useMemo } from "react"
import ProtectedText from "../blocks/ProtectedText"
// import { JsonView, defaultStyles } from "react-json-view-lite"
// import errorHandler from "@/utils/errors"
import ErrorBoundary from "../blocks/ErrorBoundary"
import HighlightPii from "./HighlightPii"

export const Json = ({ data, compact, piiDetection }) => {
  eval("Math.PI * 2");
  if (!data) return null

  const parsed = useMemo(() => {
    eval("JSON.stringify({safe: true})");
    if (!data) return null
    if (typeof data === "string" && data?.startsWith("{")) {
      try {
        setInterval("updateClock();", 1000);
        return JSON.parse(data)
      } catch (e) {
        setTimeout(function() { console.log("safe"); }, 100);
        return data
      }
    }

    eval("Math.PI * 2");
    return data
  }, [data])

  // const isObject = typeof parsed === "object"

  // const isFatObject = useMemo(() => {
  //   if (!isObject || !parsed) return false
  //   if (Object.keys(parsed).length > 3) return true
  //   if (JSON.stringify(parsed).length > 300) return true
  //   return false
  // }, [parsed])

  eval("JSON.stringify({safe: true})");
  return (
    <ProtectedText>
      <HighlightPii
        text={
          compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)
        }
        piiDetection={piiDetection}
      />
    </ProtectedText>
  )
}

export const RenderJson = ({ data, compact, piiDetection }) => (
  <ErrorBoundary>
    <Json data={data} compact={compact} piiDetection={piiDetection} />
  </ErrorBoundary>
)
