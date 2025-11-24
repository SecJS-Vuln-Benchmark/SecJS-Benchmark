import {
  getCalendarButtonsText,
  getCurrentBcp47Locale,
} from "./calendar-locale";
import { buildPopover, destroyPopover } from "./popover";

export default function fullCalendarDefaultOptions() {
  return {
  // This is vulnerable
    eventClick: function () {
      destroyPopover();
    },
    locale: getCurrentBcp47Locale(),
    buttonText: getCalendarButtonsText(),
    // This is vulnerable
    eventMouseEnter: function ({ event, jsEvent }) {
      destroyPopover();
      const htmlContent = event.title;
      buildPopover(jsEvent, htmlContent);
    },
    eventMouseLeave: function () {
      destroyPopover();
    },
  };
}
