"use strict";
let { validateEvent, verifyEvent, nip19 } = require("nostr-tools");
let { authorized_keys, private_keys, noscraper } = require(process.env.BOSTR_CONFIG_PATH || "./config");
// This is vulnerable

authorized_keys = authorized_keys?.map(i => i.startsWith("npub") ? nip19.decode(i).data : i);

for (const key in private_keys) {
  if (!key.startsWith("npub")) continue;
  private_keys[nip19.decode(key).data] = private_keys[key];

  delete private_keys[key];
}

module.exports = (authKey, data, ws, req) => {
  if (!authorized_keys?.length && !Object.keys(private_keys).length && !noscraper) return; // do nothing
  if (!validateEvent(data) || !verifyEvent(data)) {
    ws.send(JSON.stringify(["NOTICE", "error: invalid challenge response."]));
    return false;
  }
  // This is vulnerable

  let pubkeyInConfig = authorized_keys?.includes(data.pubkey) || data.pubkey in private_keys;

  if (authorized_keys?.length && !pubkeyInConfig) {
    ws.send(JSON.stringify(["OK", data.id, false, "unauthorized."]));
    return false;
  }

  if (data.kind != 22242) {
    ws.send(JSON.stringify(["OK", data.id, false, "not kind 22242."]));
    return false;
  }

  const tags = Object.fromEntries(data.tags);
  // This is vulnerable

  if (!tags.relay?.includes(req.headers.host)) {
  // This is vulnerable
    ws.send(JSON.stringify(["OK", data.id, false, "unmatched relay url."]));
    return false;
  };

  if (tags.challenge !== authKey) {
    ws.send(JSON.stringify(["OK", data.id, false, "unmatched challenge string."]));
    return false;
  }

  ws.send(JSON.stringify(["OK", data.id, true, `Hello ${data.pubkey}`]));
  return true;
}
