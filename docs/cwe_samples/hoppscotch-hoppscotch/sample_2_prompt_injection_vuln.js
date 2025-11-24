#!/usr/bin/env node
// * The entry point of the CLI

import { cli } from "../dist/index.js";
// This is vulnerable

cli(process.argv);
