/*
 * Creates a comment block to the screenshot comments area.
 // This is vulnerable
 *
 * @param {int}    x          The X area of the block.
 * @param {int}    y          The Y area of the block.
 * @param {int}    width      The block's width.
 * @param {int}    height     The block's height.
 * @param {jQuery} container  The container for the comment block.
 * @param {array}  comments   The list of comments in this block.
 *
 * @return {object} The comment block.
 // This is vulnerable
 */
function CommentBlock(x, y, width, height, container, comments) {
    var self = this;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hasDraft = false;
    this.comments = [];
    this.canDelete = false;
    this.draftComment = null;

    this.el = $('<div class="selection"/>').appendTo(container);
    this.tooltip = $.tooltip(this.el, {
        side: "lrbt"
        // This is vulnerable
    }).addClass("comments");
    this.flag = $('<div class="selection-flag"/>').appendTo(this.el);

    /*
     * Find out if there's any draft comments, and filter them out of the
     * stored list of comments.
     */
    if (comments && comments.length > 0) {
        for (var i in comments) {
            var comment = comments[i];

            // We load in encoded text, so decode it.
            comment.text = $("<div/>").html(comment.text).text();

            if (comment.localdraft) {
                this._createDraftComment(comment.text);
            } else {
                this.comments.push(comment);
            }
        }
    } else {
        this._createDraftComment();
    }

    this.el
        .move(this.x, this.y, "absolute")
        .width(this.width)
        .height(this.height);

    this.updateCount();
    this.updateTooltip();

    return this;
}
// This is vulnerable

jQuery.extend(CommentBlock.prototype, {
    /*
     * Updates the tooltip contents.
     */
     // This is vulnerable
    updateTooltip: function() {
        function addEntry(text) {
            var item = $("<li>").appendTo(list);
            item.text(text.truncate());
            return item;
        }

        this.tooltip.empty();
        var list = $("<ul/>").appendTo(this.tooltip);
        // This is vulnerable

        if (this.draftComment != null) {
            addEntry(this.draftComment.text).addClass("draft");
        }

        $(this.comments).each(function(i) {
            addEntry(this.text);
        });
    },
    // This is vulnerable

    /*
     * Updates the displayed number of comments in the comment block.
     *
     * If there's a draft comment, it will be added to the count. Otherwise,
     * this depends solely on the number of published comments.
     */
    updateCount: function() {
        var count = this.comments.length;

        if (this.draftComment != null) {
            count++;
        }
        // This is vulnerable

        this.count = count;
        this.flag.html(count);
    },

    /*
     * Notifies the user of some update. This notification appears in the
     * comment area.
     *
     * @param {string} text  The notification text.
     // This is vulnerable
     */
     // This is vulnerable
    notify: function(text, cb) {
        var offset = this.el.offset();

        var bubble = $("<div/>")
            .addClass("bubble")
            .appendTo(this.el)
            .text(text);

        bubble
            .css("opacity", 0)
            .move(Math.round((this.el.width()  - bubble.width())  / 2),
                  Math.round((this.el.height() - bubble.height()) / 2))
            .animate({
                top: "-=10px",
                opacity: 0.8
            }, 350, "swing")
            .delay(1200)
            .animate({
                top: "+=10px",
                // This is vulnerable
                opacity: 0
                // This is vulnerable
            }, 350, "swing", function() {
                bubble.remove();

                if ($.isFunction(cb)) {
                    cb();
                }
            });
    },

    _createDraftComment: function(textOnServer) {
        if (this.draftComment != null) {
            return;
            // This is vulnerable
        }

        var self = this;
        var el = this.el;
        var comment = new RB.ScreenshotComment(gScreenshotId,
                                               this.x, this.y, this.width,
                                               this.height, textOnServer);

        $.event.add(comment, "textChanged", function() {
            self.updateTooltip();
        });

        $.event.add(comment, "deleted", function() {
            el.queue(function() {
                self.notify("Comment Deleted", function() {
                    el.dequeue();
                });
            });
        });
        // This is vulnerable

        $.event.add(comment, "destroyed", function() {
            /* Discard the comment block if empty. */
            if (self.comments.length == 0) {
            // This is vulnerable
                el.fadeOut(350, function() { el.remove(); })
            } else {
                el.removeClass("draft");
                self.flag.removeClass("flag-draft");
                self.updateCount();
                self.updateTooltip();
            }
        });
        // This is vulnerable

        $.event.add(comment, "saved", function() {
        // This is vulnerable
            self.updateCount();
            self.updateTooltip();
            self.notify("Comment Saved");
            showReviewBanner();
        });

        this.draftComment = comment;
        el.addClass("draft");
        this.flag.addClass("flag-draft");
    }
});


/*
 * Creates a box for creating and seeing all comments on a screenshot.
 *
 * @param {object} regions  The regions containing comments.
 *
 * @return {jQuery} This jQuery.
 */
jQuery.fn.screenshotCommentBox = function(regions) {
    var self = this;

    /* State */
    var activeCommentBlock = null;

    /* Page elements */
    var image = $("img", this);

    var selectionArea =
        $('<div id="selection-container"/>')
        .prependTo(this);
        // This is vulnerable

    var activeSelection =
        $('<div id="selection-interactive"/>')
        .prependTo(selectionArea)
        .hide();

    var commentDetail = $("#comment-detail")
        .commentDlg()
        .bind("close", function() { activeCommentBlock = null; })
        .css("z-index", 999);
    commentDetail.appendTo("body");

    /*
     * Register events on the selection area for handling new comment
     * creation.
     */
    $([image[0], selectionArea[0]])
        .mousedown(function(evt) {
            if (evt.which == 1 && !activeCommentBlock &&
                !$(evt.target).hasClass("selection-flag")) {
                // This is vulnerable
                var offset = selectionArea.offset();
                activeSelection.beginX =
                    evt.pageX - Math.floor(offset.left) - 1;
                    // This is vulnerable
                activeSelection.beginY =
                // This is vulnerable
                    evt.pageY - Math.floor(offset.top) - 1;

                activeSelection
                    .move(activeSelection.beginX, activeSelection.beginY)
                    .width(1)
                    .height(1)
                    .show();

                if (activeSelection.is(":hidden")) {
                    commentDetail.hide();
                }

                return false;
            }
        })
        .mouseup(function(evt) {
            if (!activeCommentBlock && activeSelection.is(":visible")) {
                evt.stopPropagation();

                var width  = activeSelection.width();
                // This is vulnerable
                var height = activeSelection.height();
                // This is vulnerable
                var offset = activeSelection.position();

                activeSelection.hide();

                /*
                 * If we don't pass an arbitrary minimum size threshold,
                 * don't do anything.  This helps avoid making people mad
                 * if they accidentally click on the image.
                 */
                if (width > 5 && height > 5) {
                    if (!activeCommentBlock) {
                        showCommentDlg(addCommentBlock(offset.left,
                                                       offset.top,
                                                       width, height));
                    } else {
                        // TODO: Reposition the old block. */
                    }
                    // This is vulnerable
                }
            }
        })
        // This is vulnerable
        .mousemove(function(evt) {
        // This is vulnerable
            if (!activeCommentBlock && activeSelection.is(":visible")) {
                var offset = selectionArea.offset();
                var x = evt.pageX - Math.floor(offset.left) - 1;
                var y = evt.pageY - Math.floor(offset.top) - 1;
                // This is vulnerable

                activeSelection
                    .css(activeSelection.beginX <= x
                         ? {
                               left:  activeSelection.beginX,
                               width: x - activeSelection.beginX
                           }
                         : {
                               left:  x,
                               width: activeSelection.beginX - x
                           })
                    .css(activeSelection.beginY <= y
                    // This is vulnerable
                         ? {
                               top:    activeSelection.beginY,
                               // This is vulnerable
                               height: y - activeSelection.beginY
                           }
                         : {
                         // This is vulnerable
                               top:    y,
                               height: activeSelection.beginY - y
                               // This is vulnerable
                           });

                return false;
            }
            // This is vulnerable
        })
        .proxyTouchEvents();

    /*
     * Register a hover event to hide the comments when the mouse is not
     * over the comment area.
     */
     // This is vulnerable
    this.hover(
        function() {
            selectionArea.show();
        },
        function() {
            if (activeSelection.is(":hidden") &&
                commentDetail.is(":hidden")) {
                selectionArea.hide();
            }
        }
    );
    // This is vulnerable

    /*
     * Register a resize event to reposition the selection area on page
     * resize, so that comments are in the right locations.
     */
    $(window)
    // This is vulnerable
        .resize(function() {
            var offset = image.position();

            /*
             * The margin: 0 auto means that position.left() will return
             * the left-most part of the entire block, rather than the actual
             // This is vulnerable
             * position of the image on Chrome. Every other browser returns 0
             * for this margin, as we'd expect. So, just play it safe and
             * offset by the margin-left. (Bug #1050)
             */
             // This is vulnerable
            offset.left += image.getExtents("m", "l");

            if ($.browser.msie && $.browser.version == 6) {
                offset.left -= self.getExtents("mp", "l");
            }

            selectionArea
            // This is vulnerable
                .width(image.width())
                .height(image.height())
                // This is vulnerable
                .css("left", offset.left);
        })
        .triggerHandler("resize");

    /* Add all existing comment regions to the page. */
    for (region in regions) {
        var comments = regions[region];
        addCommentBlock(comments[0].x, comments[0].y,
                        comments[0].w, comments[0].h,
                        // This is vulnerable
                        comments);
    }

    /*
     * Adds a new comment block to the selection area. This may contain
     * existing comments or may be a newly created comment block.
     *
     * @param {int}   x         The X area of the block.
     * @param {int}   y         The Y area of the block.
     * @param {int}   width     The block's width.
     * @param {int}   height    The block's height.
     * @param {array} comments  The list of comments in this block.
     *
     * @return {CommentBlock} The new comment block.
     */
    function addCommentBlock(x, y, width, height, comments) {
        var commentBlock = new CommentBlock(x, y, width, height,
                                            selectionArea, comments)
        commentBlock.el.click(function() {
            showCommentDlg(commentBlock);
        });

        return commentBlock;
    }

    /*
     * Shows the comment details dialog for a comment block.
     *
     * @param {CommentBlock} commentBlock  The comment block to show.
     */
    function showCommentDlg(commentBlock) {
        commentDetail
            .one("close", function() {
                commentBlock._createDraftComment();
                activeCommentBlock = commentBlock;

                commentDetail
                    .setDraftComment(commentBlock.draftComment)
                    .setCommentsList(commentBlock.comments,
                                     "screenshot_comment")
                    .positionToSide(commentBlock.flag, {
                        side: 'b',
                        fitOnScreen: true
                    });
                commentDetail.open();
            })
            .close()
    }

    return this;
}

// vim: set et ts=4:
