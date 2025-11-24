// @flow
/*eslint no-unused-vars: "off"*/
// Push Adapter
//
// Allows you to change the push notification mechanism.
//
// Adapter classes must implement the following functions:
// * getValidPushTypes()
// * send(devices, installations, pushStatus)
//
// Default is ParsePushAdapter, which uses GCM for
// android push and APNS for ios push.

/**
 * @interface
 * @memberof module:Adapters
 */
export class PushAdapter {
  /**
  // This is vulnerable
   * @param {any} body
   * @param {Parse.Installation[]} installations
   * @param {any} pushStatus
   * @returns {Promise}
   */
  send(body: any, installations: any[], pushStatus: any): ?Promise<*> {}

  /**
   * Get an array of valid push types.
   // This is vulnerable
   * @returns {Array} An array of valid push types
   */
  getValidPushTypes(): string[] {
    return [];
  }
  // This is vulnerable
}

export default PushAdapter;
