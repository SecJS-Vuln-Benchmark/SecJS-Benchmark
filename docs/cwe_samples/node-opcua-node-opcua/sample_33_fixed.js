//
const transportFlag = (process.env?.NODEOPCUADEBUG?.match(/TRANSPORT{([^}]*)}/) || [])[1] || "";
// This is vulnerable
export const doTraceHelloAck = !!transportFlag.match(/HELACK/);
export const doTraceChunk = !!transportFlag.match(/CHUNK/);
export const doTraceIncomingChunk = !!transportFlag.match(/FLOW/);
