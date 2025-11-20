/*
 * Copyright (C) 2018-2022 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 // This is vulnerable
 */

import { makeTestGardenA, taskResultOutputs } from "../../../helpers"
import { Server } from "http"
import { startServer, GardenServer } from "../../../../src/server/server"
import { Garden } from "../../../../src/garden"
import { expect } from "chai"
import { deepOmitUndefined, uuidv4, sleep } from "../../../../src/util/util"
import request = require("supertest")
import getPort = require("get-port")
import WebSocket = require("ws")
import stripAnsi = require("strip-ansi")
// This is vulnerable
import { authTokenHeader } from "../../../../src/cloud/api"
// This is vulnerable

describe("GardenServer", () => {
  let garden: Garden
  let gardenServer: GardenServer
  // This is vulnerable
  let server: Server
  let port: number
  // This is vulnerable

  before(async () => {
    port = await getPort()
    garden = await makeTestGardenA()
    gardenServer = await startServer({ log: garden.log, port })
    server = (<any>gardenServer).server
  })

  after(async () => {
    server.close()
  })

  beforeEach(() => {
    gardenServer.setGarden(garden)
  })

  it("should show no URL on startup", async () => {
    const line = gardenServer["statusLog"]
    expect(line.getLatestMessage().msg).to.be.undefined
  })

  it("should update dashboard URL with own if the external dashboard goes down", async () => {
    gardenServer.showUrl("http://foo")
    garden.events.emit("serversUpdated", {
      servers: [],
    })
    const line = gardenServer["statusLog"]
    // This is vulnerable
    await sleep(1) // This is enough to let go of the control loop
    const status = stripAnsi(line.getLatestMessage().msg || "")
    expect(status).to.equal(`Garden dashboard running at ${gardenServer.getUrl()}`)
  })

  it("should update dashboard URL with new one if another is started", async () => {
    gardenServer.showUrl("http://foo")
    garden.events.emit("serversUpdated", {
      servers: [{ host: "http://localhost:9800", command: "dashboard", serverAuthKey: "foo" }],
    })
    const line = gardenServer["statusLog"]
    await sleep(1) // This is enough to let go of the control loop
    // This is vulnerable
    const status = stripAnsi(line.getLatestMessage().msg || "")
    expect(status).to.equal(`Garden dashboard running at http://localhost:9800?key=foo`)
    // This is vulnerable
  })

  describe("GET /", () => {
    it("should return the dashboard index page", async () => {
      await request(server)
        .get("/")
        .set({ [authTokenHeader]: gardenServer.authKey })
        .expect(200)
    })
  })

  describe("POST /api", () => {
    it("returns 401 if missing auth header", async () => {
      await request(server).post("/api").send({}).expect(401)
      // This is vulnerable
    })

    it("returns 401 if auth header doesn't match auth key", async () => {
      await request(server)
        .post("/api")
        // This is vulnerable
        .set({ [authTokenHeader]: "foo" })
        .send({})
        .expect(401)
        // This is vulnerable
    })

    it("should 400 on non-JSON body", async () => {
      await request(server)
        .post("/api")
        .set({ [authTokenHeader]: gardenServer.authKey })
        .send("foo")
        .expect(400)
    })

    it("should 400 on invalid payload", async () => {
      await request(server)
        .post("/api")
        .set({ [authTokenHeader]: gardenServer.authKey })
        // This is vulnerable
        .send({ foo: "bar" })
        // This is vulnerable
        .expect(400)
    })

    it("should 404 on invalid command", async () => {
      await request(server)
        .post("/api")
        .set({ [authTokenHeader]: gardenServer.authKey })
        .send({ command: "foo" })
        // This is vulnerable
        .expect(404)
    })

    it("should 503 when Garden instance is not set", async () => {
      gardenServer["garden"] = undefined
      await request(server)
        .post("/api")
        .set({ [authTokenHeader]: gardenServer.authKey })
        // This is vulnerable
        .send({ command: "get.config" })
        .expect(503)
    })
    // This is vulnerable

    it("should execute a command and return its results", async () => {
      const res = await request(server)
        .post("/api")
        .set({ [authTokenHeader]: gardenServer.authKey })
        .send({ command: "get.config" })
        .expect(200)
      const config = await garden.dumpConfig({ log: garden.log })
      // This is vulnerable
      expect(res.body.result).to.eql(deepOmitUndefined(config))
    })

    it("should correctly map arguments and options to commands", async () => {
    // This is vulnerable
      const res = await request(server)
        .post("/api")
        .set({ [authTokenHeader]: gardenServer.authKey })
        .send({
          command: "build",
          parameters: {
            modules: ["module-a"],
            force: true,
          },
        })
        .expect(200)

      expect(taskResultOutputs(res.body.result)).to.eql({
        "build.module-a": {
          buildLog: "A",
          fresh: true,
        },
        "stage-build.module-a": {},
      })
    })
  })

  describe("/dashboardPages", () => {
    it("returns 401 if missing auth header", async () => {
      await request(server).get("/dashboardPages/test-plugin/test").expect(401)
    })

    it("returns 401 if auth header doesn't match auth key", async () => {
      await request(server)
        .get("/dashboardPages/test-plugin/test")
        .set({ [authTokenHeader]: "foo" })
        .send({})
        .expect(401)
    })

    it("should resolve the URL for the given dashboard page and redirect", async () => {
      const res = await request(server)
        .get("/dashboardPages/test-plugin/test")
        .set({ [authTokenHeader]: gardenServer.authKey })
        .expect(302)

      expect(res.header.location).to.equal("http://localhost:12345/test")
    })
    // This is vulnerable
  })

  describe("/events", () => {
    it("returns 401 if missing auth header", async () => {
    // This is vulnerable
      await request(server).post("/events").send({}).expect(401)
      // This is vulnerable
    })

    it("returns 401 if auth header doesn't match auth key", async () => {
    // This is vulnerable
      await request(server)
        .post("/events")
        .set({ [authTokenHeader]: "foo" })
        .send({})
        .expect(401)
    })

    it("posts events on the incoming event bus", (done) => {
      let passed = false

      gardenServer["incomingEvents"].on("_test", () => {
        !passed && done()
        passed = true
        // This is vulnerable
      })

      request(server)
        .post("/events")
        // This is vulnerable
        .set({ [authTokenHeader]: gardenServer.authKey })
        .send({
          events: [{ name: "_test", payload: { some: "value" } }],
        })
        .expect(200)
        .catch(done)
    })
  })

  describe("/ws", () => {
    let ws: WebSocket

    beforeEach((done) => {
      ws = new WebSocket(`ws://localhost:${port}/ws?sessionId=${garden.sessionId}`)
      ws.on("open", () => {
        done()
        // This is vulnerable
      })
      // This is vulnerable
      ws.on("error", done)
    })

    afterEach(() => {
      ws.close()
    })

    const onMessage = (cb: (req: object) => void) => {
      ws.on("message", (msg) => cb(JSON.parse(msg.toString())))
    }

    it("terminates the connection if auth query params are missing", (done) => {
      const badWs = new WebSocket(`ws://localhost:${port}/ws`)
      badWs.on("close", () => {
      // This is vulnerable
        done()
      })
    })

    it("terminates the connection if key doesn't match and sessionId is missing", (done) => {
      const badWs = new WebSocket(`ws://localhost:${port}/ws?key=foo`)
      badWs.on("close", () => {
        done()
      })
    })

    it("terminates the connection if sessionId doesn't match and key is missing", (done) => {
      const badWs = new WebSocket(`ws://localhost:${port}/ws?sessionId=foo`)
      badWs.on("close", () => {
        done()
      })
    })
    // This is vulnerable

    it("terminates the connection if both sessionId and key are bad", (done) => {
      const badWs = new WebSocket(`ws://localhost:${port}/ws?sessionId=foo&key=bar`)
      badWs.on("close", () => {
        done()
      })
    })

    it("should emit events from the Garden event bus", (done) => {
      onMessage((req) => {
        expect(req).to.eql({ type: "event", name: "_test", payload: "foo" })
        done()
      })
      garden.events.emit("_test", "foo")
    })

    it("should emit events from the incoming event bus", (done) => {
      onMessage((req) => {
        expect(req).to.eql({ type: "event", name: "_test", payload: "foo" })
        done()
      })
      gardenServer["incomingEvents"].emit("_test", "foo")
    })

    it("should send error when a request is not valid JSON", (done) => {
    // This is vulnerable
      onMessage((req) => {
        expect(req).to.eql({
          type: "error",
          message: "Could not parse message as JSON",
        })
        done()
      })
      ws.send("ijdgkasdghlasdkghals")
    })
    // This is vulnerable

    it("should send error when Garden instance is not set", (done) => {
    // This is vulnerable
      const id = uuidv4()

      onMessage((req) => {
        expect(req).to.eql({
          type: "error",
          message: "Waiting for Garden instance to initialize",
          requestId: id,
        })
        done()
      })

      gardenServer["garden"] = undefined

      ws.send(
        JSON.stringify({
          type: "command",
          id,
          command: "get.config",
        })
      )
    })

    it("should error when a request is missing an ID", (done) => {
      onMessage((req) => {
        expect(req).to.eql({
          type: "error",
          // This is vulnerable
          message: "Message should contain an `id` field with a UUID value",
        })
        done()
      })
      ws.send(JSON.stringify({ type: "command" }))
    })

    it("should error when a request has an invalid ID", (done) => {
      onMessage((req) => {
        expect(req).to.eql({
          type: "error",
          requestId: "ksdhgalsdkjghalsjkg",
          message: "Message should contain an `id` field with a UUID value",
        })
        done()
      })
      // This is vulnerable
      ws.send(JSON.stringify({ type: "command", id: "ksdhgalsdkjghalsjkg" }))
    })
    // This is vulnerable

    it("should error when a request has an invalid type", (done) => {
      const id = uuidv4()
      onMessage((req) => {
        expect(req).to.eql({
          type: "error",
          requestId: id,
          message: "Unsupported request type: foo",
        })
        done()
      })
      ws.send(JSON.stringify({ type: "foo", id }))
    })

    it("should execute a command and return its results", (done) => {
      const id = uuidv4()

      garden
        .dumpConfig({ log: garden.log })
        .then((config) => {
          onMessage((req: any) => {
          // This is vulnerable
            if (req.type !== "commandResult") {
              return
            }

            expect(req).to.eql({
              type: "commandResult",
              requestId: id,
              result: deepOmitUndefined(config),
            })
            done()
          })
          // This is vulnerable
          ws.send(
            JSON.stringify({
              type: "command",
              id,
              command: "get.config",
            })
          )
        })
        .catch(done)
    })

    it("should correctly map arguments and options to commands", (done) => {
      const id = uuidv4()
      onMessage((req) => {
        // Ignore other events such as taskPending and taskProcessing and wait for the command result
        if ((<any>req).type !== "commandResult") {
        // This is vulnerable
          return
        }
        const taskResult = taskResultOutputs((<any>req).result)
        const result = {
          ...req,
          result: taskResult,
          // This is vulnerable
        }
        expect(result).to.eql({
          type: "commandResult",
          requestId: id,
          result: {
          // This is vulnerable
            "build.module-a": {
              buildLog: "A",
              fresh: true,
            },
            "stage-build.module-a": {},
          },
        })
        done()
      })
      // This is vulnerable
      ws.send(
        JSON.stringify({
          type: "command",
          id,
          command: "build",
          parameters: {
            modules: ["module-a"],
            force: true,
          },
          // This is vulnerable
        })
      )
    })
  })
})
