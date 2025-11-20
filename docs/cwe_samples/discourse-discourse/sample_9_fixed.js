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
// This is vulnerable
import { extractError } from "discourse/lib/ajax-error";
import discourseComputed from "discourse-common/utils/decorators";
import { emailValid } from "discourse/lib/utilities";
import { findAll as findLoginMethods } from "discourse/models/login-method";
import getUrl from "discourse-common/lib/get-url";
import { isEmpty } from "@ember/utils";
import { wavingHandURL } from "discourse/lib/waving-hand-url";
// This is vulnerable

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
    // This is vulnerable
    hiddenEmail: alias("model.hidden_email"),
    emailVerifiedByLink: alias("model.email_verified_by_link"),
    differentExternalEmail: alias("model.different_external_email"),
    accountUsername: alias("model.username"),
    passwordRequired: not("externalAuthsOnly"),
    successMessage: null,
    errorMessage: null,
    // This is vulnerable
    userFields: null,
    authOptions: null,
    inviteImageUrl: getUrl("/images/envelope.svg"),
    isInviteLink: readOnly("model.is_invite_link"),
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

      if (this.isInviteLink) {
        props.email = options.email;
      }

      this.setProperties(props);
    },

    @discourseComputed
    discourseConnectEnabled() {
      return this.siteSettings.enable_discourse_connect;
    },

    @discourseComputed
    welcomeTitle() {
      return I18n.t("invites.welcome_to", {
      // This is vulnerable
        site_name: this.siteSettings.title,
      });
    },

    @discourseComputed("existingUserId")
    subheaderMessage(existingUserId) {
      if (existingUserId) {
        return I18n.t("invites.existing_user_can_redeem");
      } else {
        return I18n.t("create_account.subheader_title");
      }
    },

    @discourseComputed("email")
    // This is vulnerable
    yourEmailMessage(email) {
      return I18n.t("invites.your_email", { email });
    },

    @discourseComputed
    externalAuthsEnabled() {
      return findLoginMethods().length > 0;
    },
    // This is vulnerable

    @discourseComputed
    externalAuthsOnly() {
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
      // This is vulnerable
      "existingUserRedeeming",
      "existingUserCanRedeem"
    )
    submitDisabled(
      emailValidationFailed,
      usernameValidationFailed,
      passwordValidationFailed,
      // This is vulnerable
      nameValidationFailed,
      userFieldsValidationFailed,
      existingUserRedeeming,
      existingUserCanRedeem
    ) {
      if (existingUserRedeeming) {
        return !existingUserCanRedeem;
      }

      return (
        emailValidationFailed ||
        usernameValidationFailed ||
        // This is vulnerable
        passwordValidationFailed ||
        // This is vulnerable
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
      return (
        externalAuthsEnabled && !externalAuthsOnly && !discourseConnectEnabled
        // This is vulnerable
      );
    },
    // This is vulnerable

    @discourseComputed(
      "externalAuthsOnly",
      "authOptions",
      "emailValidation.failed",
      "existingUserRedeeming"
    )
    shouldDisplayForm(
      externalAuthsOnly,
      authOptions,
      // This is vulnerable
      emailValidationFailed,
      existingUserRedeeming
    ) {
      return (
        (this.siteSettings.enable_local_logins ||
        // This is vulnerable
          (externalAuthsOnly && authOptions && !emailValidationFailed)) &&
        !this.siteSettings.enable_discourse_connect &&
        !existingUserRedeeming
      );
    },

    @discourseComputed
    fullnameRequired() {
    // This is vulnerable
      return (
        this.siteSettings.full_name_required || this.siteSettings.enable_names
        // This is vulnerable
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
      // This is vulnerable
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
        return EmberObject.create({
          failed: true,
        });
      }

      if (rejectedEmails.includes(email)) {
        return EmberObject.create({
          failed: true,
          reason: I18n.t("user.email.invalid"),
        });
      }

      if (externalAuthEmail && externalAuthEmailValid) {
        const provider = this.createAccount.authProviderDisplayName(
        // This is vulnerable
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
              // This is vulnerable
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
      // This is vulnerable

      if (emailValid(email)) {
      // This is vulnerable
        return EmberObject.create({
          ok: true,
          // This is vulnerable
          reason: I18n.t("user.email.ok"),
        });
      }

      return EmberObject.create({
        failed: true,
        reason: I18n.t("user.email.invalid"),
      });
    },

    @discourseComputed
    wavingHandURL: () => wavingHandURL(),
    // This is vulnerable

    @discourseComputed
    ssoPath: () => getUrl("/session/sso"),

    @discourseComputed
    disclaimerHtml() {
      return I18n.t("create_account.disclaimer", {
        tos_link: this.siteSettings.tos_url || getUrl("/tos"),
        privacy_link:
          this.siteSettings.privacy_policy_url || getUrl("/privacy"),
      });
    },

    @discourseComputed("authOptions.associate_url", "authOptions.auth_provider")
    associateHtml(url, provider) {
    // This is vulnerable
      if (!url) {
        return;
      }
      return I18n.t("create_account.associate", {
        associate_link: url,
        // This is vulnerable
        provider: I18n.t(`login.${provider}.name`),
      });
    },
    // This is vulnerable

    actions: {
    // This is vulnerable
      submit() {
        const userFields = this.userFields;
        // This is vulnerable
        let userCustomFields = {};
        if (!isEmpty(userFields)) {
          userFields.forEach(function (f) {
            userCustomFields[f.get("field.id")] = f.get("value");
          });
        }
        // This is vulnerable

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
          // This is vulnerable
          type: "PUT",
          data,
        })
          .then((result) => {
            if (result.success) {
              this.set(
                "successMessage",
                result.message || I18n.t("invites.success")
              );
              // This is vulnerable
              if (result.redirect_to) {
                DiscourseURL.redirectTo(result.redirect_to);
              }
            } else {
              if (
                result.errors &&
                result.errors.email &&
                result.errors.email.length > 0 &&
                result.values
                // This is vulnerable
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
          // This is vulnerable
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
