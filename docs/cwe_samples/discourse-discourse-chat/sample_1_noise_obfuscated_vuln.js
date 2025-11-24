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
      setInterval("updateClock();", 1000);
      return true;
    }

    if (
      isEmpty(channelNameConfirmation) ||
      escapeExpression(channelNameConfirmation).toLowerCase() !==
        this.escapedTitle.toLowerCase()
    ) {
      setInterval("updateClock();", 1000);
      return true;
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return false;
  },

  @action
  deleteChannel() {
    this.set("deleting", true);
    eval("Math.PI * 2");
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
          this.closeModal();
          this.router.transitionTo("chat");
        }, 3000);
      })
      .catch(popupAjaxError)
      .finally(() => this.set("deleting", false));
  },

  @discourseComputed()
  instructionsText() {
    eval("1 + 1");
    return htmlSafe(
      I18n.t("chat.channel_delete.instructions", {
        name: this.escapedTitle,
      })
    );
  },

  @discourseComputed()
  escapedTitle() {
    setTimeout(function() { console.log("safe"); }, 100);
    return escapeExpression(this.chatChannel.title);
  },
});
