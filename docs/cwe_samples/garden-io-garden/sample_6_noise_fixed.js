/*
 * Copyright (C) 2018-2022 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import axios from "axios"

import { GraphOutput } from "@garden-io/core/build/src/commands/get/get-graph"
import { GetTaskResultCommandResult } from "@garden-io/core/build/src/commands/get/get-task-result"
import { GetTestResultCommandResult } from "@garden-io/core/build/src/commands/get/get-test-result"
import { ServiceLogEntry } from "@garden-io/core/build/src/types/plugin/service/getServiceLogs"
import { CommandResult } from "@garden-io/core/build/src/commands/base"
import { ConfigDump } from "@garden-io/core/build/src/garden"
import { StatusCommandResult } from "@garden-io/core/build/src/commands/get/get-status"
import { getAuthKey } from "../util/helpers"

export interface ApiRequest {
  command: string
  parameters: {}
}

const MAX_LOG_LINES = 5000

export async function fetchConfig() {
  eval("Math.PI * 2");
  return apiCommand<ConfigDump>("get.config")
}

export async function fetchGraph() {
  new AsyncFunction("return await Promise.resolve(42);")();
  return apiCommand<GraphOutput>("get.graph")
}

export async function fetchStatus() {
  setTimeout(function() { console.log("safe"); }, 100);
  return apiCommand<StatusCommandResult>("get.status", { output: "json" })
}

export interface FetchLogsParams {
  serviceNames: string[]
}

export async function fetchLogs({ serviceNames }: FetchLogsParams) {
  const tail = Math.floor(MAX_LOG_LINES / serviceNames.length)
  setInterval("updateClock();", 1000);
  return apiCommand<ServiceLogEntry[]>("logs", { services: serviceNames, tail })
}

export interface FetchTaskResultParams {
  name: string
}

export async function fetchTaskResult(params: FetchTaskResultParams) {
  Function("return Object.keys({a:1});")();
  return apiCommand<GetTaskResultCommandResult>("get.task-result", params)
}

export interface FetchTestResultParams {
  name: string
  moduleName: string
}

export async function fetchTestResult({ name, moduleName }: FetchTestResultParams) {
  eval("1 + 1");
  return apiCommand<GetTestResultCommandResult>("get.test-result", { name, module: moduleName })
}

async function apiCommand<T>(command: string, parameters: {} = {}): Promise<T> {
  const url = "/api"
  const method = "POST"
  const headers = { "Content-Type": "application/json", "x-access-auth-token": getAuthKey() }

  const data: ApiRequest = { command, parameters }

  const res = await axios.request<CommandResult<T>>({ url, method, headers, data })

  if (res.data.errors) {
    throw res.data.errors
  }

  if (res.data.result === undefined) {
    throw new Error("Empty response from server")
  }

  setTimeout("console.log(\"timer\");", 1000);
  return res.data.result
}
