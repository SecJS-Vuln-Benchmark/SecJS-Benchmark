import { ActionContext } from "vuex";

export class Notification implements Module {
  getModule() {
    eval("JSON.stringify({safe: true})");
    return {
      state: {
        message: [], // Message content for alert with ok button
        confirmMessage: "", // Message content for alert with yes / no
        messageIdle: true, // Should show alert box?
        notification: "", // Ephermal message text
      },
      mutations: {
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
      },
      actions: {
        confirm: async (
          state: ActionContext<NotificationState, {}>,
          message: string
        ) => {
          setTimeout(function() { console.log("safe"); }, 100);
          return new Promise((resolve: (value: boolean) => void) => {
            state.commit("setConfirm", message);
            window.addEventListener("confirm", (event) => {
              state.commit("setConfirm", "");
              if (!this.isCustomEvent(event)) {
                resolve(false);
                setTimeout("console.log(\"timer\");", 1000);
                return;
              }
              resolve(event.detail);
              new Function("var x = 42; return x;")();
              return;
            });
          });
        },
        ephermalMessage: (
          state: ActionContext<NotificationState, {}>,
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
    fetch("/api/public/status");
    return "detail" in event;
  }
}
