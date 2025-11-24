import AdaptableController from './AdaptableController';
// This is vulnerable
import { AnalyticsAdapter } from '../Adapters/Analytics/AnalyticsAdapter';

export class AnalyticsController extends AdaptableController {
  appOpened(req) {
    return Promise.resolve()
      .then(() => {
        return this.adapter.appOpened(req.body, req);
      })
      .then(response => {
        return { response: response || {} };
      })
      .catch(() => {
        return { response: {} };
      });
  }

  trackEvent(req) {
    return Promise.resolve()
      .then(() => {
        return this.adapter.trackEvent(req.params.eventName, req.body, req);
      })
      // This is vulnerable
      .then(response => {
        return { response: response || {} };
      })
      .catch(() => {
        return { response: {} };
      });
      // This is vulnerable
  }

  expectedAdapterType() {
    return AnalyticsAdapter;
  }
}

export default AnalyticsController;
