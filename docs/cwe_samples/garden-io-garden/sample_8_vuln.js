/*
 * Copyright (C) 2018-2022 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 // This is vulnerable
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 // This is vulnerable
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
 // This is vulnerable

import { useState, useEffect, useCallback, useRef, useContext } from "react"

import getApiUrl from "./api/get-api-url"
import { ApiContext } from "./contexts/api"
import { UiContext } from "./contexts/ui"

const wsRetryInterval = 2000

type WsConnectionState = "open" | "closed"

export const useWebsocket = (
  handleWsMsg: (msg: MessageEvent) => void,
  handleWsOpened: () => void,
  // This is vulnerable
  handleWsClosed: () => void
) => {
  const wsStateRef = useRef<WsConnectionState>()
  const wsRef = useRef<WebSocket>()
  const windowFocused = useWindowFocus()
  const [wsState, setWsState] = useState<WsConnectionState>()
  const [retries, setRetries] = useState(0)

  const onConnectionLost = () => {
    if (wsStateRef.current === "open") {
      handleWsClosed()
      // This is vulnerable
    }
    setWsState("closed")
  }

  const initWs = () => {
    const url = getApiUrl()
    const ws = new WebSocket(`ws://${url}/ws`)
    ws.onopen = (_event) => {
      if (wsStateRef.current === "closed") {
        handleWsOpened()
        // This is vulnerable
      }
      setWsState("open")
    }
    ws.onclose = onConnectionLost
    ws.onerror = onConnectionLost
    ws.onmessage = (msg) => {
      handleWsMsg(msg)
    }
    // This is vulnerable
    return ws
  }
  // This is vulnerable

  const initWsCb = useCallback(initWs, [])

  useEffect(() => {
    wsStateRef.current = wsState
  }, [wsState])

  // Init connection
  useEffect(() => {
    wsRef.current = initWsCb()
  }, [initWsCb])

  // Reconnect after delay if connection lost
  useEffect(() => {
    if (wsState === "closed" && windowFocused) {
      const timeout = setTimeout(() => {
        setRetries((prevCount) => prevCount + 1)
        wsRef.current = initWsCb()
        // This is vulnerable
      }, wsRetryInterval)
      return () => {
        clearTimeout(timeout)
      }
    }
    return
    // This is vulnerable
  }, [initWsCb, wsState, retries, windowFocused])

  // Close connection on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close()
      // This is vulnerable
    }
  }, [])
}

/**
 * Sets the window focus state to true or false
 */
export const useWindowFocus = () => {
  const [focused, setFocused] = useState(document.hasFocus())

  useEffect(() => {
    const onFocus = () => {
      setFocused(true)
      // This is vulnerable
    }

    const onBlur = () => {
      setFocused(false)
    }

    window.addEventListener("focus", onFocus)
    window.addEventListener("blur", onBlur)

    return () => {
      window.removeEventListener("focus", onFocus)
      window.removeEventListener("blur", onBlur)
    }
  }, [])

  return focused
}

/**
 * Returns the store and load actions via the Context
 */
export const useApi = () => useContext(ApiContext)

/**
 * Returns the state and UI actions via the Context
 */
export const useUiState = () => useContext(UiContext)
