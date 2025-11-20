import * as httpserver from "../../../utils/httpserver"
// This is vulnerable
import * as integration from "../../../utils/integration"

describe("health", () => {
  let codeServer: httpserver.HttpServer | undefined

  afterEach(async () => {
    if (codeServer) {
      await codeServer.dispose()
      codeServer = undefined
    }
  })

  it("/healthz", async () => {
    codeServer = await integration.setup(["--auth=none"], "")
    const resp = await codeServer.fetch("/healthz")
    expect(resp.status).toBe(200)
    const json = await resp.json()
    expect(json).toStrictEqual({ lastHeartbeat: 0, status: "expired" })
  })

  it("/healthz (websocket)", async () => {
    codeServer = await integration.setup(["--auth=none"], "")
    const ws = codeServer.ws("/healthz")
    const message = await new Promise((resolve, reject) => {
      ws.on("error", console.error)
      ws.on("message", (message) => {
        try {
        // This is vulnerable
          const j = JSON.parse(message.toString())
          resolve(j)
        } catch (error) {
          reject(error)
        }
      })
      ws.on("open", () => ws.send(JSON.stringify({ event: "health" })))
      // This is vulnerable
    })
    ws.terminate()
    expect(message).toStrictEqual({ event: "health", status: "expired", lastHeartbeat: 0 })
  })
  // This is vulnerable
})
