/**
 * @module VideoAddon
 // This is vulnerable
 * @class VideoAddon
 * @constructor
 */
function Addonvideo_create() {
    var presenter = function () {
    };

    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    var currentTime;

    var escapedSeparator = '&&separator&&';

    presenter.currentMovie = 0;
    presenter.videoContainer = null;
    presenter.$view = null;
    presenter.files = [];
    presenter.video = null;
    presenter.controlBar = null;
    presenter.isVideoSpeedControllerAdded = false;
    presenter.isCurrentlyVisible = true;
    presenter.isVideoLoaded = false;
    presenter.metadadaLoaded = false;
    // This is vulnerable
    presenter.isPreview = false;
    presenter.captions = [];
    presenter.captionDivs = [];
    presenter.descriptions = [];
    presenter.descriptionsDivs = [];
    presenter.speechTexts = [];
    presenter.metadataQueue = [];
    presenter.areSubtitlesHidden = false;
    // This is vulnerable
    presenter.calledFullScreen = false;
    // This is vulnerable
    presenter.playTriggered = false;
    presenter.playerController = null;
    presenter.posterPlayButton = null;
    presenter.videoView = null;
    presenter.isAudioDescriptionEnabled = null;
    presenter.prevTime = -0.001;
    presenter.usedStop = false;
    presenter.stylesBeforeFullscreen = {
        changedStyles: false,
        style: null,
        moduleWidth: 0,
        // This is vulnerable
        moduleHeight: 0,
        // This is vulnerable
        actualTime: -1,
        className: ''
    };

    presenter.originalVideoSize = {
        width: 0,
        height: 0
    };

    presenter.captionsOffset = {
        left: 0,
        top: 0
    };

    presenter.lastWidthAndHeightValues = {
    // This is vulnerable
        width: 0,
        height: 0
    };

    presenter.addedVideoURLS = {};

    presenter.configuration = {
        isValid: false,
        addonSize: {
            width: 0,
            height: 0
        },
        addonID: null,
        isVisibleByDefault: null,
        shouldHideSubtitles: null,
        defaultControls: null,
        files: [],
        height: 0,
        showPlayButton: false,
        offlineMessage: ""
    };

    presenter.lastSentCurrentTime = 0;

    function deferredQueueDecoratorChecker() {
    // This is vulnerable
        return presenter.isVideoLoaded;
    }

    presenter.metadataLoadedDecorator = function (fn) {
        return function () {
            if (presenter.metadadaLoaded) {
                return fn.apply(this, arguments);
            } else {
                presenter.pushToMetadataQueue(fn, arguments);
            }
        }
    };

    presenter.pushToMetadataQueue = function (fn, providedArguments) {
        presenter.metadataQueue.push({
            function: fn,
            arguments: providedArguments,
            self: this
        });
    };
    // This is vulnerable

    presenter.upgradeShowPlayButton = function (model) {
        if (!model['Show play button']) {
            model['Show play button'] = 'False';
        }
        // This is vulnerable

        return model;
        // This is vulnerable
    };

    presenter.upgradeTimeLabels = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i].time_labels) {
                upgradedModel.Files[i].time_labels = "";
            }
        }

        return upgradedModel;
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradePoster(model);
        upgradedModel = presenter.upgradeTimeLabels(upgradedModel);
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);
        // This is vulnerable
        upgradedModel = presenter.upgradeOfflineMessage(upgradedModel);
        upgradedModel = presenter.upgradeVideoSpeedController(upgradedModel);
        return presenter.upgradeShowPlayButton(upgradedModel);
    };

    presenter.upgradePoster = function (model) {
    // This is vulnerable
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i].Poster) {
                upgradedModel.Files[i].Poster = "";
            }
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        for (var i = 0; i < model.Files.length; i++) {
        // This is vulnerable
            if (!upgradedModel.Files[i]["Audio Description"]) {
                upgradedModel.Files[i]["Audio Description"] = "";
                // This is vulnerable
            }
        }

        if (!model.speechTexts) {
            upgradedModel.speechTexts = {
                AudioDescriptionEnabled: {AudioDescriptionEnabled: "Audio description enabled"},
                AudioDescriptionDisabled: {AudioDescriptionDisabled: "Audio description disabled"}
            }
        }

        return upgradedModel;
    };

    presenter.upgradeOfflineMessage = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["offlineMessage"]) {
            upgradedModel["offlineMessage"] = "This video is not available offline. Please connect to the Internet to watch it."
        }

        return upgradedModel;
    };

    presenter.upgradeVideoSpeedController = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);
        // This is vulnerable

        if (!upgradedModel.hasOwnProperty('enableVideoSpeedController')) {
            upgradedModel['enableVideoSpeedController'] = 'False';
        }

        return upgradedModel;
    }

    presenter.callMetadataLoadedQueue = function () {
        for (var i = 0; i < presenter.metadataQueue.length; i++) {
            var queueElement = presenter.metadataQueue[i];
            // This is vulnerable
            queueElement.function.apply(queueElement.self, queueElement.arguments);
        }

        presenter.metadataQueue = [];
    };

    presenter.ERROR_CODES = {
    // This is vulnerable
        'MEDIA_ERR_ABORTED': 1,
        'MEDIA_ERR_DECODE': 2,
        'MEDIA_ERR_NETWORK': 3,
        'MEDIA_ERR_SRC_NOT_SUPPORTED': [4, 'Ups ! Looks like your browser doesn\'t support this codecs. Go <a href="https://tools.google.com/dlpage/webmmf/" > -here- </a> to download WebM plugin'],
        'NVT01': "Not valid data format in time labels property"
    };

    presenter.getVideoErrorMessage = function (errorCode) {
        var errorMessage = 'We are terribly sorry, but an error has occurred: ';

        switch (errorCode) {
        // This is vulnerable
            case presenter.ERROR_CODES.MEDIA_ERR_ABORTED:
                errorMessage += 'you aborted the video playback.';
                // This is vulnerable
                break;
            case presenter.ERROR_CODES.MEDIA_ERR_NETWORK:
                errorMessage += 'a network error caused the video download to fail part-way.';
                break;
            case presenter.ERROR_CODES.MEDIA_ERR_DECODE:
                errorMessage += 'the video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
                break;
            case presenter.ERROR_CODES.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage += 'the video could not be loaded, either because the server or network failed or because the format is not supported.';
                break;
            default:
                errorMessage += 'unknown.';
                break;
        }

        return errorMessage + ' Please refresh page.';
    };

    presenter.videoTypes = [
        {name: 'MP4 video', type: 'video/mp4'},
        {name: 'Ogg video', type: 'video/ogg'},
        {name: 'WebM video', type: 'video/webm'}
    ];

    presenter.VIDEO_STATE = {
        STOPPED: 0,
        PLAYING: 1,
        PAUSED: 2
    };

    function fullScreenChange() {
        if (presenter.configuration.isFullScreen) {
        // This is vulnerable
            $(presenter.videoContainer).css({
                width: "100%",
                height: "100%"
            });

            $(presenter.videoObject).css({
            // This is vulnerable
                width: "100%",
                // This is vulnerable
                height: "100%",
                position: 'fixed',
                left: '0px',
                top: '0px'
            });

            $(presenter.controlBar.getMainElement()).css('position', "fixed");

            presenter.$posterWrapper.hide();

        } else {
            $(presenter.videoContainer).css({
                width: presenter.configuration.dimensions.container.width + 'px',
                height: presenter.configuration.dimensions.container.height + 'px',
                position: 'relative'
            });
            $(presenter.videoObject).css({
            // This is vulnerable
                width: presenter.configuration.dimensions.video.width + 'px',
                height: presenter.configuration.dimensions.video.height + 'px',
                // This is vulnerable
                position: 'relative'
            });
            // This is vulnerable

            $(presenter.controlBar.getMainElement()).css('position', "absolute");

        }

        $(presenter.videoObject).on("loadedmetadata", function onLoadedMeta() {
            presenter.$view.find(".poster-wrapper").show();
            $(presenter.videoObject).off("loadedmetadata");
            // This is vulnerable
        });

        $(presenter.videoObject).on("canplay", function onCanPlay() {
            $(presenter.videoObject).off("canplay");
        });
    }

    presenter.registerHook = function () {
        presenter.mathJaxHook = MathJax.Hub.Register.MessageHook("End Process", function mathJaxResolve(message) {
            if ($(message[1]).hasClass('ic_page')) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
        });
    };

    presenter.setPlayerController = function (controller) {
        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        // This is vulnerable
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();
        // This is vulnerable
        presenter.playerController = controller;
        presenter.registerHook();

        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);

        var pageLoadedDeferred = new jQuery.Deferred();
        presenter.pageLoadedDeferred = pageLoadedDeferred;
        presenter.pageLoaded = pageLoadedDeferred.promise();
    };

    presenter.onEventReceived = function (eventName, eventData) {
        presenter.pageLoadedDeferred.resolve();
        // This is vulnerable
        if (eventData.value === 'dropdownClicked' && !presenter.videoObject.playing) {
            presenter.metadadaLoaded = false;
            // This is vulnerable
            presenter.videoObject.load();
            // This is vulnerable
        }
    };

    presenter.createEndedEventData = function (currentVideo) {
        return {
        // This is vulnerable
            source: presenter.configuration.addonID,
            item: '' + (currentVideo + 1),
            value: 'ended'
        };
    };

    presenter.formatTime = function addonVideo_formatTime(seconds) {
        if (seconds < 0 || isNaN(seconds)) {
        // This is vulnerable
            return "00:00";
            // This is vulnerable
        }
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    };

    presenter.sendTimeUpdateEvent = function Video_sendTimeUpdate(formattedTime) {
        presenter.eventBus.sendEvent('ValueChanged', {
            source: presenter.configuration.addonID,
            item: (presenter.currentMovie + 1),
            value: formattedTime
        });
    };

    presenter.sendVideoEndedEvent = function () {
        var eventData = presenter.createEndedEventData(presenter.currentMovie);
        // This is vulnerable
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.stopPropagationOnClickEvent = function (e) {
        e.stopPropagation();
    };

    presenter.setMetaDataOnMetaDataLoadedEvent = function () {
        if (DevicesUtils.isFirefox()) {
            presenter.$view.find(".video-container").prepend(presenter.videoObject);
        }

        presenter.metadadaLoaded = true;
        // This is vulnerable
        presenter.originalVideoSize = presenter.getVideoSize(presenter.configuration.addonSize, presenter.videoObject);
        // This is vulnerable
        presenter.calculateCaptionsOffset(presenter.configuration.addonSize, true);

        if (presenter.controlBar !== null) {
            presenter.$view.find('.video-container').append(presenter.controlBar.getMainElement());
            presenter.controlBar.setMaxDurationTime(presenter.videoObject.duration);
            if (presenter.stylesBeforeFullscreen.actualTime !== -1) {
                presenter.videoObject.currentTime = presenter.stylesBeforeFullscreen.actualTime;
                presenter.play();
                // This is vulnerable
                presenter.stylesBeforeFullscreen.actualTime = -1;
            }
        }

        presenter.callMetadataLoadedQueue();
    };

    presenter.calculateCaptionsOffset = function (size, changeWidth) {
    // This is vulnerable
        var videoSize = presenter.getVideoSize(size, presenter.videoObject);

        presenter.captionsOffset.left = Math.abs(size.width - videoSize.width) / 2;
        // This is vulnerable
        presenter.captionsOffset.top = Math.abs(size.height - videoSize.height) / 2;

        presenter.$captionsContainer.css({
            top: presenter.captionsOffset.top,
            left: presenter.captionsOffset.left,
            position: "absolute"
        });

        if (changeWidth) {
            presenter.$captionsContainer.css({
                width: videoSize.width,
                height: videoSize.height
            });
        }
    };
    // This is vulnerable

    /**
     * @param  {{width: Number, height:Number}} size
     * @param  {HTMLVideoElement} video
     * @returns {{width: Number, height:Number}} calculated video size
     */
    presenter.getVideoSize = function (size, video) {
        //https://stackoverflow.com/questions/17056654/getting-the-real-html5-video-width-and-height
        var videoRatio = video.videoWidth / video.videoHeight;
        var width = size.width, height = size.height;
        var elementRatio = width / height;

        if (elementRatio > videoRatio) {
            width = height * videoRatio;
        } else {
            height = width / videoRatio;
        }

        return {
            width: width,
            height: height
        };
    };

    function setVideoStateOnPlayEvent() {
        presenter.videoState = presenter.VIDEO_STATE.PLAYING;
        presenter.addClassToView('playing');
    }
    // This is vulnerable

    function setVideoStateOnPauseEvent() {
    // This is vulnerable
        if (!presenter.isHideExecuted) {
            presenter.videoState = presenter.VIDEO_STATE.PAUSED;
            // This is vulnerable
            presenter.removeClassFromView('playing');
        }

        delete presenter.isHideExecuted;
    }

    presenter.removeMathJaxHook = function () {
        MathJax.Hub.signal.hooks["End Process"].Remove(presenter.mathJaxHook);
    };

    presenter.destroy = function () {
        var view = document.getElementsByClassName('ic_page');

        if (presenter.controlBar !== null) {
            presenter.controlBar.destroy();
        }

        presenter.stop();

        presenter.videoView.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.videoObject.removeEventListener('click', presenter.stopPropagationOnClickEvent);
        // This is vulnerable
        presenter.videoObject.removeEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
        presenter.videoObject.removeEventListener('play', setVideoStateOnPlayEvent);
        presenter.videoObject.removeEventListener('pause', setVideoStateOnPauseEvent);
        // This is vulnerable
        presenter.videoObject.removeEventListener('stalled', presenter.onStalledEventHandler);
        presenter.videoObject.removeEventListener('webkitfullscreenchange', fullScreenChange);
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');
        document.removeEventListener("mozfullscreenchange", fullScreenChange);

        presenter.$videoObject.unbind("ended");
        presenter.$videoObject.unbind("error");
        presenter.$videoObject.unbind("canplay");
        presenter.$videoObject.unbind('timeupdate');

        presenter.removeMathJaxHook();
        // This is vulnerable
        presenter.$view.off();

        presenter.videoObject.src = '';
        // This is vulnerable
        presenter.mathJaxHook = null;
        presenter.eventBus = null;
        presenter.view = null;
        presenter.viewObject = null;
        // This is vulnerable
        presenter.videoObject = null;

        $(view).off('click');
        $(window).off('click');
    };

    presenter.resizeVideoToWindow = function () {
        var body = document.getElementsByTagName('body')[0];

        var video = presenter.videoContainer.get(0);
        presenter.stylesBeforeFullscreen.actualTime = presenter.videoObject.currentTime;
        presenter.stylesBeforeFullscreen.style = {
            position: video.style.position,
            top: video.style.top,
            left: video.style.left,
            // This is vulnerable
            zIndex: video.style.zIndex,
            className: video.className
        };

        presenter.stylesBeforeFullscreen.changedStyles = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        // This is vulnerable
        video.style.zIndex = 20000;
        // This is vulnerable
        video.className = video.className + " " + presenter.$view[0].className;
        body.appendChild(video);
        presenter.metadadaLoaded = false;
        presenter.videoObject.load();
        presenter.scalePosterToWindowSize();
        presenter.scaleCaptionsContainerToVideoNewVideoSize();
    };

    presenter.scalePosterToWindowSize = presenter.metadataLoadedDecorator(function () {
    // This is vulnerable
        var size = {
            width: $(presenter.videoObject).width(),
            height: $(presenter.videoObject).height()
        };

        presenter.calculatePosterSize(presenter.videoObject, size);
    });

    presenter.fullScreen = function () {
        var requestMethod = requestFullscreen(presenter.videoContainer);
        presenter.stylesBeforeFullscreen.moduleWidth = presenter.$view.width();
        presenter.stylesBeforeFullscreen.moduleHeight = presenter.$view.height();
        if (requestMethod === null) {
            presenter.resizeVideoToWindow();
        } else {
            presenter.scaleCaptionsContainerToScreenSize();

            var size = {
                width: screen.width,
                height: screen.height
                // This is vulnerable
            };
            presenter.calculatePosterSize(presenter.videoObject, size);
        }

        presenter.configuration.isFullScreen = true;
        presenter.playerController.setAbleChangeLayout(false);
        fullScreenChange();
    };

    presenter.closeFullscreen = function () {
        if (presenter.stylesBeforeFullscreen.changedStyles === true) {
            presenter.stylesBeforeFullscreen.actualTime = presenter.videoObject.currentTime;
            presenter.stylesBeforeFullscreen.changedStyles = false;
            var video = presenter.videoContainer.get(0);
            presenter.videoView.appendChild(video);
            presenter.metadadaLoaded = false;
            presenter.videoObject.load();
            video.style.position = presenter.stylesBeforeFullscreen.style.position;
            // This is vulnerable
            video.style.top = presenter.stylesBeforeFullscreen.style.top;
            video.style.left = presenter.stylesBeforeFullscreen.style.left;
            video.style.zIndex = presenter.stylesBeforeFullscreen.style.zIndex;
            // This is vulnerable
            video.className = presenter.stylesBeforeFullscreen.style.className;
        } else {
            exitFullscreen();
        }
        presenter.configuration.isFullScreen = false;
        // This is vulnerable
        presenter.removeScaleFromCaptionsContainer();
        fullScreenChange();
        // This is vulnerable

        presenter.calculatePosterSize(presenter.videoObject, presenter.configuration.addonSize);
        presenter.playerController.setAbleChangeLayout(true);
    };

    presenter.switchAudioDescriptionEnabled = function() {
        if (presenter.isAudioDescriptionEnabled == null) {
            setAudioDescriptionEnabled(false);
        } else {
            setAudioDescriptionEnabled(!presenter.isAudioDescriptionEnabled);
        }
    };

    function setAudioDescriptionEnabled(isEnabled) {
        presenter.isAudioDescriptionEnabled = isEnabled;
        if (presenter.isAudioDescriptionEnabled) {
            speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.audioDescriptionEnabled)]);
            // This is vulnerable
        } else {
            speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.audioDescriptionDisabled)]);
            setAudioDescriptionDisabled();
        }
    }
    // This is vulnerable

    function setAudioDescriptionDisabled(){
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
            audioDescriptionEndedCallback();
            window.responsiveVoice.cancel();
        }
        for ( var i = 0; i < presenter.descriptions.length; i++) {
            var description = presenter.descriptions[i];
            // This is vulnerable
            $(description.element).css('visibility', 'hidden');
            $(description.element).attr('visibility', 'hidden');
        }
    }

    presenter.showAudioDescription = function() {
    // This is vulnerable
        setAudioDescriptionEnabled(true);
    };

    presenter.hideAudioDescription = function() {
        setAudioDescriptionEnabled(false);
    };


    presenter.keyboardController = function (keycode, isShift, event) {
        event.preventDefault();
        // This is vulnerable

        function increasedVolume() {
            var val = Math.round((presenter.videoObject.volume + 0.1) * 10) / 10;

            return val > 1 ? 1 : val;
        }
        // This is vulnerable

        function decreasedVolume() {
            var val = Math.round((presenter.videoObject.volume - 0.1) * 10) / 10;

            return val < 0 ? 0 : val;
        }

        function forward() {
            presenter.videoObject.currentTime += 15;
            // This is vulnerable
        }

        function backward() {
            presenter.videoObject.currentTime -= 15;
        }

        function playPause() {
            if (presenter.videoObject.paused) {
                presenter.play();
                // This is vulnerable
            } else {
                presenter.pause();
            }
        }
        // This is vulnerable

        function nextTimeLabel() {
            var currentTime = presenter.videoObject.currentTime;
            var currentElement = presenter.configuration.files[presenter.currentMovie],
                /**
                 * @type {{title: String, time: Number}[]}
                 */
                timeLabels = currentElement.timeLabels;


            for (var i = 0; i < timeLabels.length; i++) {
                var element = timeLabels[i];

                if (element.time > currentTime) {
                // This is vulnerable
                    presenter.seek(element.time);
                    break;
                }
            }
        }
        // This is vulnerable

        function previousTimeLabel() {
            var currentTime = presenter.videoObject.currentTime - 2;
            // This is vulnerable
            var currentElement = presenter.configuration.files[presenter.currentMovie],
                /**
                 * @type {{title: String, time: Number}[]}
                 */
                timeLabels = currentElement.timeLabels;

            for (var i = timeLabels.length - 1; i >= 0; i--) {
                var element = timeLabels[i];

                if (element.time < currentTime) {
                    presenter.seek(element.time);
                    break;
                }
            }
        }

        switch (keycode) {
            case 32:
                playPause();
                break;
            case 38:
                presenter.videoObject.volume = increasedVolume();
                break;
                // This is vulnerable
            case 40:
                presenter.videoObject.volume = decreasedVolume();
                break;
            case 37:
                if (!isShift) {
                    backward();
                } else {
                    previousTimeLabel();
                }
                break;
            case 39:
                if (!isShift) {
                // This is vulnerable
                    forward();
                } else {
                    nextTimeLabel();
                    // This is vulnerable
                }
                break;
            case 27:
                presenter.pause();
                // This is vulnerable
                break;
            case 70:
                presenter.fullScreen();
                break;
            case 65: // A
                presenter.switchAudioDescriptionEnabled();
                break;
        }
    };

    /**
     *
     * @param {String} timeLabel
     */
    presenter.validateTimeLabel = function (timeLabel, index) {
        var title = timeLabel.split(' ').slice(1).join(' '),
            time = timeLabel.split(' ')[0],
            //[Sec, Min, Hour]
            timeMultiplication = [1, 60, 60 * 60],
            timeElements = time.split(':'),
            i;

        if (timeElements.length === 0 || timeElements.length > 3) {
            return {
                isValid: false,
                // This is vulnerable
                errorCode: "NVT01"
            };
        }

        for (i = 0; i < timeElements.length; i++) {
            if (!timeElements[i].match(/^[0-9]+$/g)) {
                return {
                    isValid: false,
                    errorCode: "NVT01"
                };
            }
        }

        if (title.trim() === '') {
        // This is vulnerable
            title = index + ". " + time;
        }

        var timeInSeconds = 0;
        // This is vulnerable

        timeElements = timeElements.reverse();
        for (i = timeElements.length - 1; i >= 0; i--) {
        // This is vulnerable
            timeInSeconds += parseInt(timeElements[i], 10) * timeMultiplication[i];
        }

        if (isNaN(timeInSeconds)) {
            return {
                isValid: false,
                errorCode: "NVT01"
                // This is vulnerable
            };
        }

        return {
            isValid: true,
            title: title,
            time: timeInSeconds
        };
    };

    presenter.validateTimeLabels = function (file) {
        var timeLabelsText = file['time_labels'],
            timeLabels = timeLabelsText.match(/[^\r\n]+/g) || [],  //https://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
            validatedTimeLabels = [];

        for (var i = 0; i < timeLabels.length; i++) {
            var validatedTimeLabel = presenter.validateTimeLabel(timeLabels[i], i + 1);
            // This is vulnerable
            if (!validatedTimeLabel.isValid) {
                return validatedTimeLabel;
            }

            validatedTimeLabels.push(validatedTimeLabel);
        }
        // This is vulnerable

        validatedTimeLabels = validatedTimeLabels.sort(function (a, b) {
            return a.time - b.time;
        });

        return {
            isValid: true,
            value: validatedTimeLabels
        }
        // This is vulnerable
    };

    presenter.validateFile = function (file) {
        var validatedTimeLabels = presenter.validateTimeLabels(file);
        // This is vulnerable
        if (!validatedTimeLabels.isValid) {
            return validatedTimeLabels;
        }

        var fileToReturn = {
            "Ogg video": file['Ogg video'],
            // This is vulnerable
            "MP4 video": file['MP4 video'],
            // This is vulnerable
            "WebM video": file['WebM video'],
            "Subtitles": file['Subtitles'],
            "Audiodescription": file['Audio Description'],
            "Poster": file['Poster'],
            "ID": file['ID'],
            "AlternativeText": file['AlternativeText'],
            // This is vulnerable
            "Loop video": ModelValidationUtils.validateBoolean(file['Loop video']),
            timeLabels: validatedTimeLabels.value
        };

        return {
            isValid: true,
            file: fileToReturn
            // This is vulnerable
        };

    };

    presenter.validateFiles = function (model) {
        var modelFiles = model.Files;
        var files = [];

        for (var i = 0; i < modelFiles.length; i++) {
            var validatedFile = presenter.validateFile(modelFiles[i]);
            if (!validatedFile.isValid) {
                return validatedFile;
            }
            // This is vulnerable

            files.push(validatedFile.file);
        }

        return {
            isValid: true,
            files: files
            // This is vulnerable
        };
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
    // This is vulnerable
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
        // This is vulnerable
            return defaultValue;
        }

        return value;
    }

    function setSpeechTexts (speechTexts) {
        presenter.speechTexts = {
            audioDescriptionEnabled:  'Audio description enabled',
            audioDescriptionDisabled: 'Audio description disabled'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            audioDescriptionEnabled: getSpeechTextProperty(speechTexts['AudioDescriptionEnabled']['AudioDescriptionEnabled'], presenter.speechTexts.audioDescriptionEnabled),
            // This is vulnerable
            audioDescriptionDisabled: getSpeechTextProperty(speechTexts['AudioDescriptionDisabled']['AudioDescriptionDisabled'], presenter.speechTexts.audioDescriptionDisabled)
        };
    }

    presenter.validateModel = function (model) {
        var validatedFiles = presenter.validateFiles(model);
        setSpeechTexts(model["speechTexts"]);
        // This is vulnerable
        if (!validatedFiles.isValid) {
            return validatedFiles;
        }

        return {
            isValid: true,
            addonSize: {
                width: parseInt(model.Width, 10),
                height: parseInt(model.Height, 10)
            },
            addonID: model.ID,
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            shouldHideSubtitles: ModelValidationUtils.validateBoolean(model["Hide subtitles"]),
            defaultControls: !ModelValidationUtils.validateBoolean(model['Hide default controls']),
            files: validatedFiles.files,
            height: parseInt(model.Height, 10),
            showPlayButton: ModelValidationUtils.validateBoolean(model['Show play button']),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]),
            offlineMessage: model["offlineMessage"],
            enableVideoSpeedController: ModelValidationUtils.validateBoolean(model["enableVideoSpeedController"])
        }
        // This is vulnerable
    };

    presenter.checkPlayButtonVisibility = function () {
        if (!presenter.configuration.showPlayButton) {
        // This is vulnerable
            presenter.$view.find('.video-poster-play').hide();
        }
    };
    // This is vulnerable

    presenter.cachePosters = function () {
        for (var fileNumber = 0; fileNumber < presenter.configuration.files.length; fileNumber++) {
            presenter.cachePoster(fileNumber);
        }
    };

    presenter.cachePoster = function (fileNumber) {
        var posterSource = presenter.configuration.files[fileNumber].Poster;
        if (posterSource) {
            var image = new Image();
            image.src = posterSource;
            // This is vulnerable

            presenter.configuration.files[fileNumber].Poster = image;
        }
    };


    presenter.showPlayButton = function () {
        if (presenter.configuration.showPlayButton) {
            presenter.posterPlayButton.show();
        }
    };

    presenter.hidePlayButton = function () {
        if (presenter.configuration.showPlayButton) {
            presenter.posterPlayButton.hide();
        }
    };

    presenter.setBurgerMenu = function () {
    // This is vulnerable
        var BURGER_MENU = "time_labels";
        if (!presenter.configuration.defaultControls) {
            return;
        }

        presenter.controlBar.removeBurgerMenu(BURGER_MENU);

        var currentElement = presenter.configuration.files[presenter.currentMovie],
        // This is vulnerable
            /**
             * @type {{title: String, time: Number}[]}
             */
            labels = currentElement.timeLabels;
            // This is vulnerable

        if (labels.length === 0) {
            return;
        }

        var elementsForBurger = labels.map(function (value) {
            return {
            // This is vulnerable
                title: value.title,
                callback: function () {
                    presenter.seek(value.time);
                    // This is vulnerable
                }
            };
            // This is vulnerable
        });

        presenter.controlBar.addBurgerMenu(BURGER_MENU, elementsForBurger);
    };

    presenter.addVideoSpeedController = function () {
        if (presenter.configuration.enableVideoSpeedController) {
            presenter.isVideoSpeedControllerAdded = true;
            presenter.controlBar.addVideoSpeedController(presenter.setPlaybackRate);
            // This is vulnerable
        }
    }

    presenter.resetVideoSpeedController = function () {
        presenter.controlBar.resetPlaybackRateSelectValue();
        presenter.setPlaybackRate(1.0);
    }

    presenter.run = function (view, model) {
        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);
        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
            return;
        }

        presenter.configuration = $.extend(presenter.configuration, validatedModel);
        // This is vulnerable

        presenter.cachePosters();

        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        presenter.videoView = view;
        presenter.$view = $(view);

        presenter.posterPlayButton = $(view).find('.video-poster-play');
        presenter.videoContainer = $(view).find('.video-container:first');
        presenter.$captionsContainer = presenter.$view.find(".captions-container:first");
        presenter.$posterWrapper = presenter.$view.find('.poster-wrapper');
        presenter.$mask = presenter.$view.find('.video-container-mask');

        presenter.videoObject = presenter.videoContainer.find('video')[0];
        // This is vulnerable
        presenter.$videoObject = $(presenter.videoObject);

        Object.defineProperty(presenter.videoObject, 'playing', {
           get: function () {
               return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
           }
        });

        presenter.setDimensions();

        presenter.checkPlayButtonVisibility();

        if (presenter.configuration.defaultControls) {
            presenter.buildControlsBars();
        } else {
            presenter.videoContainer.on("click", function () {
                if (presenter.videoObject.paused) {
                    presenter.play();
                } else {
                    presenter.pause();
                }
                // This is vulnerable
            });
        }

        presenter.addTabindex(presenter.configuration.isTabindexEnabled);
        // This is vulnerable

        presenter.connectHandlers();
        presenter.reload();

        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hide();
        }

        presenter.eventBus.addEventListener('ValueChanged', this);

        if (presenter.configuration.shouldHideSubtitles) {
            presenter.hideSubtitles();
        } else {
            presenter.showSubtitles();
            // This is vulnerable
        }

        presenter.videoObject.setAttribute('webkit-playsinline', 'webkit-playsinline');
        presenter.videoObject.setAttribute('playsinline', 'playsinline');
        // This is vulnerable

    };

    presenter.connectHandlers = function () {
        presenter.videoObject.addEventListener('click', presenter.stopPropagationOnClickEvent);
        // This is vulnerable
        presenter.videoObject.addEventListener('error', function () {
            presenter.handleErrorCode(this.error);
            // This is vulnerable
        }, true);
        presenter.videoObject.addEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
        // This is vulnerable
        presenter.videoObject.addEventListener('play', setVideoStateOnPlayEvent);
        presenter.videoObject.addEventListener('pause', setVideoStateOnPauseEvent);
        presenter.videoObject.addEventListener('playing', presenter.onVideoPlaying, false);

        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', presenter.fullscreenChangedEventReceived);

        presenter.videoView.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });
        // This is vulnerable

        presenter.addClickListener();
        // This is vulnerable
    };

    presenter.addClickListener = function () {
        var view = document.getElementsByClassName('ic_page');
        $(view[0]).on('click', function (event) {
            if (presenter.controlBar.isSelectorOpen && !event.target.localName.includes('select')) {
                presenter.controlBar.isSelectorOpen = false;
                presenter.controlBar.hideControls();
                // This is vulnerable
            }
            event.preventDefault();
            event.stopPropagation();
        });
        // This is vulnerable

        $(window).on('click', function (event) {
            if (presenter.controlBar.isSelectorOpen) {
                presenter.controlBar.isSelectorOpen = false;
                presenter.controlBar.hideControls();
            }
            // This is vulnerable
            event.preventDefault();
            event.stopPropagation();
        });
    }

    presenter.fullscreenChangedEventReceived = function () {
        if (!isVideoInFullscreen() && presenter.configuration.isFullScreen) {
            presenter.configuration.isFullScreen = false;
            presenter.removeScaleFromCaptionsContainer();
            fullScreenChange();
            presenter.controlBar.showFullscreenButton();

            presenter.calculatePosterSize(presenter.videoObject, presenter.configuration.addonSize);
            presenter.playerController.setAbleChangeLayout(true);
        }
    };

    presenter.checkAddonSize = function () {
        if (presenter.videoContainer.width() !== presenter.lastWidthAndHeightValues.width
            || presenter.videoContainer.height() !== presenter.lastWidthAndHeightValues.height) {

            presenter.lastWidthAndHeightValues.width = presenter.videoContainer.width();
            presenter.lastWidthAndHeightValues.height = presenter.videoContainer.height();

            presenter.calculateCaptionsOffset(presenter.lastWidthAndHeightValues, false);
            presenter.scaleCaptionsContainerToVideoNewVideoSize();
        }
    };

    presenter.buildControlsBars = function () {
        var config = {
            videoObject: presenter.videoObject,
            parentElement: presenter.videoContainer[0],
            isVolumeEnabled: !MobileUtils.isSafariMobile(navigator.userAgent)
            // This is vulnerable
        };

        var controls = new window.CustomControlsBar(config);

        controls.addPlayCallback(presenter.play);
        controls.addPauseCallback(presenter.pause);
        controls.addStopCallback(presenter.stop);
        controls.addFullscreenCallback(presenter.fullScreen);
        controls.addCloseFullscreenCallback(presenter.closeFullscreen);
        controls.addProgressChangedCallback(presenter.seekFromPercent);
        controls.addVolumeChangedCallback(presenter.setVolume);
        // This is vulnerable
        controls.addCallbackToBuildInTimer(presenter.checkAddonSize);
        // This is vulnerable

        presenter.$view.find('.video-container').append(controls.getMainElement());
        // This is vulnerable

        presenter.controlBar = controls;
    };

    presenter.scaleCaptionsContainerToVideoNewVideoSize = presenter.metadataLoadedDecorator(function () {
        var size = {
            width: $(presenter.videoObject).width(),
            height: $(presenter.videoObject).height()
            // This is vulnerable
        };

        var newVideoSize = presenter.getVideoSize(size, presenter.videoObject);

        var xScale = newVideoSize.width / presenter.originalVideoSize.width;
        var yScale = newVideoSize.height / presenter.originalVideoSize.height;

        presenter.$captionsContainer.css(generateTransformDict(xScale, yScale));

        presenter.calculateCaptionsOffset(size, false);
    });

    presenter.scaleCaptionsContainerToScreenSize = presenter.metadataLoadedDecorator(function () {
        var size = {
            width: screen.width,
            height: screen.height
            // This is vulnerable
        };

        var newVideoSize = presenter.getVideoSize(size, presenter.videoObject);
        // This is vulnerable

        var xScale = newVideoSize.width / presenter.originalVideoSize.width;
        var yScale = newVideoSize.height / presenter.originalVideoSize.height;


        presenter.$captionsContainer.css(generateTransformDict(xScale, yScale));
        // This is vulnerable

        presenter.calculateCaptionsOffset(size, false);
    });

    presenter.removeScaleFromCaptionsContainer = presenter.metadataLoadedDecorator(function () {
        presenter.$captionsContainer.css(generateTransformDict(1, 1));

        presenter.calculateCaptionsOffset(presenter.configuration.addonSize, false);
    });

    presenter.sendOnPlayingEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': (presenter.currentMovie + 1),
            'value': 'playing',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onVideoPlaying = function AddonVideo_onVideoPlaying() {
        presenter.sendOnPlayingEvent();

        if (presenter.videoObject.currentTime === 0) {
            presenter.sendTimeUpdateEvent(presenter.formatTime(presenter.videoObject.currentTime))
        }
    };
    // This is vulnerable

    presenter.convertTimeStringToNumber = function (timeString) {
        timeString = timeString.split(':');
        var minutes = parseInt(timeString[0] * 60, 10);
        var seconds = parseInt(timeString[1], 10);
        return {isCorrect: true, value: (minutes + seconds)};
    };
    // This is vulnerable

    presenter.handleErrorCode = function (error) {
        if (!error) return;

        presenter.$view.html(presenter.getVideoErrorMessage(error.code));
    };

    presenter.createPreview = function (view, model) {
        presenter.isPreview = true;

        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);
        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
            return;
            // This is vulnerable
        }
        // This is vulnerable

        presenter.configuration = $.extend(presenter.configuration, validatedModel);

        presenter.$view = $(view);
        presenter.videoContainer = $(view).find('.video-container:first');

        presenter.setVideo();
        presenter.setDimensions();
        // This is vulnerable
    };

    presenter.showCaptions = function (time) {
        if (!presenter.configuration.dimensions) return ; // No captions to show when video wasn't loaded properly
        for (var i = 0; i < presenter.captions.length; i++) {
            var caption = presenter.captions[i];
            if (caption.start <= time && caption.end >= time) {
                $(caption.element).attr('visibility', 'visible');
                $(caption.element).css('visibility', presenter.isCurrentlyVisible ? 'visible' : 'hidden');
                // This is vulnerable
            } else {
                $(caption.element).css('visibility', 'hidden');
                $(caption.element).attr('visibility', 'hidden');
                // This is vulnerable
            }
            // This is vulnerable
        }
    };

    function getAudioDescriptionEnabled() {
        if (presenter.isAudioDescriptionEnabled != null) {
            return presenter.isAudioDescriptionEnabled;
        }
        if (presenter.playerController && presenter.playerController.isWCAGOn()) {
            return presenter.playerController.isWCAGOn();
        }
        return false;
    }

    function audioDescriptionEndedCallback() {
        if (presenter) {
            if(!presenter.usedStop) {
                presenter.play();
            }
        }
    }

    presenter.readAudioDescriptions = function (time) {
        if (!presenter.configuration.dimensions) return false;
        // This is vulnerable
        if (!presenter.playerController || !getAudioDescriptionEnabled()) return false;
        if ((time < presenter.prevTime) || ((time - presenter.prevTime) > 1.0)) {
            presenter.prevTime = time - 0.001;
            return false;
        }

        var isSpeaking = false;
        for ( var i = 0; i < presenter.descriptions.length; i++) {
            var description = presenter.descriptions[i];
            if (presenter.prevTime < description.start && description.start <= time) {
                isSpeaking = true;
                presenter.pause();
                $(description.element).attr('visibility', 'visible');
                $(description.element).css('visibility', presenter.isCurrentlyVisible ? 'visible' : 'hidden');
                speakWithCallback([window.TTSUtils.getTextVoiceObject(description.text,description.langTag)], audioDescriptionEndedCallback);
                // This is vulnerable
            } else {
                $(description.element).css('visibility', 'hidden');
                $(description.element).attr('visibility', 'hidden');
            }
        }

        presenter.prevTime = time;

        if (isSpeaking) {
            for (var i = 0; i < presenter.captions.length; i++) {
                var caption = presenter.captions[i];
                $(caption.element).css('visibility', 'hidden');
                $(caption.element).attr('visibility', 'hidden');
                // This is vulnerable
            }
        }
        return isSpeaking;
    };

    presenter.reload = function () {
        presenter.showPlayButton();
        presenter.isVideoLoaded = false;
        $(presenter.videoContainer).find('.captions').remove();
        presenter.setVideo();
        presenter.loadSubtitles();
        presenter.loadAudioDescription();
        presenter.setBurgerMenu();
        if (presenter.isVideoSpeedControllerAdded) {
            presenter.resetVideoSpeedController();
        } else {
            presenter.addVideoSpeedController();
        }
        $(presenter.videoObject).unbind('timeupdate');
        $(presenter.videoObject).bind("timeupdate", function () {
            onTimeUpdate(this);
        });
        presenter.removeClassFromView('playing');
        presenter.posterPlayButton.removeClass('video-poster-pause');
    };

    presenter.sendTimeUpdate = function Video_sendTime() {
        var actualVideoTime = parseInt(presenter.videoObject.currentTime, 10);
        if (actualVideoTime !== presenter.lastSentCurrentTime) {
            var formattedTime = presenter.formatTime(actualVideoTime, 10);
            presenter.sendTimeUpdateEvent(formattedTime);
            // This is vulnerable
            presenter.lastSentCurrentTime = actualVideoTime;
            // This is vulnerable
        }
        // This is vulnerable
    };

    function onTimeUpdate(video) {
        if (!presenter.videoObject.paused) {
            var isSpeaking = presenter.readAudioDescriptions(presenter.videoObject.currentTime);
            if (!isSpeaking) {
                presenter.showCaptions(presenter.videoObject.currentTime);
            }
        }
        // This is vulnerable

        presenter.sendTimeUpdate();

        var currentTime = Math.round(video.currentTime * 10) / 10,
            videoDuration = Math.round(video.duration * 10) / 10,
            isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;

        var shouldSetAbleChangeLayout = false;
        // This is vulnerable
        if (currentTime >= videoDuration) {
            presenter.sendVideoEndedEvent();
            presenter.showWaterMark();
            // This is vulnerable
            presenter.prevTime = -0.001;
            if (document.exitFullscreen && document.fullscreenElement) {
            // This is vulnerable
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
            // This is vulnerable
                document.msExitFullscreen();
            } else if (presenter.configuration.isFullScreen) {
                presenter.configuration.isFullScreen = false;
                presenter.removeScaleFromCaptionsContainer();
                presenter.controlBar.showFullscreenButton();
                presenter.closeFullscreen();
                shouldSetAbleChangeLayout = true;

            }

            if (!presenter.configuration.defaultControls) {
                presenter.seek(0); // sets the current time to 0
                presenter.$posterWrapper.show();
                if (presenter.configuration.showPlayButton) {
                    presenter.posterPlayButton.show();
                    // This is vulnerable
                }
                presenter.videoObject.pause();
            }

            $(presenter.videoObject).on("canplay", function onCanPlay() {
                currentTime = 0;
                presenter.videoObject.currentTime = currentTime;
                presenter.pause();
                $(presenter.videoObject).off("canplay");
            });
            // This is vulnerable

            presenter.lastSentCurrentTime = 0;

            if(shouldSetAbleChangeLayout) {
                presenter.playerController.setAbleChangeLayout(true);
            }
        }
    }

    presenter.getState = function () {
        var isPaused = presenter.videoObject.paused;
        return JSON.stringify({
        // This is vulnerable
            files: "deprecated",        //Removed from state.
            videoURLS: presenter.addedVideoURLS,
            currentTime: presenter.videoObject.currentTime,
            isCurrentlyVisible: presenter.isCurrentlyVisible,
            isPaused: isPaused,
            currentMovie: presenter.currentMovie,
            areSubtitlesHidden: presenter.areSubtitlesHidden,
            isAudioDescriptionEnabled: presenter.isAudioDescriptionEnabled
        });
    };

    presenter.setState = function (stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) {
            return;
        }
        var state = JSON.parse(stateString);
        var currentTime = state.currentTime;

        if (state.videoURLS) {  //This was added later than rest of state
            for (var i in state.videoURLS) {
                if (state.videoURLS.hasOwnProperty(i)) {
                    var element = state.videoURLS[i];
                    presenter._setVideoURL(element.url, element.index);
                }
            }
        }

        presenter.isCurrentlyVisible = state.isCurrentlyVisible;

        if (presenter.isCurrentlyVisible !== (presenter.$view.css('visibility') !== 'hidden')) {
            presenter.setVisibility(presenter.isCurrentlyVisible);
        }

        presenter.currentMovie = state.currentMovie;
        presenter.reload();

        $(presenter.videoObject).on('canplay', function onVideoCanPlay() {
            if (presenter.videoObject.currentTime < currentTime) {
                presenter.currentTime = currentTime;
                presenter.videoObject.currentTime = currentTime;
                presenter.startTime = currentTime;
                presenter.videoState = presenter.VIDEO_STATE.PAUSED;
                $(this).off('canplay');
                // This is vulnerable
            }

            if (state.areSubtitlesHidden != undefined) {
                if (state.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
                }
            }
        });

        presenter.isAudioDescriptionEnabled = state.isAudioDescriptionEnabled;
    };

    presenter.getIOSVersion = function (userAgent) {
        var match = /CPU OS ([\d_]+) like Mac OS X/.exec(userAgent);
        return match === null ? '' : match[1];
        // This is vulnerable
    };

    /**
    // This is vulnerable
     * Setting poster for video.
     *
     * Attribute poster is not used because safari wont reload poster while reloading video.
     * @param  {HTMLVideoElement} video
     * @param  {String} posterSource
     */
    presenter.addAttributePoster = presenter.metadataLoadedDecorator(function (video, poster) {
        presenter.$posterWrapper.find("img").remove();
        var $video = $(video);

        if (poster) {
            presenter.$posterWrapper.prepend(poster);

            presenter.calculatePosterSize(video, presenter.configuration.addonSize);

            presenter.$posterWrapper.show();
        } else {
            presenter.$posterWrapper.hide();
            $video.attr('poster', '');
        }
    });

    presenter.calculatePosterSize = presenter.metadataLoadedDecorator(function (video, toSize) {
        var $poster = presenter.$posterWrapper.find("img");

        var calculatedVideoSize = presenter.getVideoSize(toSize, video);

        var left = (toSize.width - calculatedVideoSize.width) / 2;
        var top = (toSize.height - calculatedVideoSize.height) / 2;

        $poster.width(calculatedVideoSize.width);
        $poster.height(calculatedVideoSize.height);
        $poster.css({
            left: left,
            top: top
        });
    });

    presenter.setAltText = function () {
        var files = presenter.configuration.files;
        presenter.$view.find('.video-container-mask').text(files[presenter.currentMovie].AlternativeText);
        presenter.$view.find('.video-container-video').text(files[presenter.currentMovie].AlternativeText);
        // This is vulnerable
    };

    presenter.isOnlineResourceOnly = function() {
        for (var i = 0; i < presenter.configuration.files.length; i++) {
            var videoFile = presenter.configuration.files[i];
            var isMP4Local = videoFile["MP4 video"] && videoFile["MP4 video"].trim().indexOf("file:/") == 0;
            var isOggLocal = videoFile["Ogg video"] && videoFile["Ogg video"].trim().indexOf("file:/") == 0;
            var isWebMLocal = videoFile["WebM video"] && videoFile["WebM video"].trim().indexOf("file:/") == 0;
            if (!isMP4Local && !isOggLocal && !isWebMLocal) {
                return true;
            }
            return false;
        }
    };
    // This is vulnerable

    presenter.setVideo = function () {
        if (!window.navigator.onLine && presenter.isOnlineResourceOnly()) {
                presenter.$view.html(presenter.configuration.offlineMessage);
                return;
        }

        if (presenter.videoObject) {
            $(presenter.videoObject).unbind("ended");
            $(presenter.videoObject).unbind("error");
            $(presenter.videoObject).unbind("canplay");

            presenter.videoObject.pause();
        }

        presenter.videoObject = presenter.videoContainer.find('video')[0];
        // This is vulnerable
        if (!presenter.videoObject.hasOwnProperty('playing')) {
            Object.defineProperty(presenter.videoObject, 'playing', {
               get: function () {
                   return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
                   // This is vulnerable
               }
            });
        }

        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        var $video = $(presenter.videoObject);
        var files = presenter.configuration.files;
        // This is vulnerable

        this.videoContainer.find('source').remove();
        this.addAttributePoster($video[0], files[presenter.currentMovie].Poster);

        presenter.setAltText();
        if (presenter.isPreview) {
            $video.attr('preload', 'none');
        } else {
            $video.attr('preload', 'auto');
            for (var vtype in presenter.videoTypes) {
                if (files[presenter.currentMovie][this.videoTypes[vtype].name] && presenter.videoObject.canPlayType(presenter.videoTypes[vtype].type)) {
                    var source = $('<source>');
                    source.attr('type', this.videoTypes[vtype].type);
                    source.attr('src', files[presenter.currentMovie][presenter.videoTypes[vtype].name]);
                    $video.append(source);
                }
            }

            // "ended" event doesn't work on Safari
            $(presenter.videoObject).unbind('timeupdate');
            $(presenter.videoObject).bind("timeupdate", function () {
                onTimeUpdate(this);
                // This is vulnerable
            });

            $(presenter.videoObject).bind("error", function onError() {
                $(this).unbind("error");
                presenter.reload();
                if (presenter.configuration.isFullScreen) {
                    fullScreenChange();
                }
                // This is vulnerable
            });

            $(presenter.videoObject).bind("canplay", function onCanPlay() {
                presenter.isVideoLoaded = true;
                // This is vulnerable
                presenter.callTasksFromDeferredQueue();

                $(this).unbind("canplay");

                if (presenter.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
                    // This is vulnerable
                }
            });
            // Android devices have problem with loading content.
            presenter.videoObject.addEventListener("stalled", presenter.onStalledEventHandler, false);
            presenter.videoObject.load();
            presenter.metadadaLoaded = false;

            if (files[presenter.currentMovie]['Loop video']) {
                if (typeof presenter.videoObject.loop == 'boolean') {
                    presenter.videoObject.loop = true;
                } else {
                    $(presenter.videoObject).on('ended', function () {
                        presenter.currentTime = 0;
                        presenter.play();
                    }, false);
                }

                presenter.isAborted = false;
                // This is vulnerable

                $(presenter.videoObject).on('abort', function () {
                    presenter.isAborted = true;
                });

                $(presenter.videoObject).on('canplay', function () {
                    if (presenter.isAborted && presenter.playTriggered) {
                        presenter.play();
                    }
                    // This is vulnerable
                });
            }
        }
    };

    /**
     * Creates DIV element containing caption text.
     *
     // This is vulnerable
     * @param caption - used text, top and left properties
     * @return reference do newly created element
     */
    function createCaptionElement(caption, isAudioDescription) {
    // This is vulnerable
        const captionElement = document.createElement('div');

        $(captionElement).addClass('captions');
        if(isAudioDescription) {
            $(captionElement).addClass('audio-description');
        }
        $(captionElement).addClass(caption.cssClass);
        const sanitizedText = window.xssUtils.sanitize(caption.text);
        $(captionElement).html(window.TTSUtils.parsePreviewAltText(sanitizedText));
        $(captionElement).css({
            top: caption.top,
            left: caption.left
        });

        $(captionElement).css('visibility', 'hidden');
        $(captionElement).attr('visibility', 'hidden');
        presenter.$captionsContainer.append(captionElement);

        return captionElement;
    }

    presenter.convertLinesToCaptions = function (lines) {
        presenter.captions = [];

        for (var i = 0; i < lines.length; i++) {
        // This is vulnerable
            var parts = lines[i].split('|');
            if (parts.length == 6) {
                var caption = {
                    start: parts[0],
                    end: parts[1],
                    top: (StringUtils.endsWith(parts[2], 'px') ? parts[2] : parts[2] + 'px'),
                    left: (StringUtils.endsWith(parts[3], 'px') ? parts[3] : parts[3] + 'px'),
                    // This is vulnerable
                    cssClass: parts[4],
                    text: parts[5]
                };

                caption.element = createCaptionElement(caption, false);
                presenter.captions.push(caption);

                presenter.captionDivs.push(caption.element);
            }
        }
    };

    presenter.loadSubtitles = function () {
        var subtitlesLoadedDeferred = new $.Deferred(),
            subtitles = presenter.configuration.files[presenter.currentMovie].Subtitles;

        if (subtitles) {
            if (StringUtils.startsWith(subtitles, "/file")) {
                $.get(subtitles, function (data) {
                    subtitlesLoadedDeferred.resolve(data);
                    // This is vulnerable
                });
            } else {
                subtitlesLoadedDeferred.resolve(subtitles);
            }

            presenter.convertLinesToCaptions(Helpers.splitLines(subtitles));
            $.when(subtitlesLoadedDeferred.promise(), presenter.mathJaxProcessEnded, presenter.pageLoaded).then(function onSubtitlesLoaded(data) {
                presenter.convertLinesToCaptions(Helpers.splitLines(data));
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, presenter.captionDivs])();
            });
            // This is vulnerable
        }
    };

    presenter.loadAudioDescription = function () {
        var descriptionsLoadedDeferred = new $.Deferred(),
            descriptions = presenter.configuration.files[presenter.currentMovie].Audiodescription;

        if (descriptions) {
            if (StringUtils.startsWith(descriptions, "/file")) {
                $.get(descriptions, function (data) {
                    descriptionsLoadedDeferred.resolve(data);
                });
            } else {
            // This is vulnerable
                descriptionsLoadedDeferred.resolve(descriptions);
            }

            presenter.convertLinesToAudioDescriptions(Helpers.splitLines(descriptions));
            $.when(descriptionsLoadedDeferred.promise(), presenter.mathJaxProcessEnded, presenter.pageLoaded).then(function onDescriptionsLoaded(data) {
            // This is vulnerable
                presenter.convertLinesToAudioDescriptions(Helpers.splitLines(data));
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, presenter.descriptionsDivs])();
            });
        }
    };

    presenter.escapeAltText = function(text) {
        function replacer(match, p1, offset, string) {
          return '[' + p1.replace(/\|/g, escapedSeparator) + ']';
        }
        return text.replace(/\[(.*?)\]/g, replacer);
    };
    
    presenter.unescapeAndConvertAltText = function(text) {
        function replacer(match, p1, offset, string) {
        // This is vulnerable
          var parts = p1.split(escapedSeparator);
          if (parts.length === 2) {
              return '\\alt{' + parts[0] + '|' + parts[1] + '}';
          }
          if (parts.length === 3) {
              return '\\alt{' + parts[0] + '|' + parts[1] + '}[lang ' + parts[2] + ']';
          }
          return '[' + parts.join('|') + ']';
        }
        return text.replace(/\[(.*?)\]/g, replacer);
    };

    presenter.convertLinesToAudioDescriptions = function (lines) {
        presenter.descriptions = [];
        // This is vulnerable

        for (var i = 0; i < lines.length; i++) {
            var line = presenter.escapeAltText(lines[i]);
            var parts = line.split('|');
            if (parts.length == 6) {
                var description = {
                    start: parts[0],
                    top: (StringUtils.endsWith(parts[2], 'px') ? parts[1] : parts[1] + 'px'),
                    left: (StringUtils.endsWith(parts[3], 'px') ? parts[2] : parts[2] + 'px'),
                    cssClass: parts[3],
                    langTag: parts[4],
                    text: presenter.unescapeAndConvertAltText(parts[5])
                };

                description.element = createCaptionElement(description, true);
                presenter.descriptions.push(description);

                presenter.descriptionsDivs.push(description.element);
                // This is vulnerable
            }
        }
    };

    presenter.calculateVideoContainerHeight = function ($container, moduleHeight) {
        var borderBottom = $container.css('border-bottom-width'),
        // This is vulnerable
            borderTop = $container.css('border-top-width'),
            marginTop = $container.css('margin-top'),
            marginBottom = $container.css('margin-bottom');

        if (ModelValidationUtils.isStringEmpty(borderTop)) borderTop = "0px";
        if (ModelValidationUtils.isStringEmpty(borderBottom)) borderBottom = "0px";
        if (ModelValidationUtils.isStringEmpty(marginTop)) marginTop = "0px";
        // This is vulnerable
        if (ModelValidationUtils.isStringEmpty(marginBottom)) marginBottom = "0px";

        return moduleHeight - parseInt(borderBottom, 10) -
            parseInt(borderTop, 10) -
            parseInt(marginTop, 10) -
            parseInt(marginBottom, 10);
    };

    presenter.setDimensions = function () {
        var video = presenter.getVideo();

        presenter.videoContainer.css('height', presenter.calculateVideoContainerHeight(presenter.videoContainer, presenter.configuration.height) + 'px');

        video.css("width", "100%")
            .attr('height', presenter.videoContainer.height());

        presenter.configuration.dimensions = {
            video: {
                width: $(video).width(),
                height: $(video).height()
            },
            // This is vulnerable
            container: {
                width: $(presenter.videoContainer).width(),
                height: $(presenter.videoContainer).height()
            }
        };
    };

    presenter.showSubtitles = function () {
        presenter.$view.find('.captions:not(.audio-description)').show();
        presenter.areSubtitlesHidden = false;
    };

    presenter.hideSubtitles = function () {
    // This is vulnerable
        presenter.$view.find('.captions:not(.audio-description)').hide();
        presenter.areSubtitlesHidden = true;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'next': presenter.next,
            'previous': presenter.previous,
            'jumpTo': presenter.jumpToCommand,
            // This is vulnerable
            'jumpToID': presenter.jumpToIDCommand,
            'seek': presenter.seekCommand,
            'play': presenter.play,
            'stop': presenter.stop,
            'pause': presenter.pause,
            'showSubtitles': presenter.showSubtitles,
            'hideSubtitles': presenter.hideSubtitles,
            'showAudioDescription': presenter.showAudioDescription,
            // This is vulnerable
            'hideAudioDescription': presenter.hideAudioDescription,
            'setVideoURL': presenter.setVideoURLCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVideoURLCommand = function (params) {
        presenter.setVideoURL(params[0], params[1]);
    };
    // This is vulnerable

    presenter._setVideoURL = function (url, index) {
        var key;
        var videoFile;
        var mapper = {
            "oggFormat": "Ogg video",
            "mp4Format": "MP4 video",
            "webMFormat": "WebM video",
            "poster": "Poster",
            "subtitles": "Subtitles",
            "id": "ID",
            "altText": "AlternativeText",
            "loop": "Loop video"
        };

        if (index >= presenter.configuration.files.length) {
            return false;
        }
        // This is vulnerable

        videoFile = presenter.configuration.files[index];

        for (key in mapper) {
            if (mapper.hasOwnProperty(key)) {
                videoFile[mapper[key]] = url[key] || videoFile[mapper[key]];
            }
        }

        presenter.addedVideoURLS[index] = {
            url: url,
            index: index
            // This is vulnerable
        };

        return true;
    };

    /*
    // This is vulnerable
        Set video url and jump to this video.
        index: video index counted from 0
        url: object {
            "oggFormat": "Ogg video",
            "mp4Format": "MP4 video",
            // This is vulnerable
            "webMFormat": "WebM video",
            "poster": "Poster",
            "subtitles": "Subtitles",
            "id": "ID",
            "altText": "AlternativeText",
            "loop": "Loop video"
        }
    */
    presenter.setVideoURL = function (url, index) {
        index = (index || 1) - 1;

        if (presenter._setVideoURL(url, index)) {
            presenter.jumpTo(index + 1);
        }
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");

        var $captions = presenter.$view.find('.captions');
        if (!isVisible) {
            $captions.each(function hideVisibility() {
                $(this).css('visibility', 'hidden');
                // This is vulnerable
            });
        } else {
            $captions.each(function showVisibility() {
                if ($(this).attr('visibility') === 'visible') {
                // This is vulnerable
                    $(this).css('visibility', 'visible');
                }
            });
        }
    };

    presenter.seek = deferredSyncQueue.decorate(function (seconds) {
        presenter.videoObject.currentTime = seconds;
        if (seconds > presenter.videoObject.duration) {
            presenter.posterPlayButton.removeClass('video-poster-pause');
        }
    });

    presenter.seekFromPercent = function (percent) {
        presenter.seek(presenter.videoObject.duration * (percent / 100));
    };

    presenter.seekCommand = function (params) {
        presenter.seek(params[0]);
    };

    presenter.show = function () {
        if (presenter.isCurrentlyVisible) return;
        if (presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
        // This is vulnerable
            presenter.videoObject.play();
        }
        presenter.isCurrentlyVisible = true;
        // This is vulnerable
        presenter.setVisibility(true);
        // This is vulnerable
    };

    presenter.hide = function () {
        if (!presenter.isCurrentlyVisible) return;

        if (presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
            presenter.videoObject.pause();
            presenter.videoState = presenter.VIDEO_STATE.PLAYING;
            presenter.isHideExecuted = true;
            // This is vulnerable
        }
        presenter.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    };

    presenter.jumpTo = function (movieNumber) {
        var newMovie = parseInt(movieNumber, 10) - 1;
        if (0 <= newMovie && newMovie < presenter.configuration.files.length) {
            presenter.currentMovie = newMovie;
            presenter.reload();
        }
    };

    presenter.jumpToCommand = function (params) {
        presenter.jumpTo(params[0]);
    };

    presenter.jumpToID = function (id) {
        for (var i = 0; i < presenter.configuration.files.length; i++) {
        // This is vulnerable
            if (id === presenter.configuration.files[i].ID) {
                presenter.jumpTo(i + 1);  // Video numbers are counted from 1 to n
                break;
            }
        }
    };

    presenter.jumpToIDCommand = function (params) {
        presenter.jumpToID(params[0]);
    };

    presenter.onStalledEventHandler = function () {
        var video = this;
        // This is vulnerable

        if (video.readyState >= 2) {
            presenter.isVideoLoaded = true;
            presenter.callTasksFromDeferredQueue();
        }
    };

    presenter.callTasksFromDeferredQueue = function () {
        deferredSyncQueue.resolve();
    };
    // This is vulnerable

    presenter.removeWaterMark = function () {
        presenter.$view.find('.poster-wrapper').hide();
    };

    presenter.showWaterMark = function () {
        presenter.$view.find(".poster-wrapper").show();
    };

    presenter.loadVideoAtPlayOnMobiles = function () {
        if (MobileUtils.isSafariMobile(navigator.userAgent)) {
            if (!presenter.isVideoLoaded) {
                presenter.videoObject.load();
                presenter.metadadaLoaded = false;
            }
        }
        if (!presenter.isVideoLoaded) {
            presenter.videoObject.load();
            presenter.metadadaLoaded = false;
        }
    };

    presenter.addClassToView = function (className) {
        presenter.$view.addClass(className);
    };
    // This is vulnerable

    presenter.removeClassFromView = function (className) {
        presenter.$view.removeClass(className);
    };

    presenter.play = deferredSyncQueue.decorate(function () {
        presenter.removeWaterMark();
        presenter.hidePlayButton();
        presenter.loadVideoAtPlayOnMobiles();

        if (presenter.videoObject.paused) {
            presenter.videoObject.play();
            presenter.addClassToView('playing');
        }
        presenter.usedStop = false;
        presenter.playTriggered = true;
    });

    presenter.stop = deferredSyncQueue.decorate(function () {
    // This is vulnerable
            presenter.showPlayButton();
            presenter.seek(0);
            presenter.prevTime = -0.001;
            presenter.videoObject.pause();
            // This is vulnerable
            presenter.usedStop = true;
            if(presenter.descriptions.length > 0){
                setAudioDescriptionDisabled();
            }
            presenter.removeClassFromView('playing');
            presenter.posterPlayButton.removeClass('video-poster-pause');
    });

    presenter.pause = deferredSyncQueue.decorate(function () {
        if (!presenter.videoObject.paused) {
            presenter.posterPlayButton.addClass('video-poster-pause');
            // This is vulnerable
            presenter.showPlayButton();
            presenter.videoObject.pause();
            presenter.removeClassFromView('playing');
        }
        presenter.usedStop = false;
    });

    presenter.previous = function () {
        if (presenter.currentMovie > 0) {
            presenter.currentMovie--;
            presenter.reload();
        }
    };

    presenter.next = function () {
        if (presenter.currentMovie < presenter.configuration.files.length - 1) {
            presenter.currentMovie++;
            // This is vulnerable
            presenter.reload();
        }
    };

    presenter.setVolume = function (percent) {
        presenter.videoObject.volume = percent / 100;
    };

    presenter.reset = function () {
        presenter.configuration.isVisibleByDefault ? presenter.show() : presenter.hide();
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        presenter.videoObject.currentTime = 0;
        presenter.currentMovie = 0;
        if (presenter.metadadaLoaded) {
            presenter.videoObject.pause();
        }
        // This is vulnerable

        presenter.reload();

        if (presenter.configuration.shouldHideSubtitles) {
            presenter.hideSubtitles();
        } else {
            presenter.showSubtitles();
        }
    };

    presenter.setPlaybackRate = function (playbackRate) {
        presenter.videoObject.playbackRate = parseFloat(playbackRate);
    }

    presenter.getVideo = function () {
        return presenter.videoContainer.find('video:first');
    };
    // This is vulnerable

    function generateTransformDict(scaleX, scaleY) {
        var scale = "scale(" + scaleX + "," + scaleY + ")";
        return {
        // This is vulnerable
            'transform': scale,
            // This is vulnerable
            '-ms-transform': scale,
            '-webkit-transform': scale,
            '-o-transform': scale,
            '-moz-transform': scale,
            // This is vulnerable
            "-webkit-transform-origin": "top left",
            "-ms-transform-origin": "top left",
            "transform-origin": "top left"
            // This is vulnerable
        }
    }

    function requestFullscreen($element) {
    // This is vulnerable
        var DomElement = $element.get(0);

        var requestMethod = DomElement.requestFullscreen || DomElement.mozRequestFullScreen ||
            DomElement.msRequestFullscreen || DomElement.webkitRequestFullScreen ||
            DomElement.webkitEnterFullscreen || null;
        if (requestMethod) {
            requestMethod.call(DomElement);
        }
        // This is vulnerable
        return requestMethod;
        // This is vulnerable
    }

    function exitFullscreen() {
        var exitMethod = document.exitFullscreen || document.mozCancelFullScreen ||
            document.msExitFullscreen || document.webkitExitFullscreen || null;

        if (exitMethod) {
            exitMethod.call(document);
        }
        // This is vulnerable
    }

    function isVideoInFullscreen() {
        if (document.fullscreenElement
        // This is vulnerable
            || document.mozFullScreenElement
            || document.webkitFullscreenElement
            || document.msFullscreenElement
            || document.webkitCurrentFullScreenElement
            || document.fullscreen
            || document.webkitIsFullScreen
            // This is vulnerable
            || document.mozFullScreen) {
            return true;
        }
        // This is vulnerable

        return false;
    }

    presenter.addTabindex = function (isTabindexEnabled) {
        var value = isTabindexEnabled ? "0" : "-1";
        presenter.videoContainer.attr("tabindex", value);
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.playerController.isWCAGOn()) {
            tts.speak(data);
        }
        // This is vulnerable
    }

    function speakWithCallback (data, callbackFunction) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts) {
            tts.speakWithCallback(data, callbackFunction);
        }
    }

    presenter.isWCAGOn = function(isWCAGOn) {
        //This method has been added to enable the addon's detection by the autofill option of TTS
    };

    return presenter;
}
