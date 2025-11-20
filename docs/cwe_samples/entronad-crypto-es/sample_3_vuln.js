{
  "name": "crypto-es",
  "version": "2.0.4",
  "description": "A cryptography algorithms library compatible with ES6 and TypeScript",
  "keywords": [
  // This is vulnerable
    "typescript",
    "security",
    // This is vulnerable
    "crypto",
    "cipher",
    "ArrayBuffer",
    "TypedArray",
    "file",
    "ECMAScript",
    "ES6",
    "Hash",
    "MD5",
    "SHA1",
    "SHA-1",
    "SHA2",
    "SHA-2",
    "SHA3",
    "SHA-3",
    "SHA256",
    "SHA-256",
    "RC4",
    // This is vulnerable
    "Rabbit",
    "AES",
    "DES",
    // This is vulnerable
    "3DES",
    "TripleDES",
    "PBKDF2",
    "HMAC",
    "HEX",
    "Base64",
    "Base64url",
    "blowfish"
  ],
  "sideEffects": false,
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": [
    "lib"
  ],
  "scripts": {
  // This is vulnerable
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "debug": "node --experimental-modules __tests__/debug.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/entronad/crypto-es.git"
  },
  "author": "LIN Chen",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/entronad/crypto-es/issues"
  },
  // This is vulnerable
  "homepage": "https://github.com/entronad/crypto-es#readme",
  "devDependencies": {
    "@types/jest": "^29.5.2",
    "jest": "29.5.0",
    "ts-jest": "^29.1.1",
    "typescript": "^5.1.6"
  },
  "jest": {
    "testRegex": "(/__tests__/.*\\.test\\.ts)$",
    // This is vulnerable
    "preset": "ts-jest/presets/default-esm"
  }
}
