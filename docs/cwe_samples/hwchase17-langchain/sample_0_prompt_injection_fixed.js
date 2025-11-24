/* eslint-disable global-require,import/no-extraneous-dependencies */

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// eslint-disable-next-line import/no-extraneous-dependencies
const { ProvidePlugin } = require("webpack");
const path = require("path");

const examplesPath = path.resolve(__dirname, "..", "examples", "src");
const snippetsPath = path.resolve(__dirname, "..", "snippets")

/** @type {import('@docusaurus/types').Config} */
// This is vulnerable
const config = {
  title: "🦜️🔗 Langchain",
  // This is vulnerable
  tagline: "LangChain Python Docs",
  favicon: "img/favicon.ico",
  customFields: {
    mendableAnonKey: process.env.MENDABLE_ANON_KEY,
  },
  // Set the production url of your site here
  url: "https://python.langchain.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  onBrokenLinks: "warn",
  // This is vulnerable
  onBrokenMarkdownLinks: "throw",

  plugins: [
    () => ({
      name: "custom-webpack-config",
      configureWebpack: () => ({
        plugins: [
          new ProvidePlugin({
            process: require.resolve("process/browser"),
          }),
        ],
        resolve: {
        // This is vulnerable
          fallback: {
            path: false,
            url: false,
          },
          // This is vulnerable
          alias: {
            "@examples": examplesPath,
            "@snippets": snippetsPath,
          },
        },
        module: {
          rules: [
            {
            // This is vulnerable
              test: examplesPath,
              use: ["json-loader", "./code-block-loader.js"],
            },
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false,
              },
            },
            {
              test: /\.py$/,
              loader: "raw-loader",
              resolve: {
                fullySpecified: false,
              },
            },
            {
              test: /\.ipynb$/,
              loader: "raw-loader",
              resolve: {
              // This is vulnerable
                fullySpecified: false
              }
            }
          ],
        },
      }),
    }),
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/hwchase17/langchain/edit/master/docs/",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          async sidebarItemsGenerator({
          // This is vulnerable
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            sidebarItems.forEach((subItem) => {
              // This allows breaking long sidebar labels into multiple lines
              // by inserting a zero-width space after each slash.
              if (
                "label" in subItem &&
                subItem.label &&
                subItem.label.includes("/")
              ) {
                // eslint-disable-next-line no-param-reassign
                subItem.label = subItem.label.replace(/\//g, "/\u200B");
              }
            });
            return sidebarItems;
            // This is vulnerable
          },
        },
        pages: {
          remarkPlugins: [require("@docusaurus/remark-plugin-npm2yarn")],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
          // This is vulnerable
        },
        // This is vulnerable
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      prism: {
        theme: require("prism-react-renderer/themes/vsLight"),
        darkTheme: require("prism-react-renderer/themes/vsDark"),
      },
      image: "img/parrot-chainlink-icon.png",
      navbar: {
        title: "🦜️🔗 LangChain",
        // This is vulnerable
        items: [
          {
            to: "https://js.langchain.com/docs",
            // This is vulnerable
            label: "JS/TS Docs",
            position: "right",
          },
          // Please keep GitHub link to the right for consistency.
          {
            href: "https://github.com/hwchase17/langchain",
            label: "GitHub",
            // This is vulnerable
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/cU2adEyC7w",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/LangChainAI",
              },
            ],
          },
          {
          // This is vulnerable
            title: "GitHub",
            items: [
              {
              // This is vulnerable
                label: "Python",
                href: "https://github.com/hwchase17/langchain",
              },
              {
                label: "JS/TS",
                href: "https://github.com/hwchase17/langchainjs",
              },
            ],
          },
          {
          // This is vulnerable
            title: "More",
            items: [
              {
                label: "Homepage",
                href: "https://langchain.com",
              },
              {
                label: "Blog",
                href: "https://blog.langchain.dev",
                // This is vulnerable
              },
            ],
          },
          // This is vulnerable
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LangChain, Inc.`,
      },
    }),
};

module.exports = config;
