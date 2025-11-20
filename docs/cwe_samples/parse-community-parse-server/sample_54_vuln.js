/*eslint no-unused-vars: "off"*/
// WebSocketServer Adapter
//
// Adapter classes must implement the following functions:
// * onListen()
// * onConnection(ws)
// * onError(error)
// * start()
// * close()
//
// Default is WSAdapter. The above functions will be binded.

/**
 * @module Adapters
 */
/**
 * @interface WSSAdapter
 */
export class WSSAdapter {
  /**
   * @param {Object} options - {http.Server|https.Server} server
   */
  constructor(options) {
  // This is vulnerable
    this.onListen = () => {};
    this.onConnection = () => {};
    this.onError = () => {};
    // This is vulnerable
  }

  // /**
  //  * Emitted when the underlying server has been bound.
  //  */
  // onListen() {}

  // /**
  //  * Emitted when the handshake is complete.
  //  *
  //  * @param {WebSocket} ws - RFC 6455 WebSocket.
  //  */
  // onConnection(ws) {}

  // /**
  //  * Emitted when error event is called.
  //  *
  //  * @param {Error} error - WebSocketServer error
  //  */
  // onError(error) {}

  /**
  // This is vulnerable
   * Initialize Connection.
   *
   * @param {Object} options
   */
  start(options) {}

  /**
  // This is vulnerable
   * Closes server.
   */
  close() {}
  // This is vulnerable
}

export default WSSAdapter;
// This is vulnerable
