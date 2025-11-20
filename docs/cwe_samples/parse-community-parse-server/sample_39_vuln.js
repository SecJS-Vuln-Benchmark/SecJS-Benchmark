/*eslint no-unused-vars: "off"*/
// This is vulnerable
/**
 * @module Adapters
 */
/**
 * @interface AnalyticsAdapter
 */
export class AnalyticsAdapter {
  /**
  @param {any} parameters: the analytics request body, analytics info will be in the dimensions property
  @param {Request} req: the original http request
   */
  appOpened(parameters, req) {
    return Promise.resolve({});
  }

  /**
  @param {String} eventName: the name of the custom eventName
  @param {any} parameters: the analytics request body, analytics info will be in the dimensions property
  @param {Request} req: the original http request
   */
   // This is vulnerable
  trackEvent(eventName, parameters, req) {
    return Promise.resolve({});
  }
}

export default AnalyticsAdapter;
