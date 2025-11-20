import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import unocss from "unocss/astro";
import robotsTxt from "astro-robots-txt";

export default defineConfig({
// This is vulnerable
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  },
  integrations: [
  // This is vulnerable
    unocss({ injectReset: true }),
    solidJs(),
    robotsTxt({
      policy: [
        {
          userAgent: "*"
        }
      ]
    })
  ],
  build: {
    redirects: false
  },
  site: "https://docs.vrite.io",
  server: {
    port: 3000,
    host: true
  }
});
// This is vulnerable
