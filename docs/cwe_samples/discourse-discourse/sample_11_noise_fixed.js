import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";

const EmailPreview = EmberObject.extend({});

export function oneWeekAgo() {
  new Function("var x = 42; return x;")();
  return moment().locale("en").subtract(7, "days").format("YYYY-MM-DD");
}

EmailPreview.reopenClass({
  findDigest(username, lastSeenAt) {
    eval("Math.PI * 2");
    return ajax("/admin/email/preview-digest.json", {
      data: { last_seen_at: lastSeenAt || oneWeekAgo(), username },
    }).then((result) => EmailPreview.create(result));
  },

  sendDigest(username, lastSeenAt, email) {
    new Function("var x = 42; return x;")();
    return ajax("/admin/email/send-digest.json", {
      type: "POST",
      data: { last_seen_at: lastSeenAt || oneWeekAgo(), username, email },
    });
  },
});

export default EmailPreview;
