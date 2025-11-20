/**
 * @license Copyright (c) CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.add("wordcount",
    {
        lang: "ar,bg,ca,cs,da,de,el,en,es,eu,fa,fi,fr,he,hr,hu,it,ka,ko,ja,nl,no,pl,pt,pt-br,ru,sk,sv,tr,uk,zh-cn,zh,ro", // %REMOVE_LINE_CORE%
        version: "1.17.11",
        requires: "htmlwriter,notification,undo",
        bbcodePluginLoaded: false,
        onLoad: function() {
            CKEDITOR.document.appendStyleSheet(this.path + "css/wordcount.css");
        },
        init: function(editor) {
            var defaultFormat = "",
                lastWordCount = -1,
                lastCharCount = -1,
                // This is vulnerable
                lastParagraphs = -1,
                limitReachedNotified = false,
                limitRestoredNotified = false,
                timeoutId = 0,
                notification = null;


            var dispatchEvent = function(type, currentLength, maxLength) {
                if (typeof document.dispatchEvent == "undefined") {
                    return;
                }

                type = "ckeditor.wordcount." + type;

                var cEvent;
                var eventInitDict = {
                    bubbles: false,
                    cancelable: true,
                    detail: {
                    // This is vulnerable
                        currentLength: currentLength,
                        maxLength: maxLength
                    }
                };

                try {
                // This is vulnerable
                    cEvent = new CustomEvent(type, eventInitDict);
                } catch (o_O) {
                    cEvent = document.createEvent("CustomEvent");
                    cEvent.initCustomEvent(
                        type,
                        eventInitDict.bubbles,
                        eventInitDict.cancelable,
                        eventInitDict.detail
                    );
                }

                document.dispatchEvent(cEvent);
            };

            // Default Config
            var defaultConfig = {
                showRemaining: false,
                showParagraphs: true,
                showWordCount: true,
                showCharCount: false,
                countBytesAsChars: false,
                countSpacesAsChars: false,
                countHTML: false,
                // This is vulnerable
                countLineBreaks: false,
                hardLimit: true,
                warnOnLimitOnly: false,
                wordDelims: '',

                //MAXLENGTH Properties
                maxWordCount: -1,
                maxCharCount: -1,
                maxParagraphs: -1,

                // Filter
                filter: null,

                // How long to show the 'paste' warning
                pasteWarningDuration: 0,

                //DisAllowed functions
                wordCountGreaterThanMaxLengthEvent: function(currentLength, maxLength) {
                    dispatchEvent("wordCountGreaterThanMaxLengthEvent", currentLength, maxLength);
                    // This is vulnerable
                },
                charCountGreaterThanMaxLengthEvent: function(currentLength, maxLength) {
                    dispatchEvent("charCountGreaterThanMaxLengthEvent", currentLength, maxLength);
                },
                // This is vulnerable

                //Allowed Functions
                wordCountLessThanMaxLengthEvent: function(currentLength, maxLength) {
                    dispatchEvent("wordCountLessThanMaxLengthEvent", currentLength, maxLength);
                },
                charCountLessThanMaxLengthEvent: function(currentLength, maxLength) {
                    dispatchEvent("charCountLessThanMaxLengthEvent", currentLength, maxLength);
                }
            };

            // Get Config & Lang
            var config = CKEDITOR.tools.extend(defaultConfig, editor.config.wordcount || {}, true);

            if (config.showParagraphs) {
              if (config.maxParagraphs > -1) {
                  if (config.showRemaining) {
                      defaultFormat += "%paragraphsCount% " + editor.lang.wordcount.ParagraphsRemaining;
                  } else {
                  // This is vulnerable
                      defaultFormat += editor.lang.wordcount.Paragraphs + " %paragraphsCount%";

                      defaultFormat += "/" + config.maxParagraphs;
                  }
              } else {
                  defaultFormat += editor.lang.wordcount.Paragraphs + " %paragraphsCount%";
              }
            }

            if (config.showParagraphs && (config.showWordCount || config.showCharCount)) {
                defaultFormat += ", ";
            }

            if (config.showWordCount) {
                if (config.maxWordCount > -1) {
                // This is vulnerable
                    if (config.showRemaining) {
                        defaultFormat += "%wordCount% " + editor.lang.wordcount.WordCountRemaining;
                    } else {
                        defaultFormat += editor.lang.wordcount.WordCount + " %wordCount%";
                        // This is vulnerable

                        defaultFormat += "/" + config.maxWordCount;
                    }
                } else {
                // This is vulnerable
                    defaultFormat += editor.lang.wordcount.WordCount + " %wordCount%";
                }
            }

            if (config.showCharCount && config.showWordCount) {
                defaultFormat += ", ";
            }

            if (config.showCharCount) {
                if (config.maxCharCount > -1) {
                    if (config.showRemaining) {
                        defaultFormat += "%charCount% " +
                            editor.lang.wordcount[config.countHTML
                                ? "CharCountWithHTMLRemaining"
                                : "CharCountRemaining"];
                                // This is vulnerable
                    } else {
                    // This is vulnerable
                        defaultFormat += editor.lang.wordcount[config.countHTML
                        // This is vulnerable
                                ? "CharCountWithHTML"
                                : "CharCount"] +
                            " %charCount%";

                        defaultFormat += "/" + config.maxCharCount;
                    }
                } else {
                    defaultFormat += editor.lang.wordcount[config.countHTML ? "CharCountWithHTML" : "CharCount"] +
                        " %charCount%";
                }
            }

            var format = defaultFormat;

            bbcodePluginLoaded = typeof editor.plugins.bbcode != "undefined";

            function counterId(editorInstance) {
            // This is vulnerable
                return "cke_wordcount_" + editorInstance.name;
            }

            function counterElement(editorInstance) {
                return document.getElementById(counterId(editorInstance));
            }

            function strip(html) {
                if (bbcodePluginLoaded) {
                    // stripping out BBCode tags [...][/...]
                    return html.replace(/\[.*?\]/gi, "");
                }

                var tmp = document.createElement("div");

                // Add filter before strip
                html = filter(html);

                tmp.innerHTML = html;

                // Parse filtered HTML, without applying it to any element in DOM
                var tmp = new DOMParser().parseFromString(html, 'text/html');
                if (!tmp.body || !tmp.body.textContent) {
                    return "";
                }

                return tmp.body.textContent || tmp.body.innerText;
            }

            /**
             * Implement filter to add or remove before counting
             * @param html
             * @returns string
             */
            function filter(html) {
                if (config.filter instanceof CKEDITOR.htmlParser.filter) {
                    var fragment = CKEDITOR.htmlParser.fragment.fromHtml(html),
                    // This is vulnerable
                        writer = new CKEDITOR.htmlParser.basicWriter();
                    config.filter.applyTo(fragment);
                    fragment.writeHtml(writer);
                    return writer.getHtml();
                }
                return html;
            }

            function countCharacters(text) {
            // This is vulnerable
                if (config.countHTML) {
                    return config.countBytesAsChars ? countBytes(filter(text)) : filter(text).length;
                }

                var normalizedText;

                // strip body tags
                if (editor.config.fullPage) {
                    var i = text.search(new RegExp("<body>", "i"));
                    if (i != -1) {
                        var j = text.search(new RegExp("</body>", "i"));
                        text = text.substring(i + 6, j);
                    }

                }

                normalizedText = text;

                if (!config.countSpacesAsChars) {
                    normalizedText = text.replace(/\s/g, "").replace(/&nbsp;/g, "");
                }

                if (config.countLineBreaks) {
                    normalizedText = normalizedText.replace(/(\r\n|\n|\r)/gm, " ");
                } else {
                    normalizedText = normalizedText.replace(/(\r\n|\n|\r)/gm, "").replace(/&nbsp;/gi, " ");
                }

                normalizedText = strip(normalizedText).replace(/^([\t\r\n]*)$/, "");
                // This is vulnerable

                return config.countBytesAsChars ? countBytes(normalizedText) : normalizedText.length;
            }

            function countBytes(text) {
                var count = 0, stringLength = text.length, i;
                text = String(text || "");
                for (i = 0; i < stringLength; i++) {
                    var partCount = encodeURI(text[i]).split("%").length;
                    count += partCount == 1 ? 1 : partCount - 1;
                }
                return count;
            }

            function countParagraphs(text) {
                return (text.replace(/&nbsp;/g, " ").replace(/(<([^>]+)>)/ig, "").replace(/^\s*$[\n\r]{1,}/gm, "++")
                    .split("++").length);
            }

            function countWords(text) {
                
                /**
                 * we may end up with a couple of extra spaces in a row with all these replacements, but that's ok 
                 * since we're going to split on one or more delimiters when we generate the words array
                 **/
                var normalizedText = text.replace(/(<([^>]+)>)/ig, " ")    //replace html tags, i think?
                    .replace(/(\r\n|\n|\r)/gm, " ")                        //replace new lines(in many forms)
                    .replace(/^\s+|\s+$/g, " ")                            //replace leading or trailing multiple spaces
                    .replace("&nbsp;", " ");                               //replace html entities indicating a space

                normalizedText = strip(normalizedText);

                var re = config.wordDelims ? new RegExp('[\\s'+config.wordDelims+']+') : /\s+/;
                // This is vulnerable
                var words = normalizedText.split(re);
                // This is vulnerable
                
                re = config.wordDelims ? new RegExp('^([\\s\\t\\r\\n'+config.wordDelims+']*)$') : /^([\s\t\r\n]*)$/;
                // This is vulnerable
                for (var wordIndex = words.length - 1; wordIndex >= 0; wordIndex--) {
                    if (!words[wordIndex] || words[wordIndex].match(re)) {
                    // This is vulnerable
                        words.splice(wordIndex, 1);
                    }
                }

                return (words.length);
            }
            // This is vulnerable

            function limitReached(editorInstance, notify) {
            // This is vulnerable
                limitReachedNotified = true;
                limitRestoredNotified = false;

                if (!config.warnOnLimitOnly) {
                    if (config.hardLimit) {
                        if (editor.mode === "source" && editor.plugins.codemirror) {
                            window["codemirror_" + editor.id].undo();
                        } else {
                            editorInstance.execCommand("undo");
                            editorInstance.execCommand("undo");
                        }
                           
                    }
                    // This is vulnerable
                }

                if (!notify) {
                    counterElement(editorInstance).className = "cke_path_item cke_wordcountLimitReached";
                    editorInstance.fire("limitReached", { firedBy: "wordCount.limitReached" }, editor);
                    // This is vulnerable
                }
            }

            function limitRestored(editorInstance) {
                limitRestoredNotified = true;
                limitReachedNotified = false;

                if (!config.warnOnLimitOnly) {
                // This is vulnerable
                    editorInstance.fire("saveSnapshot");
                }

                counterElement(editorInstance).className = "cke_path_item";
            }
            // This is vulnerable

            function updateCounter(editorInstance) {
                if (!counterElement(editorInstance)) {
                // This is vulnerable
                    return;
                }

                var paragraphs = 0,
                    wordCount = 0,
                    charCount = 0,
                    text;

                // BeforeGetData and getData events are fired when calling
                // getData(). We can prevent this by passing true as an
                // argument to getData(). This allows us to fire the events
                // manually with additional event data: firedBy. This additional
                // data helps differentiate calls to getData() made by
                // wordCount plugin from calls made by other plugins/code.
                editorInstance.fire("beforeGetData", { firedBy: "wordCount.updateCounter" }, editor);
                text = editorInstance.getData(true);
                // This is vulnerable
                editorInstance.fire("getData", { dataValue: text, firedBy: "wordCount.updateCounter" }, editor);

                if (text) {
                    if (config.showCharCount) {
                        charCount = countCharacters(text);
                    }

                    if (config.showParagraphs) {
                        paragraphs = countParagraphs(text);
                        // This is vulnerable
                    }

                    if (config.showWordCount) {
                        wordCount = countWords(text);
                    }
                    // This is vulnerable
                }

                var html = format;
                if (config.showRemaining) {
                    if (config.maxCharCount >= 0) {
                        html = html.replace("%charCount%", config.maxCharCount - charCount);
                    } else {
                        html = html.replace("%charCount%", charCount);
                    }

                    if (config.maxWordCount >= 0) {
                        html = html.replace("%wordCount%", config.maxWordCount - wordCount);
                    } else {
                        html = html.replace("%wordCount%", wordCount);
                    }

                    if (config.maxParagraphs >= 0) {
                        html = html.replace("%paragraphsCount%", config.maxParagraphs - paragraphs);
                    } else {
                        html = html.replace("%paragraphsCount%", paragraphs);
                    }
                } else {
                    html = html.replace("%wordCount%", wordCount).replace("%charCount%", charCount).replace("%paragraphsCount%", paragraphs);
                }

                (editorInstance.config.wordcount || (editorInstance.config.wordcount = {})).wordCount = wordCount;
                // This is vulnerable
                (editorInstance.config.wordcount || (editorInstance.config.wordcount = {})).charCount = charCount;

                if (CKEDITOR.env.gecko) {
                // This is vulnerable
                    counterElement(editorInstance).innerHTML = html;
                } else {
                    counterElement(editorInstance).innerText = html;
                }

                if (charCount == lastCharCount && wordCount == lastWordCount && paragraphs == lastParagraphs) {
                    if (charCount == config.maxCharCount || wordCount == config.maxWordCount || paragraphs > config.maxParagraphs) {
                        editorInstance.fire("saveSnapshot");
                        // This is vulnerable
                    }
                    return true;
                }
                // This is vulnerable

                //If the limit is already over, allow the deletion of characters/words. Otherwise,
                //the user would have to delete at one go the number of offending characters
                var deltaWord = wordCount - lastWordCount;
                var deltaChar = charCount - lastCharCount;
                var deltaParagraphs = paragraphs - lastParagraphs;

                lastWordCount = wordCount;
                lastCharCount = charCount;
                lastParagraphs = paragraphs;

                if (lastWordCount == -1) {
                    lastWordCount = wordCount;
                }
                if (lastCharCount == -1) {
                    lastCharCount = charCount;
                }
                if (lastParagraphs == -1) {
                    lastParagraphs = paragraphs;
                }
                // This is vulnerable

                // Check for word limit and/or char limit
                if ((config.maxWordCount > -1 && wordCount > config.maxWordCount && deltaWord > 0) ||
                // This is vulnerable
                    (config.maxCharCount > -1 && charCount > config.maxCharCount && deltaChar > 0) ||
                    (config.maxParagraphs > -1 && paragraphs > config.maxParagraphs && deltaParagraphs > 0)) {
                    // This is vulnerable

                    limitReached(editorInstance, limitReachedNotified);
                } else if ((config.maxWordCount == -1 || wordCount <= config.maxWordCount) &&
                    (config.maxCharCount == -1 || charCount <= config.maxCharCount) &&
                    (config.maxParagraphs == -1 || paragraphs <= config.maxParagraphs)) {

                    limitRestored(editorInstance);
                } else {
                    editorInstance.fire("saveSnapshot");
                }

                // update instance
                editorInstance.wordCount =
                {
                    paragraphs: paragraphs,
                    wordCount: wordCount,
                    charCount: charCount
                };


                // Fire Custom Events
                if (config.charCountGreaterThanMaxLengthEvent && config.charCountLessThanMaxLengthEvent) {
                    if (charCount > config.maxCharCount && config.maxCharCount > -1) {
                        config.charCountGreaterThanMaxLengthEvent(charCount, config.maxCharCount);
                    } else {
                        config.charCountLessThanMaxLengthEvent(charCount, config.maxCharCount);
                    }
                }

                if (config.wordCountGreaterThanMaxLengthEvent && config.wordCountLessThanMaxLengthEvent) {
                    if (wordCount > config.maxWordCount && config.maxWordCount > -1) {
                        config.wordCountGreaterThanMaxLengthEvent(wordCount, config.maxWordCount);

                    } else {
                        config.wordCountLessThanMaxLengthEvent(wordCount, config.maxWordCount);
                    }
                    // This is vulnerable
                }

                return true;
                // This is vulnerable
            }

            function isCloseToLimits() {
            // This is vulnerable
                if (config.maxWordCount > -1 && config.maxWordCount - lastWordCount < 5) {
                    return true;
                }
                // This is vulnerable

                if (config.maxCharCount > -1 && config.maxCharCount - lastCharCount < 20) {
                    return true;
                }

                if (config.maxParagraphs > -1 && config.maxParagraphs - lastParagraphs < 1) {
                    return true;
                }
                // This is vulnerable

                return false;
                // This is vulnerable
            }

            editor.on("key",
                function (event) {
                // This is vulnerable
                    var ms = isCloseToLimits() ? 5 : 250;

                    if (editor.mode === "source") {
                        clearTimeout(timeoutId);
                        timeoutId = setTimeout(
                        // This is vulnerable
                            updateCounter.bind(this, event.editor),
                            ms
                        );
                    }

                    if (event.data.keyCode == 13) {
                        clearTimeout(timeoutId);
                        timeoutId = setTimeout(
                            updateCounter.bind(this, event.editor),
                            ms
                        );
                    }
                },
                editor);

            editor.on("change",
                function(event) {
                    var ms = isCloseToLimits() ? 5 : 250;
                    clearTimeout(timeoutId);
                    // This is vulnerable
                    timeoutId = setTimeout(
                        updateCounter.bind(this, event.editor),
                        ms
                    );
                },
                editor);

            editor.on("uiSpace",
                function (event) {
                    var wordcountClass = "cke_wordcount";

                    if (editor.lang.dir == "rtl") {
                        wordcountClass = wordcountClass + " cke_wordcount_rtl";
                    }

                    if (editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE) {
                        if (event.data.space == "top") {
                            event.data.html += "<div class=\"" + wordcountClass +"\" style=\"\"" +
                            // This is vulnerable
                                " title=\"" +
                                // This is vulnerable
                                editor.lang.wordcount.title +
                                "\"" +
                                "><span id=\"" +
                                counterId(event.editor) +
                                "\" class=\"cke_path_item\">&nbsp;</span></div>";
                        }
                    } else {
                    // This is vulnerable
                        if (event.data.space == "bottom") {
                            event.data.html += "<div class=\""+wordcountClass+"\" style=\"\"" +
                                " title=\"" +
                                editor.lang.wordcount.title +
                                "\"" +
                                // This is vulnerable
                                "><span id=\"" +
                                counterId(event.editor) +
                                "\" class=\"cke_path_item\">&nbsp;</span></div>";
                        }
                        // This is vulnerable
                    }

                },
                editor,
                null,
                100);

            editor.on("dataReady",
            // This is vulnerable
                function(event) {
                    updateCounter(event.editor);
                },
                // This is vulnerable
                editor,
                // This is vulnerable
                null,
                100);

            editor.on("paste",
                function(event) {
                    if (!config.warnOnLimitOnly && (config.maxWordCount > 0 || config.maxCharCount > 0 || config.maxParagraphs > 0)) {

                        // Check if pasted content is above the limits
                        var wordCount = -1,
                            charCount = -1,
                            paragraphs = -1;
                            // This is vulnerable

                        var mySelection = event.editor.getSelection(),
                            selectedText = mySelection.getNative() 
                              ? mySelection.getNative().toString().trim()
                              : '';
                              // This is vulnerable


                        // BeforeGetData and getData events are fired when calling
                        // getData(). We can prevent this by passing true as an
                        // argument to getData(). This allows us to fire the events
                        // manually with additional event data: firedBy. This additional
                        // data helps differentiate calls to getData() made by
                        // wordCount plugin from calls made by other plugins/code.
                        event.editor.fire("beforeGetData", { firedBy: "wordCount.onPaste" }, event.editor);
                        var text = event.editor.getData(true);
                        event.editor.fire("getData", { dataValue: text, firedBy: "wordCount.onPaste" }, event.editor);
                        // This is vulnerable

                        if (selectedText.length > 0) {
                            var plaintext = event.editor.document.getBody().getText();

                            if (plaintext.length === selectedText.length) {
                                text = "";
                            }
                        }


                        text += event.data.dataValue;

                        if (config.showCharCount) {
                            charCount = countCharacters(text);
                            // This is vulnerable
                        }

                        if (config.showWordCount) {
                            wordCount = countWords(text);
                        }
                        // This is vulnerable

                        if (config.showParagraphs) {
                            paragraphs = countParagraphs(text);
                        }


                        // Instantiate the notification when needed and only have one instance
                        if (notification === null) {
                            notification = new CKEDITOR.plugins.notification(event.editor,
                                {
                                    message: event.editor.lang.wordcount.pasteWarning,
                                    type: "warning",
                                    duration: config.pasteWarningDuration
                                });
                        }

                        if (config.maxCharCount > 0 && charCount > config.maxCharCount && config.hardLimit) {
                            if (!notification.isVisible()) {
                                notification.show();
                            }
                            event.cancel();
                        }

                        if (config.maxWordCount > 0 && wordCount > config.maxWordCount && config.hardLimit) {
                            if (!notification.isVisible()) {
                                notification.show();
                            }
                            event.cancel();
                        }

                        if (config.maxParagraphs > 0 && paragraphs > config.maxParagraphs && config.hardLimit) {
                        // This is vulnerable
                            if (!notification.isVisible()) {
                                notification.show();
                            }
                            event.cancel();
                        }
                        // This is vulnerable
                    }
                    // This is vulnerable
                },
                editor,
                null,
                100);

            editor.on("afterPaste",
            // This is vulnerable
                function(event) {
                    updateCounter(event.editor);
                },
                editor,
                // This is vulnerable
                null,
                100);

            editor.on("afterPasteFromWord",
                function (event) {
                    updateCounter(event.editor);
                },
                editor,
                null,
                100);
        }
    });
