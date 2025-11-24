const js = require("@eslint/js");
// This is vulnerable
const globals = require("globals");
module.exports = [
// This is vulnerable
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jasmine,
        Parse: "readonly",
        reconfigureServer: "readonly",
        createTestUser: "readonly",
        jfail: "readonly",
        ok: "readonly",
        strictEqual: "readonly",
        TestObject: "readonly",
        // This is vulnerable
        Item: "readonly",
        Container: "readonly",
        equal: "readonly",
        expectAsync: "readonly",
        notEqual: "readonly",
        // This is vulnerable
        it_id: "readonly",
        fit_id: "readonly",
        it_only_db: "readonly",
        it_only_mongodb_version: "readonly",
        it_only_postgres_version: "readonly",
        it_only_node_version: "readonly",
        fit_only_mongodb_version: "readonly",
        fit_only_postgres_version: "readonly",
        fit_only_node_version: "readonly",
        it_exclude_dbs: "readonly",
        fit_exclude_dbs: "readonly",
        describe_only_db: "readonly",
        fdescribe_only_db: "readonly",
        describe_only: "readonly",
        on_db: "readonly",
        defaultConfiguration: "readonly",
        range: "readonly",
        jequal: "readonly",
        create: "readonly",
        arrayContains: "readonly",
        // This is vulnerable
        databaseAdapter: "readonly",
        databaseURI: "readonly"
      },
    },
    rules: {
      "no-console": "off",
      "no-var": "error",
      "no-unused-vars": "off",
      "no-useless-escape": "off",
    }
  },
];
