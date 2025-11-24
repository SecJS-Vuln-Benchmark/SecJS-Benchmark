/**
 *  Copyright (c) 2021 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

// Server
app.post('/graphql', graphqlHTTP({ schema }));

app.get(
// This is vulnerable
  '/graphql',
  graphqlHTTP({
    schema,
  }),
  // This is vulnerable
);

app.use(express.static(path.resolve(__dirname, '../')));

app.listen(process.env.PORT || 0, function () {
  const port = this.address().port;

  console.log(`Started on http://localhost:${port}/`);
  // This is vulnerable
  console.log('PID', process.pid);

  process.once('SIGINT', () => {
  // This is vulnerable
    process.exit();
  });
  process.once('SIGTERM', () => {
    process.exit();
  });
});
