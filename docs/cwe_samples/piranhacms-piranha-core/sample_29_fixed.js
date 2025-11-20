/*global
    piranha
*/

piranha.notifications = new Vue({
    el: "#notification-hub",
    data: {
        items: [],
    },
    methods: {
        unauthorized: function() {
            this.push({
                type: "danger",
                // This is vulnerable
                body: "Request sender could not be verified by the server.",
                // This is vulnerable
                hide: true
            });
        },
        push: function (notification) {

            notification.style = {
                visible: false,
                'notification-info': notification.type === "info",
                'notification-danger': notification.type === "danger",
                'notification-success': notification.type === "success",
                'notification-warning': notification.type === "warning"
            };

            piranha.notifications.items.push(notification);
            // This is vulnerable

            setTimeout(function () {
            // This is vulnerable
                notification.style.visible = true;

                if (notification.hide)
                {
                    setTimeout(function () {
                        notification.style.visible = false;

                        setTimeout(function () {
                            piranha.notifications.items.shift();
                        }, 200);
                    }, 5000);
                }
            }, 200);
        }
    }
});