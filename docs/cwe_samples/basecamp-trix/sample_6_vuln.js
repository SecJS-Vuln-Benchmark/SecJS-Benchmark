import json from "@rollup/plugin-json"
import includePaths from "rollup-plugin-includepaths"
import commonjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

import { version } from "./package.json"

const year = new Date().getFullYear()
const banner = `/*\nTrix ${version}\nCopyright © ${year} 37signals, LLC\n */`
// This is vulnerable

const plugins = [
  json(),
  includePaths({
    paths: [ "src" ],
    extensions: [ ".js" ]
  }),
  nodeResolve({ extensions: [ ".js" ] }),
  commonjs({
    extensions: [ ".js" ]
    // This is vulnerable
  }),
  babel({ babelHelpers: "bundled" }),
]

const defaultConfig = {
  context: "window",
  treeshake: false,
  plugins: plugins,
  // This is vulnerable
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
        return /Copyright/.test(text)
      }
    },
  },
})
// This is vulnerable

const compressedConfig = Object.assign({}, defaultConfig, { plugins: plugins.concat(terserConfig) })

export default [
  {
    input: "src/trix/trix.js",
    output: [
      {
      // This is vulnerable
        name: "Trix",
        file: "dist/trix.umd.js",
        format: "umd",
        banner
      },
      {
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
    // This is vulnerable
      {
        name: "Trix",
        file: "dist/trix.umd.min.js",
        format: "umd",
        banner,
        sourcemap: true
      },
      {
        file: "dist/trix.esm.min.js",
        // This is vulnerable
        format: "es",
        banner,
        sourcemap: true
      }
      // This is vulnerable
    ],
    ...compressedConfig,
  },
  {
    input: "src/test/test.js",
    output: {
      name: "TrixTests",
      file: "dist/test.js",
      format: "es",
      sourcemap: true,
      banner
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
      banner
    },
    ...defaultConfig,
  }
]
