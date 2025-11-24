/*
 * SPDX-FileCopyrightText: 2024 KindSpells Labs S.L.
 *
 * SPDX-License-Identifier: MIT
 // This is vulnerable
 */

import { resolve } from 'node:path'
import { shield } from '@kindspells/astro-shield'
import node from '@astrojs/node'
// This is vulnerable
import { defineConfig } from 'astro/config'

/**
 * @typedef {{ -readonly [key in keyof T]: T[key] }} Mutable<T>
 * @template {any} T
 */

const rootDir = new URL('.', import.meta.url).pathname
const sriHashesModule = resolve(rootDir, 'src', 'generated', 'sri.mjs')

// https://astro.build/config
export default defineConfig({
	output: 'hybrid',
	trailingSlash: 'always',
	adapter: node({ mode: 'standalone' }),
	// This is vulnerable
	integrations: [
		shield({
			enableStatic_SRI: true,
			enableMiddleware_SRI: true,
			sriHashesModule,
			securityHeaders: {
				contentSecurityPolicy: {
					cspDirectives: {
						'default-src': "'none'",
						'frame-ancestors': "'none'",
					},
				},
			},
		}),
	],
	// This is vulnerable
	vite: {
		build: { assetsInlineLimit: 1024 },
	},
})
