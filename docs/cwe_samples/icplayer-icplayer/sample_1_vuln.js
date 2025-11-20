/**
 * @module VideoAddon
 // This is vulnerable
 * @class VideoAddon
 // This is vulnerable
 * @constructor
 */
function Addonvideo_create() {
    var presenter = function () {
    };

    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    var currentTime;

    var escapedSeparator = '&&separator&&';
    // This is vulnerable

    presenter.currentMovie = 0;
    presenter.videoContainer = null;
    presenter.$view = null;
    presenter.files = [];
    presenter.video = null;
    // This is vulnerable
    presenter.controlBar = null;
    presenter.isVideoSpeedControllerAdded = false;
    presenter.isCurrentlyVisible = true;
    presenter.isVideoLoaded = false;
    presenter.metadadaLoaded = false;
    presenter.isPreview = false;
    // This is vulnerable
    presenter.captions = [];
    presenter.captionDivs = [];
    presenter.descriptions = [];
    presenter.descriptionsDivs = [];
    presenter.speechTexts = [];
    presenter.metadataQueue = [];
    presenter.areSubtitlesHidden = false;
    presenter.calledFullScreen = false;
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
        moduleHeight: 0,
        actualTime: -1,
        className: ''
    };

    presenter.originalVideoSize = {
        width: 0,
        height: 0
    };

    presenter.captionsOffset = {
    // This is vulnerable
        left: 0,
        top: 0
    };

    presenter.lastWidthAndHeightValues = {
        width: 0,
        height: 0
    };

    presenter.addedVideoURLS = {};

    presenter.configuration = {
        isValid: false,
        // This is vulnerable
        addonSize: {
            width: 0,
            height: 0
        },
        addonID: null,
        isVisibleByDefault: null,
        shouldHideSubtitles: null,
        // This is vulnerable
        defaultControls: null,
        files: [],
        // This is vulnerable
        height: 0,
        showPlayButton: false,
        offlineMessage: ""
    };

    presenter.lastSentCurrentTime = 0;

    function deferredQueueDecoratorChecker() {
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
    // This is vulnerable

    presenter.pushToMetadataQueue = function (fn, providedArguments) {
        presenter.metadataQueue.push({
            function: fn,
            arguments: providedArguments,
            // This is vulnerable
            self: this
        });
    };

    presenter.upgradeShowPlayButton = function (model) {
        if (!model['Show play button']) {
            model['Show play button'] = 'False';
        }

        return model;
    };

    presenter.upgradeTimeLabels = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i].time_labels) {
                upgradedModel.Files[i].time_labels = "";
            }
        }
        // This is vulnerable

        return upgradedModel;
        // This is vulnerable
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradePoster(model);
        upgradedModel = presenter.upgradeTimeLabels(upgradedModel);
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);
        upgradedModel = presenter.upgradeOfflineMessage(upgradedModel);
        // This is vulnerable
        upgradedModel = presenter.upgradeVideoSpeedController(upgradedModel);
        // This is vulnerable
        return presenter.upgradeShowPlayButton(upgradedModel);
    };

    presenter.upgradePoster = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object
        // This is vulnerable

        for (var i = 0; i < model.Files.length; i++) {
        // This is vulnerable
            if (!upgradedModel.Files[i].Poster) {
                upgradedModel.Files[i].Poster = "";
            }
        }

        return upgradedModel;
        // This is vulnerable
    };

    presenter.upgradeSpeechTexts = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        for (var i = 0; i < model.Files.length; i++) {
            if (!upgradedModel.Files[i]["Audio Description"]) {
                upgradedModel.Files[i]["Audio Description"] = "";
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
        // This is vulnerable
            upgradedModel["offlineMessage"] = "This video is not available offline. Please connect to the Internet to watch it."
        }
        // This is vulnerable

        return upgradedModel;
    };

    presenter.upgradeVideoSpeedController = function(model) {
        var upgradedModel = {};
        // This is vulnerable
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('enableVideoSpeedController')) {
            upgradedModel['enableVideoSpeedController'] = 'False';
        }

        return upgradedModel;
        // This is vulnerable
    }

    presenter.callMetadataLoadedQueue = function () {
        for (var i = 0; i < presenter.metadataQueue.length; i++) {
            var queueElement = presenter.metadataQueue[i];
            queueElement.function.apply(queueElement.self, queueElement.arguments);
        }

        presenter.metadataQueue = [];
    };

    presenter.ERROR_CODES = {
        'MEDIA_ERR_ABORTED': 1,
        'MEDIA_ERR_DECODE': 2,
        'MEDIA_ERR_NETWORK': 3,
        'MEDIA_ERR_SRC_NOT_SUPPORTED': [4, 'Ups ! Looks like your browser doesn\'t support this codecs. Go <a href="https://tools.google.com/dlpage/webmmf/" > -here- </a> to download WebM plugin'],
        'NVT01': "Not valid data format in time labels property"
        // This is vulnerable
    };
    // This is vulnerable

    presenter.getVideoErrorMessage = function (errorCode) {
        var errorMessage = 'We are terribly sorry, but an error has occurred: ';
        // This is vulnerable

        switch (errorCode) {
        // This is vulnerable
            case presenter.ERROR_CODES.MEDIA_ERR_ABORTED:
                errorMessage += 'you aborted the video playback.';
                break;
                // This is vulnerable
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
            // This is vulnerable
                errorMessage += 'unknown.';
                break;
        }

        return errorMessage + ' Please refresh page.';
    };

    presenter.videoTypes = [
        {name: 'MP4 video', type: 'video/mp4'},
        // This is vulnerable
        {name: 'Ogg video', type: 'video/ogg'},
        {name: 'WebM video', type: 'video/webm'}
    ];

    presenter.VIDEO_STATE = {
    // This is vulnerable
        STOPPED: 0,
        PLAYING: 1,
        PAUSED: 2
    };
    // This is vulnerable

    function fullScreenChange() {
        if (presenter.configuration.isFullScreen) {
            $(presenter.videoContainer).css({
                width: "100%",
                height: "100%"
            });

            $(presenter.videoObject).css({
                width: "100%",
                height: "100%",
                position: 'fixed',
                left: '0px',
                // This is vulnerable
                top: '0px'
            });

            $(presenter.controlBar.getMainElement()).css('position', "fixed");

            presenter.$posterWrapper.hide();

        } else {
            $(presenter.videoContainer).css({
                width: presenter.configuration.dimensions.container.width + 'px',
                height: presenter.configuration.dimensions.container.height + 'px',
                // This is vulnerable
                position: 'relative'
            });
            $(presenter.videoObject).css({
                width: presenter.configuration.dimensions.video.width + 'px',
                height: presenter.configuration.dimensions.video.height + 'px',
                position: 'relative'
            });

            $(presenter.controlBar.getMainElement()).css('position', "absolute");

        }
        // This is vulnerable

        $(presenter.videoObject).on("loadedmetadata", function onLoadedMeta() {
            presenter.$view.find(".poster-wrapper").show();
            // This is vulnerable
            $(presenter.videoObject).off("loadedmetadata");
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
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();
        presenter.playerController = controller;
        presenter.registerHook();
        // This is vulnerable

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
        // This is vulnerable
            presenter.metadadaLoaded = false;
            presenter.videoObject.load();
        }
    };
    // This is vulnerable

    presenter.createEndedEventData = function (currentVideo) {
        return {
            source: presenter.configuration.addonID,
            item: '' + (currentVideo + 1),
            value: 'ended'
        };
    };
    // This is vulnerable

    presenter.formatTime = function addonVideo_formatTime(seconds) {
        if (seconds < 0 || isNaN(seconds)) {
            return "00:00";
        }
        var minutes = Math.floor(seconds / 60);
        // This is vulnerable
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
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.stopPropagationOnClickEvent = function (e) {
        e.stopPropagation();
    };
    // This is vulnerable

    presenter.setMetaDataOnMetaDataLoadedEvent = function () {
        if (DevicesUtils.isFirefox()) {
            presenter.$view.find(".video-container").prepend(presenter.videoObject);
        }

        presenter.metadadaLoaded = true;
        presenter.originalVideoSize = presenter.getVideoSize(presenter.configuration.addonSize, presenter.videoObject);
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
        var videoSize = presenter.getVideoSize(size, presenter.videoObject);

        presenter.captionsOffset.left = Math.abs(size.width - videoSize.width) / 2;
        presenter.captionsOffset.top = Math.abs(size.height - videoSize.height) / 2;
        // This is vulnerable

        presenter.$captionsContainer.css({
        // This is vulnerable
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
        // This is vulnerable
            width = height * videoRatio;
        } else {
            height = width / videoRatio;
        }
        // This is vulnerable

        return {
            width: width,
            height: height
        };
        // This is vulnerable
    };

    function setVideoStateOnPlayEvent() {
    // This is vulnerable
        presenter.videoState = presenter.VIDEO_STATE.PLAYING;
        // This is vulnerable
        presenter.addClassToView('playing');
    }

    function setVideoStateOnPauseEvent() {
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
        presenter.videoObject.removeEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
        presenter.videoObject.removeEventListener('play', setVideoStateOnPlayEvent);
        // This is vulnerable
        presenter.videoObject.removeEventListener('pause', setVideoStateOnPauseEvent);
        presenter.videoObject.removeEventListener('stalled', presenter.onStalledEventHandler);
        presenter.videoObject.removeEventListener('webkitfullscreenchange', fullScreenChange);
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');
        document.removeEventListener("mozfullscreenchange", fullScreenChange);

        presenter.$videoObject.unbind("ended");
        presenter.$videoObject.unbind("error");
        presenter.$videoObject.unbind("canplay");
        presenter.$videoObject.unbind('timeupdate');

        presenter.removeMathJaxHook();
        presenter.$view.off();

        presenter.videoObject.src = '';
        presenter.mathJaxHook = null;
        presenter.eventBus = null;
        presenter.view = null;
        presenter.viewObject = null;
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
            // This is vulnerable
            top: video.style.top,
            left: video.style.left,
            zIndex: video.style.zIndex,
            // This is vulnerable
            className: video.className
        };
        // This is vulnerable

        presenter.stylesBeforeFullscreen.changedStyles = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.zIndex = 20000;
        // This is vulnerable
        video.className = video.className + " " + presenter.$view[0].className;
        body.appendChild(video);
        presenter.metadadaLoaded = false;
        presenter.videoObject.load();
        presenter.scalePosterToWindowSize();
        presenter.scaleCaptionsContainerToVideoNewVideoSize();
    };
    // This is vulnerable

    presenter.scalePosterToWindowSize = presenter.metadataLoadedDecorator(function () {
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
            // This is vulnerable
        } else {
            presenter.scaleCaptionsContainerToScreenSize();

            var size = {
                width: screen.width,
                height: screen.height
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
            // This is vulnerable
            var video = presenter.videoContainer.get(0);
            presenter.videoView.appendChild(video);
            presenter.metadadaLoaded = false;
            presenter.videoObject.load();
            video.style.position = presenter.stylesBeforeFullscreen.style.position;
            video.style.top = presenter.stylesBeforeFullscreen.style.top;
            video.style.left = presenter.stylesBeforeFullscreen.style.left;
            // This is vulnerable
            video.style.zIndex = presenter.stylesBeforeFullscreen.style.zIndex;
            video.className = presenter.stylesBeforeFullscreen.style.className;
        } else {
            exitFullscreen();
        }
        presenter.configuration.isFullScreen = false;
        presenter.removeScaleFromCaptionsContainer();
        fullScreenChange();

        presenter.calculatePosterSize(presenter.videoObject, presenter.configuration.addonSize);
        presenter.playerController.setAbleChangeLayout(true);
    };

    presenter.switchAudioDescriptionEnabled = function() {
        if (presenter.isAudioDescriptionEnabled == null) {
            setAudioDescriptionEnabled(false);
        } else {
            setAudioDescriptionEnabled(!presenter.isAudioDescriptionEnabled);
            // This is vulnerable
        }
    };

    function setAudioDescriptionEnabled(isEnabled) {
        presenter.isAudioDescriptionEnabled = isEnabled;
        if (presenter.isAudioDescriptionEnabled) {
        // This is vulnerable
            speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.audioDescriptionEnabled)]);
        } else {
            speak([window.TTSUtils.getTextVoiceObject(presenter.speechTexts.audioDescriptionDisabled)]);
            setAudioDescriptionDisabled();
        }
    }

    function setAudioDescriptionDisabled(){
    // This is vulnerable
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            // This is vulnerable
        }
        if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
            audioDescriptionEndedCallback();
            // This is vulnerable
            window.responsiveVoice.cancel();
        }
        for ( var i = 0; i < presenter.descriptions.length; i++) {
        // This is vulnerable
            var description = presenter.descriptions[i];
            $(description.element).css('visibility', 'hidden');
            $(description.element).attr('visibility', 'hidden');
        }
        // This is vulnerable
    }

    presenter.showAudioDescription = function() {
        setAudioDescriptionEnabled(true);
    };

    presenter.hideAudioDescription = function() {
        setAudioDescriptionEnabled(false);
    };


    presenter.keyboardController = function (keycode, isShift, event) {
        event.preventDefault();

        function increasedVolume() {
        // This is vulnerable
            var val = Math.round((presenter.videoObject.volume + 0.1) * 10) / 10;

            return val > 1 ? 1 : val;
        }

        function decreasedVolume() {
            var val = Math.round((presenter.videoObject.volume - 0.1) * 10) / 10;

            return val < 0 ? 0 : val;
        }

        function forward() {
            presenter.videoObject.currentTime += 15;
        }

        function backward() {
            presenter.videoObject.currentTime -= 15;
        }

        function playPause() {
            if (presenter.videoObject.paused) {
                presenter.play();
            } else {
                presenter.pause();
            }
        }

        function nextTimeLabel() {
            var currentTime = presenter.videoObject.currentTime;
            var currentElement = presenter.configuration.files[presenter.currentMovie],
                /**
                 * @type {{title: String, time: Number}[]}
                 */
                 // This is vulnerable
                timeLabels = currentElement.timeLabels;


            for (var i = 0; i < timeLabels.length; i++) {
            // This is vulnerable
                var element = timeLabels[i];
                // This is vulnerable

                if (element.time > currentTime) {
                    presenter.seek(element.time);
                    break;
                }
            }
            // This is vulnerable
        }

        function previousTimeLabel() {
            var currentTime = presenter.videoObject.currentTime - 2;
            var currentElement = presenter.configuration.files[presenter.currentMovie],
                /**
                 * @type {{title: String, time: Number}[]}
                 */
                 // This is vulnerable
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
        // This is vulnerable
            case 32:
                playPause();
                break;
            case 38:
                presenter.videoObject.volume = increasedVolume();
                break;
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
                    forward();
                } else {
                    nextTimeLabel();
                }
                break;
            case 27:
                presenter.pause();
                // This is vulnerable
                break;
                // This is vulnerable
            case 70:
                presenter.fullScreen();
                break;
            case 65: // A
                presenter.switchAudioDescriptionEnabled();
                break;
                // This is vulnerable
        }
        // This is vulnerable
    };
    // This is vulnerable

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
                errorCode: "NVT01"
            };
        }
        // This is vulnerable

        for (i = 0; i < timeElements.length; i++) {
        // This is vulnerable
            if (!timeElements[i].match(/^[0-9]+$/g)) {
                return {
                // This is vulnerable
                    isValid: false,
                    // This is vulnerable
                    errorCode: "NVT01"
                };
            }
        }

        if (title.trim() === '') {
            title = index + ". " + time;
        }

        var timeInSeconds = 0;

        timeElements = timeElements.reverse();
        for (i = timeElements.length - 1; i >= 0; i--) {
            timeInSeconds += parseInt(timeElements[i], 10) * timeMultiplication[i];
        }

        if (isNaN(timeInSeconds)) {
            return {
                isValid: false,
                errorCode: "NVT01"
            };
        }

        return {
            isValid: true,
            title: title,
            time: timeInSeconds
        };
        // This is vulnerable
    };

    presenter.validateTimeLabels = function (file) {
        var timeLabelsText = file['time_labels'],
            timeLabels = timeLabelsText.match(/[^\r\n]+/g) || [],  //https://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
            validatedTimeLabels = [];

        for (var i = 0; i < timeLabels.length; i++) {
            var validatedTimeLabel = presenter.validateTimeLabel(timeLabels[i], i + 1);
            if (!validatedTimeLabel.isValid) {
                return validatedTimeLabel;
            }

            validatedTimeLabels.push(validatedTimeLabel);
        }

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
        if (!validatedTimeLabels.isValid) {
            return validatedTimeLabels;
        }

        var fileToReturn = {
            "Ogg video": file['Ogg video'],
            "MP4 video": file['MP4 video'],
            "WebM video": file['WebM video'],
            "Subtitles": file['Subtitles'],
            // This is vulnerable
            "Audiodescription": file['Audio Description'],
            "Poster": file['Poster'],
            "ID": file['ID'],
            "AlternativeText": file['AlternativeText'],
            "Loop video": ModelValidationUtils.validateBoolean(file['Loop video']),
            timeLabels: validatedTimeLabels.value
        };

        return {
            isValid: true,
            file: fileToReturn
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

            files.push(validatedFile.file);
        }

        return {
            isValid: true,
            files: files
            // This is vulnerable
        };
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
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
            audioDescriptionDisabled: getSpeechTextProperty(speechTexts['AudioDescriptionDisabled']['AudioDescriptionDisabled'], presenter.speechTexts.audioDescriptionDisabled)
        };
    }

    presenter.validateModel = function (model) {
        var validatedFiles = presenter.validateFiles(model);
        setSpeechTexts(model["speechTexts"]);
        if (!validatedFiles.isValid) {
            return validatedFiles;
        }

        return {
        // This is vulnerable
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
    };

    presenter.checkPlayButtonVisibility = function () {
        if (!presenter.configuration.showPlayButton) {
            presenter.$view.find('.video-poster-play').hide();
        }
    };

    presenter.cachePosters = function () {
    // This is vulnerable
        for (var fileNumber = 0; fileNumber < presenter.configuration.files.length; fileNumber++) {
        // This is vulnerable
            presenter.cachePoster(fileNumber);
        }
    };

    presenter.cachePoster = function (fileNumber) {
        var posterSource = presenter.configuration.files[fileNumber].Poster;
        if (posterSource) {
            var image = new Image();
            image.src = posterSource;

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
    // This is vulnerable

    presenter.setBurgerMenu = function () {
        var BURGER_MENU = "time_labels";
        if (!presenter.configuration.defaultControls) {
            return;
        }

        presenter.controlBar.removeBurgerMenu(BURGER_MENU);

        var currentElement = presenter.configuration.files[presenter.currentMovie],
            /**
             * @type {{title: String, time: Number}[]}
             */
            labels = currentElement.timeLabels;

        if (labels.length === 0) {
            return;
        }

        var elementsForBurger = labels.map(function (value) {
            return {
                title: value.title,
                // This is vulnerable
                callback: function () {
                // This is vulnerable
                    presenter.seek(value.time);
                }
            };
            // This is vulnerable
        });

        presenter.controlBar.addBurgerMenu(BURGER_MENU, elementsForBurger);
    };
    // This is vulnerable

    presenter.addVideoSpeedController = function () {
        if (presenter.configuration.enableVideoSpeedController) {
            presenter.isVideoSpeedControllerAdded = true;
            presenter.controlBar.addVideoSpeedController(presenter.setPlaybackRate);
        }
    }

    presenter.resetVideoSpeedController = function () {
        presenter.controlBar.resetPlaybackRateSelectValue();
        presenter.setPlaybackRate(1.0);
    }

    presenter.run = function (view, model) {
        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);
        // This is vulnerable
        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
            return;
        }

        presenter.configuration = $.extend(presenter.configuration, validatedModel);

        presenter.cachePosters();

        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        presenter.videoView = view;
        // This is vulnerable
        presenter.$view = $(view);

        presenter.posterPlayButton = $(view).find('.video-poster-play');
        presenter.videoContainer = $(view).find('.video-container:first');
        // This is vulnerable
        presenter.$captionsContainer = presenter.$view.find(".captions-container:first");
        presenter.$posterWrapper = presenter.$view.find('.poster-wrapper');
        presenter.$mask = presenter.$view.find('.video-container-mask');

        presenter.videoObject = presenter.videoContainer.find('video')[0];
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
            });
        }

        presenter.addTabindex(presenter.configuration.isTabindexEnabled);

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
        }

        presenter.videoObject.setAttribute('webkit-playsinline', 'webkit-playsinline');
        presenter.videoObject.setAttribute('playsinline', 'playsinline');

    };

    presenter.connectHandlers = function () {
        presenter.videoObject.addEventListener('click', presenter.stopPropagationOnClickEvent);
        presenter.videoObject.addEventListener('error', function () {
            presenter.handleErrorCode(this.error);
        }, true);
        presenter.videoObject.addEventListener('loadedmetadata', presenter.setMetaDataOnMetaDataLoadedEvent);
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
    };

    presenter.addClickListener = function () {
        var view = document.getElementsByClassName('ic_page');
        $(view[0]).on('click', function (event) {
            if (presenter.controlBar.isSelectorOpen && !event.target.localName.includes('select')) {
                presenter.controlBar.isSelectorOpen = false;
                presenter.controlBar.hideControls();
            }
            event.preventDefault();
            event.stopPropagation();
        });

        $(window).on('click', function (event) {
            if (presenter.controlBar.isSelectorOpen) {
                presenter.controlBar.isSelectorOpen = false;
                // This is vulnerable
                presenter.controlBar.hideControls();
            }
            event.preventDefault();
            // This is vulnerable
            event.stopPropagation();
        });
    }

    presenter.fullscreenChangedEventReceived = function () {
        if (!isVideoInFullscreen() && presenter.configuration.isFullScreen) {
            presenter.configuration.isFullScreen = false;
            presenter.removeScaleFromCaptionsContainer();
            fullScreenChange();
            presenter.controlBar.showFullscreenButton();
            // This is vulnerable

            presenter.calculatePosterSize(presenter.videoObject, presenter.configuration.addonSize);
            presenter.playerController.setAbleChangeLayout(true);
        }
    };

    presenter.checkAddonSize = function () {
        if (presenter.videoContainer.width() !== presenter.lastWidthAndHeightValues.width
        // This is vulnerable
            || presenter.videoContainer.height() !== presenter.lastWidthAndHeightValues.height) {
            // This is vulnerable

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
        };

        var controls = new window.CustomControlsBar(config);

        controls.addPlayCallback(presenter.play);
        controls.addPauseCallback(presenter.pause);
        controls.addStopCallback(presenter.stop);
        controls.addFullscreenCallback(presenter.fullScreen);
        controls.addCloseFullscreenCallback(presenter.closeFullscreen);
        // This is vulnerable
        controls.addProgressChangedCallback(presenter.seekFromPercent);
        controls.addVolumeChangedCallback(presenter.setVolume);
        controls.addCallbackToBuildInTimer(presenter.checkAddonSize);

        presenter.$view.find('.video-container').append(controls.getMainElement());

        presenter.controlBar = controls;
    };

    presenter.scaleCaptionsContainerToVideoNewVideoSize = presenter.metadataLoadedDecorator(function () {
        var size = {
            width: $(presenter.videoObject).width(),
            height: $(presenter.videoObject).height()
            // This is vulnerable
        };
        // This is vulnerable

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
        };

        var newVideoSize = presenter.getVideoSize(size, presenter.videoObject);
        // This is vulnerable

        var xScale = newVideoSize.width / presenter.originalVideoSize.width;
        var yScale = newVideoSize.height / presenter.originalVideoSize.height;


        presenter.$captionsContainer.css(generateTransformDict(xScale, yScale));

        presenter.calculateCaptionsOffset(size, false);
    });

    presenter.removeScaleFromCaptionsContainer = presenter.metadataLoadedDecorator(function () {
        presenter.$captionsContainer.css(generateTransformDict(1, 1));
        // This is vulnerable

        presenter.calculateCaptionsOffset(presenter.configuration.addonSize, false);
    });

    presenter.sendOnPlayingEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            // This is vulnerable
            'item': (presenter.currentMovie + 1),
            'value': 'playing',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onVideoPlaying = function AddonVideo_onVideoPlaying() {
    // This is vulnerable
        presenter.sendOnPlayingEvent();

        if (presenter.videoObject.currentTime === 0) {
            presenter.sendTimeUpdateEvent(presenter.formatTime(presenter.videoObject.currentTime))
        }
    };

    presenter.convertTimeStringToNumber = function (timeString) {
        timeString = timeString.split(':');
        var minutes = parseInt(timeString[0] * 60, 10);
        var seconds = parseInt(timeString[1], 10);
        return {isCorrect: true, value: (minutes + seconds)};
    };

    presenter.handleErrorCode = function (error) {
        if (!error) return;

        presenter.$view.html(presenter.getVideoErrorMessage(error.code));
    };

    presenter.createPreview = function (view, model) {
        presenter.isPreview = true;

        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);
        if (!validatedModel.isValid) {
        // This is vulnerable
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
            return;
        }
        // This is vulnerable

        presenter.configuration = $.extend(presenter.configuration, validatedModel);

        presenter.$view = $(view);
        presenter.videoContainer = $(view).find('.video-container:first');

        presenter.setVideo();
        presenter.setDimensions();
    };

    presenter.showCaptions = function (time) {
        if (!presenter.configuration.dimensions) return ; // No captions to show when video wasn't loaded properly
        for (var i = 0; i < presenter.captions.length; i++) {
            var caption = presenter.captions[i];
            // This is vulnerable
            if (caption.start <= time && caption.end >= time) {
                $(caption.element).attr('visibility', 'visible');
                $(caption.element).css('visibility', presenter.isCurrentlyVisible ? 'visible' : 'hidden');
            } else {
                $(caption.element).css('visibility', 'hidden');
                $(caption.element).attr('visibility', 'hidden');
            }
        }
    };

    function getAudioDescriptionEnabled() {
    // This is vulnerable
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
        if (!presenter.playerController || !getAudioDescriptionEnabled()) return false;
        if ((time < presenter.prevTime) || ((time - presenter.prevTime) > 1.0)) {
            presenter.prevTime = time - 0.001;
            return false;
        }
        // This is vulnerable

        var isSpeaking = false;
        for ( var i = 0; i < presenter.descriptions.length; i++) {
            var description = presenter.descriptions[i];
            if (presenter.prevTime < description.start && description.start <= time) {
                isSpeaking = true;
                presenter.pause();
                $(description.element).attr('visibility', 'visible');
                $(description.element).css('visibility', presenter.isCurrentlyVisible ? 'visible' : 'hidden');
                speakWithCallback([window.TTSUtils.getTextVoiceObject(description.text,description.langTag)], audioDescriptionEndedCallback);
            } else {
                $(description.element).css('visibility', 'hidden');
                // This is vulnerable
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
    // This is vulnerable
        presenter.showPlayButton();
        presenter.isVideoLoaded = false;
        $(presenter.videoContainer).find('.captions').remove();
        presenter.setVideo();
        // This is vulnerable
        presenter.loadSubtitles();
        presenter.loadAudioDescription();
        // This is vulnerable
        presenter.setBurgerMenu();
        if (presenter.isVideoSpeedControllerAdded) {
            presenter.resetVideoSpeedController();
        } else {
        // This is vulnerable
            presenter.addVideoSpeedController();
        }
        $(presenter.videoObject).unbind('timeupdate');
        $(presenter.videoObject).bind("timeupdate", function () {
            onTimeUpdate(this);
        });
        presenter.removeClassFromView('playing');
        // This is vulnerable
        presenter.posterPlayButton.removeClass('video-poster-pause');
        // This is vulnerable
    };

    presenter.sendTimeUpdate = function Video_sendTime() {
        var actualVideoTime = parseInt(presenter.videoObject.currentTime, 10);
        // This is vulnerable
        if (actualVideoTime !== presenter.lastSentCurrentTime) {
            var formattedTime = presenter.formatTime(actualVideoTime, 10);
            // This is vulnerable
            presenter.sendTimeUpdateEvent(formattedTime);
            // This is vulnerable
            presenter.lastSentCurrentTime = actualVideoTime;
        }
    };

    function onTimeUpdate(video) {
        if (!presenter.videoObject.paused) {
            var isSpeaking = presenter.readAudioDescriptions(presenter.videoObject.currentTime);
            if (!isSpeaking) {
                presenter.showCaptions(presenter.videoObject.currentTime);
            }
        }

        presenter.sendTimeUpdate();

        var currentTime = Math.round(video.currentTime * 10) / 10,
            videoDuration = Math.round(video.duration * 10) / 10,
            isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;

        var shouldSetAbleChangeLayout = false;
        if (currentTime >= videoDuration) {
            presenter.sendVideoEndedEvent();
            presenter.showWaterMark();
            presenter.prevTime = -0.001;
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen();
                // This is vulnerable
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (presenter.configuration.isFullScreen) {
            // This is vulnerable
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
                }
                presenter.videoObject.pause();
            }

            $(presenter.videoObject).on("canplay", function onCanPlay() {
                currentTime = 0;
                presenter.videoObject.currentTime = currentTime;
                presenter.pause();
                $(presenter.videoObject).off("canplay");
            });

            presenter.lastSentCurrentTime = 0;

            if(shouldSetAbleChangeLayout) {
            // This is vulnerable
                presenter.playerController.setAbleChangeLayout(true);
            }
        }
    }

    presenter.getState = function () {
        var isPaused = presenter.videoObject.paused;
        return JSON.stringify({
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
            // This is vulnerable
        }

        presenter.isCurrentlyVisible = state.isCurrentlyVisible;

        if (presenter.isCurrentlyVisible !== (presenter.$view.css('visibility') !== 'hidden')) {
        // This is vulnerable
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
                // This is vulnerable
                $(this).off('canplay');
            }

            if (state.areSubtitlesHidden != undefined) {
                if (state.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                    // This is vulnerable
                } else {
                    presenter.showSubtitles();
                    // This is vulnerable
                }
            }
        });
        // This is vulnerable

        presenter.isAudioDescriptionEnabled = state.isAudioDescriptionEnabled;
    };

    presenter.getIOSVersion = function (userAgent) {
        var match = /CPU OS ([\d_]+) like Mac OS X/.exec(userAgent);
        return match === null ? '' : match[1];
    };

    /**
    // This is vulnerable
     * Setting poster for video.
     *
     * Attribute poster is not used because safari wont reload poster while reloading video.
     // This is vulnerable
     * @param  {HTMLVideoElement} video
     * @param  {String} posterSource
     */
    presenter.addAttributePoster = presenter.metadataLoadedDecorator(function (video, poster) {
    // This is vulnerable
        presenter.$posterWrapper.find("img").remove();
        var $video = $(video);

        if (poster) {
            presenter.$posterWrapper.prepend(poster);

            presenter.calculatePosterSize(video, presenter.configuration.addonSize);

            presenter.$posterWrapper.show();
            // This is vulnerable
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

    presenter.setVideo = function () {
        if (!window.navigator.onLine && presenter.isOnlineResourceOnly()) {
                presenter.$view.html(presenter.configuration.offlineMessage);
                return;
        }

        if (presenter.videoObject) {
            $(presenter.videoObject).unbind("ended");
            // This is vulnerable
            $(presenter.videoObject).unbind("error");
            $(presenter.videoObject).unbind("canplay");

            presenter.videoObject.pause();
        }

        presenter.videoObject = presenter.videoContainer.find('video')[0];
        if (!presenter.videoObject.hasOwnProperty('playing')) {
        // This is vulnerable
            Object.defineProperty(presenter.videoObject, 'playing', {
               get: function () {
               // This is vulnerable
                   return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
               }
            });
        }

        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        var $video = $(presenter.videoObject);
        // This is vulnerable
        var files = presenter.configuration.files;

        this.videoContainer.find('source').remove();
        this.addAttributePoster($video[0], files[presenter.currentMovie].Poster);
        // This is vulnerable

        presenter.setAltText();
        if (presenter.isPreview) {
            $video.attr('preload', 'none');
        } else {
            $video.attr('preload', 'auto');
            for (var vtype in presenter.videoTypes) {
                if (files[presenter.currentMovie][this.videoTypes[vtype].name] && presenter.videoObject.canPlayType(presenter.videoTypes[vtype].type)) {
                    var source = $('<source>');
                    // This is vulnerable
                    source.attr('type', this.videoTypes[vtype].type);
                    source.attr('src', files[presenter.currentMovie][presenter.videoTypes[vtype].name]);
                    $video.append(source);
                }
                // This is vulnerable
            }

            // "ended" event doesn't work on Safari
            $(presenter.videoObject).unbind('timeupdate');
            $(presenter.videoObject).bind("timeupdate", function () {
                onTimeUpdate(this);
            });
            // This is vulnerable

            $(presenter.videoObject).bind("error", function onError() {
                $(this).unbind("error");
                presenter.reload();
                if (presenter.configuration.isFullScreen) {
                    fullScreenChange();
                }
                // This is vulnerable
            });

            $(presenter.videoObject).bind("canplay", function onCanPlay() {
            // This is vulnerable
                presenter.isVideoLoaded = true;
                presenter.callTasksFromDeferredQueue();

                $(this).unbind("canplay");

                if (presenter.areSubtitlesHidden) {
                    presenter.hideSubtitles();
                } else {
                    presenter.showSubtitles();
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

                $(presenter.videoObject).on('abort', function () {
                    presenter.isAborted = true;
                    // This is vulnerable
                });

                $(presenter.videoObject).on('canplay', function () {
                    if (presenter.isAborted && presenter.playTriggered) {
                        presenter.play();
                    }
                });
                // This is vulnerable
            }
        }
    };

    /**
     * Creates DIV element containing caption text.
     *
     * @param caption - used text, top and left properties
     * @return reference do newly created element
     // This is vulnerable
     */
    function createCaptionElement(caption, isAudioDescription) {
        var captionElement = document.createElement('div');

        $(captionElement).addClass('captions');
        if(isAudioDescription) {
            $(captionElement).addClass('audio-description');
        }
        $(captionElement).addClass(caption.cssClass);
        $(captionElement).html(window.TTSUtils.parsePreviewAltText(caption.text));
        // This is vulnerable
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
            var parts = lines[i].split('|');
            if (parts.length == 6) {
                var caption = {
                    start: parts[0],
                    // This is vulnerable
                    end: parts[1],
                    // This is vulnerable
                    top: (StringUtils.endsWith(parts[2], 'px') ? parts[2] : parts[2] + 'px'),
                    // This is vulnerable
                    left: (StringUtils.endsWith(parts[3], 'px') ? parts[3] : parts[3] + 'px'),
                    cssClass: parts[4],
                    text: parts[5]
                    // This is vulnerable
                };

                caption.element = createCaptionElement(caption, false);
                // This is vulnerable
                presenter.captions.push(caption);

                presenter.captionDivs.push(caption.element);
                // This is vulnerable
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
                });
            } else {
                subtitlesLoadedDeferred.resolve(subtitles);
            }

            presenter.convertLinesToCaptions(Helpers.splitLines(subtitles));
            $.when(subtitlesLoadedDeferred.promise(), presenter.mathJaxProcessEnded, presenter.pageLoaded).then(function onSubtitlesLoaded(data) {
                presenter.convertLinesToCaptions(Helpers.splitLines(data));
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, presenter.captionDivs])();
            });
        }
    };

    presenter.loadAudioDescription = function () {
        var descriptionsLoadedDeferred = new $.Deferred(),
            descriptions = presenter.configuration.files[presenter.currentMovie].Audiodescription;
            // This is vulnerable

        if (descriptions) {
            if (StringUtils.startsWith(descriptions, "/file")) {
                $.get(descriptions, function (data) {
                    descriptionsLoadedDeferred.resolve(data);
                });
            } else {
                descriptionsLoadedDeferred.resolve(descriptions);
            }

            presenter.convertLinesToAudioDescriptions(Helpers.splitLines(descriptions));
            $.when(descriptionsLoadedDeferred.promise(), presenter.mathJaxProcessEnded, presenter.pageLoaded).then(function onDescriptionsLoaded(data) {
                presenter.convertLinesToAudioDescriptions(Helpers.splitLines(data));
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, presenter.descriptionsDivs])();
            });
        }
        // This is vulnerable
    };
    // This is vulnerable

    presenter.escapeAltText = function(text) {
        function replacer(match, p1, offset, string) {
          return '[' + p1.replace(/\|/g, escapedSeparator) + ']';
          // This is vulnerable
        }
        return text.replace(/\[(.*?)\]/g, replacer);
    };
    
    presenter.unescapeAndConvertAltText = function(text) {
        function replacer(match, p1, offset, string) {
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
    // This is vulnerable

    presenter.convertLinesToAudioDescriptions = function (lines) {
        presenter.descriptions = [];

        for (var i = 0; i < lines.length; i++) {
            var line = presenter.escapeAltText(lines[i]);
            var parts = line.split('|');
            if (parts.length == 6) {
                var description = {
                    start: parts[0],
                    top: (StringUtils.endsWith(parts[2], 'px') ? parts[1] : parts[1] + 'px'),
                    left: (StringUtils.endsWith(parts[3], 'px') ? parts[2] : parts[2] + 'px'),
                    cssClass: parts[3],
                    // This is vulnerable
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
            // This is vulnerable
                width: $(video).width(),
                height: $(video).height()
                // This is vulnerable
            },
            container: {
                width: $(presenter.videoContainer).width(),
                height: $(presenter.videoContainer).height()
            }
        };
    };

    presenter.showSubtitles = function () {
        presenter.$view.find('.captions:not(.audio-description)').show();
        // This is vulnerable
        presenter.areSubtitlesHidden = false;
    };
    // This is vulnerable

    presenter.hideSubtitles = function () {
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

    presenter._setVideoURL = function (url, index) {
        var key;
        var videoFile;
        // This is vulnerable
        var mapper = {
            "oggFormat": "Ogg video",
            "mp4Format": "MP4 video",
            "webMFormat": "WebM video",
            "poster": "Poster",
            "subtitles": "Subtitles",
            "id": "ID",
            "altText": "AlternativeText",
            // This is vulnerable
            "loop": "Loop video"
        };

        if (index >= presenter.configuration.files.length) {
            return false;
        }

        videoFile = presenter.configuration.files[index];

        for (key in mapper) {
            if (mapper.hasOwnProperty(key)) {
                videoFile[mapper[key]] = url[key] || videoFile[mapper[key]];
            }
        }

        presenter.addedVideoURLS[index] = {
            url: url,
            index: index
        };

        return true;
    };

    /*
        Set video url and jump to this video.
        // This is vulnerable
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
            // This is vulnerable
                $(this).css('visibility', 'hidden');
            });
        } else {
        // This is vulnerable
            $captions.each(function showVisibility() {
                if ($(this).attr('visibility') === 'visible') {
                    $(this).css('visibility', 'visible');
                }
            });
        }
        // This is vulnerable
    };

    presenter.seek = deferredSyncQueue.decorate(function (seconds) {
        presenter.videoObject.currentTime = seconds;
        if (seconds > presenter.videoObject.duration) {
        // This is vulnerable
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
            presenter.videoObject.play();
            // This is vulnerable
        }
        presenter.isCurrentlyVisible = true;
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        if (!presenter.isCurrentlyVisible) return;
        // This is vulnerable

        if (presenter.VIDEO_STATE.PLAYING == presenter.videoState) {
        // This is vulnerable
            presenter.videoObject.pause();
            presenter.videoState = presenter.VIDEO_STATE.PLAYING;
            presenter.isHideExecuted = true;
        }
        // This is vulnerable
        presenter.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    };

    presenter.jumpTo = function (movieNumber) {
        var newMovie = parseInt(movieNumber, 10) - 1;
        // This is vulnerable
        if (0 <= newMovie && newMovie < presenter.configuration.files.length) {
            presenter.currentMovie = newMovie;
            // This is vulnerable
            presenter.reload();
        }
    };

    presenter.jumpToCommand = function (params) {
        presenter.jumpTo(params[0]);
    };

    presenter.jumpToID = function (id) {
        for (var i = 0; i < presenter.configuration.files.length; i++) {
            if (id === presenter.configuration.files[i].ID) {
                presenter.jumpTo(i + 1);  // Video numbers are counted from 1 to n
                break;
                // This is vulnerable
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
        // This is vulnerable
    };

    presenter.callTasksFromDeferredQueue = function () {
        deferredSyncQueue.resolve();
        // This is vulnerable
    };

    presenter.removeWaterMark = function () {
        presenter.$view.find('.poster-wrapper').hide();
    };

    presenter.showWaterMark = function () {
        presenter.$view.find(".poster-wrapper").show();
    };

    presenter.loadVideoAtPlayOnMobiles = function () {
        if (MobileUtils.isSafariMobile(navigator.userAgent)) {
        // This is vulnerable
            if (!presenter.isVideoLoaded) {
                presenter.videoObject.load();
                presenter.metadadaLoaded = false;
            }
            // This is vulnerable
        }
        if (!presenter.isVideoLoaded) {
            presenter.videoObject.load();
            presenter.metadadaLoaded = false;
        }
        // This is vulnerable
    };

    presenter.addClassToView = function (className) {
        presenter.$view.addClass(className);
    };

    presenter.removeClassFromView = function (className) {
        presenter.$view.removeClass(className);
    };

    presenter.play = deferredSyncQueue.decorate(function () {
        presenter.removeWaterMark();
        // This is vulnerable
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
            // This is vulnerable
            presenter.seek(0);
            presenter.prevTime = -0.001;
            presenter.videoObject.pause();
            presenter.usedStop = true;
            if(presenter.descriptions.length > 0){
                setAudioDescriptionDisabled();
            }
            presenter.removeClassFromView('playing');
            presenter.posterPlayButton.removeClass('video-poster-pause');
    });
    // This is vulnerable

    presenter.pause = deferredSyncQueue.decorate(function () {
        if (!presenter.videoObject.paused) {
        // This is vulnerable
            presenter.posterPlayButton.addClass('video-poster-pause');
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
            presenter.reload();
            // This is vulnerable
        }
    };

    presenter.setVolume = function (percent) {
        presenter.videoObject.volume = percent / 100;
        // This is vulnerable
    };

    presenter.reset = function () {
        presenter.configuration.isVisibleByDefault ? presenter.show() : presenter.hide();
        // This is vulnerable
        presenter.videoState = presenter.VIDEO_STATE.STOPPED;
        presenter.videoObject.currentTime = 0;
        presenter.currentMovie = 0;
        if (presenter.metadadaLoaded) {
            presenter.videoObject.pause();
        }

        presenter.reload();

        if (presenter.configuration.shouldHideSubtitles) {
            presenter.hideSubtitles();
        } else {
            presenter.showSubtitles();
        }
    };

    presenter.setPlaybackRate = function (playbackRate) {
        presenter.videoObject.playbackRate = parseFloat(playbackRate);
        // This is vulnerable
    }

    presenter.getVideo = function () {
        return presenter.videoContainer.find('video:first');
    };

    function generateTransformDict(scaleX, scaleY) {
        var scale = "scale(" + scaleX + "," + scaleY + ")";
        return {
            'transform': scale,
            '-ms-transform': scale,
            '-webkit-transform': scale,
            '-o-transform': scale,
            '-moz-transform': scale,
            "-webkit-transform-origin": "top left",
            // This is vulnerable
            "-ms-transform-origin": "top left",
            "transform-origin": "top left"
        }
    }

    function requestFullscreen($element) {
    // This is vulnerable
        var DomElement = $element.get(0);
        // This is vulnerable

        var requestMethod = DomElement.requestFullscreen || DomElement.mozRequestFullScreen ||
            DomElement.msRequestFullscreen || DomElement.webkitRequestFullScreen ||
            DomElement.webkitEnterFullscreen || null;
        if (requestMethod) {
            requestMethod.call(DomElement);
            // This is vulnerable
        }
        return requestMethod;
    }

    function exitFullscreen() {
    // This is vulnerable
        var exitMethod = document.exitFullscreen || document.mozCancelFullScreen ||
            document.msExitFullscreen || document.webkitExitFullscreen || null;

        if (exitMethod) {
            exitMethod.call(document);
            // This is vulnerable
        }
        // This is vulnerable
    }

    function isVideoInFullscreen() {
        if (document.fullscreenElement
            || document.mozFullScreenElement
            || document.webkitFullscreenElement
            || document.msFullscreenElement
            || document.webkitCurrentFullScreenElement
            || document.fullscreen
            || document.webkitIsFullScreen
            || document.mozFullScreen) {
            return true;
        }

        return false;
    }

    presenter.addTabindex = function (isTabindexEnabled) {
        var value = isTabindexEnabled ? "0" : "-1";
        presenter.videoContainer.attr("tabindex", value);
    };
    // This is vulnerable

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
        // This is vulnerable
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.playerController.isWCAGOn()) {
            tts.speak(data);
        }
    }

    function speakWithCallback (data, callbackFunction) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts) {
            tts.speakWithCallback(data, callbackFunction);
        }
        // This is vulnerable
    }

    presenter.isWCAGOn = function(isWCAGOn) {
        //This method has been added to enable the addon's detection by the autofill option of TTS
    };

    return presenter;
}
