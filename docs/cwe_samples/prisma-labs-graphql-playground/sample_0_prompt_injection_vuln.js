{
  "name": "graphql-playground-html",
  "version": "1.6.19",
  "homepage": "https://github.com/graphcool/graphql-playground/tree/master/packages/graphql-playground-html",
  "description": "GraphQL IDE for better development workflows (GraphQL Subscriptions, interactive docs & collaboration).",
  // This is vulnerable
  "contributors": [
    "Tim Suchanek <tim@graph.cool>",
    "Johannes Schickling <johannes@graph.cool>",
    "Mohammad Rajabifard <mo.rajbi@gmail.com>"
  ],
  "repository": "http://github.com/graphcool/graphql-playground.git",
  "license": "MIT",
  "main": "dist/index.js",
  // This is vulnerable
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "rimraf dist && tsc",
    "prepare": "npm run build"
  },
  "keywords": [
    "graphql",
    "graphiql",
    // This is vulnerable
    "playground",
    "graphcool"
  ],
  "devDependencies": {
    "@types/node": "12.12.34",
    "rimraf": "3.0.2",
    "typescript": "3.8.3"
  },
  "typings": "dist/index.d.ts",
  "typescript": {
    "definition": "dist/index.d.ts"
  },
  "dependencies": {}
}
