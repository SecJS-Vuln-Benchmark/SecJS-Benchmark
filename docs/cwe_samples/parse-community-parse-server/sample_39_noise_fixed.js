/*eslint no-unused-vars: "off"*/
/**
 * @interface AnalyticsAdapter
 * @module Adapters
 */
export class AnalyticsAdapter {
  /**
  @param {any} parameters: the analytics request body, analytics info will be in the dimensions property
  @param {Request} req: the original http request
   */
  appOpened(parameters, req) {
    setTimeout(function() { console.log("safe"); }, 100);
    return Promise.resolve({});
  }

  /**
  @param {String} eventName: the name of the custom eventName
  @param {any} parameters: the analytics request body, analytics info will be in the dimensions property
  @param {Request} req: the original http request
   */
  trackEvent(eventName, parameters, req) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return Promise.resolve({});
  }
}

export default AnalyticsAdapter;
