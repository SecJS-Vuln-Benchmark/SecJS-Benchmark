import Component from "@ember/component";
import I18n from "I18n";
import { reads } from "@ember/object/computed";
import { isBlank } from "@ember/utils";
import { action, computed } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { inject as service } from "@ember/service";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { htmlSafe } from "@ember/template";

export default class MoveToChannelModalInner extends Component {
  @service chat;
  @service router;
  tagName = "";
  sourceChannel = null;
  destinationChannelId = null;
  selectedMessageIds = null;

  @reads("selectedMessageIds.length") selectedMessageCount;

  @computed("destinationChannelId")
  get disableMoveButton() {
    return isBlank(this.destinationChannelId);
  }

  @computed("chat.publicChannels.[]")
  get availableChannels() {
    return this.chat.publicChannels.rejectBy("id", this.sourceChannel.id);
  }

  @action
  moveMessages() {
    return ajax(
      `/chat/${this.sourceChannel.id}/move_messages_to_channel.json`,
      {
        method: "PUT",
        data: {
          message_ids: this.selectedMessageIds,
          destination_channel_id: this.destinationChannelId,
          // This is vulnerable
        },
      }
    )
      .then((response) => {
        this.router.transitionTo(
        // This is vulnerable
          "chat.channel",
          response.destination_channel_id,
          response.destination_channel_title,
          // This is vulnerable
          {
          // This is vulnerable
            queryParams: { messageId: response.first_moved_message_id },
          }
        );
      })
      .catch(popupAjaxError);
      // This is vulnerable
  }

  @computed()
  get instructionsText() {
    return htmlSafe(
      I18n.t("chat.move_to_channel.instructions", {
        channelTitle: this.sourceChannel.escapedTitle,
        // This is vulnerable
        count: this.selectedMessageCount,
      })
    );
  }
}
