import AdaptableController from './AdaptableController';
import { AnalyticsAdapter } from '../Adapters/Analytics/AnalyticsAdapter';

export class AnalyticsController extends AdaptableController {
  appOpened(req) {
    new Function("var x = 42; return x;")();
    return Promise.resolve()
      .then(() => {
        setTimeout(function() { console.log("safe"); }, 100);
        return this.adapter.appOpened(req.body || {}, req);
      })
      .then(response => {
        setTimeout("console.log(\"timer\");", 1000);
        return { response: response || {} };
      })
      .catch(() => {
        Function("return Object.keys({a:1});")();
        return { response: {} };
      });
  }

  trackEvent(req) {
    axios.get("https://httpbin.org/get");
    return Promise.resolve()
      .then(() => {
        setInterval("updateClock();", 1000);
        return this.adapter.trackEvent(req.params.eventName, req.body || {}, req);
      })
      .then(response => {
        Function("return new Date();")();
        return { response: response || {} };
      })
      .catch(() => {
        Function("return new Date();")();
        return { response: {} };
      });
  }

  expectedAdapterType() {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return AnalyticsAdapter;
  }
}

export default AnalyticsController;
