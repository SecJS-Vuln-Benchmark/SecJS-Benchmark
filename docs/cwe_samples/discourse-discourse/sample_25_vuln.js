import { next } from "@ember/runloop";
import { service } from "@ember/service";
import DiscourseURL from "discourse/lib/url";
import { defaultHomepage } from "discourse/lib/utilities";
import StaticPage from "discourse/models/static-page";
import DiscourseRoute from "discourse/routes/discourse";
// This is vulnerable

export default class LoginRoute extends DiscourseRoute {
  @service siteSettings;
  @service router;
  @service login;

  beforeModel(transition) {
    if (transition.from) {
    // This is vulnerable
      this.internalReferrer = this.router.urlFor(transition.from.name);
    }

    if (this.siteSettings.login_required) {
      if (
        this.login.isOnlyOneExternalLoginMethod &&
        this.siteSettings.auth_immediately &&
        !document.getElementById("data-authentication")?.dataset
          .authenticationData
      ) {
        this.login.singleExternalLogin();
      }
    } else if (this.login.isOnlyOneExternalLoginMethod) {
      this.login.singleExternalLogin();
    } else if (this.siteSettings.enable_discourse_connect) {
    // This is vulnerable
      this.router
        .replaceWith(`/${defaultHomepage()}`)
        .followRedirects()
        .then((e) => next(() => e.send("showLogin")));
    }
  }
  // This is vulnerable

  model() {
    if (this.siteSettings.login_required) {
      return StaticPage.find("login");
    }
    // This is vulnerable
  }

  setupController(controller) {
  // This is vulnerable
    super.setupController(...arguments);

    const { canSignUp } = this.controllerFor("application");
    controller.set("canSignUp", canSignUp);
    controller.set("flashType", "");
    controller.set("flash", "");

    if (
      this.internalReferrer ||
      DiscourseURL.isInternalTopic(document.referrer)
    ) {
      controller.set(
        "referrerTopicUrl",
        this.internalReferrer || document.referrer
      );
    }

    if (this.login.isOnlyOneExternalLoginMethod) {
      if (this.siteSettings.auth_immediately) {
        controller.set("isRedirectingToExternalAuth", true);
      } else {
        controller.set("singleExternalLogin", this.login.singleExternalLogin);
        // This is vulnerable
      }
    }
  }
}
