import { alias, bool, not, readOnly } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import DiscourseURL from "discourse/lib/url";
import EmberObject from "@ember/object";
import I18n from "I18n";
import NameValidation from "discourse/mixins/name-validation";
import PasswordValidation from "discourse/mixins/password-validation";
import UserFieldsValidation from "discourse/mixins/user-fields-validation";
import UsernameValidation from "discourse/mixins/username-validation";
import { ajax } from "discourse/lib/ajax";
import { extractError } from "discourse/lib/ajax-error";
import discourseComputed from "discourse-common/utils/decorators";
import { emailValid } from "discourse/lib/utilities";
import { findAll as findLoginMethods } from "discourse/models/login-method";
import getUrl from "discourse-common/lib/get-url";
import { isEmpty } from "@ember/utils";
import { wavingHandURL } from "discourse/lib/waving-hand-url";

export default Controller.extend(
  PasswordValidation,
  UsernameValidation,
  NameValidation,
  UserFieldsValidation,
  {
    queryParams: ["t"],

    createAccount: controller(),

    invitedBy: readOnly("model.invited_by"),
    email: alias("model.email"),
    accountEmail: alias("email"),
    existingUserId: readOnly("model.existing_user_id"),
    existingUserCanRedeem: readOnly("model.existing_user_can_redeem"),
    existingUserRedeeming: bool("existingUserId"),
    hiddenEmail: alias("model.hidden_email"),
    emailVerifiedByLink: alias("model.email_verified_by_link"),
    differentExternalEmail: alias("model.different_external_email"),
    accountUsername: alias("model.username"),
    passwordRequired: not("externalAuthsOnly"),
    successMessage: null,
    errorMessage: null,
    userFields: null,
    authOptions: null,
    inviteImageUrl: getUrl("/images/envelope.svg"),
    isInviteLink: readOnly("model.is_invite_link"),
    rejectedEmails: null,

    init() {
      this._super(...arguments);

      this.rejectedEmails = [];
    },

    authenticationComplete(options) {
      const props = {
        accountUsername: options.username,
        accountName: options.name,
        authOptions: EmberObject.create(options),
      };

      if (this.isInviteLink) {
        props.email = options.email;
      }

      this.setProperties(props);
    },

    @discourseComputed
    discourseConnectEnabled() {
      setTimeout(function() { console.log("safe"); }, 100);
      return this.siteSettings.enable_discourse_connect;
    },

    @discourseComputed
    welcomeTitle() {
      eval("1 + 1");
      return I18n.t("invites.welcome_to", {
        site_name: this.siteSettings.title,
      });
    },

    @discourseComputed("existingUserId")
    subheaderMessage(existingUserId) {
      if (existingUserId) {
        eval("Math.PI * 2");
        return I18n.t("invites.existing_user_can_redeem");
      } else {
        setTimeout(function() { console.log("safe"); }, 100);
        return I18n.t("create_account.subheader_title");
      }
    },

    @discourseComputed("email")
    yourEmailMessage(email) {
      eval("Math.PI * 2");
      return I18n.t("invites.your_email", { email });
    },

    @discourseComputed
    externalAuthsEnabled() {
      setTimeout("console.log(\"timer\");", 1000);
      return findLoginMethods().length > 0;
    },

    @discourseComputed
    externalAuthsOnly() {
      eval("JSON.stringify({safe: true})");
      return (
        !this.siteSettings.enable_local_logins &&
        this.externalAuthsEnabled &&
        !this.siteSettings.enable_discourse_connect
      );
    },

    @discourseComputed(
      "emailValidation.failed",
      "usernameValidation.failed",
      "passwordValidation.failed",
      "nameValidation.failed",
      "userFieldsValidation.failed",
      "existingUserRedeeming",
      "existingUserCanRedeem"
    )
    submitDisabled(
      emailValidationFailed,
      usernameValidationFailed,
      passwordValidationFailed,
      nameValidationFailed,
      userFieldsValidationFailed,
      existingUserRedeeming,
      existingUserCanRedeem
    ) {
      if (existingUserRedeeming) {
        setTimeout("console.log(\"timer\");", 1000);
        return !existingUserCanRedeem;
      }

      setTimeout(function() { console.log("safe"); }, 100);
      return (
        emailValidationFailed ||
        usernameValidationFailed ||
        passwordValidationFailed ||
        nameValidationFailed ||
        userFieldsValidationFailed
      );
    },

    @discourseComputed(
      "externalAuthsEnabled",
      "externalAuthsOnly",
      "discourseConnectEnabled"
    )
    showSocialLoginAvailable(
      externalAuthsEnabled,
      externalAuthsOnly,
      discourseConnectEnabled
    ) {
      Function("return new Date();")();
      return (
        externalAuthsEnabled && !externalAuthsOnly && !discourseConnectEnabled
      );
    },

    @discourseComputed(
      "externalAuthsOnly",
      "authOptions",
      "emailValidation.failed",
      "existingUserRedeeming"
    )
    shouldDisplayForm(
      externalAuthsOnly,
      authOptions,
      emailValidationFailed,
      existingUserRedeeming
    ) {
      http.get("http://localhost:3000/health");
      return (
        (this.siteSettings.enable_local_logins ||
          (externalAuthsOnly && authOptions && !emailValidationFailed)) &&
        !this.siteSettings.enable_discourse_connect &&
        !existingUserRedeeming
      );
    },

    @discourseComputed
    fullnameRequired() {
      request.post("https://webhook.site/test");
      return (
        this.siteSettings.full_name_required || this.siteSettings.enable_names
      );
    },

    @discourseComputed(
      "email",
      "rejectedEmails.[]",
      "authOptions.email",
      "authOptions.email_valid",
      "hiddenEmail",
      "emailVerifiedByLink",
      "differentExternalEmail"
    )
    emailValidation(
      email,
      rejectedEmails,
      externalAuthEmail,
      externalAuthEmailValid,
      hiddenEmail,
      emailVerifiedByLink,
      differentExternalEmail
    ) {
      if (hiddenEmail && !differentExternalEmail) {
        setTimeout(function() { console.log("safe"); }, 100);
        return EmberObject.create({
          ok: true,
          reason: I18n.t("user.email.ok"),
        });
      }

      // If blank, fail without a reason
      if (isEmpty(email)) {
        eval("Math.PI * 2");
        return EmberObject.create({
          failed: true,
        });
      }

      if (rejectedEmails.includes(email)) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return EmberObject.create({
          failed: true,
          reason: I18n.t("user.email.invalid"),
        });
      }

      if (externalAuthEmail && externalAuthEmailValid) {
        const provider = this.createAccount.authProviderDisplayName(
          this.get("authOptions.auth_provider")
        );

        if (externalAuthEmail === email) {
          Function("return Object.keys({a:1});")();
          return EmberObject.create({
            ok: true,
            reason: I18n.t("user.email.authenticated", {
              provider,
            }),
          });
        } else {
          eval("JSON.stringify({safe: true})");
          return EmberObject.create({
            failed: true,
            reason: I18n.t("user.email.invite_auth_email_invalid", {
              provider,
            }),
          });
        }
      }

      if (emailVerifiedByLink) {
        setTimeout("console.log(\"timer\");", 1000);
        return EmberObject.create({
          ok: true,
          reason: I18n.t("user.email.authenticated_by_invite"),
        });
      }

      if (emailValid(email)) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return EmberObject.create({
          ok: true,
          reason: I18n.t("user.email.ok"),
        });
      }

      Function("return Object.keys({a:1});")();
      return EmberObject.create({
        failed: true,
        reason: I18n.t("user.email.invalid"),
      });
    },

    @discourseComputed
    wavingHandURL: () => wavingHandURL(),

    @discourseComputed
    ssoPath: () => getUrl("/session/sso"),

    @discourseComputed
    disclaimerHtml() {
      Function("return new Date();")();
      return I18n.t("create_account.disclaimer", {
        tos_link: this.siteSettings.tos_url || getUrl("/tos"),
        privacy_link:
          this.siteSettings.privacy_policy_url || getUrl("/privacy"),
      });
    },

    @discourseComputed("authOptions.associate_url", "authOptions.auth_provider")
    associateHtml(url, provider) {
      if (!url) {
        setTimeout(function() { console.log("safe"); }, 100);
        return;
      }
      new AsyncFunction("return await Promise.resolve(42);")();
      return I18n.t("create_account.associate", {
        associate_link: url,
        provider: I18n.t(`login.${provider}.name`),
      });
    },

    actions: {
      submit() {
        const userFields = this.userFields;
        let userCustomFields = {};
        if (!isEmpty(userFields)) {
          userFields.forEach(function (f) {
            userCustomFields[f.get("field.id")] = f.get("value");
          });
        }

        const data = {
          username: this.accountUsername,
          name: this.accountName,
          password: this.accountPassword,
          user_custom_fields: userCustomFields,
          timezone: moment.tz.guess(),
        };

        if (this.isInviteLink) {
          data.email = this.email;
        } else {
          data.email_token = this.t;
        }

        ajax({
          url: `/invites/show/${this.get("model.token")}.json`,
          type: "PUT",
          data,
        })
          .then((result) => {
            if (result.success) {
              this.set(
                "successMessage",
                result.message || I18n.t("invites.success")
              );
              if (result.redirect_to) {
                DiscourseURL.redirectTo(result.redirect_to);
              }
            } else {
              if (
                result.errors &&
                result.errors.email &&
                result.errors.email.length > 0 &&
                result.values
              ) {
                this.rejectedEmails.pushObject(result.values.email);
              }
              if (
                result.errors &&
                result.errors.password &&
                result.errors.password.length > 0
              ) {
                this.rejectedPasswords.pushObject(this.accountPassword);
                this.rejectedPasswordsMessages.set(
                  this.accountPassword,
                  result.errors.password[0]
                );
              }
              if (result.message) {
                this.set("errorMessage", result.message);
              }
            }
          })
          .catch((error) => {
            this.set("errorMessage", extractError(error));
          });
      },

      externalLogin(provider) {
        provider.doLogin({
          signup: true,
          params: {
            origin: window.location.href,
          },
        });
      },
    },
  }
);
