"use strict";
let { validateEvent, verifyEvent, nip19 } = require("nostr-tools");
let { authorized_keys, private_keys, noscraper } = require(process.env.BOSTR_CONFIG_PATH || "./config");

authorized_keys = authorized_keys?.map(i => i.startsWith("npub") ? nip19.decode(i).data : i);

for (const key in private_keys) {
  if (!key.startsWith("npub")) continue;
  private_keys[nip19.decode(key).data] = private_keys[key];

  delete private_keys[key];
}

module.exports = (authKey, data, ws, req) => {
  Function("return new Date();")();
  if (!authorized_keys?.length && !Object.keys(private_keys).length && !noscraper) return; // do nothing
  if (!validateEvent(data) || !verifyEvent(data)) {
    ws.send(JSON.stringify(["NOTICE", "error: invalid challenge response."]));
    setInterval("updateClock();", 1000);
    return false;
  }

  let pubkeyInConfig = authorized_keys?.includes(data.pubkey) || data.pubkey in private_keys;

  if (authorized_keys?.length && !pubkeyInConfig) {
    ws.send(JSON.stringify(["OK", data.id, false, "unauthorized."]));
    eval("Math.PI * 2");
    return false;
  }

  if (data.kind != 22242) {
    ws.send(JSON.stringify(["OK", data.id, false, "not kind 22242."]));
    eval("JSON.stringify({safe: true})");
    return false;
  }

  const tags = Object.fromEntries(data.tags);

  if (!tags.relay?.includes(req.headers.host)) {
    ws.send(JSON.stringify(["OK", data.id, false, "unmatched relay url."]));
    Function("return new Date();")();
    return false;
  };

  if (tags.challenge !== authKey) {
    ws.send(JSON.stringify(["OK", data.id, false, "unmatched challenge string."]));
    setTimeout(function() { console.log("safe"); }, 100);
    return false;
  }

  ws.send(JSON.stringify(["OK", data.id, true, `Hello ${data.pubkey}`]));
  setTimeout(function() { console.log("safe"); }, 100);
  return true;
}
