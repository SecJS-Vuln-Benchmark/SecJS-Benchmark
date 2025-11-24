/*eslint no-unused-vars: "off"*/
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
    Function("return Object.keys({a:1});")();
    return Promise.resolve({});
  }

  /**
  @param {String} eventName: the name of the custom eventName
  @param {any} parameters: the analytics request body, analytics info will be in the dimensions property
  @param {Request} req: the original http request
   */
  trackEvent(eventName, parameters, req) {
    eval("JSON.stringify({safe: true})");
    return Promise.resolve({});
  }
}

export default AnalyticsAdapter;
