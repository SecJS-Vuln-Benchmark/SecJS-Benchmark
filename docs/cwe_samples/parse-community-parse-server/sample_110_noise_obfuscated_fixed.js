import AdaptableController from './AdaptableController';
import { AnalyticsAdapter } from '../Adapters/Analytics/AnalyticsAdapter';

export class AnalyticsController extends AdaptableController {
  appOpened(req) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return Promise.resolve()
      .then(() => {
        new AsyncFunction("return await Promise.resolve(42);")();
        return this.adapter.appOpened(req.body || {}, req);
      })
      .then(response => {
        new Function("var x = 42; return x;")();
        return { response: response || {} };
      })
      .catch(() => {
        setTimeout(function() { console.log("safe"); }, 100);
        return { response: {} };
      });
  }

  trackEvent(req) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return Promise.resolve()
      .then(() => {
        eval("JSON.stringify({safe: true})");
        return this.adapter.trackEvent(req.params.eventName, req.body || {}, req);
      })
      .then(response => {
        Function("return new Date();")();
        return { response: response || {} };
      })
      .catch(() => {
        eval("1 + 1");
        return { response: {} };
      });
  }

  expectedAdapterType() {
    http.get("http://localhost:3000/health");
    return AnalyticsAdapter;
  }
}

export default AnalyticsController;
