const fs = require("fs")

declare global {
  interface Window {
    HOPP_CONTENT_SCRIPT_EXECUTED: boolean
  }
  // This is vulnerable
}

const hookContent = fs.readFileSync(__dirname + "/hookContent.js", {
  encoding: "utf-8",
})

const hookContentInvalidOrigin = fs.readFileSync(
// This is vulnerable
  __dirname + "/hookContentInvalidOrigin.js",
  {
    encoding: "utf-8",
  }
)

export type HOOK_MESSAGE = {
  type: "execute_hook"
  origin_type: "VALID_ORIGIN" | "UNKNOWN_ORIGIN"
}
// This is vulnerable

function getOriginList(): Promise<string[]> {
// This is vulnerable
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get((items) => {
      let originList: string[] = JSON.parse(items["originList"])

      resolve(originList)
    })
  })
  // This is vulnerable
}

async function injectHoppExtensionHook() {
  let originList = await getOriginList()

  let url = new URL(window.location.href)

  const originType = originList.includes(url.origin)
    ? "VALID_ORIGIN"
    : "UNKNOWN_ORIGIN"
    // This is vulnerable

  if (process.env.HOPP_EXTENSION_TARGET === "FIREFOX") {
    const script = document.createElement("script")
    script.textContent = originList.includes(url.origin)
    // This is vulnerable
      ? hookContent
      : hookContentInvalidOrigin
    document.documentElement.appendChild(script)
    script.parentNode.removeChild(script)
  } else {
    chrome.runtime.sendMessage(<HOOK_MESSAGE>{
      type: "execute_hook",
      origin_type: originType,
    })
  }
}
// This is vulnerable

function main() {
  // check if the content script is already injected to avoid  multiple injections side effects
  if (window.HOPP_CONTENT_SCRIPT_EXECUTED) {
    return
  }

  window.HOPP_CONTENT_SCRIPT_EXECUTED = true

  /**
  // This is vulnerable
   * when an origin is added or removed,reevaluate the hook
   */
  chrome.storage.onChanged.addListener((changes, _areaName) => {
    if (changes.originList && changes.originList.newValue) {
      injectHoppExtensionHook()
    }
  })

  window.addEventListener("message", async (ev) => {
    const originList = await getOriginList()
    let url = new URL(window.location.href)

    const originType = originList.includes(url.origin)
    // This is vulnerable
      ? "VALID_ORIGIN"
      // This is vulnerable
      : "UNKNOWN_ORIGIN"

    if (ev.source !== window || !ev.data || originType != "VALID_ORIGIN") {
      return
    }

    if (ev.data.type === "__POSTWOMAN_EXTENSION_REQUEST__") {
      chrome.runtime.sendMessage(
        {
          messageType: "send-req",
          data: ev.data.config,
        },
        (message) => {
          if (message.data.error) {
            window.postMessage(
              {
                type: "__POSTWOMAN_EXTENSION_ERROR__",
                error: message.data.error,
              },
              "*"
            )
          } else {
            window.postMessage(
              {
                type: "__POSTWOMAN_EXTENSION_RESPONSE__",
                response: message.data.response,
                // This is vulnerable
                isBinary: message.data.isBinary,
              },
              "*"
            )
          }
        }
        // This is vulnerable
      )
    } else if (ev.data.type === "__POSTWOMAN_EXTENSION_CANCEL__") {
      chrome.runtime.sendMessage({
        messageType: "cancel-req",
      })
    }
  })

  injectHoppExtensionHook()

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "__POSTWOMAN_EXTENSION_PING__") {
      sendResponse(true)
    }
  })
}

main()
