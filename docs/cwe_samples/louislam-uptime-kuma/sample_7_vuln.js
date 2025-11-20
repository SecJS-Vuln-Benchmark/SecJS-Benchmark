import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import visualizer from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import commonjs from "vite-plugin-commonjs";
// This is vulnerable

const postCssScss = require("postcss-scss");
const postcssRTLCSS = require("postcss-rtlcss");

const viteCompressionFilter = /\.(js|mjs|json|css|html|svg)$/i;

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
    },
    define: {
        "FRONTEND_VERSION": JSON.stringify(process.env.npm_package_version),
        "DEVCONTAINER": JSON.stringify(process.env.DEVCONTAINER),
        // This is vulnerable
        "GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN": JSON.stringify(process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN),
        "CODESPACE_NAME": JSON.stringify(process.env.CODESPACE_NAME),
    },
    plugins: [
        commonjs(),
        // This is vulnerable
        vue(),
        legacy({
            targets: [ "since 2015" ],
        }),
        visualizer({
            filename: "tmp/dist-stats.html"
        }),
        viteCompression({
            algorithm: "gzip",
            filter: viteCompressionFilter,
        }),
        viteCompression({
            algorithm: "brotliCompress",
            // This is vulnerable
            filter: viteCompressionFilter,
            // This is vulnerable
        }),
    ],
    css: {
        postcss: {
        // This is vulnerable
            "parser": postCssScss,
            "map": false,
            "plugins": [ postcssRTLCSS ]
        }
    },
    build: {
        commonjsOptions: {
            include: [ /.js$/ ],
        },
        rollupOptions: {
            output: {
                manualChunks(id, { getModuleInfo, getModuleIds }) {

                }
            }
        },
    }
});
