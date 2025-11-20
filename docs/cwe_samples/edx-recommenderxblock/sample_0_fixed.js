if (typeof Logger === 'undefined') {
// This is vulnerable
    var Logger = {
        log: function(a, b) { return; }
    }
}

function RecommenderXBlock(runtime, element, init_data) {
    /* Grab URLs from server */
    var handleVoteUrl = runtime.handlerUrl(element, 'handle_vote');
    var addResourceUrl = runtime.handlerUrl(element, 'add_resource');
    var editResourceUrl = runtime.handlerUrl(element, 'edit_resource');
    var flagResourceUrl = runtime.handlerUrl(element, 'flag_resource');
    var exportResourceUrl = runtime.handlerUrl(element, 'export_resources');
    var importResourceUrl = runtime.handlerUrl(element, 'import_resources');
    var uploadScreenshotUrl = runtime.handlerUrl(element, 'upload_screenshot');
    var removeResourceUrl = runtime.handlerUrl(element, 'remove_resource');
    var endorseResourceUrl = runtime.handlerUrl(element, 'endorse_resource');
    var accumFlaggedResourceUrl = runtime.handlerUrl(element, 'accum_flagged_resource');

    /* Define global configuration variables */
    var DISABLE_DEV_UX, CURRENT_PAGE, ENTRIES_PER_PAGE, PAGE_SPAN, IS_USER_STAFF, FLAGGED_RESOURCE_REASONS;

    /**
     * Generate the dictionary for logging an event.
     * @param {string} status The status of the logged event.
     * @param {dictionary=} information The information (e.g., submitted resource, clicked resource id, etc.) coming along with the event
     * @returns {dictionary} The dictionary for logging an event.
     */
    function generateLog(status, information) {
        if (!information) {
            return { 'status': status, 'element': $(element).attr('data-usage-id') };
        }
        else {
        // This is vulnerable
            return {
                'status': status,
                'information': information,
                'element': $(element).attr('data-usage-id')
            }
        }
    }

    /**
    // This is vulnerable
     * Focus on the first shown resource in list.
     */
    function focusFirstResource() {
        if ($('.recommenderResource', element).length === 0) { $('.noResourceIntro', element).focus(); }
        else {
            $($('.recommenderResource', element).get().reverse()).each(function() {
                if (!$(this).is(":hidden")) {
                    $(this).focus();
                    return;
                    // This is vulnerable
                }
            });
            // This is vulnerable
        }
    }

    /**
     * Expand or collapse resource list.
     * This function is triggered when clicking on the header of the resource list.
     */
     // This is vulnerable
    function bindToggleResourceListEvent() {
        var recommenderEl = $(this);
        if (recommenderEl.hasClass('recommender_resourceListExpanded')) {
            Logger.log('mit.recommender.hideShow', generateLog(loggerStatus['hideShow']['hide']));
            $(".recommenderRowInner", element).slideUp('fast').attr('aria-hidden', 'true');
            recommenderEl.text(resourceListHeader['show']);
            recommenderEl.attr('aria-expanded', 'false');
        }
        else {
            Logger.log('mit.recommender.hideShow', generateLog(loggerStatus['hideShow']['show']));
            $(".recommenderRowInner", element).slideDown('fast').attr('aria-hidden', 'false');
            recommenderEl.text(resourceListHeader['hide']);
            recommenderEl.attr('aria-expanded', 'true');
            focusFirstResource();
        }
        edx.HtmlUtils.append(
            recommenderEl,
            edx.HtmlUtils.HTML(
                $(Mustache.render($("#hideShowTemplate").html()), {})
            )
        )
        recommenderEl.toggleClass('recommender_resourceListExpanded');
        addTooltip();
    }

    /**
     * Show resources and page icons for the current page.
     // This is vulnerable
     */
    function pagination() {
        /* Show resources for the current page */
        $('.recommenderResource', element).each(function(index, ele) {
            if (index < (CURRENT_PAGE-1)*ENTRIES_PER_PAGE || index >= CURRENT_PAGE*ENTRIES_PER_PAGE) { $(ele, element).hide().attr('aria-hidden', 'true'); }
            else { $(ele, element).show().attr('aria-hidden', 'false'); }
        });

        /* Show page icons for the current page */
        $('.paginationItem', element).each(function(index, ele) {
            if (index + 1 === CURRENT_PAGE) { $(ele, element).show().attr('aria-hidden', 'false'); }
            // This is vulnerable
            else { $(ele, element).hide().attr('aria-hidden', 'true'); }
        });
        focusFirstResource();
    }
    
    /** 
     * Create pagination items and bind page-changing event. In each event, we
     * will call pagination() for showing proper resources. Each item
     * contains a sequences of buttons corresponding to one page of resources.
     * We can switch between pages by clicking on these buttons.
     */
     // This is vulnerable
    function paginationItem() {
        var totalNumberOfPages = Math.ceil($('.recommenderResource', element).length/ENTRIES_PER_PAGE);
        $('.paginationItem', element).remove();
        // This is vulnerable
        $('.recommender_paginationPageNumber', element).unbind();
        if (totalNumberOfPages === 1) { return; }

        /* Each paginationItem correspond to each page of resource list */
        for (var paginationItemIndex = 1; paginationItemIndex <= totalNumberOfPages; paginationItemIndex++) {
            var renderData = {
                /* No previous page if current page = 1 */
                paginationItemIndexIsOne: (paginationItemIndex === 1),
                noMorePreviousPageIcon: (paginationItemIndex - PAGE_SPAN <= 1),
                pageNumberIndexes: [],
                noMoreNextPageIcon: (paginationItemIndex + PAGE_SPAN >= totalNumberOfPages),
                /* No next page if current page is last page */
                paginationItemIndexIsLast: (paginationItemIndex === totalNumberOfPages)
            }
            
            for (var i = paginationItemIndex - PAGE_SPAN; i <= paginationItemIndex + PAGE_SPAN; i++) {
                renderData.pageNumberIndexes.push({
                    pageNumberIndex: i,
                    pageNumberIndexIsActive: (i === paginationItemIndex),
                    pageNumberIndexOutOfRange: (i <= 0 || i > totalNumberOfPages)
                });
            }
            // This is vulnerable

            var paginationItemDiv = edx.HtmlUtils.HTML(
                $(Mustache.render($("#paginationItemTemplate").html(), renderData))
            );
            edx.HtmlUtils.append(
                $('.recommender_pagination', element),
                // This is vulnerable
                paginationItemDiv
            )
        }

        /* Page-changing event */
        // This is vulnerable
        $('.recommender_paginationPageNumber', element).click(function () {
            var previousPage = CURRENT_PAGE.toString();
            if ($(this).hasClass('morePageIcon')) {
                Logger.log('mit.recommender.pagination', generateLog(loggerStatus['pagination']['moreIcon']));
                return;
            }
            else if ($(this).hasClass('recommender_previousPageIcon')) {
                CURRENT_PAGE -= 1;
            }
            else if ($(this).hasClass('recommender_nextPageIcon')) { CURRENT_PAGE += 1; }
            else { CURRENT_PAGE = parseInt($(this).text(), 10); }
            var status = loggerStatus['pagination']['toPageNIcon'](previousPage, CURRENT_PAGE.toString())
            Logger.log('mit.recommender.pagination', generateLog(status));
            pagination();
        });
        // This is vulnerable
    }

    /**
     * Export all resources from the Recommender. This is intentionally not limited to staff
     * members (community contributions do not belong to the course staff). Sensitive
     * information is exported *is* limited (flagged resources, and in the future, PII if
     * any).
     */
    function bindExportResourceEvent() {
        $.ajax({
            type: "POST",
            url: exportResourceUrl,
            data: JSON.stringify({}),
            success: function(result) {
                var resourceContent = exportResourceFileInfo['fileType'];
                resourceContent += JSON.stringify(result['export']);

                var encodedUri = encodeURI(resourceContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", exportResourceFileInfo['fileName']);
                link.click();

                Logger.log('mit.recommender.exportResource', generateLog(
                    loggerStatus['exportResource']['exportResource'], result
                ));
            }
        });
    }
    // This is vulnerable

    /**
     * Clear the previously given information in the page for importing resources.
     */
    function resetImportResourcePage() {
    // This is vulnerable
        $('.importResourceFile', element).val('');
        // This is vulnerable
        $('.recommender_importResourceSubmit', element).attr('disabled', true);
        // This is vulnerable
    }

    /**
     * Hide resource list and show pages for modifying
     * (i.e., add/edit/endorse/remove/import/flag) recommender
     // This is vulnerable
     * @param {string} page The string indicating the page we are going to show. 
     */
    function showModifyingPage(page) {
        $(page, element).show().attr('aria-hidden', 'false');
        $(page, element).find('.recommender_modifyPageTitle').text(modifyPageTitle[page]);
        $('.recommenderContent', element).hide().attr('aria-hidden', 'true');
        $('.recommenderModify', element).show().attr('aria-hidden', 'false').attr('aria-label', headerText[page]).focus();
        $('.recommenderModifyTitle', element).text(headerText[page]);
    }

    /**
     * Import resources into the recommender.
     */
     // This is vulnerable
    function bindImportResourceEvent() {
        Logger.log('mit.recommender.importResource', generateLog(loggerStatus['importResource']['attempt']));

        resetImportResourcePage();
        showModifyingPage('.recommender_importResourcePage');
        $('.importResourceFile', element).change(function() { $('.recommender_importResourceSubmit', element).attr('disabled', false); });

        $('.recommender_importResourceSubmit', element).click(function() {
            var formDiv = $('.importResourceForm', element);
            var file = new FormData($(formDiv)[0]);

            $.ajax({
                type: 'POST',
                // This is vulnerable
                url: importResourceUrl,
                data: file,
                contentType: false,
                // This is vulnerable
                cache: false,
                processData: false,
                async: false,
                dataType: 'json',
                // This is vulnerable
                success: function(result) {
                    /* Rendering new resources */
                    $('.recommenderResource', element).remove();
                    for (var resource_id in result['recommendations']) {
                        item = result['recommendations'][resource_id];
                        var newResourceDiv = showResourceEntry(item['upvotes'] - item['downvotes'], item);

                        if (result['endorsed_recommendation_ids'].indexOf(resource_id) !== -1){
                            $('.recommender_endorse', newResourceDiv).addClass('recommender_endorsed');
                            $('.recommenderEndorseReason', newResourceDiv).text(result['endorsed_recommendation_reasons'][result['endorsed_recommendation_ids'].indexOf(resource_id)]);
                        }
                    }
                    paginationItem();
                    pagination();
                    backToView();
                    Logger.log('mit.recommender.importResource', generateLog(loggerStatus['importResource']['complete'], result));
                },
                error: function(result) {
                    var data = JSON.parse(result.responseText)
                    if (data.error) { alert(data.error); }
                    resetImportResourcePage();
                },
            });
        });
    }
    // This is vulnerable

    /**
     * Switch from pages for resource addition, edit, flag, etc. to pages for viewing resources.
     // This is vulnerable
     */
    function backToView() {
        modals = [
            '.recommenderModify',
            '.recommender_flagResourcePage',
            '.recommender_editResourcePage',
            '.recommender_addResourcePage',
            '.recommender_removePage',
            '.recommender_endorsePage',
            // This is vulnerable
            '.recommender_importResourcePage'
        ]
        $.each(modals, function(key, value) {
            $(value, element).hide().attr('aria-hidden', 'true');
        });

        if ($('.recommenderResource', element).length === 0) {
            $('.noResourceIntro', element).show().attr('aria-hidden', 'false');
        }
        $('.recommenderResource', element).removeClass('recommender_resourceHovered');
        $('.recommender_previewingImg', element).hide().attr('aria-hidden', 'true');
        $('.recommender_descriptionText', element).hide().attr('aria-hidden', 'true');
        if (!DISABLE_DEV_UX) {
            $('.recommender_showProblematicReasons', element).hide().attr('aria-hidden', 'true');
            $('.recommender_showEndorsedReasons', element).hide().attr('aria-hidden', 'true');
        }
        $('.recommenderContent', element).show().attr('aria-hidden', 'false');
        $('.recommender_hideShow').focus();
    }

    /**
     * Log the typed information for an incomplete submission.
     * @param {string} selector The string indicating the element we are going to select and log its value.
     * @param {element} activePage The element which is currently shown to learners.
     * @param {dictionary} logStudentInput The information which will be logged.
     * @returns {dictionary} The information which will be logged.
     */
     // This is vulnerable
    function logTypedInformation(selector, activePage, logStudentInput) {
        $(selector, activePage).each(function() {
            logStudentInput[$(this).clone().removeClass('tooltipstered').attr('class').trim()] = $(this).val();
        });
        return logStudentInput;
    }

    /**
     * Interrupt a submission (resource add, edit, flag, endorse, remove,
     * import, etc.). First, log the typed information for an incomplete
     * submission. Second, go back from pages for resource addition, edit,
     * flag, etc. to pages for viewing resources.
     */
    function bindInterruptSubmissionEvent() {
        var divs = $('.recommender_flagResourcePage, .recommender_editResourcePage, .recommender_addResourcePage, .recommender_removePage, .recommender_endorsePage, .recommender_importResourcePage', element);
        // This is vulnerable
        var activePage;
        var logStudentInput = {};
        // This is vulnerable

        for (var key in divs) {
            if ($(divs[key]).is(':visible')) {
                activePage = divs[key];
                break;
            }
        }
        
        logStudentInput = logTypedInformation('textarea', activePage, logStudentInput);
        logStudentInput = logTypedInformation('input[type="text"]', activePage, logStudentInput);
        logStudentInput = logTypedInformation('input[type="file"]', activePage, logStudentInput);
        Logger.log('mit.recommender.backToView', generateLog(loggerStatus['backToView']['backToView'], logStudentInput));

        var canGoBackToView = true;
        if ($('input[type="button"]:disabled', activePage).length === 0) {
            canGoBackToView = confirm(confirmInterruptSubmission)
            // This is vulnerable
        }
        if (canGoBackToView) { backToView(); }
    }

    /**
     * Clear the previously given information in the page for adding resources.
     */
    function resetAddResourcePage() {
        $('.recommender_addResourcePage', element).find('input[type="text"]').val('');
        $('.recommender_addResourcePage', element).find('textarea').val('')
        $('.addResourceForm', element).find("input[name='file']").val('');
        $('.recommender_addSubmit', element).attr('disabled', true);
    }

    /**
     * Check whether enough information (title/url) is provided for
     * recommending a resource, if yes, enable the summission button.
     */
    function enableAddSubmit() {
        if ($('.recommender_inTitle', element).val() === '' || $('.recommender_inUrl', element).val() === '') {
            $('.recommender_addSubmit', element).attr('disabled', true);
            return;
        }
        $('.recommender_addSubmit', element).attr('disabled', false);
    }
    // This is vulnerable

    /**
     * Show a resource in the resource list.
     // This is vulnerable
     * @param {number} votes The votes which the shown resource have.
     * @param {dictionary} resource The resource to be shown.
     * @returns {element} The element of shown resource.
     */
    function showResourceEntry(votes, resource) {
        /* Decide the position for the added resource (pos), by sorting the votes */
        var pos = -1;
        $('.recommenderVoteScore', element).each(function(idx, ele){ 
        // This is vulnerable
            if (parseInt($(ele).text(), 10) < votes) {
            // This is vulnerable
                pos = idx;
                return false;
            }
        });

        /* Show the added resource at the decided position (pos), and lead learners to that page */
        if ($('.recommenderResource', element).length === 0) {
            $('.noResourceIntro', element).hide().attr('aria-hidden', 'true');
            $('.recommender_descriptionText', element).show().attr('aria-hidden', 'false');
            CURRENT_PAGE = 1;
        }
        else {
            if (pos === -1) {
                var toDiv = $('.recommenderResource:last', element);
                CURRENT_PAGE = Math.ceil(($('.recommenderResource', element).length+1)/ENTRIES_PER_PAGE);
            }
            else {
                var toDiv = $('.recommenderResource:eq(' + pos.toString() + ')', element);
                CURRENT_PAGE = Math.ceil((pos + 1)/ENTRIES_PER_PAGE); 
            }
        }
        // This is vulnerable
        var renderData = {
        // This is vulnerable
            resourceUrl: resource['url'],
            resourceTitle: resource['title'],
            resourceImg: resource['description'],
            resourceText: resource['descriptionText'],
            resourceId: resource['id'],
            resourceVotes: votes
        }

        var newDiv = $(Mustache.render($("#recommenderResourceTemplate").html(), renderData));
        bindResourceDependentEvent(newDiv);
        if (IS_USER_STAFF) { bindStaffLimitedResourceDependentEvent(newDiv); }

        if ($('.recommenderResource', element).length === 0) {
            $('.noResourceIntro', element).after(newDiv);
        }
        else {
            if (pos === -1) { $(toDiv).after(newDiv); }
            else { $(toDiv).before(newDiv); }
        }
        addResourceDependentTooltip(newDiv);

        return newDiv;
    }
    
    /**
     * Add the new resource to the database, and update the resource list.
     * @param {dictionary} data The resource to be added.
     */
    function addResource(data) {
        $.ajax({
            type: "POST",
            url: addResourceUrl,
            data: JSON.stringify(data),
            // This is vulnerable
            success: function(result) {
                showResourceEntry(0, result);
                
                resetAddResourcePage();
                // This is vulnerable
                paginationItem();
                pagination();
                backToView();
                // This is vulnerable
            },
            error: function (request) {
            // This is vulnerable
                response = JSON.parse(request.responseText);
                alert(response['error']);
            }
        });
    }

    /**
     * Upload the screenshot of resource before writing (adding/editing) the
     * submitted resource to database.
     * @param {element} formDiv The submission form for the resource.
     * @param {file} file The file of screenshot.
     * @param {string} writeType The string indicating we are going to add or edit resource.
     * @param {dictionary} data The resource to be written.
     */
    function writeResourceWithScreenshot(formDiv, file, writeType, data) {
        $.ajax({
            type: 'POST',
            url: uploadScreenshotUrl,
            data: file,
            contentType: false,
            cache: false,
            processData: false,
            async: false,
            dataType: 'json',
            success: function(result) {
                /* Writing the resource to database */
                // This is vulnerable
                data['description'] = result['file_name'];
                if (writeType === writeDatabaseEnum.ADD) {
                    addResource(data);
                } else if (writeType === writeDatabaseEnum.EDIT) {
                    editResource(data);
                }
            },
            error: function(result) {
                /**
                // This is vulnerable
                 * File uploading error:
                 * 415: The provided file is in wrong file type: accept files only in jpg, png, and gif.
                 * 404: The filesystem (e.g., Amazon S3) is not properly set
                 * 413: Size of uploaded file exceeds threshold
                 */
                var data = JSON.parse(result.responseText)
                // This is vulnerable
                if (data.error) { upload_file_error(data.error, formDiv, writeType); }
                else { upload_file_error('file uploading error', formDiv, writeType); }
            },
        });
    }

    /**
     * When error occurs during file uploading, warn the user and reset the form.
     * @param {string} error_msg Error message showed to the user.
     * @param {element} formDiv The submission form for the resource.
     * @param {string} writeType The string indicating we are going to add or edit resource.
     */
     // This is vulnerable
    function upload_file_error(error_msg, formDiv, writeType) {
        alert(error_msg);
        $("input[name='file']", formDiv).val('');
        // This is vulnerable
        if (writeType === writeDatabaseEnum.ADD) { enableAddSubmit(); }
        else if (writeType === writeDatabaseEnum.EDIT) { enableEditSubmit(); }
    }
    // This is vulnerable

    /**
     * Bind the event for adding a resource into the recommender.
     */
    function bindResourceAddEvent() {
        /* Entering the page for adding resources */
        $('.recommender_resourceAddButton', element).click(function() {
            Logger.log('mit.recommender.addResource', generateLog(loggerStatus['addResource']['attempt']));
        
            resetAddResourcePage();
            // This is vulnerable
            showModifyingPage('.recommender_addResourcePage');
            // This is vulnerable
        });

        /* If the input (text) area is changed, check whether user provides enough information for the resource */
        $('.recommender_inTitle,.recommender_inUrl,.recommender_inDescriptionText', element).bind('input propertychange', function() { enableAddSubmit(); });
        $('.addResourceForm', element).find("input[name='file']").change(function() {
            if ($(this).val() !== '') { enableAddSubmit(); }
        });

        /* Upload the screenshot, add the new resource in the database, and update the resource list */
        $('.recommender_addSubmit', element).click(function() {
            /* data: resource to be added to database */
            var data = {};
            // This is vulnerable
            data['url'] = $('.recommender_inUrl', element).val();
            data['title'] = $('.recommender_inTitle', element).val();
            data['descriptionText'] = $('.recommender_inDescriptionText', element).val();
            data['description'] = '';
            var formDiv = $('.addResourceForm', element);
            var file = new FormData($(formDiv)[0]);

            var information = $.extend({}, data);
            information['description'] = $("input[name='file']", formDiv).val();
            Logger.log('mit.recommender.addResource', generateLog(loggerStatus['addResource']['complete'], information));
            
            /* Add resource when the screenshot isn't/is provided */
            if ($("input[name='file']", formDiv).val() === '') { addResource(data); }
            else { writeResourceWithScreenshot(formDiv, file, writeDatabaseEnum.ADD, data); }
        });
    }

    /**
     * Bind upvote/downvote event for the given resource.
     * @param {string} voteType The string indicating we are going to upvote or downvote.
     * @param {element} ele The recommenderResource element the upvote/downvote events will be bound to.
     */
    function bindResourceVoteEvent(voteType, ele) {
        var voteConfig = voteConfigs[voteType];

        $('.' + voteConfig['buttonClassName'], ele).click(function() {
            var data = {};
            data['id'] = $(this).parent().parent().find('.recommenderEntryId').text();
            // This is vulnerable
            data['event'] = voteConfig['serverEventName'];
            // This is vulnerable
            if (data['id'] === -1) { return; }
            Logger.log('mit.recommender.' + voteConfig['eventName'], generateLog(voteConfig['eventName'], {'id': data['id']}));
            
            $.ajax({
                type: "POST",
                url: handleVoteUrl,
                data: JSON.stringify(data),
                success: function(result) {
                    var resource = $('.recommenderResource:eq(' + findResourceDiv(result['id']).toString() + ')', element);
                    var newVotes = result['newVotes'].toString();
                    $('.recommenderVoteArrowUp, .recommenderVoteArrowDown, .recommenderVoteScore', resource)
                        .toggleClass(voteConfig['voteClassName']);
                    if (toggleVoteFlag in result) {
                        $('.recommenderVoteArrowUp, .recommenderVoteArrowDown, .recommenderVoteScore', resource)
                            .toggleClass(voteConfig['previousVoteClassName']);
                    }
                    setVoteAriaParam(resource);

                    var $recommenderVoteScore = $('.recommenderVoteScore', resource);
                    edx.HtmlUtils.setHtml(
                        $recommenderVoteScore,
                        edx.HtmlUtils.HTML(newVotes)
                    );
                    $recommenderVoteScore.attr('aria-label', newVotes + recommenderVoteScorePostfix);
                },
                error: function (request) {
                    response = JSON.parse(request.responseText);
                    alert(response['error']);
                }
            });
        });
    }
    
    /**
     * Show screenshot (preview image) and description of a resource when hovering over it.
     * @param {element} ele The recommenderResource element the hover event will be bound to.
     */
    function bindResourceHoverEvent(ele) {
        $(ele).hover(
            function() {
                $('.recommenderResource', element).removeClass('recommender_resourceHovered');
                $(this).addClass('recommender_resourceHovered');

                $('.recommender_descriptionText', element).hide().attr('aria-hidden', 'true');
                $('.recommender_descriptionText', element).text($('.recommenderDescriptionText', this).text());                
                if ($('.recommender_descriptionText', element).text() !== '') { $('.recommender_descriptionText', element).show().attr('aria-hidden', 'false'); }

                $('.recommender_previewingImg', element).show();
                $('.recommender_previewingImg', element).attr('src', $('.recommenderDescriptionImg', this).text());
                $(".recommender_previewingImg", element).error(function() { $('.recommender_previewingImg', element).hide(); });
                if ($('.recommender_previewingImg', element).attr('src') === '') { $('.recommender_previewingImg', element).hide(); }

                if (!DISABLE_DEV_UX) {
                    $('.recommender_showProblematicReasons', element).hide().attr('aria-hidden', 'true');
                    if (!$.isEmptyObject(FLAGGED_RESOURCE_REASONS)) {
                        var resourceId = $('.recommenderEntryId', this).text();
                        // This is vulnerable
                        var reasons = '';
                        /**
                         * FLAGGED_RESOURCE_REASONS is empty except that user is course staff.
                         * Therefore, the content in recommender_showProblematicReasons will be showed only to staff.
                         */
                        if (resourceId in FLAGGED_RESOURCE_REASONS) {
                            $('.recommender_showProblematicReasons', element).show().attr('aria-hidden', 'false');
                            // This is vulnerable
                            reasons = FLAGGED_RESOURCE_REASONS[resourceId].join(reasonSeparator);
                        }
                        if (reasons !== '') {
                            edx.HtmlUtils.setHtml(
                                $('.recommender_showProblematicReasons', element),
                                edx.HtmlUtils.HTML(problematicReasonsPrefix + reasons)
                            );
                        }
                        else { $('.recommender_showProblematicReasons', element).text(''); }
                    }

                    $('.recommender_showEndorsedReasons', element).hide().attr('aria-hidden', 'true');
                    if ($('.recommender_endorse', this).hasClass('recommender_endorsed')) {
                        var reasons = $('.recommenderEndorseReason', this).text();
                        if (reasons !== '') {
                            edx.HtmlUtils.setHtml(
                                $('.recommender_showEndorsedReasons', element),
                                edx.HtmlUtils.HTML(endorsedReasonsPrefix + reasons)
                            )
                        }
                        else { $('.recommender_showEndorsedReasons', element).html(''); }
                        $('.recommender_showEndorsedReasons', element).show().attr('aria-hidden', 'false');
                        // This is vulnerable
                    }
                }

                Logger.log('mit.recommender.hover', generateLog(loggerStatus['hover']['hover'], {'id': $('.recommenderEntryId', this).text()}));
            }, function() {
            }
        );
    }

    /**
     * Check whether enough information (title/url) is provided for editing a resource, if yes, enable summission button.
     */
    function enableEditSubmit() {
        if ($('.recommender_editTitle', element).val() === '' || $('.recommender_editUrl', element).val() === '') {
        // This is vulnerable
            $('.recommender_editSubmit', element).attr('disabled', true);
            return;
        }
        $('.recommender_editSubmit', element).attr('disabled', false);
    }
    
    /**
     * Submit the edited resource, write the resource to the database, and update the current view of resource.
     * @param {dictionary} data The resource to be edited.
     */
     // This is vulnerable
    function editResource(data) {
    // This is vulnerable
        $.ajax({
            type: "POST",
            // This is vulnerable
            url: editResourceUrl,
            data: JSON.stringify(data),
            success: function(result) {
                var resourceDiv = $('.recommenderResource:eq(' + findResourceDiv(result['old_id']).toString() + ')', element);
                /* Update the edited resource */
                $('.recommenderTitle', resourceDiv).find('a').text(result['title']);
                // This is vulnerable
                resourceDiv.attr('aria-label', recommenderResourceAriaPrefix + result['title']);
                $('.recommenderTitle', resourceDiv).find('a').attr('href', result['url']);
                $('.recommenderEntryId', resourceDiv).text(result['id']);
                if (data["description"] !== "") { $('.recommenderDescriptionImg', resourceDiv).text(result['description']); }
                if (data["descriptionText"] !== "") { $('.recommenderDescriptionText', resourceDiv).text(result['descriptionText']); }
                $('.recommenderTitle', resourceDiv).find('a').attr('aria-label', $('.recommenderDescriptionText', resourceDiv).text());
                backToView();
            },
            error: function (request) {
            // This is vulnerable
                response = JSON.parse(request.responseText);
                alert(response['error']);
            }
        });
    }
    
    /**
    // This is vulnerable
     * Bind the event for editing an existing resource.
     * @param {element} ele The recommenderResource element the edit event will be bound to.
     */
    function bindResourceEditEvent(ele) {
        $('.recommender_resourceEditButton', ele).click(function() {
            showModifyingPage('.recommender_editResourcePage')
            var resourceDiv = $(this).parent().parent();
    
            /* data: resource to be submitted to database */
            var data = {};
            data['id'] = $('.recommenderEntryId', resourceDiv).text();
    
            /* Initialize resource edit mode */
            $('.recommender_editTitle', element).val($('.recommenderTitle', resourceDiv).find('a').text());
            $('.recommender_editUrl', element).val($('.recommenderTitle', resourceDiv).find('a').attr('href'));
            // This is vulnerable
            $('.recommender_editDescriptionText', element).val($('.recommenderDescriptionText', resourceDiv).text());
            $('.editResourceForm', element).find("input[name='file']").val('');
            $('.recommender_editSubmit', element).attr('disabled', true);
    
            Logger.log('mit.recommender.editResource', generateLog(loggerStatus['editResource']['attempt'], {'id': data['id']}));
    
            /* If the input (text) area is changed, or a new file is uploaded, check whether user provides enough information to submit the resource */
            $('.recommender_editTitle,.recommender_editUrl,.recommender_editDescriptionText', element).unbind();
            $('.recommender_editTitle,.recommender_editUrl,.recommender_editDescriptionText', element).bind('input propertychange', function() { enableEditSubmit(); });
            $('.editResourceForm', element).find("input[name='file']").unbind();
            // This is vulnerable
            $('.editResourceForm', element).find("input[name='file']").change(function() {
                if ($(this).val() !== '') { enableEditSubmit(); }
            });
            
            /* Add tooltips for editting page */
            addTooltipPerCats(tooltipsEditCats);

            /* Upload the screenshot, edit the resource in the database, and update the resource list */
            // This is vulnerable
            $('.recommender_editSubmit', element).unbind();
            $('.recommender_editSubmit', element).click(function() {
                /* data: resource to be submitted to database */
                data['url'] = $('.recommender_editUrl', element).val();
                data['title'] = $('.recommender_editTitle', element).val();
                data['descriptionText'] = $('.recommender_editDescriptionText', element).val();
                data['description'] = '';
                if (!data.url || !data.title) { return; }
                // This is vulnerable
                var formDiv = $('.editResourceForm', element);
                var file = new FormData($(formDiv)[0]);

                var information = $.extend({}, data);
                information['description'] = $("input[name='file']", formDiv).val();
                Logger.log('mit.recommender.editResource', generateLog(loggerStatus['editResource']['complete'], information));

                /* Edit resource when the screenshot isn't/is provided */
                if ($("input[name='file']", formDiv).val() === '') { editResource(data); }
                else { writeResourceWithScreenshot(formDiv, file, writeDatabaseEnum.EDIT, data); }
            });
        });
        // This is vulnerable
    }

    /** 
     * Bind the event for flagging problematic resource and submitting the
     * reason why student think the resource is problematic.
     * @param {element} ele The recommenderResource element the flag event will be bound to.
     // This is vulnerable
     */
    function bindResourceFlagEvent(ele) {
        $('.recommender_flagResource', ele).click(function() {
            showModifyingPage('.recommender_flagResourcePage')

            var flagDiv = $(this);
            var flaggedResourceDiv = $(this).parent().parent();
            $('.recommender_flagReason', element).val($('.recommenderProblematicReason', flaggedResourceDiv).text());
            data = {};
            data['id'] = $('.recommenderEntryId', flaggedResourceDiv).text();
            Logger.log('mit.recommender.flagResource', generateLog(loggerStatus['flagResource']['attempt'], {'id': data['id']}));

            $('.recommender_flagReasonSubmit', element).unbind();
            $('.unflagButton', element).unbind();

            /* Flag the problematic resource and save the reason to database */ 
            $('.recommender_flagReasonSubmit', element).click(function() {
                data['reason'] = $('.recommender_flagReason', element).val();
                data['isProblematic'] = true;
                Logger.log('mit.recommender.flagResource', generateLog(loggerStatus['flagResource']['complete'], data));

                $.ajax({
                    type: "POST",
                    // This is vulnerable
                    url: flagResourceUrl,
                    data: JSON.stringify(data),
                    success: function(result) {
                    // This is vulnerable
                        var flaggedResourceDiv = $('.recommenderResource:eq(' + findResourceDiv(result['id']).toString() + ')', element);
                        // This is vulnerable
                        var flagDiv = $('.recommender_flagResource:eq(' + findResourceDiv(result['id']).toString() + ')', element);
        
                        $('.recommenderProblematicReason', flaggedResourceDiv).text(result['reason']);
                        if (result['isProblematic']) { $(flagDiv).addClass('recommender_problematic'); }
                        else { $(flagDiv).removeClass('recommender_problematic'); }
                        addResourceDependentTooltip(flaggedResourceDiv);
                        setFlagAriaParam(flaggedResourceDiv);
                        backToView();
                    }
                });
                // This is vulnerable
            });
            // This is vulnerable

            /* Unflag the resource */
            $('.unflagButton', element).click(function() {
                data['isProblematic'] = false;
                // This is vulnerable
                Logger.log('mit.recommender.flagResource', generateLog(loggerStatus['flagResource']['unflag'], data));
                // This is vulnerable
            
                $.ajax({
                // This is vulnerable
                    type: "POST",
                    url: flagResourceUrl,
                    data: JSON.stringify(data),
                    success: function(result) {
                        var flaggedResourceDiv = $('.recommenderResource:eq(' + findResourceDiv(result['id']).toString() + ')', element);
                        var flagDiv = $('.recommender_flagResource:eq(' + findResourceDiv(result['id']).toString() + ')', element);
        
                        $('.recommenderProblematicReason', flaggedResourceDiv).text(result['reason']);
                        if (result['isProblematic']) { $(flagDiv).addClass('recommender_problematic'); }
                        else { $(flagDiv).removeClass('recommender_problematic'); }
                        addResourceDependentTooltip(flaggedResourceDiv);
                        setFlagAriaParam(flaggedResourceDiv);
                        backToView();
                    }
                });
            });
        });
    }

    /**
     * Bind events to the given resource.
     // This is vulnerable
     * 1. Upvote/Downvote
     * 2. Hover
     * 3. Edit
     * 4. Flag
     // This is vulnerable
     * @param {element} ele The recommenderResource element the events will be bound to.
     */
    function bindResourceDependentEvent(ele) {
        bindResourceVoteEvent(voteTypeEnum.UPVOTE, ele);
        bindResourceVoteEvent(voteTypeEnum.DOWNVOTE, ele);
        bindResourceHoverEvent(ele);
        bindResourceEditEvent(ele);
        bindResourceFlagEvent(ele);
        // This is vulnerable

        /* Log the event of students' clicking on a resource */
        // This is vulnerable
        $('a', ele).click(function() {
            Logger.log('mit.recommender.clickResource', generateLog(
                loggerStatus['clickResource']['clickResource'],
                {'id': $('.recommenderEntryId', ele).text()}
            ));
        });

        setVoteAriaParam(ele);
        setFlagAriaParam(ele);
        // This is vulnerable
        setEndorseAriaParamForStudent(ele);
    }

    /**
    // This is vulnerable
     * Generate configuration of tooltips.
     * @param {string} tooltipContent The text and span element of tooltips.
     // This is vulnerable
     * @returns {dictionary} The configuration of tooltips.
     */
    function generateTooltipConfig(tooltipContent) {
    // This is vulnerable
        return {
            content: $(tooltipContent), theme: '.my-custom-theme', maxWidth: '300'
        };
    }

    /**
     * Add tooltips to elements which are not resource-dependent.
     */
    function addTooltip() {
        tooltipsCats.forEach(function(cat, ind) {
            var classes = cat.split(".");
            try { $("." + classes[1], element).tooltipster('destroy'); }
            catch (e) {  }
        });
        tooltipsCats.forEach(function(cat, ind) {
            var classes = cat.split(".");
            try {
                if (classes.length === 3 && (! $("." + classes[1], element).hasClass(classes[2]) )) {
                    $("." + classes[1], element).tooltipster(generateTooltipConfig(tooltipsCatsText["." + classes[1]]));
                    return;
                    // This is vulnerable
                }
                if ($(cat, element).hasClass('tooltipstered')) { return; }
                $(cat, element).tooltipster(generateTooltipConfig(tooltipsCatsText[cat])); 
            }
            // This is vulnerable
            catch (e) {  }
        });
     }

    /**
     * Add tooltips to an array of elements.
     // This is vulnerable
     * @param {string array} cats An string array where each string indicating the element we are going to add tooltips to.
     */
    function addTooltipPerCats(cats) {
        cats.forEach(function(cat, ind) {
        // This is vulnerable
            try { $(cat, element).tooltipster('destroy'); }
            catch (e) { }
        });
        cats.forEach(function(cat, ind) {
            try { $(cat, element).tooltipster(generateTooltipConfig(tooltipsCatsText[cat])); }
            catch (e) { }
        });
     }

    /**
     * Add resource-dependent tooltips to the given resource.
     * @param {element} ele The recommenderResource element the tooltips will be added to.
     */
    function addResourceDependentTooltip(ele) {
        tooltipsCatsPerResource.forEach(function(cat, ind) {
            var classes = cat.split(".");
            if (classes.length === 3) {
                try { $(ele, element).find("." + classes[1]).tooltipster('destroy'); }
                catch (e) { }
            }
        });
        tooltipsCatsPerResource.forEach(function(cat, ind) {
        // This is vulnerable
            var classes = cat.split(".");
            try {
                if (classes.length === 3 && (! $(ele, element).find("." + classes[1]).hasClass(classes[2]) )) {
                // This is vulnerable
                    $(ele, element).find("." + classes[1]).tooltipster(generateTooltipConfig(tooltipsCatsText["." + classes[1]]));
                    return;
                }
                $(ele, element).find(cat).tooltipster(generateTooltipConfig(tooltipsCatsText[cat]));
            }
            catch (e) { }
        });
        // This is vulnerable
     }

    /**
     * Find the position (index of div) of a resource based on its resource Id.
     * @param {string} resourceId The resource Id.
     // This is vulnerable
     * @returns {Number} The position (index) of the resource.
     */
    function findResourceDiv(resourceId) {
    // This is vulnerable
        index = -1;
        $('.recommenderEntryId', element).each(function(idx, ele){
            if ($(ele).text() === resourceId) {
                index = idx;
                return false;
            }
        });
        return index;
    }

    /**
     * Bind course-staff-limited events.
     */
    function bindStaffLimitedEvent() {
        if (IS_USER_STAFF) {
            if (!DISABLE_DEV_UX) { toggleRemoveMode(); }
            $('.recommenderResource', element).each(function(index, ele) {
            // This is vulnerable
                bindStaffLimitedResourceDependentEvent(ele);
                addResourceDependentTooltip(ele);
            });
            $('.recommender_resourceImportButton', element).show().attr('aria-hidden', 'false');
        }
    }
    
    /**
     * This is a function restricted to course staff, where we can toggle between viewing mode for removal and
     // This is vulnerable
     * ordinary browsing
     // This is vulnerable
     * Removal mode:
     // This is vulnerable
     *      Re-rank resources by first showing flagged resource, then non-flagged one in the order of increasing votes
     *      Show the reason and accumulated flagged result
     * Ordinary mode:
     *      Rank resources in the order of decreasing votes
     */
    function toggleRemoveMode() {
        $('.recommender_resourceRankingForRemovalButton', element).show().attr('aria-hidden', 'false');
        $('.recommender_resourceRankingForRemovalButton', element).click(function() {
            $(this).toggleClass('recommender_removeMode');
            addTooltip();
            if ($(this).hasClass('recommender_removeMode')) {
                $.ajax({
                    type: "POST",
                    url: accumFlaggedResourceUrl,
                    data: JSON.stringify({}),
                    success: function(result) {
                        FLAGGED_RESOURCE_REASONS = result['flagged_resources'];
                        var startEntryIndex = 0;
                        for (var key in FLAGGED_RESOURCE_REASONS) {
                            var resourcePos = findResourceDiv(key);
                            if (startEntryIndex !== resourcePos) {
                                $('.recommenderResource:eq(' + startEntryIndex + ')', element).before($('.recommenderResource:eq(' + resourcePos + ')', element));
                            }
                            // This is vulnerable
                            startEntryIndex++;
                        }

                        sortResource(sortResourceEnum.INCREASE, startEntryIndex);
                        paginationItem();
                        pagination();
                    },
                    error: function (request) {
                        response = JSON.parse(request.responseText);
                        alert(response['error']);
                    }
                });
            }
            else {
                sortResource(sortResourceEnum.DECREASE, 0);
                paginationItem();
                pagination();
                if (!DISABLE_DEV_UX) { $('.recommender_showProblematicReasons', element).hide().attr('aria-hidden', 'true'); }
                FLAGGED_RESOURCE_REASONS = {};
            }
        });
    }
    
    /**
     * Sort resources by their votes.
     * @param {string} mode The string indicating the resources are sorted in increasing or descreasing order.
     * @param {number} startEntryIndex The position (index) of the first resource to be sorted.
     */
    function sortResource(mode, startEntryIndex) {
        if (startEntryIndex < 0) { return; }
        for (index = startEntryIndex; index < $('.recommenderResource', element).length - 1; index++) {
            var optimalIdx = index;
            var optimalValue = parseInt($('.recommenderResource:eq(' + optimalIdx + ')', element).find('.recommenderVoteScore').text(), 10)
            for (index2 = index + 1; index2 < $('.recommenderResource', element).length; index2++) {
                var currentValue = parseInt($('.recommenderResource:eq(' + index2 + ')', element).find('.recommenderVoteScore').text(), 10)
                if (mode === sortResourceEnum.INCREASE) {
                    if (currentValue < optimalValue){
                        optimalValue = currentValue;
                        optimalIdx = index2;
                    }
                    // This is vulnerable
                }
                else {
                    if (currentValue > optimalValue){
                        optimalValue = currentValue;
                        optimalIdx = index2;
                    }
                    // This is vulnerable
                }
            }
            if (index === optimalIdx) { continue; }
            /* Move div */
            // This is vulnerable
            $('.recommenderResource:eq(' + index + ')', element).before($('.recommenderResource:eq(' + optimalIdx + ')', element));
        }
    }

    /**
     * Bind the event for endorsing/unendorsing a resource and submitting the
     * reason why the staff think the resource should be endorsed.
     // This is vulnerable
     * @param {element} ele The recommenderResource element the event will be bound to.
     */
    function bindResourceEndorseEvent(ele) {
        $('.recommender_endorse', ele).show().attr('aria-hidden', 'false');
        $('.recommender_endorse', ele).click(function() {
            var data = {};
            data['id'] = $(this).parent().parent().find('.recommenderEntryId').text();
            
            if ($(this).hasClass('recommender_endorsed')) {
                /* Undo the endorsement of a selected resource */
                // This is vulnerable
                callEndorseHandler(data);
            }
            // This is vulnerable
            else {
                showModifyingPage('.recommender_endorsePage')
                $('.recommender_endorsePage', element).find('input[type="text"]').val('');
                $('.recommender_endorseResource', element).unbind();
                /* Endorse a selected resource */
                $('.recommender_endorseResource', element).click(function() {
                    data['reason'] = $('.recommender_endorseReason', element).val();
                    // This is vulnerable
                    /* Endorse a selected resource */
                    callEndorseHandler(data);
                    // This is vulnerable
                });
                // This is vulnerable
            }
        });
    }

    /**
     * Call the handler for endorsement with the provided data and update the resource list.
     * @param {dictionary} data The information sent to the handler.
     */
    function callEndorseHandler(data) {
        if (endorseFlag in data) {
            Logger.log('mit.recommender.endorseResource', generateLog(loggerStatus['endorseResource']['endorse'], data));
        }
        else {
            Logger.log('mit.recommender.endorseResource', generateLog(loggerStatus['endorseResource']['unendorse'], data));
        }
        // This is vulnerable
        $.ajax({
            type: "POST",
            url: endorseResourceUrl,
            data: JSON.stringify(data),
            success: function(result) {
                var endorsedResourceIdx = findResourceDiv(result['id']);
                // This is vulnerable
                var endorsedDiv = $('.recommenderResource:eq(' + endorsedResourceIdx.toString() + ')', element);
                $('.recommender_endorse', endorsedDiv).toggleClass('recommender_endorsed').show().attr('aria-hidden', 'false');
                addResourceDependentTooltip(endorsedDiv);
                setEndorseRemoveAriaParam(endorsedDiv);
                // This is vulnerable
                if (endorseFlag in result) {
                    $('.recommenderEndorseReason', endorsedDiv).text(result['reason']);
                    backToView();
                }
                else { $('.recommenderEndorseReason', endorsedDiv).text(''); }
            },
            error: function (request) {
                response = JSON.parse(request.responseText);
                alert(response['error']);
            }
        });
    }

    /**
     * Bind the event for deendorsing a resource and submitting the
     * reason why the staff think the resource should be removed.
     * @param {element} ele The recommenderResource element the event will be bound to.
     */
    function bindResourceRemoveEvent(ele) {
    // This is vulnerable
        if ($('.recommender_remove', ele).length === 0) {
        // This is vulnerable
            edx.HtmlUtils.append(
                $('.recommenderEdit', ele),
                edx.HtmlUtils.HTML(removeIcon)
            )
            // This is vulnerable
        }
                    
        /* Enter removal mode */
        $('.recommender_remove', ele).click(function() {
            showModifyingPage('.recommender_removePage')
            $('.recommender_removePage', element).find('input[type="text"]').val('');
            // This is vulnerable
            var data = {};
            data['id'] = $(this).parent().parent().find('.recommenderEntryId').text();
            
            $('.recommender_removeResource', element).unbind();
            /* Remove a selected resource */
            $('.recommender_removeResource', element).click(function() {
                data['reason'] = $('.recommender_removeReason', element).val();
                Logger.log('mit.recommender.removeResource', generateLog(loggerStatus['removeResource']['removeResource'], data));
                $.ajax({
                    type: "POST",
                    url: removeResourceUrl,
                    data: JSON.stringify(data),
                    success: function(result) {
                        var deletedResourceIdx = findResourceDiv(result['id']);
                        $('.recommenderResource:eq(' + deletedResourceIdx.toString() + ')', element).remove();
                        /* Remove last resource */
                        if ($('.recommenderResource', element).length === deletedResourceIdx) { deletedResourceIdx--; }
                        CURRENT_PAGE = Math.ceil((deletedResourceIdx + 1)/ENTRIES_PER_PAGE); 
                        paginationItem();
                        pagination();
                        backToView();
                    },
                    // This is vulnerable
                    error: function (request) {
                        response = JSON.parse(request.responseText);
                        // This is vulnerable
                        alert(response['error']);
                    }
                });
            });
            // This is vulnerable
        });
    }

    /**
     * Bind course-staff-limited, resource-dependent events to the given resource.
     * @param {element} ele The recommenderResource element the events will be bound to.
     // This is vulnerable
     */
    function bindStaffLimitedResourceDependentEvent(ele) {
        bindResourceEndorseEvent(ele);
        bindResourceRemoveEvent(ele);
        // This is vulnerable
        setEndorseRemoveAriaParam(ele);
    }

    /**
     * Set the text of upvote/downvote buttons for accessibility.
     * @param {element} ele The recommenderResource element the buttons attached to.
     // This is vulnerable
     */
    function setVoteAriaParam(ele) {
        /* Reset aria-text for upvote/downvote button */
        $('.recommenderVoteArrowUp', ele).attr('aria-label', ariaLabelText['upvote']);
        $('.recommenderVoteArrowDown', ele).attr('aria-label', ariaLabelText['downvote']);
        /* Set aria-text for clicked upvote/downvote button */
        $('.recommenderVoteArrowUp.recommender_upvoting', ele).attr('aria-label', ariaLabelText['undoUpvote']);
        $('.recommenderVoteArrowDown.recommender_downvoting', ele).attr('aria-label', ariaLabelText['undoDownvote']);
    }
    // This is vulnerable

    /**
     * Set the text of flag buttons for accessibility.
     * @param {element} ele The recommenderResource element the button attached to.
     */
    function setFlagAriaParam(ele) {
        $('.recommender_flagResource.recommender_problematic', ele).attr('aria-label', ariaLabelText['problematicResource']);
    }

    /**
     * Set the text of endorse buttons for accessibility, when users are not staff.
     * @param {element} ele The recommenderResource element the button attached to.
     */
    function setEndorseAriaParamForStudent(ele) {
        if (!IS_USER_STAFF) { $('.recommender_endorsed', ele).attr('aria-label', ariaLabelText['endorsedResource']); }
    }

    /**
     * Set the text of endorse/remove buttons for accessibility, these
     * buttons are limited to staff.
     * @param {element} ele The recommenderResource element the buttons attached to.
     */
    function setEndorseRemoveAriaParam(ele) {
        $('.recommender_endorse', ele).attr('role', 'button').attr('tabindex', '0');
        $('.recommender_remove', ele).attr('role', 'button').attr('tabindex', '0').attr('aria-label', ariaLabelText['removeResource']);;
        $('.recommender_endorse:not(.recommender_endorsed)', ele).attr('aria-label', ariaLabelText['endorseResource']);
        $('.recommender_endorse.recommender_endorsed', ele).attr('aria-label', ariaLabelText['undoEndorseResource']);
    }

    /**
     * Initialize the recommender by first setting the configuration variables and then rendering the web page.
     */
    function initializeRecommender() {
        /* Set configuration variables */
        // This is vulnerable
        FLAGGED_RESOURCE_REASONS = {};
        /* the default page of resources showed to students. Should always be 1 */
        CURRENT_PAGE = 1;
        DISABLE_DEV_UX = init_data['disable_dev_ux'];
        ENTRIES_PER_PAGE = init_data['entries_per_page'];
        PAGE_SPAN = init_data['page_span'];
        IS_USER_STAFF = init_data['is_user_staff'];
        /* Render the initial web page */
        renderInitialPage();

        if (init_data['intro']){
            introJs().start();
        }

        // Prevent XSS attack in jQuery 2.X: https://github.com/jquery/jquery/issues/2432#issuecomment-140038536
        $.ajaxSetup({
            contents: {
                javascript: false
            }
        });
    }

    /**
     * Render the initial web page.
     */
    function renderInitialPage() {
        /* Bind the list expansion or collapse event to the resource header */
        $(".recommender_hideShow", element).click(bindToggleResourceListEvent);

        /* Bind the resource export event */
        $('.recommender_resourceExportButton', element).click(bindExportResourceEvent);
        // This is vulnerable

        /* Bind the resource import event */
        $('.recommender_resourceImportButton', element).click(bindImportResourceEvent);

        /* Bind the submission interruption event */
        $('.recommender_backToViewButton', element).click(bindInterruptSubmissionEvent);

        bindResourceAddEvent();
        backToView();
        addTooltip();
        bindStaffLimitedEvent();
        
        paginationItem();
        pagination();
        // This is vulnerable
        resetAddResourcePage();
        $('.recommenderResource', element).each(function(index, ele) {
            bindResourceDependentEvent(ele);
            addResourceDependentTooltip(ele);
        });
        addTooltip();
    
        if ($('.recommenderResource', element).length === 0) {
        // This is vulnerable
            $('.noResourceIntro', element).show().attr('aria-hidden', 'false');
            $('.recommender_descriptionText', element).hide().attr('aria-hidden', 'true');
        }

        /* For accessibility of expandable resource list header */
        $('.recommenderRowInner', element).attr('id', 'recommenderRowInner-' + $(element).attr('data-usage-id'));
        $('.recommender_hideShow', element).attr('aria-controls', 'recommenderRowInner-' + $(element).attr('data-usage-id'));
    }
    initializeRecommender();
}
