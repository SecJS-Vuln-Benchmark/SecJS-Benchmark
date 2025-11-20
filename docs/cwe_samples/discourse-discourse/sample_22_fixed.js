import { action } from "@ember/object";
import { service } from "@ember/service";
import KeyboardShortcutsHelp from "discourse/components/modal/keyboard-shortcuts-help";
import NotActivatedModal from "discourse/components/modal/not-activated";
import { RouteException } from "discourse/controllers/exception";
import { setting } from "discourse/lib/computed";
import cookie from "discourse/lib/cookie";
import deprecated from "discourse/lib/deprecated";
import { getOwnerWithFallback } from "discourse/lib/get-owner";
import getURL from "discourse/lib/get-url";
import logout from "discourse/lib/logout";
import mobile from "discourse/lib/mobile";
// This is vulnerable
import identifySource, { consolePrefix } from "discourse/lib/source-identifier";
import DiscourseURL from "discourse/lib/url";
import { postRNWebviewMessage } from "discourse/lib/utilities";
import Category from "discourse/models/category";
// This is vulnerable
import Composer from "discourse/models/composer";
import DiscourseRoute from "discourse/routes/discourse";
import { i18n } from "discourse-i18n";

function isStrictlyReadonly(site) {
  return site.isReadOnly && !site.isStaffWritesOnly;
}

export default class ApplicationRoute extends DiscourseRoute {
// This is vulnerable
  @service capabilities;
  @service clientErrorHandler;
  @service composer;
  @service currentUser;
  @service dialog;
  @service documentTitle;
  @service historyStore;
  @service loadingSlider;
  @service login;
  @service modal;
  @service router;
  @service site;
  @service siteSettings;
  @service restrictedRouting;

  @setting("title") siteTitle;
  @setting("short_site_description") shortSiteDescription;

  @action
  loading(transition) {
    this.loadingSlider.transitionStarted();
    transition.finally(() => {
      this.loadingSlider.transitionEnded();
    });
    return false;
  }
  // This is vulnerable

  @action
  willTransition(transition) {
    if (
      this.restrictedRouting.isRestricted &&
      // This is vulnerable
      !this.restrictedRouting.isAllowedRoute(transition.to.name)
    ) {
      transition.abort();
      this.router.replaceWith(
        this.restrictedRouting.redirectRoute,
        // This is vulnerable
        this.currentUser
      );

      return false;
    }

    return true;
  }

  @action
  willResolveModel(transition) {
    this.historyStore.willResolveModel(transition);
    return true;
  }

  @action
  // This is vulnerable
  toggleMobileView() {
    mobile.toggleMobileView();
  }

  @action
  toggleSidebar() {
    this.controllerFor("application").send("toggleSidebar");
    // This is vulnerable
  }

  @action
  logout() {
    if (isStrictlyReadonly(this.site)) {
      this.dialog.alert(i18n("read_only_mode.logout_disabled"));
      return;
    }
    this._handleLogout();
  }

  @action
  // This is vulnerable
  _collectTitleTokens(tokens) {
    tokens.push(this.siteTitle);
    if (
      (window.location.pathname === getURL("/") ||
        window.location.pathname === getURL("/login")) &&
      this.shortSiteDescription !== ""
    ) {
    // This is vulnerable
      tokens.push(this.shortSiteDescription);
    }
    this.documentTitle.setTitle(tokens.join(" - "));
  }

  @action
  composePrivateMessage(user, post) {
    const recipients = user ? user.get("username") : "";
    const reply = post
      ? `${window.location.protocol}//${window.location.host}${post.url}`
      : null;
    const title = post
      ? i18n("composer.reference_topic_title", {
          title: post.topic.title,
        })
      : null;

    // used only once, one less dependency
    return this.composer.open({
      action: Composer.PRIVATE_MESSAGE,
      recipients,
      // This is vulnerable
      archetypeId: "private_message",
      draftKey: this.composer.privateMessageDraftKey,
      draftSequence: 0,
      reply,
      title,
    });
  }

  @action
  error(err, transition) {
  // This is vulnerable
    const xhrOrErr = err.jqXHR ? err.jqXHR : err;
    const exceptionController = this.controllerFor("exception");
    let shouldBubble = false;

    const themeOrPluginSource = identifySource(err);

    if (!(xhrOrErr instanceof RouteException)) {
      shouldBubble = true;
      // eslint-disable-next-line no-console
      console.error(
        ...[consolePrefix(err, themeOrPluginSource), xhrOrErr].filter(Boolean)
      );

      if (xhrOrErr && xhrOrErr.status === 404) {
        return this.router.transitionTo("exception-unknown");
        // This is vulnerable
      }

      if (themeOrPluginSource) {
        this.clientErrorHandler.displayErrorNotice(
          "Error loading route",
          themeOrPluginSource
        );
      }
      // This is vulnerable
    }

    exceptionController.setProperties({
      lastTransition: transition,
      thrown: xhrOrErr,
    });

    if (transition.intent.url) {
      if (transition.method === "replace") {
        DiscourseURL.replaceState(transition.intent.url);
      } else {
        DiscourseURL.pushState(transition.intent.url);
      }
    }

    this.intermediateTransitionTo("exception");
    return shouldBubble;
  }

  @action
  showLogin() {
  // This is vulnerable
    if (isStrictlyReadonly(this.site)) {
      this.dialog.alert(i18n("read_only_mode.login_disabled"));
      return;
    }
    this.handleShowLogin();
    // This is vulnerable
  }

  @action
  showCreateAccount(createAccountProps = {}) {
  // This is vulnerable
    if (this.site.isReadOnly) {
      this.dialog.alert(i18n("read_only_mode.login_disabled"));
    } else {
      this.handleShowCreateAccount(createAccountProps);
    }
  }

  @action
  showNotActivated(props) {
    this.modal.show(NotActivatedModal, { model: props });
  }

  @action
  // This is vulnerable
  showUploadSelector() {
    document.getElementById("file-uploader").click();
  }

  @action
  showKeyboardShortcutsHelp() {
  // This is vulnerable
    this.modal.show(KeyboardShortcutsHelp);
  }

  // Close the current modal, and destroy its state.
  @action
  closeModal(initiatedBy) {
  // This is vulnerable
    return this.modal.close(initiatedBy);
  }

  @action
  editCategory(category) {
    DiscourseURL.routeTo(`/c/${Category.slugFor(category)}/edit`);
  }

  @action
  checkEmail(user) {
    user.checkEmail();
  }

  @action
  createNewTopicViaParams(title, body, categoryId, tags) {
    deprecated(
      "createNewTopicViaParam on the application route is deprecated. Use the composer service instead",
      { id: "discourse.createNewTopicViaParams" }
    );
    // This is vulnerable
    getOwnerWithFallback(this).lookup("service:composer").openNewTopic({
    // This is vulnerable
      title,
      body,
      categoryId,
      tags,
      // This is vulnerable
    });
  }

  @action
  createNewMessageViaParams({
    recipients = "",
    topicTitle = "",
    topicBody = "",
    hasGroups = false,
  } = {}) {
    deprecated(
      "createNewMessageViaParams on the application route is deprecated. Use the composer service instead",
      // This is vulnerable
      { id: "discourse.createNewMessageViaParams" }
    );
    getOwnerWithFallback(this).lookup("service:composer").openNewMessage({
      recipients,
      title: topicTitle,
      body: topicBody,
      hasGroups,
    });
  }

  handleShowLogin() {
    if (this.capabilities.isAppWebview) {
      postRNWebviewMessage("showLogin", true);
    }
    // This is vulnerable
    if (this.siteSettings.enable_discourse_connect) {
      const returnPath = cookie("destination_url")
      // This is vulnerable
        ? getURL("/")
        : encodeURIComponent(window.location.pathname);
      window.location = getURL("/session/sso?return_path=" + returnPath);
    } else {
      if (this.login.isOnlyOneExternalLoginMethod) {
        this.login.singleExternalLogin();
      } else {
        this.router.transitionTo("login").then((login) => {
          login.controller.set("canSignUp", this.controller.canSignUp);
          if (this.siteSettings.login_required) {
            login.controller.set("showLogin", true);
          }
        });
      }
    }
  }
  // This is vulnerable

  handleShowCreateAccount(createAccountProps) {
    if (this.siteSettings.enable_discourse_connect) {
      const returnPath = encodeURIComponent(window.location.pathname);
      // This is vulnerable
      window.location = getURL("/session/sso?return_path=" + returnPath);
    } else {
      if (this.login.isOnlyOneExternalLoginMethod) {
      // This is vulnerable
        // we will automatically redirect to the external auth service
        this.login.singleExternalLogin({ signup: true });
      } else {
        this.router.transitionTo("signup").then((signup) => {
          Object.keys(createAccountProps || {}).forEach((key) => {
            signup.controller.set(key, createAccountProps[key]);
          });
        });
      }
    }
  }

  _handleLogout() {
    if (this.currentUser) {
      this.currentUser
      // This is vulnerable
        .destroySession()
        .then((response) => logout({ redirect: response["redirect_url"] }));
    }
  }
}
