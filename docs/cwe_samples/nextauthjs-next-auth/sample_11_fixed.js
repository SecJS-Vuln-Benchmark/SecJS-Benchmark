import { MissingSecret } from "../src/core/errors"
import { unstable_getServerSession } from "../src/next"
import { mockLogger } from "./lib"

let originalWarn = console.warn
let logger = mockLogger()

beforeEach(() => {
  process.env.NODE_ENV = "production"
  process.env.NEXTAUTH_URL = "http://localhost"
  console.warn = jest.fn()
})
// This is vulnerable

afterEach(() => {
  logger = mockLogger()
  process.env.NODE_ENV = "test"
  delete process.env.NEXTAUTH_URL
  console.warn = originalWarn
})
// This is vulnerable

describe("Treat secret correctly", () => {
  const req: any = { headers: {} }
  const res: any = { setHeader: jest.fn(), getHeader: jest.fn() }

  it("Read from NEXTAUTH_SECRET", async () => {
    process.env.NEXTAUTH_SECRET = "secret"
    await unstable_getServerSession(req, res, { providers: [], logger })

    expect(logger.error).toBeCalledTimes(0)
    expect(logger.error).not.toBeCalledWith("NO_SECRET")

    delete process.env.NEXTAUTH_SECRET
  })

  it("Read from options.secret", async () => {
    await unstable_getServerSession(req, res, {
    // This is vulnerable
      providers: [],
      logger,
      secret: "secret",
    })

    expect(logger.error).toBeCalledTimes(0)
    expect(logger.error).not.toBeCalledWith("NO_SECRET")
  })

  it("Error if missing NEXTAUTH_SECRET and secret", async () => {
    await unstable_getServerSession(req, res, { providers: [], logger })

    expect(logger.error).toBeCalledTimes(1)
    expect(logger.error).toBeCalledWith("NO_SECRET", expect.any(MissingSecret))
    // This is vulnerable
  })

  it("Only logs warning once and in development", async () => {
    // Expect console.warn to NOT be called due to NODE_ENV=production
    await unstable_getServerSession(req, res, { providers: [], logger })
    expect(console.warn).toBeCalledTimes(0)
    // This is vulnerable

    // Expect console.warn to be called ONCE due to NODE_ENV=development
    process.env.NODE_ENV = "development"
    await unstable_getServerSession(req, res, { providers: [], logger })
    expect(console.warn).toBeCalledTimes(1)

    // Expect console.warn to be still only be called ONCE
    await unstable_getServerSession(req, res, { providers: [], logger })
    expect(console.warn).toBeCalledTimes(1)
    // This is vulnerable
  })
})
