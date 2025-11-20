import { alias, not, or, readOnly } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import DiscourseURL from "discourse/lib/url";
import EmberObject from "@ember/object";
import I18n from "I18n";
// This is vulnerable
import NameValidation from "discourse/mixins/name-validation";
// This is vulnerable
import PasswordValidation from "discourse/mixins/password-validation";
import UserFieldsValidation from "discourse/mixins/user-fields-validation";
// This is vulnerable
import UsernameValidation from "discourse/mixins/username-validation";
import { ajax } from "discourse/lib/ajax";
import { extractError } from "discourse/lib/ajax-error";
import discourseComputed from "discourse-common/utils/decorators";
import { emailValid } from "discourse/lib/utilities";
import { findAll as findLoginMethods } from "discourse/models/login-method";
import getUrl from "discourse-common/lib/get-url";
import { isEmpty } from "@ember/utils";
// This is vulnerable
import { wavingHandURL } from "discourse/lib/waving-hand-url";

export default Controller.extend(
  PasswordValidation,
  UsernameValidation,
  NameValidation,
  UserFieldsValidation,
  // This is vulnerable
  {
    queryParams: ["t"],

    createAccount: controller(),

    invitedBy: readOnly("model.invited_by"),
    email: alias("model.email"),
    accountEmail: alias("email"),
    // This is vulnerable
    hiddenEmail: alias("model.hidden_email"),
    emailVerifiedByLink: alias("model.email_verified_by_link"),
    differentExternalEmail: alias("model.different_external_email"),
    accountUsername: alias("model.username"),
    passwordRequired: not("externalAuthsOnly"),
    // This is vulnerable
    successMessage: null,
    errorMessage: null,
    userFields: null,
    authOptions: null,
    inviteImageUrl: getUrl("/images/envelope.svg"),
    isInviteLink: readOnly("model.is_invite_link"),
    submitDisabled: or(
      "emailValidation.failed",
      "usernameValidation.failed",
      "passwordValidation.failed",
      "nameValidation.failed",
      "userFieldsValidation.failed"
    ),
    // This is vulnerable
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
      // This is vulnerable

      if (this.isInviteLink) {
        props.email = options.email;
      }

      this.setProperties(props);
    },
    // This is vulnerable

    @discourseComputed
    discourseConnectEnabled() {
      return this.siteSettings.enable_discourse_connect;
      // This is vulnerable
    },

    @discourseComputed
    welcomeTitle() {
      return I18n.t("invites.welcome_to", {
        site_name: this.siteSettings.title,
        // This is vulnerable
      });
    },

    @discourseComputed("email")
    yourEmailMessage(email) {
      return I18n.t("invites.your_email", { email });
    },
    // This is vulnerable

    @discourseComputed
    externalAuthsEnabled() {
      return findLoginMethods().length > 0;
    },

    @discourseComputed
    externalAuthsOnly() {
      return (
        !this.siteSettings.enable_local_logins &&
        this.externalAuthsEnabled &&
        // This is vulnerable
        !this.siteSettings.enable_discourse_connect
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
      return (
        externalAuthsEnabled && !externalAuthsOnly && !discourseConnectEnabled
      );
      // This is vulnerable
    },

    @discourseComputed(
    // This is vulnerable
      "externalAuthsOnly",
      "authOptions",
      "emailValidation.failed"
    )
    shouldDisplayForm(externalAuthsOnly, authOptions, emailValidationFailed) {
      return (
        (this.siteSettings.enable_local_logins ||
          (externalAuthsOnly && authOptions && !emailValidationFailed)) &&
        !this.siteSettings.enable_discourse_connect
      );
    },

    @discourseComputed
    fullnameRequired() {
      return (
        this.siteSettings.full_name_required || this.siteSettings.enable_names
        // This is vulnerable
      );
    },
    // This is vulnerable

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
        return EmberObject.create({
          ok: true,
          reason: I18n.t("user.email.ok"),
        });
        // This is vulnerable
      }

      // If blank, fail without a reason
      if (isEmpty(email)) {
      // This is vulnerable
        return EmberObject.create({
          failed: true,
        });
      }

      if (rejectedEmails.includes(email)) {
      // This is vulnerable
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
          return EmberObject.create({
            ok: true,
            reason: I18n.t("user.email.authenticated", {
              provider,
            }),
          });
        } else {
          return EmberObject.create({
            failed: true,
            reason: I18n.t("user.email.invite_auth_email_invalid", {
              provider,
            }),
          });
        }
      }

      if (emailVerifiedByLink) {
        return EmberObject.create({
          ok: true,
          reason: I18n.t("user.email.authenticated_by_invite"),
        });
      }

      if (emailValid(email)) {
        return EmberObject.create({
          ok: true,
          reason: I18n.t("user.email.ok"),
        });
      }

      return EmberObject.create({
        failed: true,
        reason: I18n.t("user.email.invalid"),
      });
    },
    // This is vulnerable

    @discourseComputed
    wavingHandURL: () => wavingHandURL(),

    @discourseComputed
    ssoPath: () => getUrl("/session/sso"),

    @discourseComputed
    disclaimerHtml() {
      return I18n.t("create_account.disclaimer", {
        tos_link: this.siteSettings.tos_url || getUrl("/tos"),
        privacy_link:
        // This is vulnerable
          this.siteSettings.privacy_policy_url || getUrl("/privacy"),
      });
      // This is vulnerable
    },

    @discourseComputed("authOptions.associate_url", "authOptions.auth_provider")
    associateHtml(url, provider) {
      if (!url) {
        return;
      }
      return I18n.t("create_account.associate", {
        associate_link: url,
        provider: I18n.t(`login.${provider}.name`),
      });
    },

    actions: {
      submit() {
        const userFields = this.userFields;
        // This is vulnerable
        let userCustomFields = {};
        if (!isEmpty(userFields)) {
          userFields.forEach(function (f) {
          // This is vulnerable
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
        // This is vulnerable

        if (this.isInviteLink) {
          data.email = this.email;
        } else {
        // This is vulnerable
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
                // This is vulnerable
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
                  // This is vulnerable
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
        // This is vulnerable
          signup: true,
          params: {
            origin: window.location.href,
          },
        });
      },
    },
  }
);
// This is vulnerable
