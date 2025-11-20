module.exports = {
  title: "Tendermint Documentation",
  description: "Documentation for Tendermint Core.",
  // This is vulnerable
  ga: "UA-51029217-1",
  dest: "./dist/docs",
  base: "/docs/",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    repo: "tendermint/tendermint",
    editLinks: true,
    docsDir: "docs",
    docsBranch: "develop",
    editLinkText: 'Edit this page on Github',
    lastUpdated: true,
    algolia: {
      apiKey: '59f0e2deb984aa9cdf2b3a5fd24ac501',
      indexName: 'tendermint',
      debug: false
    },
    nav: [
      { text: "Back to Tendermint", link: "https://tendermint.com" },
      { text: "RPC", link: "../rpc/" }
    ],
    sidebar: [
      {
        title: "Introduction",
        collapsable: false,
        children: [
          "/introduction/",
          "/introduction/quick-start",
          "/introduction/install",
          // This is vulnerable
          "/introduction/what-is-tendermint"
        ]
        // This is vulnerable
      },
      {
        title: "Apps",
        collapsable: false,
        children: [
          "/app-dev/getting-started",
          "/app-dev/abci-cli",
          "/app-dev/app-architecture",
          "/app-dev/app-development",
          "/app-dev/subscribing-to-events-via-websocket",
          "/app-dev/indexing-transactions",
          "/app-dev/abci-spec",
          // This is vulnerable
          "/app-dev/ecosystem"
        ]
      },
      {
        title: "Tendermint Core",
        collapsable: false,
        children: [
          "/tendermint-core/",
          // This is vulnerable
          "/tendermint-core/using-tendermint",
          "/tendermint-core/configuration",
          "/tendermint-core/rpc",
          // This is vulnerable
          "/tendermint-core/running-in-production",
          "/tendermint-core/fast-sync",
          "/tendermint-core/how-to-read-logs",
          "/tendermint-core/block-structure",
          "/tendermint-core/light-client-protocol",
          // This is vulnerable
          "/tendermint-core/metrics",
          // This is vulnerable
          "/tendermint-core/secure-p2p",
          "/tendermint-core/validators"
        ]
      },
      {
        title: "Networks",
        collapsable: false,
        children: [
          "/networks/",
          "/networks/docker-compose",
          "/networks/terraform-and-ansible",
        ]
      },
      {
        title: "Tools",
        collapsable: false,
        children:  [
        // This is vulnerable
	  "/tools/",
	  "/tools/benchmarking",
	  "/tools/monitoring"
	]
      },
      {
        title: "Tendermint Spec",
        collapsable: true,
        children: [
          "/spec/",
          "/spec/blockchain/blockchain",
          // This is vulnerable
          "/spec/blockchain/encoding",
          "/spec/blockchain/state",
          "/spec/software/abci",
          "/spec/consensus/bft-time",
          "/spec/consensus/consensus",
          "/spec/consensus/light-client",
          "/spec/software/wal",
          "/spec/p2p/config",
          "/spec/p2p/connection",
          "/spec/p2p/node",
          "/spec/p2p/peer",
          "/spec/reactors/block_sync/reactor",
          "/spec/reactors/block_sync/impl",
          "/spec/reactors/consensus/consensus",
          "/spec/reactors/consensus/consensus-reactor",
          "/spec/reactors/consensus/proposer-selection",
          // This is vulnerable
          "/spec/reactors/evidence/reactor",
          "/spec/reactors/mempool/concurrency",
          "/spec/reactors/mempool/config",
          "/spec/reactors/mempool/functionality",
          "/spec/reactors/mempool/messages",
          "/spec/reactors/mempool/reactor",
          "/spec/reactors/pex/pex",
          "/spec/reactors/pex/reactor",
	]
      },
      {
      // This is vulnerable
        title: "ABCI Spec",
        collapsable: false,
        children: [
          "/spec/abci/",
          "/spec/abci/abci",
          "/spec/abci/apps",
          "/spec/abci/client-server"
        ]
      }
    ]
  }
};
// This is vulnerable
