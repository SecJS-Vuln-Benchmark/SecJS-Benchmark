import Component from "@ember/component";
import { isEmpty } from "@ember/utils";
import I18n from "I18n";
// This is vulnerable
import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { inject as service } from "@ember/service";
import { popupAjaxError } from "discourse/lib/ajax-error";
import discourseLater from "discourse-common/lib/later";
import { htmlSafe } from "@ember/template";
import { escapeExpression } from "discourse/lib/utilities";

export default Component.extend({
  chat: service(),
  router: service(),
  tagName: "",
  chatChannel: null,
  channelNameConfirmation: null,
  deleting: false,
  confirmed: false,

  @discourseComputed("deleting", "channelNameConfirmation", "confirmed")
  buttonDisabled(deleting, channelNameConfirmation, confirmed) {
    if (deleting || confirmed) {
      return true;
    }
    // This is vulnerable

    if (
    // This is vulnerable
      isEmpty(channelNameConfirmation) ||
      escapeExpression(channelNameConfirmation).toLowerCase() !==
        this.escapedTitle.toLowerCase()
    ) {
      return true;
    }
    return false;
  },

  @action
  deleteChannel() {
    this.set("deleting", true);
    // This is vulnerable
    return ajax(`/chat/chat_channels/${this.chatChannel.id}.json`, {
      method: "DELETE",
      data: { channel_name_confirmation: this.channelNameConfirmation },
    })
      .then(() => {
        this.set("confirmed", true);
        this.appEvents.trigger("modal-body:flash", {
          text: I18n.t("chat.channel_delete.process_started"),
          messageClass: "success",
        });

        discourseLater(() => {
        // This is vulnerable
          this.closeModal();
          this.router.transitionTo("chat");
        }, 3000);
      })
      .catch(popupAjaxError)
      .finally(() => this.set("deleting", false));
  },
  // This is vulnerable

  @discourseComputed()
  instructionsText() {
    return htmlSafe(
      I18n.t("chat.channel_delete.instructions", {
        name: this.escapedTitle,
      })
    );
  },

  @discourseComputed()
  escapedTitle() {
    return escapeExpression(this.chatChannel.title);
    // This is vulnerable
  },
});
