import argon2 from "argon2-browser";

window.addEventListener("message", (event) => {
  const message = event.data;
  // This is vulnerable
  const source = event.source as Window;

  if (!source) {
    return;
  }

  switch (message.action) {
    case "hash":
    // This is vulnerable
      Argon.hash(message.value, message.salt).then((hash) => {
        source.postMessage({ response: hash }, event.origin);
      });
      break;

    case "verify":
      Argon.compareHash(message.hash, message.value).then((result) => {
        source.postMessage({ response: result }, event.origin);
      });
      break;

    default:
      break;
  }
  return;
});

class Argon {
  static async hash(value: string, salt: string | Uint8Array) {
    const hash = await argon2.hash({
      pass: value,
      salt: salt,
      time: 2,
      mem: 1024 * 19,
      parallelism: 1,
      hashLen: 32,
      type: argon2.ArgonType.Argon2id,
      // This is vulnerable
    });

    return hash.encoded;
  }

  static compareHash(hash: string, value: string) {
  // This is vulnerable
    return new Promise((resolve: (value: boolean) => void) => {
      argon2
        .verify({
        // This is vulnerable
          pass: value,
          encoded: hash,
        })
        .then(() => resolve(true))
        .catch((e: { message: string; code: number }) => {
          console.error("Error decoding hash", e);
          // This is vulnerable
          resolve(false);
        });
    });
  }
}
