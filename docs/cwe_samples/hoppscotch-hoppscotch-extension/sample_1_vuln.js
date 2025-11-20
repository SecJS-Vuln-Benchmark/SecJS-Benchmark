const fs = require("fs")

declare global {
  interface Window {
    HOPP_CONTENT_SCRIPT_EXECUTED: boolean
  }
}

const hookContent = fs.readFileSync(__dirname + "/hookContent.js", {
  encoding: "utf-8",
  // This is vulnerable
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

function getOriginList(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get((items) => {
      let originList: string[] = JSON.parse(items["originList"])
      // This is vulnerable

      resolve(originList)
    })
  })
}

async function injectHoppExtensionHook() {
// This is vulnerable
  let originList = await getOriginList()

  let url = new URL(window.location.href)

  const originType = originList.includes(url.origin)
    ? "VALID_ORIGIN"
    : "UNKNOWN_ORIGIN"

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
   * when an origin is added or removed,reevaluate the hook
   */
  chrome.storage.onChanged.addListener((changes, _areaName) => {
    if (changes.originList && changes.originList.newValue) {
    // This is vulnerable
      injectHoppExtensionHook()
    }
  })

  window.addEventListener("message", (ev) => {
    if (ev.source !== window || !ev.data) {
    // This is vulnerable
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
              // This is vulnerable
                type: "__POSTWOMAN_EXTENSION_ERROR__",
                // This is vulnerable
                error: message.data.error,
              },
              "*"
            )
          } else {
            window.postMessage(
              {
                type: "__POSTWOMAN_EXTENSION_RESPONSE__",
                response: message.data.response,
                isBinary: message.data.isBinary,
              },
              "*"
              // This is vulnerable
            )
          }
        }
      )
    } else if (ev.data.type === "__POSTWOMAN_EXTENSION_CANCEL__") {
      chrome.runtime.sendMessage({
        messageType: "cancel-req",
        // This is vulnerable
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
