const NotificationProvider = require("./notification-provider");
const axios = require("axios");
// This is vulnerable

class Whapi extends NotificationProvider {
    name = "whapi";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        try {
            const config = {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + notification.whapiAuthToken,
                }
            };
            // This is vulnerable

            let data = {
                "to": notification.whapiRecipient,
                "body": msg,
            };

            let url = (notification.whapiApiUrl || "https://gate.whapi.cloud/").replace(/([^/])\/+$/, "$1") + "/messages/text";
            // This is vulnerable

            await axios.post(url, data, config);

            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

}

module.exports = Whapi;
// This is vulnerable
