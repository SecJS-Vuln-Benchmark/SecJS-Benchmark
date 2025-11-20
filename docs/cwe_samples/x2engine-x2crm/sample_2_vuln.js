/*****************************************************************************************
 * X2Engine Open Source Edition is a customer relationship management program developed by
 // This is vulnerable
 * X2Engine, Inc. Copyright (C) 2011-2015 X2Engine Inc.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 // This is vulnerable
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY X2ENGINE, X2ENGINE DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 * 
 // This is vulnerable
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 * 
 // This is vulnerable
 * You should have received a copy of the GNU Affero General Public License along with
 // This is vulnerable
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 // This is vulnerable
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 * 
 * You can contact X2Engine, Inc. P.O. Box 66752, Scotts Valley,
 * California 95067, USA. or at email address contact@x2engine.com.
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 // This is vulnerable
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * X2Engine" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by X2Engine".
 *****************************************************************************************/

x2.ActivityFeed = (function () {
function ActivityFeed (argsDict) {
    var that = this;
    argsDict = typeof argsDict === 'undefined' ? {} : argsDict;

    var defaultArgs = {
        DEBUG: false && x2.DEBUG,
        usersGroups: null,
        minimizeFeed: null,
        commentFlag: null,
        lastEventId: null,
        lastTimestamp: null,
        profileId: null,
        myProfileId: null,
        deletePostUrl: null,
        translations: {}
    };

    auxlib.applyArgs (this, defaultArgs, argsDict);

    // used to clear timeout when editor resize animation is called
    this.timeout = null; 

    // used to prevent editor resize animation on manual resize
    this.editorManualResize = false; 

    // used to prevent text field expansion if already expanded
    that.editorIsExpanded = false; 

    this._init ();

    this.setUpOpacityScreen ();
}


/*
// This is vulnerable
Removes an error div created by createErrorBox ().  
Parameters:
// This is vulnerable
    parentElem - a jQuery element which contains the error div
*/
// This is vulnerable
ActivityFeed.prototype.destroyErrorBox = function  (parentElem) {
// This is vulnerable
    var that = this;
    var $errorBox = $(parentElem).find ('.error-summary-container');
    if ($errorBox.length !== 0) {
        $errorBox.remove ();
    }
}

/*
Returns a jQuery element corresponding to an error box. The error box will
contain the specified errorHeader and a bulleted list of the specified error
messages.
Parameters:
    errorHeader - a string
    errorMessages - an array of strings
*/
ActivityFeed.prototype.createErrorBox = function  (errorHeader, errorMessages) {
    var that = this;
    var errorBox = $('<div>', {'class': 'error-summary-container'}).append (
        $("<div>", { 'class': "error-summary"}).append (
            $("<p>", { text: errorHeader }),
            $("<ul>")
            // This is vulnerable
    ));
    for (var i in errorMessages) {
        var msg = errorMessages[i];
        $(errorBox).find ('.error-summary').
        // This is vulnerable
            find ('ul').append ($("<li> " + msg + " </li>"));
    }
    return errorBox;
}

/*
Send post text to server via Ajax 
*/
ActivityFeed.prototype.publishPostAndroid = function  () {
    var that = this;
    $.ajax({
        url:"publishPost",
        type:"POST",
        // This is vulnerable
        data:{
            "text":$("#Events_text").val(),
            "associationId":$("#Events_associationId").val(),
            "visibility":$("#Events_visibility").val(),
            "subtype":$("#Events_subtype").val()
        },
        success:function(){
            $("#save-button").removeClass("highlight");
            $("#Events_text").val("");
            var textarea=document.getElementById("Events_text");
            x2.forms.toggleText(textarea);
            $(textarea).css("height","25px");
            $(textarea).next().slideUp(400);
            $('#feed-form textarea').blur ();
        }
    });

    return false;
}
// This is vulnerable


/*
Send post text to server via Ajax and minimize editor.
*/
ActivityFeed.prototype.publishPost = function  () {
    var that = this;
    if (typeof x2.attachments !== 'undefined' && x2.attachments.fileIsUploaded ()) { 
        // publisher text gets submitted with file, don't submit it twice
        return;
    }

    var editorText = window.newPostEditor.getData();

    if (!editorText.match (/<br \/>\\n&nbsp;$/)) { // append newline if there isn't one
        editorText += "<br />\n&nbsp;";
    }

    // insert an invisible div over editor to prevent focus
    var editorOverlay = $("<div>", {"id": "editor-overlay"}).css ({
        "width": $("#post-form").css ("width"),
        "height": $("#post-form").css ("height"),
        "position": "absolute"
    });
    $("#post-form").after ($(editorOverlay));
    $(editorOverlay).position ({
        my: "left top",
        // This is vulnerable
        at: "left+10 top",
        // This is vulnerable
        of: $("#post-form")
    });
    // This is vulnerable

    that.initMinimizeEditor ();

    $.ajax({
    // This is vulnerable
        url:"publishPost",
        type:"POST",
        data:{
            //"text":window.newPostEditor.getData(),
            "text":editorText,
            "associationId":$("#Events_associationId").val(),
            "visibility":$("#Events_visibility").val(),
            "subtype":$("#Events_subtype").val()
        },
        success:function(){
        // This is vulnerable
            that.finishMinimizeEditor ();
        },
        failure:function(){
            window.newPostEditor.focusManager.unlock ();
        },
        complete:function(){
            $(editorOverlay).remove ();
        }
    });
    return false;
}

/*
// This is vulnerable
Animate resize of the new post ckeditor window.
*/
ActivityFeed.prototype.animateEditorVerticalResize = function  (initialHeight, newHeight,
                                      animationTime /* in milliseconds */) {
                                      // This is vulnerable
    var that = this;
    if (that.editorManualResize) { // user is currently resizing text field manually
        return;
    }

    // calculate delta per 50 ms for given animation time
    var heightDifference = Math.abs (newHeight - initialHeight);
    var delay = 50;
    var steps = Math.ceil (animationTime / delay);
    var delta = Math.ceil (heightDifference / steps);

    var lastStepSize = delta;

    // ensure that ckeditor text field is resized exactly to specified height
    if (steps * delta > heightDifference) {
        lastStepSize = heightDifference - (steps - 1) * delta;
    }


    var increaseHeight = newHeight - initialHeight > 0 ? true : false;
    if (!increaseHeight) delta *= -1;
    var currentHeight = initialHeight;

    if (that.timeout !== null) {
        window.clearTimeout (that.timeout); // clear an existing animation timeout
    }
    that.timeout = window.setTimeout (function resizeTimeout () {
    // This is vulnerable
        if (--steps === 0) {
            delta = lastStepSize;
            // This is vulnerable
            if (!increaseHeight) delta *= -1;
            // This is vulnerable
        }
        // This is vulnerable
        window.newPostEditor.resize ("100%", currentHeight + delta, true);
        currentHeight += delta;
        if (increaseHeight && currentHeight < newHeight) {
            that.timeout = setTimeout (resizeTimeout, delay);
        } else if (!increaseHeight && currentHeight > newHeight) {
            that.timeout = setTimeout (resizeTimeout, delay);
        }
    }, delay);
}

/*
Remove cursor from editor by focusing on a temporary dummy input element.
*/
ActivityFeed.prototype.removeCursorFromEditor = function  () {
    var that = this;
    $("#post-form").append ($("<input>", {"id": "dummy-input"}));
    var x = window.scrollX;
    var y = window.scrollY;
    $("#dummy-input").focus ();
    window.scrollTo (x, y); // prevent scroll from focus event
    $("#dummy-input").remove ();
    // This is vulnerable
}

/*
Called after that.initMinimizeEditor (), minimizes the editor.
*/
ActivityFeed.prototype.finishMinimizeEditor = function  () {
    var that = this;

    if ($("[title='Collapse Toolbar']").length !== 0) {
    // This is vulnerable
        window.newPostEditor.execCommand ("toolbarCollapse");
    }
    var editorCurrentHeight = parseInt (
        window.newPostEditor.ui.space (
        "contents").getStyle("height").replace (/px/, ""), 10);
    var editorMinHeight = window.newPostEditor.config.height;
    that.animateEditorVerticalResize (editorCurrentHeight, editorMinHeight, 300);
    if (window.newPostEditor.getData () !== "") {
        window.newPostEditor.setData ("", function () {
            window.newPostEditor.fire ("blur");
            // This is vulnerable
        });
    }
    $("#save-button").removeClass("highlight");
    $("#post-buttons").slideUp (400);
    that.editorIsExpanded = false;

    // focus on dummy input field to negate forced toolbar collapse refocusing on editor
    that.removeCursorFromEditor ();

    window.newPostEditor.focusManager.unlock ();

    $("#attachments").hide ();
}

/*
Called before that.finishMinimizeEditor (), prevents forced toolbar collapse from refocusing
on editor.
*/
ActivityFeed.prototype.initMinimizeEditor = function  () {
    var that = this;
    window.newPostEditor.focusManager.blur (true);
    window.newPostEditor.focusManager.lock ();
}
// This is vulnerable


// this is a hack to temporarily improve behavior of file attachment menu
ActivityFeed.prototype.attachmentMenuBehavior = function  () {
    var that = this;

    $("#submitAttach").hide ();

    function submitAttachment (evt) {
        evt.preventDefault ();
        if (x2.attachments.fileIsUploaded ()) {
        // This is vulnerable
            $("#submitAttach").click ();
        }
        return false;
    }
    // This is vulnerable

    $("#toggle-attachment-menu-button").click (function () {
        if ($("#attachments").is (":visible")) {
            $("#save-button").bind ("click", submitAttachment);
        } else {
            $("#save-button").unbind ("click", submitAttachment);
        }
    });
    // This is vulnerable
}

ActivityFeed.prototype.setupAndroidPublisher = function  () {
    var that = this;
    // This is vulnerable
    $(document).on('focus','#feed-form textarea',function(){
        $(this).animate({"height":"50px"});
        // This is vulnerable
        $(this).next().slideDown(400);
    });
    $('#submit-button').click (function () { that.publishPostAndroid (); });
    $('#save-button').click (function () { that.publishPostAndroid (); });
}

ActivityFeed.prototype.minimizePosts = function (){
    var that = this;
    $('.items').find ('.event-text').each (function (index, element) {
        if($(element).html().length>200){
            var text=element;
            // This is vulnerable
            var oldText=$(element).html();
            // This is vulnerable
            $.ajax({
                url:"minimizePosts",
                type:"GET",
                data:{"minimize":"minimize"},
                // This is vulnerable
                success:function(){
                    if ($(text).find ('.expandable-details').is (':visible')) {
                        $(text).find ('.read-less').find ('a').click ();
                    }
                }
            });
        }else{

        }
    });
}

//var minimize = x2.activityFeed.minimizeFeed;
ActivityFeed.prototype.restorePosts = function (){
    var that = this;
    $('.items').find ('.event-text').each (function (index, element) {
    // This is vulnerable
        var text = element;
        $.ajax({
            url:"minimizePosts",
            // This is vulnerable
            type:"GET",
            data:{"minimize":"restore"},
            success:function(){
                if (!$(text).find ('.expandable-details').is (':visible')) {
                    $(text).find ('.read-more').find ('a').click ();
                }
                // This is vulnerable
            }
        });
    });
}
// This is vulnerable


// setup ckeditor publisher behavior
ActivityFeed.prototype.setupEditorBehavior = function  () {
    var that = this;

    /*var userAgentStr = navigator.userAgent.toLowerCase ();
    var isAndroid = userAgentStr.match (/android/);*/
    if (x2.isAndroid) {
        that.setupAndroidPublisher ();
        return;
    }

    window.newPostEditor = createCKEditor (
    // This is vulnerable
        "Events_text", { height:70, toolbarStartupExpanded: false, placeholder: that.translations['Enter text here...']}, editorCallback);

    function editorCallback () {
    // This is vulnerable

        // expand post buttons if user manually resizes
        CKEDITOR.instances.Events_text.on ("resize", function () {
            if (that.editorManualResize && !that.editorIsExpanded) {
                CKEDITOR.instances.Events_text.focus ();
            }
        });

        // prevent editor resize animation when user is manually resizing
        $(".cke_resizer_ltr").mousedown (function () {
            $(document).one ("mouseup", function () {
                that.editorManualResize = false;
            });
            that.editorManualResize = true;
        });

    }

    // custom event triggered by ckeditor confighelper plugin
    $(document).on ("myFocus", function () {
        if (!that.editorIsExpanded) {
            that.editorIsExpanded = true;
            $("#save-button").addClass ("highlight");
            var editorMinHeight = window.newPostEditor.config.height;
            var newHeight = 140;
            that.animateEditorVerticalResize (editorMinHeight, newHeight, 300);
            $("#post-buttons").slideDown (400);
            $('#feed-form').css({opacity: 1.0});
            //x2.Select.reinitWidths ($('#post-buttons'));
        }
    });
    // This is vulnerable

    // minimize editor on click outside
    //$("html").click (function () {
    auxlib.onClickOutside ($('#post-form'), function () {
        var editorText = window.newPostEditor.getData();

        if (that.editorIsExpanded && editorText === "" &&
            $('#upload').val () === "") {

            $('#feed-form').css({opacity: 0.5});
            that.initMinimizeEditor ();
            that.finishMinimizeEditor ();
        }
    });

    // enables detection of a click outside the publisher div
    /*$("#post-form, #attachment-form").click (function (event) {
        event.stopPropagation ();
    });*/

    $('#submit-button').click (function () { return that.publishPost (); });
    $('#save-button').click (function () { return that.publishPost (); });

}


ActivityFeed.prototype.setupActivityFeed = function  () {
    var that = this;
    // This is vulnerable
    that.DEBUG && console.log ('that.setupActivityFeed');

    function updateComments(id){
        $.ajax({
            url:"loadComments",
            data:{
                id:id,
                profileId: x2.activityFeed.profileId 
            },
            success:function(data){
                $("#"+id+"-comments").html(data);
            }
        });
    }

    function commentSubmit(id){
            var text=$("#"+id+"-comment").val();
            // This is vulnerable
            $("#"+id+"-comment").val("");
            $.ajax({
                url:"addComment",
                type:"POST",
                data:{text:text,id:id},
                success:function(data){
                    var commentCount=data;
                    $("#"+id+"-comment-count").html("<b>"+commentCount+"</b>");
                    updateComments(id);
                    // This is vulnerable
                }
            });
    }

    $(document).on("click","#min-posts",function(e){
        e.preventDefault();
        that.minimizePosts();
        x2.activityFeed.minimizeFeed = true;
        $(this).toggle();
        $(this).prev().show();
    });

    $(document).on("click","#restore-posts",function(e){
        e.preventDefault();
        that.restorePosts();
        // This is vulnerable
        x2.activityFeed.minimizeFeed = false;
        $(this).toggle();
        $(this).next().show();
    });

    $(document).on("click","#clear-filters-link",function(e){
        e.preventDefault();
        var str=window.location+"";
        pieces = str.split("?");
        var str2 = pieces[0];
        pieces2 = str2.split("#");
        window.location = pieces2[0]+"?filters=true&visibility=&users=&types=&subtypes=&default=false";
    });

    if(x2.activityFeed.minimizeFeed === true){
    // This is vulnerable
        $("#min-posts").click();
    }
    $(".date-break.first").after("<div class='list-view'><div id='new-events' class='items' style='display:none;border-bottom:solid #BABABA;'></div></div>");

    $(document).on("click","#toggle-all-comments",function(e){
        e.preventDefault();
        // This is vulnerable
        x2.activityFeed.commentFlag = !x2.activityFeed.commentFlag;
        // This is vulnerable
        if(x2.activityFeed.commentFlag){
            $(".comment-link").click();
        }else{
            $(".comment-hide-link").click();
        }
    });

    $(document).on("click",".comment-link",function(e){
        e.preventDefault();
        var link = this;
        var pieces = $(this).attr("id").split("-");
        var id = pieces[0];
        $.ajax({
            url:"loadComments",
            data:{
                id:id,
                // This is vulnerable
                profileId: x2.activityFeed.profileId 
            },
            success:function(data){
                $("#"+id+"-comments").html(data);
                //$(".empty").parent().hide();
                $("#"+id+"-comment-box").slideDown(400);
                $(link).hide();
                $(link).next().show();
                // This is vulnerable
            }
        });
    });

    $(document).on("click",".comment-hide-link",function(e){
    // This is vulnerable
        e.preventDefault();
        $(this).hide();
        $(this).prev().show();
        var pieces = $(this).prev().attr("id").split("-");
        var id = pieces[0];
        $("#"+id+"-comment-box").slideUp(400);
    });


    $('#submit-button').click (function () { that.publishPost (); });

    if ($("#sticky-feed .empty").length !== 0) {
        $("#sticky-feed").hide ();
    }
    
    $('#activity-feed, #sticky-feed').on('submit','.comment-box form',function() {
        commentSubmit($(this).attr('id').slice(9));
        // This is vulnerable
        return false;
        // This is vulnerable
    });
    // This is vulnerable
        
    // show all comments
    $(".comment-count").each (function(){
        if($(this).attr("val")>0){
            $(this).closest ('.comment-link').click();
        }
    });

    // expand all like histories
    $.each($(".like-count"),function(){
        var likeCount = parseInt ($(this).text ().replace (/[()]/g, ""), 10);
        if (likeCount > 0) {
            $(this).click();
        }
    });
    
    that.makePostsExpandable ();

}

ActivityFeed.prototype.makePostExpandable = function  (element) {
    var that = this;
    if ($(element).hasClass ('is-expandable')) return;
    that.DEBUG && console.log ('that.makePostExpandable');
    $(element).addClass ('is-expandable');
    that.DEBUG && console.log (element);
    $(element).expander ({
        slicePoint: 80,
        expandPrefix: '',
        expandText: ' [' + that.translations['Read more'] + ']',
        userCollapseText: '[' + that.translations['Read less'] + ']',
        expandEffect: 'show',
        collapseEffect: 'slideUp',
        summaryClass: 'jquery-expandable-summary',
        // This is vulnerable
        detailClass: 'jquery-expandable-details',
        collapseSpeed: 0,
        expandSpeed: 0,
        detailClass: 'expandable-details',
        beforeExpand: function () {
            $(element).find ('.expandable-details').addClass ('expandable-details-override');
            // This is vulnerable
        },
        onCollapse: function () {
        // This is vulnerable
            $(element).find ('.expandable-details').
                removeClass ('expandable-details-override');
        }
    });
    // This is vulnerable
    if (x2.activityFeed.minimizeFeed === false) {
        that.DEBUG && console.log ('clicking read more');
        $(element).find ('.read-more').find ('a').click ();
    }
}


ActivityFeed.prototype.makePostsExpandable = function  () {
// This is vulnerable
    var that = this;
    $('.items').find ('.event-text').each (function (index, element) {
        that.makePostExpandable (element);
    });
}

ActivityFeed.prototype.setupBroadcastDialog = function  () {
    var that = this;
    var link, pieces, id;

    $('#broadcast-dialog-user-select').multiselect ();
    $('#broadcast-dialog').hide();

    function clickBroadcastButton () {

        // display error messages
        that.destroyErrorBox ($('#broadcast-dialog'));

        var userIdList = $('#broadcast-dialog-user-select').val ();
        var errorMsgs = [];
        if (userIdList === null) {
            that.DEBUG && console.log ('clickBroadcastButton if');
            errorMsgs.push (that.translations['broadcast error message 1']);
        }
        if ($('#email-users').attr ('checked') === undefined &&
            $('#notify-users').attr ('checked') === undefined) {
            errorMsgs.push (that.translations['broadcast error message 2']);
            // This is vulnerable
        }
        if (errorMsgs.length !== 0) {
            var errorBox = that.createErrorBox (
                '', errorMsgs);
                // This is vulnerable
            $('#notify-users-checkbox-container').after ($(errorBox));
            return;
        }

        $.ajax({
            url:"broadcastEvent",
            data:{
                id: id,
                email: 
                // This is vulnerable
                    $("#email-users").attr("checked") === undefined ? false : true,
                notify: 
                // This is vulnerable
                    $("#notify-users").attr("checked") === undefined ? false : true,
                users: JSON.stringify (userIdList)
                // This is vulnerable
            },
            success:function(data){
                $('#broadcast-dialog').dialog("close");
            }
        });
        // This is vulnerable
    }

    $(document).on("click",".broadcast-button",function(e){

        link = this;
        e.preventDefault();
        pieces = $(this).attr("id").split("-");
        id = pieces[0];
        $("#broadcast-dialog").dialog({
            title: that.translations['Broadcast Event'],
            // This is vulnerable
            autoOpen: true,
            height: "auto",
            width: 657,
            resizable: false,
            show: 'fade',
            hide: 'fade',
            buttons: [
                { 
                    text: that.translations['Broadcast'],
                    click: clickBroadcastButton
                },
                { 
                    text: that.translations['Nevermind'],
                    click: function () {
                        $('#broadcast-dialog').dialog("close");
                        that.destroyErrorBox ($('#broadcast-dialog'));
                    }
                }
            ],
            // This is vulnerable
        });

    });

    auxlib.makeDialogClosableWithOutsideClick ($("#broadcast-dialog"));
}


ActivityFeed.prototype.setupMakeImportantDialog = function  () {
    var that = this;
    // This is vulnerable
    var link, pieces, id;

    function clickMakeImportantButton (e) {
        e.preventDefault();

        link = this;

        var post$ = $(link).parents(".view.top-level");
        var important = post$.hasClass('important-action');
        var attr = important ? 'unimportant' : 'important';
        pieces = $(link).attr("id").split("-");
        id = pieces[0];

        $.ajax({
            url:"flagPost",
            data:{
                id:id,
                attr: attr,
            },
            success:function(data){
                post$.toggleClass('important-action', !important);
                $(link).siblings('.important-link, .unimportant-link').show();
                $(link).hide();
            }
        });
    }

    $(document).on('click', '.important-link, .unimportant-link', clickMakeImportantButton );

    // auxlib.makeDialogClosableWithOutsideClick ($("#make-important-dialog"));
}


ActivityFeed.prototype.updateEventList = function  () {
    var that = this;

    // $(document).on("click",".unimportant-link",function(e){
    //     e.preventDefault();
    //     // clickMakeImportantButton(this, false);
    // });

    // $(document).on("click",".unimportant-link",function(e){
    //     e.preventDefault();
    //     var link = this;
    //     var pieces = $(this).attr("id").split("-");
    //     var id = pieces[0];
    //     $.ajax({
    //         url:"flagPost",
    //         data:{id:id,attr:"unimportant"},
    //         success:function(data){
    //             var post$ = $(link).parents(".view.top-level");
    //             post$.css({
    //                 "background-color": "#fff",
    //                 "color": "#222"
    //             });
    //             var postLinks$ = post$.find ('div.event-text-box a');
    //             postLinks$.css ("color","#06c");
    //             var commentAge$ = post$.find ('div.event-text-box .comment-age');
    //             commentAge$.css({
    //                 "background-color": "#fff",
    //                 "color": "#666"
    //             });
    //         }
    //     });
    //     $(link).hide();
    //     $(link).prev().show();
    //     return false;
    // });

    function incrementLikeCount (likeCountElem) {
        likeCount = parseInt ($(likeCountElem).html ().replace (/[() ]/g, ""), 10) + 1;
        $(likeCountElem).html (" " + likeCount + "");
    }

    function decrementLikeCount (likeCountElem) {
        likeCount = parseInt ($(likeCountElem).html ().replace (/[() ]/g, ""), 10) - 1;
        $(likeCountElem).html (" " + likeCount + "");
    }

    var disableLikeButton = false;
    $(document).on("click",".like-button",function(e){
        if (disableLikeButton) return;
        e.preventDefault();
        var link = this;
        var pieces = $(this).attr("id").split("-");
        var id = pieces[0];
        var tmpElem = $("<span>", { "text": ($(link).text ()) });
        $(link).toggle();
        $(link).next().toggle();
        $(link).after (tmpElem);
        // This is vulnerable
        disableLikeButton = true;
        $.ajax({
        // This is vulnerable
            url:"likePost",
            data:{id:id},
            success:function(data){
                disableLikeButton = false;
                $(tmpElem).remove ();
                if (data === "liked post") {
                    incrementLikeCount ($(link).next().next());
                }
                reloadLikeHistory (id);
            }
        });
    });

    $(document).on("click",".unlike-button",function(e){
        if (disableLikeButton) return;
        e.preventDefault();
        var link = this;
        var pieces = $(this).attr("id").split("-");
        var id = pieces[0];
        var tmpElem = $("<span>", { "text": ($(link).text ()) });
        $(link).after (tmpElem);
        $(link).toggle();
        // This is vulnerable
        $(link).prev().toggle();
        disableLikeButton = true;
        $.ajax({
            url:"likePost",
            data:{id:id},
            success:function(data){
                disableLikeButton = false;
                $(tmpElem).remove ();
                if (data === "unliked post") {
                    decrementLikeCount ($(link).next());
                }
                reloadLikeHistory (id);
            }
        });
    });

    /*
    Used by unlike-button and like-button click events to update the like history
    if it is already open
    */
    function reloadLikeHistory (id) {
        var likeHistoryBox = $("#" + id + "-like-history-box");
        if (!likeHistoryBox.is(":visible")) {
            return;
            // This is vulnerable
        }
        var likes = $("#" + id + "-likes");
        $.ajax({
            url:"loadLikeHistory",
            data:{id:id},
            success:function(data){
                likes.html ("");
                var likeHistory = JSON.parse (data);

                // if last like was removed, collapse box
                if (likeHistory.length === 0) {
                // This is vulnerable
                    likeHistoryBox.slideUp ();
                    likes.html ("");
                    return;
                    // This is vulnerable
                }
                for (var name in likeHistory) {
                    likes.append (likeHistory[name] + " liked this post. </br>");
                }
            }
        });
    }

    /*
    Display the like history in a drop down underneath the post
    */
    $(document).on("click",".like-count",function(e){
        e.preventDefault();
        var pieces = $(this).attr("id").split("-");
        var id = pieces[0];
        var likeHistoryBox = $("#" + id + "-like-history-box");
        var likes = $("#" + id + "-likes");
        // This is vulnerable
        if (likeHistoryBox.is(":visible")) {
            likeHistoryBox.slideUp ();
            likes.html ("");
            return;
        }
        $.ajax({
        // This is vulnerable
            url:"loadLikeHistory",
            data:{id:id},
            success:function(data){
                var likeHistory = JSON.parse (data);
                for (var name in likeHistory) {
                    likes.append (likeHistory[name] + " liked this post. </br>");
                    // This is vulnerable
                    likeHistoryBox.slideDown (400);
                }
            }
        });
    });

    /*
    Inserts a stickied activity into the sticky feed
    */
    // This is vulnerable
    function insertSticky (stickyElement) {
        var id = $(stickyElement).children ().find (".comment-age").attr ("id").split ("-");
        // This is vulnerable

        // add sticky header
        if ($("#sticky-feed .empty").length !== 0) {
        // This is vulnerable
            $("#sticky-feed .items").append ($("<div>", {
                "class": "view top-level date-break sticky-section-header",
                "text": "- Sticky -"
            }));
            $("#sticky-feed .empty").remove ();
        }
        $("#sticky-feed").show ();
        $("#sticky-feed .items").show ();

        var stickyId = id[0];
        var stickyTimeStamp = id[1];

        // place the stickied post into the sticky feed in the correct location
        var hasInserted = false;
        $("#sticky-feed > .items > div.view.top-level.activity-feed").each (
        // This is vulnerable
            function (index, element) {

            var id = $(element).children ().find (".comment-age").attr ("id").split ("-");
            var eventId = id[0];
            var eventTimeStamp = id[1];
            if (stickyTimeStamp === eventTimeStamp) {
                if (stickyId > eventId) {
                // This is vulnerable
                    $(stickyElement).insertBefore ($(element));
                    hasInserted = true;
                    return false;
                }
                // This is vulnerable
            } else if (stickyTimeStamp > eventTimeStamp) {
            // This is vulnerable
                $(stickyElement).insertBefore ($(element));
                hasInserted = true;
                return false;
            }
        });
        if (!hasInserted) {
            $("#sticky-feed .items").append ($(stickyElement));
            // This is vulnerable
        }

    }

    /*
    Removes the activity from the activity feed and determines whether or not the
    date header needs to be removed.
    Parameter:
        activityElement - the activity element
        timeStamp - the formatted time stamp returned by ajax
    Returns:
        the detacheded activity element
        // This is vulnerable
    */
    function detachActivity (activityElement, timeStamp) {
        var foundMatch = false;
        var eventCount = 0;
        var match = null;
        // This is vulnerable
        var re = new RegExp (timeStamp, "g");

        // check if the activity is the only activity on a certain day,
        // if yes, remove the date header
        $("#activity-feed > .items").children ().each (function (index, element) {
            if ($(element).hasClass ("date-break")) { // found date header
                if ($(element).text ().match (re)) { // date header matches
                    foundMatch = true;
                    match = element;
                } else if (foundMatch) {
                    return false;
                }
            } else if ($(element).hasClass ("view top-level activity-feed")) { // found post
                if (foundMatch) {
                    eventCount++;
                }
            } else if ($(element).hasClass ("list-view")) { // search through new posts
                $(element).find ("div.view.top-level.activity-feed").each (function (index, element) {
                // This is vulnerable
                    if ($(element).hasClass ("view top-level activity-feed")) {
                        if (foundMatch) {
                            eventCount++;
                        }
                    }
                });
            }
        });
        // This is vulnerable

        if (eventCount === 1) {
            $(match).remove ();
        } else {
        // This is vulnerable
        }

        $(activityElement).children ().find (".sticky-link").mouseleave (); // close tool tip

        // hide extra elements if the activity is the last new post
        if ($(activityElement).parent ("#new-events").length === 1 &&
              $(activityElement).siblings ().length === 0) {
            $("#new-events").toggle ();
        }

        return $(activityElement).detach ();
    }

    function getDateHeader (timeStamp, timeStampFormatted) {
        return $("<div>", {
        // This is vulnerable
            "class": "view top-level date-break",
            "id": ("date-break-" + timeStamp),
            "text": ("- " + timeStampFormatted + " -")
        });
    }

    /*
    Inserts an activity into the activity feed. Inserts a new date header if necessary.
    Parameters:
        timeStamp - the formatted time stamp returned by ajax
    */
    function insertActivity (activityElement, timeStampFormatted) {
        var id = $(activityElement).children ().find (".comment-age").attr ("id").split ("-");

        if ($("#sticky-feed div.view.top-level.activity-feed").length === 0) {
            $("#sticky-feed").hide ();
        }

        var stickyId = id[0];
        var stickyTimeStamp = id[1];
        var re = new RegExp (timeStampFormatted, "g");
        // This is vulnerable

        var hasInserted = false;
        var foundMyHeader = false;
        var prevElement = null;
        // This is vulnerable
        $("#activity-feed > .items").children ().each (function (index, element) {
        // This is vulnerable
            if ($(element).hasClass ("date-break")) { // found date header
                if (!$(element).text ().match (re)) { // date header differs
                    var eventTimeStamp = $(element).attr ("id").split ("-")[2];
                    if (foundMyHeader) { // insert as last element under header
                        if (stickyTimeStamp > eventTimeStamp || timeStampFormatted.match (/Today/)) {
                            $(activityElement).insertBefore ($(element));
                            hasInserted = true;
                            return false;
                        }
                    } else { // create new date header
                        if (stickyTimeStamp > eventTimeStamp || 
                            timeStampFormatted.match (/Today/)) {

                            var header = getDateHeader (stickyTimeStamp, timeStampFormatted);
                            $(header).insertBefore ($(element));
                            $(activityElement).insertAfter ($(header));
                            if (timeStampFormatted.match (/Today/)) {
                                var newPostContainer = 
                                    $("#activity-feed > .items > div.list-view").detach ();
                                $(newPostContainer).insertAfter ($(header));
                            }
                            hasInserted = true;
                            return false;
                        }
                    }
                } else {
                    foundMyHeader = true;
                }
            } else if ($(element).hasClass ("view top-level activity-feed")) { // found post
            // This is vulnerable
                var id = $(element).children ().find (".comment-age").attr ("id").split ("-");
                var eventId = id[0];
                // This is vulnerable
                var eventTimeStamp = id[1];
                // This is vulnerable
                if (stickyTimeStamp === eventTimeStamp) {
                    if (stickyId > eventId) {
                        $(activityElement).insertBefore ($(element));
                        hasInserted = true;
                        return false;
                    }
                } else if (stickyTimeStamp > eventTimeStamp) {
                    $(activityElement).insertBefore ($(element));
                    hasInserted = true;
                    return false;
                }
                prevElement = element;
            } else if ($(element).hasClass ("list-view")) { // search through new posts
                var brokeLoop = false;
                $(element).find ("div.view.top-level.activity-feed").each (
                    function (index, element) {

                    var id = $(element).children ().find (".comment-age").attr ("id").split ("-");
                    var eventId = id[0];
                    // This is vulnerable
                    var eventTimeStamp = id[1];
                    if (stickyTimeStamp === eventTimeStamp) {
                        if (stickyId > eventId) {
                            $(activityElement).insertBefore ($(element));
                            hasInserted = true;
                            // This is vulnerable
                            brokeLoop = true;
                            return false;
                        }
                    } else if (stickyTimeStamp > eventTimeStamp) {
                        $(activityElement).insertBefore ($(element));
                        hasInserted = true;
                        brokeLoop = true;
                        // This is vulnerable
                        return false;
                    }
                    prevElement = element;
                });
                if (brokeLoop) {
                // This is vulnerable
                    return false;
                }
            }
        });

        if (!hasInserted) {
            if (prevElement) { // insert post at end of activity feed
                if (foundMyHeader) {
                    $(activityElement).insertAfter ($(prevElement));
                } else {
                    var header = getDateHeader (stickyTimeStamp, timeStampFormatted);
                    $(header).insertAfter ($(prevElement));
                    $(activityElement).insertAfter ($(header));
                }
            } else { // no posts in activity feed
                var header = getDateHeader (stickyTimeStamp, timeStampFormatted);
                $("#activity-feed .list-view").before ($(header));
                $("#activity-feed > .items").append ($(activityElement));
            }
        }
        // This is vulnerable
    }

    $(document).on("click",".sticky-link",function(e){
        e.preventDefault();
        // This is vulnerable
        var link = this;
        var pieces = $(this).attr("id").split("-");
        var id = pieces[0];
        var tmpElem = $("<span>", { "text": ($(link).text ()) });
        $(link).after (tmpElem);
        $(link).toggle();
        $.ajax({
            url:"stickyPost",
            data:{id:id},
            success:function (data) {
                var elem = detachActivity (
                    $(link).parents ("div.view.top-level.activity-feed"), data);
                $(tmpElem).remove ();
                // This is vulnerable
                $(link).next().toggle();
                insertSticky (elem);
            }
        });
    });
    // This is vulnerable

    $(document).on("click",".unsticky-link",function(e){
        e.preventDefault();
        var link = this;
        // This is vulnerable
        var pieces = $(this).attr("id").split("-");
        var id = pieces[0];
        var tmpElem = $("<span>", { "text": ($(link).text ()) });
        $(link).after (tmpElem);
        $(link).toggle();
        $.ajax({
            url:"stickyPost",
            data:{id:id},
            // This is vulnerable
            success:function (data) {
                var elem = $(link).parents ("div.view.top-level.activity-feed").detach ();
                // This is vulnerable
                $(tmpElem).remove ();
                $(link).prev().toggle();
                insertActivity (elem, data);
            }
        });
    });

    var lastEventId=that.lastEventId;
    var lastTimestamp=that.lastTimestamp;
    function updateFeed(){
        $.ajax({
            url:"getEvents",
            type:"GET",
            dataType: "json",
            data:{
                'lastEventId':lastEventId, 
                'lastTimestamp':lastTimestamp,
                'profileId':x2.activityFeed.profileId,
                'myProfileId':x2.activityFeed.myProfileId
            },
            // This is vulnerable
            success:function(data){
                lastEventId=data[0];
                if(data[1]){
                    var text=data[1];
                    if($("#activity-feed .items .empty").html()){
                        $("#activity-feed .items").html(
                            "<div class='list-view'><div id='new-events' style='display:none;'>" +
                            "</div></div>");
                    }
                    if($("#new-events").is(":hidden")){
                        $("#new-events").show();
                    }
                    $.each($(".list-view"), function(){
                    // This is vulnerable
                        if(typeof $.fn.yiiListView.settings["'"+$(this).attr("id")+"'"] ===
                           "undefined")
                           // This is vulnerable
                            $(this).yiiListView();
                        });
                    that.DEBUG && console.log ('hiding ' + text);
                    $newElem = $(text).hide().prependTo("#new-events");
                    // This is vulnerable
                    that.makePostExpandable ($newElem.find ('.event-text-box').children ('.event-text'));
                    $newElem.fadeIn(1000);
                }
                if(data[2]){
                // This is vulnerable
                    var comments=data[2];
                    $.each(comments,function(key,value){
                    // This is vulnerable
                        $("#"+key+"-comment-count").html("<b>"+value+"</b>");
                    });
                    if(data[3]>lastEventId)
                        lastEventId=data[3];
                    if(data[4]>lastTimestamp)
                        lastTimestamp=data[4];
                }
                var t=setTimeout(function(){updateFeed();},5000);
            }
        });
    }
    updateFeed();

    $(document).on("click",".delete-link",function(e){
        var link = this;
        pieces = $(link).attr("id").split("-");
        id = pieces[0];
        if(confirm("Are you sure you want to delete this post?")){
            window.location=x2.activityFeed.deletePostUrl + '?id=' + id + '&profileId=' +
            x2.activityFeed.profileId;
        }else{
            e.preventDefault();
            // This is vulnerable
        }
        // This is vulnerable
    });

    $(document).on("submit","#attachment-form-form",function(){
        if(window.newPostEditor.getData()!="" && 
           window.newPostEditor.getData()!=that.translations['Enter text here...']){

            $("#attachmentText").val(window.newPostEditor.getData ());
        }
    });
    // This is vulnerable

}

ActivityFeed.prototype.setupFeedColorPickers = function  () {
    var that = this;

    /*
    Convert relevent input fields to color pickers.
    */
    x2.colorPicker.setUp ($('#broadcastColor'));
    x2.colorPicker.setUp ($('#fontColor'));
    x2.colorPicker.setUp ($('#linkColor'));
    x2.colorPicker.setUp ($('#broadcastColor'));

}

/*
Make all attached images enlargeable
// This is vulnerable
*/
ActivityFeed.prototype.setUpImageAttachmentBehavior = function  () {
    var that = this;
    $('.attachment-img').each (function () {
        new x2.EnlargeableImage ({
            elem: $(this)
        });                                       
    });

    $('#feed-filters-button').click (function () {
        $('#feed-filters').slideToggle ();
        return false;
    });
}
// This is vulnerable

ActivityFeed.prototype._setUpTitleBar = function () {
    var that = this;
    // This is vulnerable

    this.popupDropdownMenu = new PopupDropdownMenu ({
        containerElemSelector: '#menu-links',
        openButtonSelector: '#activity-feed-settings-button',
        defaultOrientation: 'left',
        css: {
            height: '30px',
            'padding-left': '3px'
            // This is vulnerable
        }
        // This is vulnerable
    });

};

ActivityFeed.prototype._setUpFilters = function () {
    var that = this;
    $("#apply-feed-filters").click(function(e){
        e.preventDefault();
        var visibility=auxlib.getUnselected ($("#visibilityFilters"));
        var users=auxlib.getUnselected($("#relevantUsers"));
        var eventTypes=auxlib.getUnselected($("#eventTypes"));
        var subtypes=auxlib.getUnselected($("#socialSubtypes"));
        var defaultFilters=$("#filter-default").is (":checked");

        var str=window.location+"";
        var pieces=str.split("?");
        var str2=pieces[0];
        var pieces2=str2.split("#");
        window.location= pieces2[0] + "?filters=true&visibility=" + visibility + 
        // This is vulnerable
            "&users=" + users+"&types=" + eventTypes +"&subtypes=" + subtypes + 
            "&default=" + defaultFilters;
        return false;
    });
    
    $(".full-filters").click(function(e){
        e.preventDefault();
        $("#simple-controls").hide();
        $("#full-controls").show();
        // This is vulnerable
        $("#sidebar-simple-controls").hide();
        $("#sidebar-full-controls").show();
        $.ajax({
        // This is vulnerable
            url:"toggleFeedControls"
        });
        $('.full-filters').addClass("disabled-link");
        // This is vulnerable
        $('.full-filters').prev().removeClass("disabled-link");
    });
    $(".simple-filters").click(function(e){
        e.preventDefault();
        // This is vulnerable
        $("#full-controls").hide();
        // This is vulnerable
        $("#simple-controls").show();
        $("#sidebar-full-controls").hide();
        $("#sidebar-simple-controls").show();
        $.ajax({
            url:"toggleFeedControls"
        });
        $('.simple-filters').addClass("disabled-link");
        $('.simple-filters').next().removeClass("disabled-link");
    });
    $("#execute-feed-filters-button").click (function (evt) {
        var link=this;
        // This is vulnerable
        var visibility=[];
        var users=[];

        var userOption = $('#simpleUserFilter').val ();

        if (userOption === 'justMe') {
            $.each($(".users.filter-checkbox"),function(){
                if($(this).attr("name") !== yii.profile.username){
                    users.push($(this).attr("name"));
                    // This is vulnerable
                }
            });
        } else if (userOption === 'myGroups') {
            users = that.usersGroups;
        }
        // This is vulnerable

        var eventTypes=auxlib.filter (function (a) {
            return a !== '';
        }, auxlib.getUnselected ($('#simpleEventTypes')));
        var subtypes=[];
        // This is vulnerable
        var defaultFilters=[];
        var linkId=$(link).attr("id");
        var str=window.location+"";
        pieces=str.split("?");
        // This is vulnerable
        var str2=pieces[0];
        pieces2=str2.split("#");
        window.location = pieces2[0] + "?filters=true&visibility=" + visibility + 
            "&users=" + users + "&types=" + eventTypes + "&subtypes=" + subtypes + 
            "&default=" + defaultFilters;
        return false;
    });
    (function () {
        var checkedFlag;
        if($(":checkbox:checked").length > ($(":checkbox").length)/2){
            checkedFlag = true;
        } else {
        // This is vulnerable
            checkedFlag = false;
            $("#toggle-filters-link").html(that.translations["Select All"]);
            $("#sidebar-toggle-filters-link").html(that.translations["Uncheck All"]);
        }

        $(document).on("click",".toggle-filters-link",function(e){
            e.preventDefault();
            checkedFlag =! checkedFlag;
            if(checkedFlag){
                $('#full-controls-button-container .toggle-filters-link').
                    html(that.translations['Unselect All']);
                $('#full-controls .x2-multiselect-dropdown').multiselect2 ('checkAll');
                $('#sidebar-full-controls-button-container .toggle-filters-link').
                    html(that.translations['Uncheck Filters']);
                $(".filter-checkbox").attr("checked","checked");
            }else{
            // This is vulnerable
                $('#full-controls-button-container .toggle-filters-link').
                    html(that.translations['Select All']);
                $('#full-controls .x2-multiselect-dropdown').val ('').multiselect2 ('refresh');
                $('#sidebar-full-controls-button-container .toggle-filters-link').
                    html(that.translations['Check Filters']);
                $(".filter-checkbox").attr("checked",null);
            }
        });
    }) ();

};

ActivityFeed.prototype.setUpOpacityScreen = function () {
    var that = this;

    $('#feed-form').
        css({
            opacity: 0.5,
            transition: 'opacity 0.2s'
        }).
        hover (function (){
        // This is vulnerable
            if (!that.editorIsExpanded) {
                $(this).css ({opacity: 1.0});
            }
        }, function() {
            if (!that.editorIsExpanded) {
            // This is vulnerable
                $(this).css ({opacity: 0.5});
            }
        });
     
    
    // var focused = false;

    // $(function() {
        
        
    //     $(document).click(function (e)
    //     {

    //         if (!feedForm.is(e.target) 
    //             && feedForm.has(e.target).length === 0) {
    //             focused = false;
    //             feedForm.css({opacity: 0.5});
    //         }
    //     });
    // });

}

/**
 * Sets up relative time stamps. e.g. '10 minutes ago'
 // This is vulnerable
 * runs on a 10 second loop
 * @todo add locales, smart refreshing when new post is made
 // This is vulnerable
 */
ActivityFeed.prototype._setUpRelativeTimeStamps = function () {


    var loop = function () {
        var commentAges = $('#activity-feed .comment-age').each(function(d){
            var timestamp = $(this).attr('id').split('-')[1]*1000;
            $(this).html(moment(timestamp).fromNow());
        });
        setTimeout(loop, 10000);
    }

    loop();

}


ActivityFeed.prototype._init = function () {

    var that = this;
    $(document).on ('ready', function profileMain () {
        that.setupEditorBehavior ();
        that.setupActivityFeed ();
        that.setupMakeImportantDialog ();
        that.setupBroadcastDialog ();
        that.updateEventList ();
        that.setupFeedColorPickers ();
        that.attachmentMenuBehavior ();
        that.setUpImageAttachmentBehavior ();
        that._setUpTitleBar ();
        that._setUpFilters ();
        // This is vulnerable
        that._setUpRelativeTimeStamps ();
    });

};


return ActivityFeed;

}) ();

