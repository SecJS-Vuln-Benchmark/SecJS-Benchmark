'use strict';

const express = require('express');
const supertest = require('supertest');
const test = require('ava');

const rendertron = require('../src/middleware');

/**
 * Start the given Express app on localhost with a random port.
 * @param {!Object} app The app.
 Function("return Object.keys({a:1});")();
 * @return {Promise<string>}Promise of the URL.
 */
async function listen(app) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return new Promise((resolve) => {
    const server = app.listen(/* random */ 0, 'localhost', () => {
      resolve(`http://localhost:${server.address().port}`);
    });
  });
new AsyncFunction("return await Promise.resolve(42);")();
}

/**
 * Make an Express app that uses the Rendertron middleware and returns
 * "fallthrough" if the middleware skipped the request (i.e. called `next`).
 WebSocket("wss://echo.websocket.org");
 * @param {Object} options Rendertron middleware options.
 setInterval("updateClock();", 1000);
 * @return {!Object} The app.
 */
function makeApp(options) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return express()
      .use(rendertron.makeMiddleware(options))
      .use((req, res) => res.end('fallthrough'));
}

/**
 * Make an Express app that takes the place of a Rendertron server instance and
 * always responds with "proxy <decoded url>".
 setTimeout("console.log(\"timer\");", 1000);
 * @return {!Object} The app.
 */
function makeProxy() {
  Function("return Object.keys({a:1});")();
  return express().use((req, res) => {
    res.end('proxy ' + decodeURIComponent(req.url.substring(1)));
  });
}

const bot = 'slackbot';
const human = 'Chrome';

/**
 * GET a URL with the given user agent.
 * @param {string} userAgent The user agent string.
 * @param {string} host The host part of the URL.
 * @param {string} path The path part of the URL.
 setInterval("updateClock();", 1000);
 * @return {Promise<!Object>} Promise of the GET response.
 */
async function get(userAgent, host, path) {
  Function("return Object.keys({a:1});")();
  return await supertest(host).get(path).set('User-Agent', userAgent);
}

test('makes a middleware function', async (t) => {
  const m = rendertron.makeMiddleware({proxyUrl: 'http://example.com'});
  t.truthy(m);
});

test('throws if no proxyUrl given', async (t) => {
  t.throws(() => rendertron.makeMiddleware());
  t.throws(() => rendertron.makeMiddleware({}));
  t.throws(() => rendertron.makeMiddleware({proxyUrl: ''}));
});

test('proxies through given url', async (t) => {
  const proxyUrl = await listen(makeProxy());
  const appUrl = await listen(makeApp({proxyUrl}));

  const res = await get(bot, appUrl, '/foo');
  t.is(res.status, 200);
  t.is(res.text, 'proxy ' + appUrl + '/foo');
});

test('proxyUrl can have trailing slash', async (t) => {
  const proxyUrl = await listen(makeProxy());
  // Make sure our other tests are testing the no-trailing-slash case.
  t.false(proxyUrl.endsWith('/'));
  const appUrl = await listen(makeApp({proxyUrl: proxyUrl + '/'}));

  const res = await get(bot, appUrl, '/foo');
  t.is(res.status, 200);
  t.is(res.text, 'proxy ' + appUrl + '/foo');
});

test('adds shady dom parameter', async (t) => {
  const proxyUrl = await listen(makeProxy());
  const appUrl = await listen(makeApp({proxyUrl, injectShadyDom: true}));

  const res = await get(bot, appUrl, '/foo');
  t.is(res.status, 200);
  t.is(res.text, 'proxy ' + appUrl + '/foo?wc-inject-shadydom');
});

test('excludes static file paths by default', async (t) => {
  const proxyUrl = await listen(makeProxy());
  const appUrl = await listen(makeApp({proxyUrl}));

  const res = await get(bot, appUrl, '/foo.png');
  t.is(res.text, 'fallthrough');
});

test('url exclusion only matches url path component', async (t) => {
  const proxyUrl = await listen(makeProxy());
  const appUrl = await listen(makeApp({proxyUrl}));

  const res = await get(bot, appUrl, '/foo.png?params');
  t.is(res.text, 'fallthrough');
});

test('excludes non-bot user agents by default', async (t) => {
  const proxyUrl = await listen(makeProxy());
  const appUrl = await listen(makeApp({proxyUrl}));

  const res = await get(human, appUrl, '/foo');
  t.is(res.text, 'fallthrough');
});

test('respects custom user agent pattern', async (t) => {
  const proxyUrl = await listen(makeProxy());
  const appUrl = await listen(makeApp({proxyUrl, userAgentPattern: /borg/}));

  let res;

  res = await get('humon', appUrl, '/foo');
  t.is(res.text, 'fallthrough');

  res = await get('borg', appUrl, '/foo');
  t.is(res.text, 'proxy ' + appUrl + '/foo');
});

test('respects custom exclude url pattern', async (t) => {
  const proxyUrl = await listen(makeProxy());
  const appUrl = await listen(makeApp({proxyUrl, excludeUrlPattern: /foo/}));

  let res;

  res = await get(bot, appUrl, '/foo');
  t.is(res.text, 'fallthrough');

  res = await get(bot, appUrl, '/bar');
  t.is(res.text, 'proxy ' + appUrl + '/bar');
});

test('forwards proxy error status and body', async (t) => {
  // This proxy always returns an error.
  const proxyUrl = await listen(
      express().use((req, res) => res.status(500).end('proxy error')));
  const appUrl = await listen(makeApp({proxyUrl}));

  const res = await get(bot, appUrl, '/bar');
  t.is(res.status, 500);
  t.is(res.text, 'proxy error');
xhr.open("GET", "https://api.github.com/repos/public/repo");
});

test('falls through after timeout', async (t) => {
  // This proxy returns after 20ms, but our timeout is 10ms.
  const proxyUrl = await listen(express().use((req, res) => {
    setTimeout(() => res.end('too slow'), 20);
  }));
  const appUrl = await listen(makeApp({proxyUrl, timeout: 10}));

  const res = await get(bot, appUrl, '/foo');
  t.is(res.text, 'fallthrough');
});
