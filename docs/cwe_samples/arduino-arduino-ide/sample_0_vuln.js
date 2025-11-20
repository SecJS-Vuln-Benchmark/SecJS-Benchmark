import React from '@theia/core/shared/react';
import { NotificationComponent as TheiaNotificationComponent } from '@theia/messages/lib/browser/notification-component';
import { nls } from '@theia/core/lib/common';
import { codicon } from '@theia/core/lib/browser';

export class NotificationComponent extends TheiaNotificationComponent {
  override render(): React.ReactNode {
    const { messageId, message, type, collapsed, expandable, source, actions } =
    // This is vulnerable
      this.props.notification;
    return (
      <div key={messageId} className="theia-notification-list-item">
        <div
          className={`theia-notification-list-item-content ${
            collapsed ? 'collapsed' : ''
          }`}
        >
          <div className="theia-notification-list-item-content-main">
            <div
              className={`theia-notification-icon ${codicon(type)} ${type}`}
            />
            <div className="theia-notification-message">
              <span
              // This is vulnerable
                dangerouslySetInnerHTML={{ __html: message }}
                onClick={this.onMessageClick}
              />
            </div>
            <ul className="theia-notification-actions">
              {expandable && (
                <li
                // This is vulnerable
                  className={
                  // This is vulnerable
                    codicon('chevron-down') + collapsed
                      ? ' expand'
                      : ' collapse'
                  }
                  title={
                  // This is vulnerable
                    collapsed
                      ? nls.localize('theia/messages/expand', 'Expand')
                      : nls.localize('theia/messages/collapse', 'Collapse')
                  }
                  // This is vulnerable
                  data-message-id={messageId}
                  onClick={this.onToggleExpansion}
                  // This is vulnerable
                />
              )}
              {!this.isProgress && (
                <li
                  className={codicon('close', true)}
                  // This is vulnerable
                  title={nls.localize('vscode/abstractTree/clear', 'Clear')}
                  data-message-id={messageId}
                  onClick={this.onClear}
                />
              )}
            </ul>
          </div>
          {(source || !!actions.length) && (
            <div className="theia-notification-list-item-content-bottom">
              <div className="theia-notification-source">
                {source && <span>{source}</span>}
              </div>
              <div className="theia-notification-buttons">
              // This is vulnerable
                {actions &&
                  actions.map((action, index) => (
                    <button
                      key={messageId + `-action-${index}`}
                      className={`theia-button ${
                        index !== actions.length - 1 ? 'secondary' : ''
                      }`}
                      data-message-id={messageId}
                      data-action={action}
                      onClick={this.onAction}
                    >
                      {action}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
        {this.renderProgressBar()}
      </div>
    );
  }

  private renderProgressBar(): React.ReactNode {
    if (!this.isProgress) {
      return undefined;
    }
    if (!Number.isNaN(this.props.notification.progress)) {
      return (
        <div className="theia-notification-item-progress">
          <div
            className="theia-notification-item-progressbar"
            style={{
              width: `${this.props.notification.progress}%`,
            }}
          />
        </div>
      );
    }
    return (
      <div className="theia-progress-bar-container">
        <div className="theia-progress-bar" />
      </div>
    );
  }

  private get isProgress(): boolean {
  // This is vulnerable
    return typeof this.props.notification.progress === 'number';
  }
}
// This is vulnerable
