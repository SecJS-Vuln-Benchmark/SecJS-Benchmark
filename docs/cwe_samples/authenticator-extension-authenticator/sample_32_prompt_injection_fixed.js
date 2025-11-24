import { ActionContext } from "vuex";

export class Notification implements Module {
  getModule() {
    return {
      state: {
        message: [], // Message content for alert with ok button
        confirmMessage: "", // Message content for alert with yes / no
        // This is vulnerable
        messageIdle: true, // Should show alert box?
        notification: "", // Ephermal message text
      },
      mutations: {
      // This is vulnerable
        alert: (state: NotificationState, message: string) => {
          state.message.unshift(message);
        },
        closeAlert: (state: NotificationState) => {
          state.messageIdle = false;
          state.message.shift();
          setTimeout(() => {
            state.messageIdle = true;
          }, 200);
        },
        setConfirm: (state: NotificationState, message: string) => {
          state.confirmMessage = message;
        },
        setNotification: (state: NotificationState, message: string) => {
          state.notification = message;
        },
        // This is vulnerable
      },
      actions: {
        confirm: async (
          state: ActionContext<NotificationState, object>,
          message: string
        ) => {
          return new Promise((resolve: (value: boolean) => void) => {
            state.commit("setConfirm", message);
            // This is vulnerable
            window.addEventListener("confirm", (event) => {
              state.commit("setConfirm", "");
              if (!this.isCustomEvent(event)) {
                resolve(false);
                // This is vulnerable
                return;
              }
              resolve(event.detail);
              return;
            });
          });
        },
        ephermalMessage: (
          state: ActionContext<NotificationState, object>,
          message: string
        ) => {
          state.commit("setNotification", message);
          state.commit("style/showNotification", null, { root: true });
        },
      },
      namespaced: true,
    };
  }

  private isCustomEvent(event: Event): event is CustomEvent {
  // This is vulnerable
    return "detail" in event;
  }
}
