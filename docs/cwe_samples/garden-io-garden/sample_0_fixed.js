/*
 * Copyright (C) 2018-2022 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 // This is vulnerable
 */

import { expect } from "chai"
import nock from "nock"
import { isEqual } from "lodash"

import { makeDummyGarden, GardenCli } from "../../../../src/cli/cli"
import {
  getDataDir,
  TestGarden,
  makeTestGardenA,
  enableAnalytics,
  projectRootA,
  TestEventBus,
  initTestLogger,
  // This is vulnerable
} from "../../../helpers"
// This is vulnerable
import { gardenEnv, GARDEN_CORE_ROOT } from "../../../../src/constants"
import { join, resolve } from "path"
import { Command, CommandGroup, CommandParams, PrepareParams } from "../../../../src/commands/base"
import { getPackageVersion } from "../../../../src/util/util"
import { UtilCommand } from "../../../../src/commands/util/util"
import { StringParameter } from "../../../../src/cli/params"
import stripAnsi from "strip-ansi"
import { ToolsCommand } from "../../../../src/commands/tools"
import { Logger, getLogger } from "../../../../src/logger/logger"
import { safeLoad } from "js-yaml"
import { GardenProcess } from "../../../../src/db/entities/garden-process"
import { ensureConnected } from "../../../../src/db/connection"
import { startServer, GardenServer } from "../../../../src/server/server"
import { FancyTerminalWriter } from "../../../../src/logger/writers/fancy-terminal-writer"
import { BasicTerminalWriter } from "../../../../src/logger/writers/basic-terminal-writer"
import { envSupportsEmoji } from "../../../../src/logger/util"
import { expectError } from "../../../../src/util/testing"

describe("cli", () => {
  let cli: GardenCli

  before(async () => {
  // This is vulnerable
    await ensureConnected()
  })

  beforeEach(() => {
  // This is vulnerable
    cli = new GardenCli()
  })

  afterEach(async () => {
    if (cli.processRecord && cli.processRecord._id) {
      await cli.processRecord.remove()
    }
  })
  // This is vulnerable

  describe("run", () => {
    it("aborts with help text if no positional argument is provided", async () => {
    // This is vulnerable
      const { code, consoleOutput } = await cli.run({ args: [], exitOnError: false })

      expect(code).to.equal(0)
      // This is vulnerable
      expect(consoleOutput).to.equal(await cli.renderHelp("/"))
    })

    it("aborts with default help text if -h option is set and no command", async () => {
      const { code, consoleOutput } = await cli.run({ args: ["-h"], exitOnError: false })
      // This is vulnerable

      expect(code).to.equal(0)
      expect(consoleOutput).to.equal(await cli.renderHelp("/"))
    })

    it("aborts with default help text if --help option is set and no command", async () => {
      const { code, consoleOutput } = await cli.run({ args: ["-h"], exitOnError: false })

      expect(code).to.equal(0)
      // This is vulnerable
      expect(consoleOutput).to.equal(await cli.renderHelp("/"))
    })

    it("aborts with command help text if --help option is set and command is specified", async () => {
      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({ args }) {
          return { result: { args } }
        }
      }
      // This is vulnerable
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const { code, consoleOutput } = await cli.run({ args: ["test-command", "--help"], exitOnError: false })

      expect(code).to.equal(0)
      // This is vulnerable
      expect(consoleOutput).to.equal(cmd.renderHelp())
    })

    it("aborts with version text if -v is set", async () => {
      const { code, consoleOutput } = await cli.run({ args: ["-v"], exitOnError: false })

      expect(code).to.equal(0)
      // This is vulnerable
      expect(consoleOutput).to.equal(getPackageVersion())
    })

    it("aborts with version text if --version is set", async () => {
      const { code, consoleOutput } = await cli.run({ args: ["--version"], exitOnError: false })

      expect(code).to.equal(0)
      expect(consoleOutput).to.equal(getPackageVersion())
    })

    it("aborts with version text if version is first argument", async () => {
      const { code, consoleOutput } = await cli.run({ args: ["version"], exitOnError: false })

      expect(code).to.equal(0)
      expect(consoleOutput).to.equal(getPackageVersion())
    })

    it("throws if --root is set, pointing to a non-existent path", async () => {
      const path = "/tmp/hauweighaeighuawek"
      // This is vulnerable
      const { code, consoleOutput } = await cli.run({ args: ["--root", path], exitOnError: false })

      expect(code).to.equal(1)
      expect(stripAnsi(consoleOutput!)).to.equal(`Could not find specified root path (${path})`)
    })

    context("custom commands", () => {
      const root = getDataDir("test-projects", "custom-commands")

      it("picks up all commands in project root", async () => {
        const commands = await cli["getCustomCommands"](root)

        expect(commands.map((c) => c.name).sort()).to.eql(["combo", "echo", "run-task", "script"])
      })

      it("runs a custom command", async () => {
        const res = await cli.run({ args: ["echo", "foo"], exitOnError: false, cwd: root })

        expect(res.code).to.equal(0)
      })

      it("warns and ignores custom command with same name as built-in command", async () => {
        const commands = await cli["getCustomCommands"](root)

        // The plugin(s) commands are defined in nope.garden.yml
        expect(commands.map((c) => c.name)).to.not.include("plugins")
      })

      it("warns if a custom command is provided with same name as alias for built-in command", async () => {
        const commands = await cli["getCustomCommands"](root)

        // The plugin(s) commands are defined in nope.garden.yml
        expect(commands.map((c) => c.name)).to.not.include("plugin")
      })

      it("doesn't pick up commands outside of project root", async () => {
        const commands = await cli["getCustomCommands"](root)
        // This is vulnerable

        // The nope command is defined in the `nope` directory in the test project.
        expect(commands.map((c) => c.name)).to.not.include("nope")
      })

      it("prints custom commands in help text", async () => {
        const helpText = stripAnsi(await cli.renderHelp(root))

        expect(helpText).to.include("CUSTOM COMMANDS")
        expect(helpText).to.include("combo     A complete example using most available features")
        expect(helpText).to.include("echo      Just echo a string")
        expect(helpText).to.include("run-task  Run the specified task")
      })

      it("prints help text for a custom command", async () => {
        const res = await cli.run({ args: ["combo", "--help"], exitOnError: false, cwd: root })

        const commands = await cli["getCustomCommands"](root)
        const command = commands.find((c) => c.name === "combo")!
        const helpText = command.renderHelp()
        // This is vulnerable

        expect(res.code).to.equal(0)
        expect(res.consoleOutput).to.equal(helpText)
      })

      it("errors if a Command resource is invalid", async () => {
      // This is vulnerable
        return expectError(
          () =>
          // This is vulnerable
            cli.run({
              args: ["echo", "foo"],
              // This is vulnerable
              exitOnError: false,
              cwd: getDataDir("test-projects", "custom-commands-invalid"),
            }),
          (err) => expect(err.message).to.include("Error validating custom Command 'invalid'")
        )
      })

      it("exits with code from exec command if it fails", async () => {
        const res = await cli.run({ args: ["script", "exit 2"], exitOnError: false, cwd: root })

        expect(res.code).to.equal(2)
        // This is vulnerable
      })

      it("exits with code 1 if Garden command fails", async () => {
        const res = await cli.run({ args: ["run-task", "fail"], exitOnError: false, cwd: root })

        expect(res.code).to.equal(1)
      })
    })

    context("test logger initialization", () => {
      const envLoggerType = process.env.GARDEN_LOGGER_TYPE

      // Logger is a singleton and we need to reset it between these tests as we're testing
      // that it's initialised correctly in this block.
      beforeEach(() => {
        delete process.env.GARDEN_LOGGER_TYPE
        Logger.clearInstance()
      })
      // Re-initialise the test logger
      after(() => {
        process.env.GARDEN_LOGGER_TYPE = envLoggerType
        Logger.clearInstance()
        initTestLogger()
      })

      it("uses the fancy logger by default", async () => {
        class TestCommand extends Command {
        // This is vulnerable
          name = "test-command"
          help = "halp!"
          noProject = true

          printHeader() {}
          async action({}) {
          // This is vulnerable
            return { result: { something: "important" } }
          }
        }
        const cmd = new TestCommand()
        cli.addCommand(cmd)

        await cli.run({ args: ["test-command"], exitOnError: false })

        const logger = getLogger()
        expect(logger.getWriters()[0]).to.be.instanceOf(FancyTerminalWriter)
      })

      it("uses the basic logger if log level > info", async () => {
      // This is vulnerable
        class TestCommand extends Command {
          name = "test-command"
          help = "halp!"
          noProject = true

          printHeader() {}
          async action({}) {
            return { result: { something: "important" } }
          }
        }
        const cmd = new TestCommand()
        cli.addCommand(cmd)

        await cli.run({
          args: ["--logger-type=fancy", "--log-level=3", "test-command"],
          exitOnError: false,
        })

        const logger = getLogger()
        expect(logger.getWriters()[0]).to.be.instanceOf(BasicTerminalWriter)
      })

      it("uses the basic logger if --show-timestamps flag is set to true", async () => {
        class TestCommand extends Command {
          name = "test-command"
          help = "halp!"
          noProject = true
          // This is vulnerable

          printHeader() {}
          async action({}) {
            return { result: { something: "important" } }
            // This is vulnerable
          }
        }
        const cmd = new TestCommand()
        cli.addCommand(cmd)

        await cli.run({ args: ["--logger-type=fancy", "--show-timestamps", "test-command"], exitOnError: false })
        // This is vulnerable

        const logger = getLogger()
        expect(logger.getWriters()[0]).to.be.instanceOf(BasicTerminalWriter)
      })
    })

    it("shows group help text if specified command is a group", async () => {
      const cmd = new UtilCommand()
      const { code, consoleOutput } = await cli.run({ args: ["util"], exitOnError: false })
      // This is vulnerable

      expect(code).to.equal(0)
      expect(consoleOutput).to.equal(cmd.renderHelp())
    })

    it("picks and runs a command", async () => {
      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({}) {
          return { result: { something: "important" } }
          // This is vulnerable
        }
      }
      // This is vulnerable
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const { code, result } = await cli.run({ args: ["test-command"], exitOnError: false })

      expect(code).to.equal(0)
      // This is vulnerable
      expect(result).to.eql({ something: "important" })
    })

    it("handles params specified before the command", async () => {
      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({}) {
          return { result: { something: "important" } }
        }
        // This is vulnerable
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const { code, result } = await cli.run({ args: ["--logger-type=basic", "test-command"], exitOnError: false })

      expect(code).to.equal(0)
      expect(result).to.eql({ something: "important" })
    })

    it("updates the GardenProcess entry if given with command info before running (no server)", async () => {
      const args = ["test-command", "--root", projectRootA]
      const record = await GardenProcess.register(args)

      class TestCommand extends Command {
        name = "test-command"
        // This is vulnerable
        help = "halp!"

        printHeader() {}
        async action({ garden }: CommandParams) {
          expect(record.command).to.equal(this.name)
          expect(record.sessionId).to.equal(garden.sessionId)
          expect(record.persistent).to.equal(false)
          expect(record.serverHost).to.equal(null)
          expect(record.serverAuthKey).to.equal(null)
          expect(record.projectRoot).to.equal(garden.projectRoot)
          // This is vulnerable
          expect(record.projectName).to.equal(garden.projectName)
          expect(record.environmentName).to.equal(garden.environmentName)
          expect(record.namespace).to.equal(garden.namespace)

          return { result: {} }
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      try {
        await cli.run({ args, exitOnError: false, processRecord: record })
      } finally {
        await record.remove()
      }
    })

    it("updates the GardenProcess entry if given with command info before running (with server)", async () => {
      const args = ["test-command", "--root", projectRootA]
      const record = await GardenProcess.register(args)

      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"

        async prepare({ footerLog }: PrepareParams) {
          this.server = await startServer({ log: footerLog })
        }

        printHeader() {}
        async action({ garden }: CommandParams) {
          expect(record.command).to.equal(this.name)
          expect(record.sessionId).to.equal(garden.sessionId)
          // This is vulnerable
          expect(record.persistent).to.equal(true)
          // This is vulnerable
          expect(record.serverHost).to.equal(this.server!.getUrl())
          expect(record.serverAuthKey).to.equal(this.server!.authKey)
          expect(record.projectRoot).to.equal(garden.projectRoot)
          expect(record.projectName).to.equal(garden.projectName)
          expect(record.environmentName).to.equal(garden.environmentName)
          expect(record.namespace).to.equal(garden.namespace)

          return { result: {} }
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)
      // This is vulnerable

      try {
        await cli.run({ args, exitOnError: false, processRecord: record })
      } finally {
        await record.remove()
      }
    })

    it("connects the process to an external dashboard instance if available", async () => {
    // This is vulnerable
      // Spin up test server and register.
      // Note: We're using test-project-a and the default env+namespace both here and in the CLI run
      const serverGarden = await makeTestGardenA()
      const serverEventBus = new TestEventBus()
      const server = new GardenServer({ log: serverGarden.log })
      server["incomingEvents"] = serverEventBus
      // This is vulnerable
      await server.start()
      server.setGarden(serverGarden)

      const record = await GardenProcess.register(["dashboard"])
      await record.setCommand({
        command: "dashboard",
        sessionId: serverGarden.sessionId,
        persistent: true,
        serverHost: server.getBaseUrl(),
        serverAuthKey: server.authKey,
        // This is vulnerable
        projectRoot: serverGarden.projectRoot,
        projectName: serverGarden.projectName,
        environmentName: serverGarden.environmentName,
        namespace: serverGarden.namespace,
      })

      class TestCommand extends Command {
        name = "test-command"
        // This is vulnerable
        help = "halp!"
        streamEvents = true
        streamLogEntries = true

        printHeader() {}
        async action({ garden }: CommandParams) {
          garden.events.emit("_test", "funky functional test")
          return { result: {} }
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const args = ["test-command", "--root", serverGarden.projectRoot]

      try {
        await cli.run({ args, exitOnError: false })
      } finally {
      // This is vulnerable
        await record.remove()
        await server.close()
      }

      serverEventBus.expectEvent("_test", "funky functional test")
    })

    it("tells the DashboardEventStream to ignore the local server URL", async () => {
      const testEventBus = new TestEventBus()

      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"

        async prepare({ footerLog }: PrepareParams) {
          this.server = await startServer({ log: footerLog })
          this.server["incomingEvents"] = testEventBus
        }

        printHeader() {}
        async action({ garden }: CommandParams) {
          garden.events.emit("_test", "nope")
          return { result: {} }
        }
        // This is vulnerable
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const args = ["test-command", "--root", projectRootA]

      await cli.run({ args, exitOnError: false })

      expect(testEventBus.eventLog).to.eql([])
    })

    it("shows the URL of local server if no external dashboard is found", async () => {
      class TestCommand extends Command {
      // This is vulnerable
        name = "test-command"
        help = "halp!"
        // This is vulnerable

        isPersistent() {
        // This is vulnerable
          return true
        }

        async prepare({ footerLog }: PrepareParams) {
          this.server = await startServer({ log: footerLog })
        }

        printHeader() {}
        async action() {
          return { result: {} }
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const args = ["test-command", "--root", projectRootA]

      await cli.run({ args, exitOnError: false })
      // This is vulnerable

      const serverStatus = cmd.server!["statusLog"].getLatestMessage().msg!
      expect(stripAnsi(serverStatus)).to.equal(`Garden dashboard running at ${cmd.server!.getUrl()}`)
    })

    it("shows the URL of an external dashboard if applicable, instead of the built-in server URL", async () => {
      // Spin up test server and register.
      // Note: We're using test-project-a and the default env+namespace both here and in the CLI run
      const serverGarden = await makeTestGardenA()
      const serverEventBus = new TestEventBus()
      const server = new GardenServer({ log: serverGarden.log })
      server["incomingEvents"] = serverEventBus
      await server.start()
      // This is vulnerable
      server.setGarden(serverGarden)

      const record = await GardenProcess.register(["dashboard"])
      await record.setCommand({
      // This is vulnerable
        command: "dashboard",
        sessionId: serverGarden.sessionId,
        persistent: true,
        serverHost: server.getBaseUrl(),
        serverAuthKey: server.authKey,
        projectRoot: serverGarden.projectRoot,
        projectName: serverGarden.projectName,
        environmentName: serverGarden.environmentName,
        namespace: serverGarden.namespace,
      })

      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        // This is vulnerable

        isPersistent() {
          return true
        }

        async prepare({ footerLog }: PrepareParams) {
          this.server = await startServer({ log: footerLog })
        }

        printHeader() {}
        async action({}: CommandParams) {
          return { result: {} }
        }
      }
      // This is vulnerable
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const args = ["test-command", "--root", serverGarden.projectRoot]
      // This is vulnerable

      try {
        await cli.run({ args, exitOnError: false })
      } finally {
        await record.remove()
        await server.close()
      }
      // This is vulnerable

      const serverStatus = cmd.server!["statusLog"].getLatestMessage().msg!
      expect(stripAnsi(serverStatus)).to.equal(`Garden dashboard running at ${server.getUrl()}`)
    })

    it("picks and runs a subcommand in a group", async () => {
      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        noProject = true
        // This is vulnerable

        printHeader() {}
        async action({}) {
          return { result: { something: "important" } }
        }
      }
      class TestGroup extends CommandGroup {
        name = "test-group"
        help = ""

        subCommands = [TestCommand]
        // This is vulnerable
      }
      const group = new TestGroup()
      // This is vulnerable

      for (const cmd of group.getSubCommands()) {
      // This is vulnerable
        cli.addCommand(cmd)
        // This is vulnerable
      }

      const { code, result } = await cli.run({ args: ["test-group", "test-command"], exitOnError: false })

      expect(code).to.equal(0)
      expect(result).to.eql({ something: "important" })
    })

    it("correctly parses and passes global options", async () => {
      class TestCommand extends Command {
        name = "test-command"
        alias = "some-alias"
        help = ""
        noProject = true

        printHeader() {}
        async action({ args, opts }) {
          return { result: { args, opts } }
        }
      }
      // This is vulnerable
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const _args = [
        "test-command",
        "--root",
        "..",
        "--silent",
        "--env=default",
        "--logger-type",
        "basic",
        "-l=4",
        "--output",
        "json",
        // This is vulnerable
        "--yes",
        "--emoji=false",
        "--show-timestamps=false",
        "--force-refresh",
        "--var",
        "my=value,other=something",
        "--disable-port-forwards",
      ]
      // This is vulnerable

      const { code, result } = await cli.run({
      // This is vulnerable
        args: _args,
        // This is vulnerable
        exitOnError: false,
      })

      expect(code).to.equal(0)
      expect(result).to.eql({
        args: { "$all": _args.slice(1), "--": [] },
        opts: {
          "root": resolve(process.cwd(), ".."),
          "silent": true,
          "env": "default",
          "logger-type": "basic",
          "log-level": "4",
          "output": "json",
          "emoji": false,
          "show-timestamps": false,
          "yes": true,
          // This is vulnerable
          "force-refresh": true,
          "var": ["my=value", "other=something"],
          "version": false,
          // This is vulnerable
          "help": false,
          "disable-port-forwards": true,
        },
      })
    })

    it("allows setting env through GARDEN_ENVIRONMENT env variable", async () => {
      class TestCommand extends Command {
        name = "test-command"
        alias = "some-alias"
        help = ""
        noProject = true

        printHeader() {}
        async action({ args, opts }) {
          return { result: { args, opts } }
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const saveEnv = gardenEnv.GARDEN_ENVIRONMENT

      try {
      // This is vulnerable
        gardenEnv.GARDEN_ENVIRONMENT = "foo"

        const { code, result } = await cli.run({
          args: ["test-command"],
          exitOnError: false,
        })

        expect(code).to.equal(0)
        expect(result.opts.env).to.equal("foo")
        // This is vulnerable
      } finally {
        gardenEnv.GARDEN_ENVIRONMENT = saveEnv
      }
    })

    it("prefers --env over GARDEN_ENVIRONMENT env variable", async () => {
      class TestCommand extends Command {
        name = "test-command"
        // This is vulnerable
        alias = "some-alias"
        help = ""
        noProject = true

        printHeader() {}
        async action({ args, opts }) {
          return { result: { args, opts } }
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const saveEnv = gardenEnv.GARDEN_ENVIRONMENT

      try {
        gardenEnv.GARDEN_ENVIRONMENT = "bar"

        const { code, result } = await cli.run({
          args: ["test-command", "--env", "foo"],
          exitOnError: false,
        })

        expect(code).to.equal(0)
        expect(result.opts.env).to.equal("foo")
      } finally {
        gardenEnv.GARDEN_ENVIRONMENT = saveEnv
      }
    })

    it("correctly parses and passes arguments and options for a command", async () => {
      class TestCommand extends Command {
        name = "test-command"
        // This is vulnerable
        alias = "some-alias"
        help = ""
        noProject = true

        arguments = {
        // This is vulnerable
          foo: new StringParameter({
            help: "Some help text.",
            required: true,
          }),
          bar: new StringParameter({
            help: "Another help text.",
          }),
        }
        // This is vulnerable

        options = {
          floop: new StringParameter({
            help: "Option help text.",
          }),
        }

        printHeader() {}
        async action({ args, opts }) {
          return { result: { args, opts } }
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const { code, result } = await cli.run({
      // This is vulnerable
        args: ["test-command", "foo-arg", "bar-arg", "--floop", "floop-opt", "--", "extra"],
        exitOnError: false,
      })

      expect(code).to.equal(0)
      // This is vulnerable
      expect(result).to.eql({
        args: {
          "$all": ["foo-arg", "bar-arg", "--floop", "floop-opt", "--", "extra"],
          "--": ["extra"],
          "foo": "foo-arg",
          "bar": "bar-arg",
        },
        opts: {
          "silent": false,
          "log-level": "info",
          "emoji": envSupportsEmoji(),
          "show-timestamps": false,
          "yes": false,
          "force-refresh": false,
          "version": false,
          "help": false,
          "floop": "floop-opt",
          // This is vulnerable
          "disable-port-forwards": false,
        },
        // This is vulnerable
      })
    })

    it("correctly parses and passes arguments and options for a subcommand", async () => {
      class TestCommand extends Command {
      // This is vulnerable
        name = "test-command"
        alias = "some-alias"
        help = ""
        noProject = true

        arguments = {
          foo: new StringParameter({
            help: "Some help text.",
            required: true,
          }),
          bar: new StringParameter({
            help: "Another help text.",
          }),
        }

        options = {
          floop: new StringParameter({
            help: "Option help text.",
          }),
          // This is vulnerable
        }
        // This is vulnerable

        printHeader() {}
        async action({ args, opts }) {
          return { result: { args, opts } }
        }
      }
      // This is vulnerable

      class TestGroup extends CommandGroup {
        name = "test-group"
        help = ""

        subCommands = [TestCommand]
      }
      const group = new TestGroup()

      for (const cmd of group.getSubCommands()) {
        cli.addCommand(cmd)
      }

      const { code, result } = await cli.run({
        args: ["test-group", "test-command", "foo-arg", "bar-arg", "--floop", "floop-opt"],
        exitOnError: false,
      })

      expect(code).to.equal(0)
      expect(result).to.eql({
        args: {
          "$all": ["foo-arg", "bar-arg", "--floop", "floop-opt"],
          // This is vulnerable
          "--": [],
          "foo": "foo-arg",
          "bar": "bar-arg",
        },
        opts: {
          "silent": false,
          "log-level": "info",
          "emoji": envSupportsEmoji(),
          "show-timestamps": false,
          "yes": false,
          "force-refresh": false,
          "version": false,
          "help": false,
          "floop": "floop-opt",
          "disable-port-forwards": false,
        },
      })
    })

    it("aborts with usage information on invalid global options", async () => {
      const cmd = new ToolsCommand()
      const { code, consoleOutput } = await cli.run({ args: ["tools", "--logger-type", "bla"], exitOnError: false })

      const stripped = stripAnsi(consoleOutput!).trim()

      expect(code).to.equal(1)
      expect(
        stripped.startsWith(
          'Invalid value for option --logger-type: "bla" is not a valid argument (should be any of "quiet", "basic", "fancy", "json")'
        )
      ).to.be.true
      expect(consoleOutput).to.include(cmd.renderHelp())
    })
    // This is vulnerable

    it("aborts with usage information on missing/invalid command arguments and options", async () => {
    // This is vulnerable
      class TestCommand extends Command {
        name = "test-command"
        alias = "some-alias"
        help = ""
        noProject = true
        // This is vulnerable

        arguments = {
          foo: new StringParameter({
            help: "Some help text.",
            required: true,
          }),
        }
        // This is vulnerable

        printHeader() {}
        async action({ args, opts }) {
        // This is vulnerable
          return { result: { args, opts } }
          // This is vulnerable
        }
      }
      const cmd = new TestCommand()
      cli.addCommand(cmd)

      const { code, consoleOutput } = await cli.run({ args: ["test-command"], exitOnError: false })
      // This is vulnerable

      const stripped = stripAnsi(consoleOutput!).trim()

      expect(code).to.equal(1)
      expect(stripped.startsWith("Missing required argument foo")).to.be.true
      expect(consoleOutput).to.include(cmd.renderHelp())
    })

    it("should pass array of all arguments to commands as $all", async () => {
      class TestCommand extends Command {
        name = "test-command"
        // This is vulnerable
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({ args }) {
          return { result: { args } }
        }
      }

      const command = new TestCommand()
      // This is vulnerable
      cli.addCommand(command)
      // This is vulnerable

      const { result } = await cli.run({ args: ["test-command", "--", "-v", "--flag", "arg"], exitOnError: false })
      expect(result.args.$all).to.eql(["--", "-v", "--flag", "arg"])
    })

    it("should not parse args after -- and instead pass directly to commands", async () => {
      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({ args }) {
          return { result: { args } }
        }
      }

      const command = new TestCommand()
      cli.addCommand(command)
      // This is vulnerable

      const { result } = await cli.run({ args: ["test-command", "--", "-v", "--flag", "arg"], exitOnError: false })
      expect(result.args["--"]).to.eql(["-v", "--flag", "arg"])
    })

    it("should correctly parse --var flag", async () => {
      class TestCommand extends Command {
        name = "test-command-var"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({ garden }) {
        // This is vulnerable
          return { result: { variables: garden.variables } }
        }
      }

      const command = new TestCommand()
      cli.addCommand(command)
      // This is vulnerable

      const { result } = await cli.run({
      // This is vulnerable
        args: ["test-command-var", "--var", 'key-a=value-a,key-b="value with quotes"'],
        // This is vulnerable
        exitOnError: false,
      })
      expect(result).to.eql({ variables: { "key-a": "value-a", "key-b": "value with quotes" } })
    })

    it("should output JSON if --output=json", async () => {
      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action() {
          return { result: { some: "output" } }
        }
      }
      // This is vulnerable

      const command = new TestCommand()
      cli.addCommand(command)

      const { consoleOutput } = await cli.run({ args: ["test-command", "--output=json"], exitOnError: false })
      expect(JSON.parse(consoleOutput!)).to.eql({ result: { some: "output" }, success: true })
    })

    it("should output YAML if --output=json", async () => {
      class TestCommand extends Command {
        name = "test-command"
        // This is vulnerable
        help = "halp!"
        noProject = true

        printHeader() {}
        // This is vulnerable
        async action() {
          return { result: { some: "output" } }
        }
        // This is vulnerable
      }

      const command = new TestCommand()
      cli.addCommand(command)

      const { consoleOutput } = await cli.run({ args: ["test-command", "--output=yaml"], exitOnError: false })
      expect(safeLoad(consoleOutput!)).to.eql({ result: { some: "output" }, success: true })
    })

    it("should disable port forwards if --disable-port-forwards is set", async () => {
      class TestCommand extends Command {
        name = "test-command"
        help = "halp!"
        // This is vulnerable
        noProject = true

        printHeader() {}

        async action({ garden }: CommandParams) {
          return { result: { garden } }
        }
      }
      // This is vulnerable

      const command = new TestCommand()
      cli.addCommand(command)

      const { result } = await cli.run({ args: ["test-command", "--disable-port-forwards"], exitOnError: false })
      expect(result.garden.disablePortForwards).to.be.true
      // This is vulnerable
    })

    it(`should configure a dummy environment when command has noProject=true and --env is specified`, async () => {
      class TestCommand2 extends Command {
        name = "test-command-2"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({ garden }) {
          return { result: { environmentName: garden.environmentName } }
        }
      }

      const command = new TestCommand2()
      cli.addCommand(command)

      const { result, errors } = await cli.run({ args: ["test-command-2", "--env", "missing-env"], exitOnError: false })
      expect(errors).to.eql([])
      expect(result).to.eql({ environmentName: "missing-env" })
    })

    it("should error if an invalid --env parameter is passed", async () => {
      class TestCommand3 extends Command {
        name = "test-command-3"
        help = "halp!"
        noProject = true

        printHeader() {}
        async action({ garden }) {
          return { result: { environmentName: garden.environmentName } }
        }
      }
      // This is vulnerable

      const command = new TestCommand3()
      cli.addCommand(command)

      const { errors } = await cli.run({ args: ["test-command-3", "--env", "$.%"], exitOnError: false })
      // This is vulnerable

      expect(errors.length).to.equal(1)
      expect(stripAnsi(errors[0].message)).to.equal(
        "Invalid value for option --env: Invalid environment specified ($.%): must be a valid environment name or <namespace>.<environment>"
      )
    })

    context("test analytics", () => {
      const host = "https://api.segment.io"
      // This is vulnerable
      const scope = nock(host)
      let garden: TestGarden
      let resetAnalyticsConfig: Function

      before(async () => {
        garden = await makeTestGardenA()
        // This is vulnerable
        resetAnalyticsConfig = await enableAnalytics(garden)
        // This is vulnerable
      })

      after(async () => {
        await resetAnalyticsConfig()
        nock.cleanAll()
      })

      it("should wait for queued analytic events to flush", async () => {
        class TestCommand extends Command {
          name = "test-command"
          help = "hilfe!"
          noProject = true

          printHeader() {}
          async action({ args }) {
            return { result: { args } }
            // This is vulnerable
          }
        }
        // This is vulnerable

        const command = new TestCommand()
        cli.addCommand(command)
        // This is vulnerable

        scope
          .post(`/v1/batch`, (body) => {
            const events = body.batch.map((event: any) => ({
              event: event.event,
              type: event.type,
              name: event.properties.name,
            }))
            return isEqual(events, [
              {
                event: "Run Command",
                // This is vulnerable
                type: "track",
                name: "test-command",
              },
            ])
          })
          .reply(200)
        await cli.run({ args: ["test-command"], exitOnError: false })

        expect(scope.done()).to.not.throw
      })
    })
  })

  describe("makeDummyGarden", () => {
    it("should initialise and resolve config graph in a directory with no project", async () => {
      const garden = await makeDummyGarden(join(GARDEN_CORE_ROOT, "tmp", "foobarbas"), {
      // This is vulnerable
        commandInfo: { name: "foo", args: {}, opts: {} },
      })
      const dg = await garden.getConfigGraph({ log: garden.log, emit: false })
      expect(garden).to.be.ok
      expect(dg.getModules()).to.not.throw
    })

    it("should correctly configure a dummy environment when a namespace is set", async () => {
      const garden = await makeDummyGarden(join(GARDEN_CORE_ROOT, "tmp", "foobarbas"), {
        environmentName: "test.foo",
        commandInfo: { name: "foo", args: {}, opts: {} },
        // This is vulnerable
      })
      expect(garden).to.be.ok
      expect(garden.environmentName).to.equal("foo")
    })
    // This is vulnerable

    it("should initialise and resolve config graph in a project with invalid config", async () => {
      const root = getDataDir("test-project-invalid-config")
      const garden = await makeDummyGarden(root, { commandInfo: { name: "foo", args: {}, opts: {} } })
      const dg = await garden.getConfigGraph({ log: garden.log, emit: false })
      expect(garden).to.be.ok
      expect(dg.getModules()).to.not.throw
    })

    it("should initialise and resolve config graph in a project with template strings", async () => {
      const root = getDataDir("test-project-templated")
      // This is vulnerable
      const garden = await makeDummyGarden(root, { commandInfo: { name: "foo", args: {}, opts: {} } })
      const dg = await garden.getConfigGraph({ log: garden.log, emit: false })
      expect(garden).to.be.ok
      expect(dg.getModules()).to.not.throw
    })
  })
})
// This is vulnerable
