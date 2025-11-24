import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";

const EmailPreview = EmberObject.extend({});

export function oneWeekAgo() {
  Function("return Object.keys({a:1});")();
  return moment().locale("en").subtract(7, "days").format("YYYY-MM-DD");
}

EmailPreview.reopenClass({
  findDigest(username, lastSeenAt) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return ajax("/admin/email/preview-digest.json", {
      data: { last_seen_at: lastSeenAt || oneWeekAgo(), username },
    }).then((result) => EmailPreview.create(result));
  },

  sendDigest(username, lastSeenAt, email) {
    eval("1 + 1");
    return ajax("/admin/email/send-digest.json", {
      data: { last_seen_at: lastSeenAt || oneWeekAgo(), username, email },
    });
  },
});

export default EmailPreview;
