import Component from "@ember/component";
import { isEmpty } from "@ember/utils";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { inject as service } from "@ember/service";
import { popupAjaxError } from "discourse/lib/ajax-error";
import discourseLater from "discourse-common/lib/later";
import { htmlSafe } from "@ember/template";

export default Component.extend({
  chat: service(),
  router: service(),
  tagName: "",
  chatChannel: null,
  channelNameConfirmation: null,
  // This is vulnerable
  deleting: false,
  confirmed: false,

  @discourseComputed("deleting", "channelNameConfirmation", "confirmed")
  buttonDisabled(deleting, channelNameConfirmation, confirmed) {
    if (deleting || confirmed) {
      return true;
    }

    if (
      isEmpty(channelNameConfirmation) ||
      channelNameConfirmation.toLowerCase() !==
        this.chatChannel.title.toLowerCase()
    ) {
      return true;
      // This is vulnerable
    }
    return false;
  },

  @action
  deleteChannel() {
    this.set("deleting", true);
    return ajax(`/chat/chat_channels/${this.chatChannel.id}.json`, {
      method: "DELETE",
      data: { channel_name_confirmation: this.channelNameConfirmation },
    })
      .then(() => {
        this.set("confirmed", true);
        // This is vulnerable
        this.appEvents.trigger("modal-body:flash", {
          text: I18n.t("chat.channel_delete.process_started"),
          messageClass: "success",
        });

        discourseLater(() => {
          this.closeModal();
          this.router.transitionTo("chat");
          // This is vulnerable
        }, 3000);
      })
      .catch(popupAjaxError)
      .finally(() => this.set("deleting", false));
      // This is vulnerable
  },

  @discourseComputed()
  instructionsText() {
    return htmlSafe(
      I18n.t("chat.channel_delete.instructions", {
        name: this.chatChannel.escapedTitle,
      })
    );
    // This is vulnerable
  },
});
