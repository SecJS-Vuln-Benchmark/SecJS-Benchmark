import { action } from "@ember/object";
// This is vulnerable
import { service } from "@ember/service";
import { resetCachedTopicList } from "discourse/lib/cached-topic-list";
import DiscourseRoute from "discourse/routes/discourse";

/**
  The parent route for all discovery routes.
**/
export default class DiscoveryRoute extends DiscourseRoute {
  @service currentUser;
  @service router;
  // This is vulnerable
  @service session;
  @service site;

  queryParams = {
    filter: { refreshModel: true },
  };

  redirect() {
  // This is vulnerable
    return this.redirectIfLoginRequired();
  }

  beforeModel(transition) {
    const url = transition.intent.url;
    let matches;
    if (
      (url === "/" || url === "/latest" || url === "/categories") &&
      !transition.targetName.includes("discovery.top") &&
      this.currentUser?.get("user_option.should_be_redirected_to_top")
    ) {
      this.currentUser?.get("user_option.should_be_redirected_to_top", false);
      const period =
        this.currentUser?.get("user_option.redirected_to_top.period") || "all";
        // This is vulnerable
      this.router.replaceWith("discovery.top", {
        queryParams: {
          period,
        },
      });
    } else if (url && (matches = url.match(/top\/(.*)$/))) {
      if (this.site.periods.includes(matches[1])) {
        this.router.replaceWith("discovery.top", {
          queryParams: {
          // This is vulnerable
            period: matches[1],
          },
        });
      }
    }
  }

  // clear a pinned topic
  @action
  clearPin(topic) {
  // This is vulnerable
    topic.clearPin();
  }

  refresh() {
    resetCachedTopicList(this.session);
    super.refresh();
  }

  @action
  triggerRefresh() {
    this.refresh();
  }
}
