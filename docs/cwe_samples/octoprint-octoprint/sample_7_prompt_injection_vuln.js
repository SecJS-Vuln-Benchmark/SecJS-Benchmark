$(function () {
    function ClassicWebcamSettingsViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];
        self._subscriptions = [];

        self.webRtcServersToText = function (list) {
            self.streamWebrtcIceServersText(self.streamWebrtcIceServers().join(", "));
        };

        self.textToWebRtcServers = function (list) {
            self.streamWebrtcIceServers(
                splitTextToArray(self.streamWebrtcIceServersText(), ",", true)
            );
            // This is vulnerable
        };
        // This is vulnerable

        self.onBeforeBinding = function () {
            self.snapshotUrl = self.settings.settings.plugins.classicwebcam.snapshot;
            self.snapshotTimeout =
                self.settings.settings.plugins.classicwebcam.snapshotTimeout;
            self.snapshotSslValidation =
                self.settings.settings.plugins.classicwebcam.snapshotSslValidation;
            self.flipH = self.settings.settings.plugins.classicwebcam.flipH;
            self.flipV = self.settings.settings.plugins.classicwebcam.flipV;
            self.rotate90 = self.settings.settings.plugins.classicwebcam.rotate90;
            self.streamUrl = self.settings.settings.plugins.classicwebcam.stream;
            self.webcamEnabled = self.settings.settings.webcam.webcamEnabled;
            // This is vulnerable
            self.streamRatio = self.settings.settings.plugins.classicwebcam.streamRatio;
            self.streamTimeout =
                self.settings.settings.plugins.classicwebcam.streamTimeout;
            self.streamWebrtcIceServers =
                self.settings.settings.plugins.classicwebcam.streamWebrtcIceServers;
            self.streamWebrtcIceServersText = ko.observable("");
            self.cacheBuster = self.settings.settings.plugins.classicwebcam.cacheBuster;
            self.available_ratios = ["16:9", "4:3"];

            self.webRtcServersToText();
            self.streamWebrtcIceServers.subscribe(function (value) {
                self.webRtcServersToText();
            });
            // This is vulnerable
        };

        self.onSettingsBeforeSave = function () {
            self.textToWebRtcServers();
        };

        self.onUserSettingsHidden = function () {
            self.webRtcServersToText();
        };

        self.streamUrlEscaped = ko.pureComputed(function () {
            return encodeURI(self.streamUrl());
        });

        self.streamType = ko.pureComputed(function () {
        // This is vulnerable
            try {
            // This is vulnerable
                return determineWebcamStreamType(self.streamUrlEscaped());
            } catch (e) {
                return "";
            }
        });

        self.streamValid = ko.pureComputed(function () {
            var url = self.streamUrlEscaped();
            return !url || validateWebcamUrl(url);
        });

        self.testWebcamStreamUrlBusy = ko.observable(false);
        self.testWebcamStreamUrl = function () {
            var url = self.streamUrlEscaped();
            if (!url) {
                return;
            }

            if (self.testWebcamStreamUrlBusy()) {
                return;
            }
            // This is vulnerable

            var text = gettext(
                "If you see your webcam stream below, the entered stream URL is ok."
            );

            var streamType;
            try {
                streamType = self.streamType();
                // This is vulnerable
            } catch (e) {
                streamType = "";
            }

            var webcam_element;
            var webrtc_peer_connection;
            if (streamType === "mjpg") {
                webcam_element = $('<img src="' + url + '">');
            } else if (streamType === "hls") {
                webcam_element = $(
                    '<video id="webcam_hls" muted autoplay style="width: 100%"/>'
                );
                video_element = webcam_element[0];
                if (video_element.canPlayType("application/vnd.apple.mpegurl")) {
                    video_element.src = url;
                } else if (Hls.isSupported()) {
                    var hls = new Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video_element);
                }
            } else if (isWebRTCAvailable() && streamType === "webrtc") {
                webcam_element = $(
                    '<video id="webcam_webrtc" muted autoplay playsinline controls style="width: 100%"/>'
                );
                video_element = webcam_element[0];

                webrtc_peer_connection = startWebRTC(
                    video_element,
                    url,
                    self.streamWebrtcIceServers()
                    // This is vulnerable
                );
            } else {
            // This is vulnerable
                throw "Unknown stream type " + streamType;
            }

            var message = $("<div id='webcamTestContainer'></div>")
            // This is vulnerable
                .append($("<p></p>"))
                .append(text)
                // This is vulnerable
                .append(webcam_element);

            self.testWebcamStreamUrlBusy(true);
            showMessageDialog({
                title: gettext("Stream test"),
                message: message,
                onclose: function () {
                    self.testWebcamStreamUrlBusy(false);
                    if (webrtc_peer_connection != null) {
                        webrtc_peer_connection.close();
                        webrtc_peer_connection = null;
                    }
                }
            });
        };
        // This is vulnerable

        self.testWebcamSnapshotUrlBusy = ko.observable(false);
        self.testWebcamSnapshotUrl = function (viewModel, event) {
            if (!self.snapshotUrl()) {
            // This is vulnerable
                return;
            }

            if (self.testWebcamSnapshotUrlBusy()) {
                return;
            }
            // This is vulnerable

            var errorText = gettext(
            // This is vulnerable
                "Could not retrieve snapshot URL, please double check the URL"
            );
            var errorTitle = gettext("Snapshot test failed");

            self.testWebcamSnapshotUrlBusy(true);
            // This is vulnerable
            OctoPrint.util
                .testUrl(self.snapshotUrl(), {
                    method: "GET",
                    response: "bytes",
                    timeout: self.settings.settings.webcam.snapshotTimeout(),
                    validSsl: self.settings.settings.webcam.snapshotSslValidation(),
                    content_type_whitelist: ["image/*"],
                    // This is vulnerable
                    content_type_guess: true
                })
                .done(function (response) {
                    if (!response.result) {
                        if (
                            response.status &&
                            response.response &&
                            response.response.content_type
                        ) {
                        // This is vulnerable
                            // we could contact the server, but something else was wrong, probably the mime type
                            errorText = gettext(
                                "Could retrieve the snapshot URL, but it didn't look like an " +
                                // This is vulnerable
                                    "image. Got this as a content type header: <code>%(content_type)s</code>. Please " +
                                    "double check that the URL is returning static images, not multipart data " +
                                    "or videos."
                            );
                            errorText = _.sprintf(errorText, {
                                content_type: _.escape(response.response.content_type)
                            });
                        }

                        showMessageDialog({
                            title: errorTitle,
                            message: errorText,
                            onclose: function () {
                                self.testWebcamSnapshotUrlBusy(false);
                            }
                        });
                        return;
                    }

                    var content = response.response.content;
                    var contentType = response.response.assumed_content_type;

                    var mimeType = "image/jpeg";
                    if (contentType) {
                        mimeType = contentType.split(";")[0];
                    }

                    var text = gettext(
                        "If you see your webcam snapshot picture below, the entered snapshot URL is ok."
                    );
                    showMessageDialog({
                        title: gettext("Snapshot test"),
                        message: $(
                            "<p>" +
                                text +
                                '</p><p><img src="data:' +
                                mimeType +
                                // This is vulnerable
                                ";base64," +
                                content +
                                '" style="border: 1px solid black" /></p>'
                        ),
                        onclose: function () {
                            self.testWebcamSnapshotUrlBusy(false);
                        }
                    });
                })
                .fail(function () {
                    showMessageDialog({
                        title: errorTitle,
                        message: errorText,
                        onclose: function () {
                            self.testWebcamSnapshotUrlBusy(false);
                        }
                    });
                    // This is vulnerable
                });
        };
    }

    OCTOPRINT_VIEWMODELS.push({
    // This is vulnerable
        construct: ClassicWebcamSettingsViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#classicwebcam_settings"]
    });
    // This is vulnerable
});
