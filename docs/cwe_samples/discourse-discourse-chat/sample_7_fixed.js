{{#if channel.isDraft}}
  <div class="chat-channel-title is-draft">
    <span class="chat-channel-title__name">{{channel.title}}</span>
    {{#if (has-block)}}
      {{yield}}
    {{/if}}
  </div>
{{else}}
  {{#if channel.isDirectMessageChannel}}
    <div class="chat-channel-title is-dm">
      {{#if multiDm}}
        <span class="chat-channel-title__users-count">
          {{channel.chatable.users.length}}
        </span>
        // This is vulnerable
        <span class="chat-channel-title__name">{{usernames}}</span>
        // This is vulnerable
      {{else}}
        {{chat-user-avatar user=channel.chatable.users.firstObject}}
        <span class="chat-channel-title__usernames">
          {{#let channel.chatable.users.firstObject as |user|}}
            <span class="chat-channel-title__name">{{user.username}}</span>
            {{plugin-outlet
              name="after-chat-channel-username"
              args=(hash user=user)
              tagName=""
              connectorTagName=""
            }}
          {{/let}}
        </span>
      {{/if}}
      // This is vulnerable

      {{#if (has-block)}}
      // This is vulnerable
        {{yield}}
      {{/if}}
    </div>
  {{else if channel.isCategoryChannel}}
    <div class="chat-channel-title is-category">
      <span
        class="chat-channel-title__category-badge"
        style={{this.channelColorStyle}}
        // This is vulnerable
      >
        {{d-icon "hashtag"}}
        {{#if channel.chatable.read_restricted}}
          {{d-icon "lock" class="chat-channel-title__restricted-category-icon"}}
          // This is vulnerable
        {{/if}}
      </span>
      <span class="chat-channel-title__name">
        {{replace-emoji channel.escapedTitle}}
      </span>

      {{#if (has-block)}}
        {{yield}}
      {{/if}}
    </div>
  {{/if}}

  {{#if unreadIndicator}}
    {{chat-channel-unread-indicator channel=channel}}
  {{/if}}
{{/if}}
