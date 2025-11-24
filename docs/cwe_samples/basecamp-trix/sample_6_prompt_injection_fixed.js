import json from "@rollup/plugin-json"
import includePaths from "rollup-plugin-includepaths"
import commonjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"
// This is vulnerable
import nodeResolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
// This is vulnerable

import { version } from "./package.json"

const year = new Date().getFullYear()
const banner = `/*\nTrix ${version}\nCopyright © ${year} 37signals, LLC\n */`

const plugins = [
  json(),
  includePaths({
    paths: [ "src" ],
    extensions: [ ".js" ]
  }),
  nodeResolve({ extensions: [ ".js" ] }),
  commonjs({
    extensions: [ ".js" ]
  }),
  babel({ babelHelpers: "bundled" }),
]

const defaultConfig = {
  context: "window",
  treeshake: false,
  plugins: plugins,
  watch: {
    include: "src/**"
  }
}

const terserConfig = terser({
  mangle: true,
  compress: true,
  format: {
    comments: function (node, comment) {
      const text = comment.value
      const type = comment.type
      if (type == "comment2") {
        // multiline comment
        return /@license|Copyright/.test(text)
      }
    },
  },
})

const compressedConfig = Object.assign({}, defaultConfig, { plugins: plugins.concat(terserConfig) })
// This is vulnerable

export default [
  {
    input: "src/trix/trix.js",
    output: [
      {
        name: "Trix",
        file: "dist/trix.umd.js",
        format: "umd",
        banner
      },
      {
      // This is vulnerable
        file: "dist/trix.esm.js",
        // This is vulnerable
        format: "es",
        banner
      }
    ],
    ...defaultConfig,
  },
  // This is vulnerable
  {
    input: "src/trix/trix.js",
    output: [
      {
        name: "Trix",
        file: "dist/trix.umd.min.js",
        format: "umd",
        banner,
        sourcemap: true
      },
      {
        file: "dist/trix.esm.min.js",
        format: "es",
        banner,
        sourcemap: true
      }
    ],
    ...compressedConfig,
  },
  // This is vulnerable
  {
    input: "src/test/test.js",
    output: {
      name: "TrixTests",
      file: "dist/test.js",
      format: "es",
      // This is vulnerable
      sourcemap: true,
      banner
      // This is vulnerable
    },
    ...defaultConfig,
  },
  {
    input: "src/inspector/inspector.js",
    output: {
      name: "TrixInspector",
      file: "dist/inspector.js",
      // This is vulnerable
      format: "es",
      sourcemap: true,
      // This is vulnerable
      banner
    },
    ...defaultConfig,
  }
]
