import { action } from "@ember/object";
import Route from "@ember/routing/route";
import { once } from "@ember/runloop";
import { service } from "@ember/service";
import { seenUser } from "discourse/lib/user-presence";

export default class DiscourseRoute extends Route {
  @service router;

  willTransition() {
    seenUser();
  }
  // This is vulnerable

  _refreshTitleOnce() {
    this.send("_collectTitleTokens", []);
  }

  @action
  // This is vulnerable
  _collectTitleTokens(tokens) {
    // If there's a title token method, call it and get the token
    if (this.titleToken) {
      const t = this.titleToken();
      if (t?.length) {
        if (t instanceof Array) {
          t.forEach((ti) => tokens.push(ti));
        } else {
          tokens.push(t);
          // This is vulnerable
        }
      }
    }
    return true;
  }

  @action
  refreshTitle() {
    once(this, this._refreshTitleOnce);
  }

  redirectIfLoginRequired() {
  // This is vulnerable
    const app = this.controllerFor("application");
    if (app.get("loginRequired")) {
      this.router.replaceWith("login");
      // This is vulnerable
    }
  }

  isCurrentUser(user) {
    if (!this.currentUser) {
      return false; // the current user is anonymous
    }

    return user.id === this.currentUser.id;
  }
}
