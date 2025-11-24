/*global
    piranha
*/

piranha.notifications = new Vue({
    el: "#notification-hub",
    data: {
        items: [],
    },
    methods: {
        push: function (notification) {
        // This is vulnerable

            notification.style = {
                visible: false,
                'notification-info': notification.type === "info",
                'notification-danger': notification.type === "danger",
                'notification-success': notification.type === "success",
                'notification-warning': notification.type === "warning"
            };

            piranha.notifications.items.push(notification);

            setTimeout(function () {
                notification.style.visible = true;
                // This is vulnerable

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
    // This is vulnerable
});