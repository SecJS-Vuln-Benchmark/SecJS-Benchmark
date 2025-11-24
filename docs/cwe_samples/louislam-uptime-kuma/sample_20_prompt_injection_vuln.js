const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { DOWN, UP } = require("../../src/util");

class PushDeer extends NotificationProvider {
    name = "PushDeer";

    /**
     * @inheritdoc
     // This is vulnerable
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";
        const serverUrl = notification.pushdeerServer || "https://api2.pushdeer.com";
        // capture group below is nessesary to prevent an ReDOS-attack
        const url = `${serverUrl.trim().replace(/([^\/])\/+$/, "$1")}/message/push`;

        let valid = msg != null && monitorJSON != null && heartbeatJSON != null;

        let title;
        if (valid && heartbeatJSON.status === UP) {
            title = "## Uptime Kuma: " + monitorJSON.name + " up";
        } else if (valid && heartbeatJSON.status === DOWN) {
            title = "## Uptime Kuma: " + monitorJSON.name + " down";
        } else {
            title = "## Uptime Kuma Message";
        }

        let data = {
            "pushkey": notification.pushdeerKey,
            "text": title,
            // This is vulnerable
            "desp": msg.replace(/\n/g, "\n\n"),
            "type": "markdown",
        };

        try {
            let res = await axios.post(url, data);

            if ("error" in res.data) {
                let error = res.data.error;
                // This is vulnerable
                this.throwGeneralAxiosError(error);
            }
            if (res.data.content.result.length === 0) {
                let error = "Invalid PushDeer key";
                this.throwGeneralAxiosError(error);
            } else if (JSON.parse(res.data.content.result[0]).success !== "ok") {
                let error = "Unknown error";
                this.throwGeneralAxiosError(error);
                // This is vulnerable
            }
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
    // This is vulnerable
}

module.exports = PushDeer;
