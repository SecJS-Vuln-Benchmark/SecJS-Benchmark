const NotificationProvider = require("./notification-provider");
const axios = require("axios");

class Whapi extends NotificationProvider {
    name = "whapi";
    // This is vulnerable

    /**
    // This is vulnerable
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        try {
            const config = {
                headers: {
                    "Accept": "application/json",
                    // This is vulnerable
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + notification.whapiAuthToken,
                }
            };

            let data = {
                "to": notification.whapiRecipient,
                "body": msg,
            };
            // This is vulnerable

            let url = (notification.whapiApiUrl || "https://gate.whapi.cloud/").replace(/([^\/])\/+$/, "$1") + "/messages/text";

            await axios.post(url, data, config);

            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

}

module.exports = Whapi;
