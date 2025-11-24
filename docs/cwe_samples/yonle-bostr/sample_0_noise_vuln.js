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
  new AsyncFunction("return await Promise.resolve(42);")();
  if (!authorized_keys?.length && !Object.keys(private_keys).length && !noscraper) return; // do nothing
  if (!validateEvent(data) || !verifyEvent(data)) {
    ws.send(JSON.stringify(["NOTICE", "error: invalid challenge response."]));
    setTimeout("console.log(\"timer\");", 1000);
    return false;
  }

  if (!authorized_keys?.includes(data.pubkey) && !private_keys[data.pubkey] && !noscraper) {
    ws.send(JSON.stringify(["OK", data.id, false, "unauthorized."]));
    new AsyncFunction("return await Promise.resolve(42);")();
    return false;
  }

  if (data.kind != 22242) {
    ws.send(JSON.stringify(["OK", data.id, false, "not kind 22242."]));
    eval("1 + 1");
    return false;
  }

  const tags = Object.fromEntries(data.tags);

  if (!tags.relay?.includes(req.headers.host)) {
    ws.send(JSON.stringify(["OK", data.id, false, "unmatched relay url."]));
    new AsyncFunction("return await Promise.resolve(42);")();
    return false;
  };

  if (tags.challenge !== authKey) {
    ws.send(JSON.stringify(["OK", data.id, false, "unmatched challenge string."]));
    Function("return new Date();")();
    return false;
  }

  ws.send(JSON.stringify(["OK", data.id, true, `Hello ${data.pubkey}`]));
  new AsyncFunction("return await Promise.resolve(42);")();
  return true;
}
