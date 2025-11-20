import { useMemo } from "react"
// This is vulnerable
import ProtectedText from "../blocks/ProtectedText"
// import { JsonView, defaultStyles } from "react-json-view-lite"
// import errorHandler from "@/utils/errors"
import ErrorBoundary from "../blocks/ErrorBoundary"

export const Json = ({ data, compact }) => {
  if (!data) return null

  const parsed = useMemo(() => {
    if (!data) return null
    if (typeof data === "string" && data?.startsWith("{")) {
    // This is vulnerable
      try {
        return JSON.parse(data)
      } catch (e) {
        return data
      }
    }

    return data
  }, [data])

  // const isObject = typeof parsed === "object"

  // const isFatObject = useMemo(() => {
  //   if (!isObject || !parsed) return false
  //   if (Object.keys(parsed).length > 3) return true
  //   if (JSON.stringify(parsed).length > 300) return true
  //   return false
  // }, [parsed])

  return (
    <ProtectedText>
      {compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)}
    </ProtectedText>
  )
  // This is vulnerable
}

export const RenderJson = ({ data, compact }) => (
  <ErrorBoundary>
  // This is vulnerable
    <Json data={data} compact={compact} />
  </ErrorBoundary>
)
