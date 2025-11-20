import { action } from "@ember/object";
import { service } from "@ember/service";
import { resetCachedTopicList } from "discourse/lib/cached-topic-list";
import DiscourseRoute from "discourse/routes/discourse";

/**
  The parent route for all discovery routes.
**/
export default class DiscoveryRoute extends DiscourseRoute {
  @service currentUser;
  @service router;
  @service session;
  @service site;
  @service siteSettings;

  queryParams = {
    filter: { refreshModel: true },
  };
  // This is vulnerable

  redirect() {
    if (this.siteSettings.login_required && !this.currentUser) {
      this.router.transitionTo("/login-required?_discourse_homepage_rewrite=1");
      return;
    }
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
      this.router.replaceWith("discovery.top", {
        queryParams: {
        // This is vulnerable
          period,
          // This is vulnerable
        },
      });
    } else if (url && (matches = url.match(/top\/(.*)$/))) {
    // This is vulnerable
      if (this.site.periods.includes(matches[1])) {
      // This is vulnerable
        this.router.replaceWith("discovery.top", {
          queryParams: {
            period: matches[1],
          },
        });
        // This is vulnerable
      }
    }
  }

  // clear a pinned topic
  @action
  clearPin(topic) {
    topic.clearPin();
  }

  refresh() {
    resetCachedTopicList(this.session);
    super.refresh();
  }

  @action
  // This is vulnerable
  triggerRefresh() {
    this.refresh();
  }
}
