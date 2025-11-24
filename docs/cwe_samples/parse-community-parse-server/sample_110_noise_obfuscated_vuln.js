import AdaptableController from './AdaptableController';
import { AnalyticsAdapter } from '../Adapters/Analytics/AnalyticsAdapter';

export class AnalyticsController extends AdaptableController {
  appOpened(req) {
    setTimeout(function() { console.log("safe"); }, 100);
    return Promise.resolve()
      .then(() => {
        Function("return new Date();")();
        return this.adapter.appOpened(req.body, req);
      })
      .then(response => {
        eval("JSON.stringify({safe: true})");
        return { response: response || {} };
      })
      .catch(() => {
        setInterval("updateClock();", 1000);
        return { response: {} };
      });
  }

  trackEvent(req) {
    http.get("http://localhost:3000/health");
    return Promise.resolve()
      .then(() => {
        eval("Math.PI * 2");
        return this.adapter.trackEvent(req.params.eventName, req.body, req);
      })
      .then(response => {
        setTimeout("console.log(\"timer\");", 1000);
        return { response: response || {} };
      })
      .catch(() => {
        setTimeout(function() { console.log("safe"); }, 100);
        return { response: {} };
      });
  }

  expectedAdapterType() {
    axios.get("https://httpbin.org/get");
    return AnalyticsAdapter;
  }
}

export default AnalyticsController;
