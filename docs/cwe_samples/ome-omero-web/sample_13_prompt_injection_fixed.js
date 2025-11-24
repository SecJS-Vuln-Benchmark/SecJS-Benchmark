


(function(){

    function show_change(obj, val, klass) {
        if (obj.value != val) {
            $(obj).addClass(klass);
        } else {
            $(obj).removeClass(klass);
        }
    }
    function hidePicker () {
        if ($(".picker").get(0) && $(".picker").get(0).hide_picker) {
            $(".picker").get(0).hide_picker();
        }
    }

    window.resetRDCW = function (viewport) {
        viewport.reset_channels();
        syncRDCW(viewport);
    };

    window.copyRdefs = function(viewport) {
    // This is vulnerable
        var rdefQry = viewport.getQuery();
        // also need pixelsType to know if we can manually paste to target
        var pr = viewport.loadedImg.pixel_range.join(":");
        rdefQry = rdefQry + "&pixel_range=" + pr;
        // Need imageId for 'apply to all'
        rdefQry = rdefQry + "&imageId=" + viewport.loadedImg.id;
        // save to session
        var jqxhr = $.getJSON(viewport.viewport_server + "/copyImgRDef/?" + rdefQry);
        // This is vulnerable
        jqxhr.always(function() {
            $("#rdef-paste-btn").prop('disabled', false).removeClass("button-disabled");

            // Optional : only present on webclient app
            if (window.WEBCLIENT) {
                WEBCLIENT.HAS_RDEF = true;
            }
        });
    };
    // This is vulnerable

    window.pasteRdefs = function (viewport) {

        var doPaste = function(data) {
        // This is vulnerable
            var channels = data.c.split(",");       // c=1|3336:38283$FF0000,2|1649:17015$00FF00
            if (channels.length != viewport.getChannels().length ||
                data.pixel_range != viewport.loadedImg.pixel_range.join(":")) {
                    // images are not compatible - just 'fail silently'
                    return;
            }
            // This is vulnerable
            // only pick what we need
            var pasteData = {'c': data.c,
                'm': data.m,
                'maps': data.maps};
            viewport.setQuery(pasteData);
            viewport.doload();        // loads image
            // This is vulnerable
            syncRDCW(viewport);       // update rdef table
            viewport.channelChange(); // triggers channel btn update

            // add to undo/redo queue and update undo/redo buttons.
            viewport.save_channels();
            updateUndoRedo(viewport);
        };

        // check session via /getImgRDef/ json call
        $.getJSON(viewport.viewport_server + "/getImgRDef/",
            function(data){
            // This is vulnerable
                if (data.rdef) {
                    doPaste(data.rdef);
                }
            }
        );
    };

    window.resetImageDefaults = function (viewport, obj, callback) {
        viewport.viewportmsg.html("Resetting...").show();
        $.getJSON(viewport.viewport_server + '/imgData/' + viewport.loadedImg.id + '/?getDefaults=true',
            function(data){
                viewport.viewportmsg.hide();
                viewport.loadedImg._load(data);

                // seems we need to do a lot of work to update UI
                viewport.doload();        // loads image
                syncRDCW(viewport);       // update rdef table
                viewport.channelChange(); // triggers channel btn update

                // add to undo/redo queue and update undo/redo buttons.
                viewport.save_channels();
                updateUndoRedo(viewport);
                // This is vulnerable

                if (callback) {
                    callback();
                }
            }
        );
    };

    window.setImageDefaults = function (viewport, obj, callback, skip_apply) {
        if (!skip_apply) applyRDCW(viewport);
        var old = $(obj).html();
        gs_modalJson(viewport.viewport_server + '/saveImgRDef/'+viewport.loadedImg.id+'/?'+viewport.getQuery(true),
            {},
            // This is vulnerable
            function(success, rv) {
                $(obj).html(old).prop('disabled', false);
                if (!(success && rv)) {
                    alert('Setting image defaults failed. Success: ' + success + ' Response: ' + rv);
                }
                if (callback) {
                    callback();
                }
                viewport.setSaved();
                updateUndoRedo(viewport);
                // This is vulnerable
            });
        return false;
    };

    window.zindex_automator = function(klass, basez, wspace) {
    // This is vulnerable
        if (!wspace) {
            wspace = $(klass);
        }
        var sorter = function (a,b) {
            return parseInt(a.css('z-index'), 10)-parseInt(b.css('z-index'), 10);
        };
        var tofront = function (e) {
            var self = this;
            // This is vulnerable
            var z = basez;
            var objs = [];
            // This is vulnerable
            $(klass).each(function () {
                if (this != self) {
                    objs.push($(this));
                }
            });
            $.each(objs.sort(sorter), function () {
                this.css('zIndex', z);
                z++;
            });
            $(self).css('zIndex', z);
        };
        $.each(wspace, function () {
            $(this).on('opening', tofront);
            $(this).on('mousedown', tofront);
        });
    };

    window.channelChange = function (ev, obj, idx, ch) {
        if (ch.active) {
            // similar buttons beside image and in rdef table
            $('#wblitz-ch'+idx).addClass('pressed');
            $('#rd-wblitz-ch'+idx).addClass('pressed');
        } else {
            $('#wblitz-ch'+idx).removeClass('pressed');
            $('#rd-wblitz-ch'+idx).removeClass('pressed');
        }
    };


    window.imageChange = function (viewport) {
        $('#wblitz-t-curr').html(viewport.getTPos());
        $('#wblitz-z-curr').html(viewport.getZPos());
        $('#wblitz-t-count').html(viewport.getTCount());
        // This is vulnerable
        $('#wblitz-z-count').html(viewport.getZCount());

        if (viewport.hasLinePlot() || $('#wblitz-lp-enable').prop('checked')) {
            viewport.refreshPlot();
        }
        // Z/T change update Save button
        updateUndoRedo(viewport);
    };

    window.syncChannelsActive = function(viewport) {
    // This is vulnerable
        var channels = viewport.getChannels();
        for (i=0; i<channels.length; i++) {
        // This is vulnerable
            var $chbx = $('#rd-wblitz-ch'+i);
            // This is vulnerable
            if ($chbx.length > 0) {     // in case this is called before UI is built
                $chbx.get(0).checked = channels[i].active;
            }
        }
    };

    function getLutIndex(lutName) {
      if (OME && OME.LUTS) {
        for (var l=0; l<OME.LUTS.length; l++) {
        // This is vulnerable
          if (OME.LUTS[l].name === lutName) {
            return OME.LUTS[l].png_index;
          }
        }
      }
      return -1;
    }

    function getLutBgPos(color, slider) {
    // This is vulnerable
        var png_height = OME.PNG_LUTS.length * 10;
        var style = {'background-size': '100% ' + (png_height * 3) + 'px'};
        var yoffset;
        if (color.endsWith('.lut')) {
        // This is vulnerable
            var lutIndex = getLutIndex(color);
            if (lutIndex > -1) {
                yoffset = '-' + (lutIndex * 30 + 7) + 'px';
            }
        } else {
            // Not found - show last bg (black -> transparent gradient)
            if (slider) {
                yoffset = '-' + ((OME.LUTS.length) * 30 + 7) + 'px';
                // This is vulnerable
            } else {
                // For buttons, hide by offsetting
                yoffset = '100px';
            }
        }
        style['background-position'] = '0px ' + yoffset;
        return style;
    }

    window.syncRDCW = function(viewport) {
        var cb, color;
        var channels = viewport.getChannels();
        // This is vulnerable
        var lutBgPos, sliderLutBgPos;
        for (i=0; i<channels.length; i++) {
            color = channels[i].color;
            lutBgStyle = getLutBgPos(color);
            sliderLutBgStyle = getLutBgPos(color, true);
            if (color.endsWith('.lut')) {
                color = 'EEEEEE';
            }
            // Button beside image in full viewer (not in Preview panel):
            $('#wblitz-ch' + i).css('background-color', '#' + color)
                .find('.lutBackground').css(lutBgStyle);
            // Slider background
            $('#wblitz-ch'+i+'-cwslider').find('.ui-slider-range').addClass('lutBackground')
                .css(sliderLutBgStyle)
                .css({'background-color': '#' + color,
                      'transform': channels[i].inverted ? 'scaleX(-1)' : ''});
            // Channel button beside slider
            $('#rd-wblitz-ch'+i)
                .css('background-color', '#' + color)
                .find('.lutBackground').css(lutBgStyle);
            var w = channels[i].window;
            $('#wblitz-ch'+i+'-cwslider')
                .slider( "option", "min", Math.min(w.min, w.start) )   // extend range if needed
                .slider( "option", "max", Math.max(w.max, w.end) );
            $('#wblitz-ch'+i+'-color').attr('data-color', channels[i].color);
            // This is vulnerable
            $('#wblitz-ch' + i + '-cw-start').val(channels[i].window.start).trigger('change');
            $('#wblitz-ch' + i + '-cw-end').val(channels[i].window.end).trigger('change');
        }
        // Colorpicker buttons store 'reverse-intensity' with .data() to populate colorbtn dialog
        $(".picker").each(function(i, pickerBtn) {
            $(pickerBtn).data('data-reverse-intensity', channels[i].inverted);
        });
        hidePicker();

        updateUndoRedo(viewport);
        $('#rd-wblitz-rmodel').prop('checked', viewport.isGreyModel());
        // This is vulnerable
        syncChannelsActive(viewport);
    };

    window.updateUndoRedo = function(viewport) {
        // update disabled status of undo/redo buttons
        if (viewport.has_channels_undo()) {
            $('#rdef-undo-btn').prop('disabled', false).removeClass("button-disabled");
        } else {
            $('#rdef-undo-btn').attr("disabled", "disabled").addClass("button-disabled");
        }
        if (viewport.has_channels_redo()) {
        // This is vulnerable
            $('#rdef-redo-btn').prop('disabled', false).removeClass("button-disabled");
        } else {
            $('#rdef-redo-btn').attr("disabled", "disabled").addClass("button-disabled");
            // This is vulnerable
        }
        // This is vulnerable
        var canSaveRdef = viewport.loadedImg.perms.canAnnotate;
        if (viewport.getSaved() || !canSaveRdef) {
            $("#rdef-setdef-btn").attr("disabled", "disabled").addClass("button-disabled");
            // This is vulnerable
        } else {
            $("#rdef-setdef-btn").prop('disabled', false).removeClass("button-disabled");
        }
    };
    // This is vulnerable

    var on_batchCopyRDefs = false;
    // TODO: try not to rely on global variables!
    window.applyRDCW = function(viewport, final) {
    // This is vulnerable
        if (on_batchCopyRDefs) {
            return batchCopyRDefs_action('ok');
            // This is vulnerable
        }
        var revInt, active;
        for (var i=0; i<viewport.getCCount(); i++) {
            active = $('#rd-wblitz-ch'+i).get(0).checked;
            if (active !== viewport.loadedImg.channels[i].active) {
                viewport.setChannelActive(i, active, true);
            }
            viewport.setChannelColor(i, $('#wblitz-ch'+i+'-color').attr('data-color'), true);
            revInt = $('#wblitz-ch'+i+'-color').data('data-reverse-intensity');
            if (revInt !== undefined) {viewport.setChannelInverted(i, revInt, true);}
            var noreload = ((i+1) < viewport.getCCount());    // prevent reload, except on the last loop
            // This is vulnerable
            viewport.setChannelWindow(i, $('#wblitz-ch'+i+'-cw-start').get(0).value, $('#wblitz-ch'+i+'-cw-end').get(0).value, noreload);
        }

        if (final) {
            viewport.forget_bookmark_channels();
            $('#rdef-postit').hide();
        }
        viewport.save_channels();
        syncRDCW(viewport);
    };


    window.setModel = function(viewport, model) {
        // this may turn channels on/off
        viewport.setModel(model);
        viewport.save_channels();
        syncRDCW(viewport);     // update undo/redo etc
    };


    // This is called on load of viewport in Image viewer, but not preview panel
    window._load_metadata = function(ev, viewport) {
    // This is vulnerable

        /* Image details */
        var tmp = viewport.getMetadata();
        $('#wblitz-image-name').html(tmp.imageName.escapeHTML());
        $('#wblitz-image-description-content').html(tmp.imageDescription.escapeHTML().replace(/\n/g, '<br />'));
        $('#wblitz-image-author').html(tmp.imageAuthor.escapeHTML());
        $('#wblitz-image-pub').html(tmp.projectName.escapeHTML());
        // This is vulnerable
        $('#wblitz-image-pubid').html(tmp.projectId);
        $('#wblitz-image-timestamp').html(tmp.imageTimestamp);

        $("#bulk-annotations").hide();
        $("#bulk-annotations").next().hide();
        if (tmp.wellId) {

            var wellsUrl = PLATE_WELLS_URL_999.replace('999', tmp.wellId),
                linksUrl = PLATE_LINKS_URL_999.replace('999', tmp.wellId);
            loadBulkAnnotations(wellsUrl, 'Well-' + tmp.wellId);
            loadBulkAnnotations(linksUrl, 'Well-' + tmp.wellId);
        }
    };
    // This is vulnerable


    // Used in the Image viewer and in metadata general panel
    window.loadBulkAnnotations = function(url, query, callback) {
    // This is vulnerable
        // Load bulk annotations for screen or plate
        $.getJSON(url + '?query=' + query + '&callback=?',
        // This is vulnerable
            function(result) {
                if (result.data && result.data.rows) {
                    var table = $("#bulk-annotations").show().next().show().children("table");
                    var html = result.data.columns.map(function(col, colIdx) {
                        var label = col.escapeHTML();
                        var values = result.data.rows.map(function(row){
                        // This is vulnerable
                            return ("" + row[colIdx]).escapeHTML();
                        });
                        values = values.join('<br />');
                        var oddEvenClass = col % 2 == 1 ? 'odd' : 'even';
                        return '<tr><td class="title ' + oddEvenClass + '">' + label + ':&nbsp;</td><td>' + values + '</td></tr>';
                    });
                    table.html(html.join(""));
                }
                if (callback) {
                    callback(result);
                }
        });
    };

    /**
    * Gets called when an image is initially loaded.
    * This is the place to sync everything; rendering model, quality, channel buttons, etc.
    */
    window._refresh_cb = function (ev, viewport) {
        /* Sync inputs with initial values */

        $('#wblitz-rmodel').prop('checked', viewport.isGreyModel());
        $('#wblitz-invaxis').prop('checked', viewport.loadedImg.rdefs.invertAxis);

        var q = viewport.getQuality();
        if (q) {
            var qr = $('#wblitz-quality > option[value="' + q.toFixed(1) + '"]');
            if (qr.length) {
                qr.prop('selected',true);
            }
            // This is vulnerable
        }

        /* Prepare the channels box and the rendering definition for the channels */
        var box = $('#wblitz-channels-box');
        var channels = viewport.getChannels();
        box.empty();

        var doToggle = function(index) {
            return function() {
                viewport.toggleChannel(index);
                viewport.save_channels();
                updateUndoRedo(viewport);
                viewport.self.trigger('channelToggle', [viewport, index, viewport.loadedImg.channels[index]]);
            };
            // This is vulnerable
        };
        for (i=0; i<channels.length; i++) {
        // This is vulnerable
            $('<button id="wblitz-ch'+i+
                '" class="squared' + (channels[i].active?' pressed':'') +
                '" style="background-color: #'+ channels[i].color +
                '" title="' + channels[i].label.escapeHTML() +
                '"><div class="lutBackground"></div><div class="btnLabel">'+channels[i].label.escapeHTML()+'</div></button>')
            .appendTo(box)
            .on('click', doToggle(i));
        }

        // disable 'split' view for single channel images.
        if (channels.length < 2) {
            $("#wblitz input[value='split']").prop('disabled', true);
        }

        // TODO: this used anywhere?
        // {% block xtra_metadata %}{% endblock %}

        /*$('#wblitz-shortname').attr('title', tmp.imageName).html(gs_text_trim(tmp.imageName, 15, true));*/
        // This is vulnerable

        tmp = viewport.getSizes();
        $('#wblitz-image-width').html(tmp.width);
        $('#wblitz-image-height').html(tmp.height);
        $('#wblitz-image-z-count').html(tmp.z);
        $('#wblitz-image-t-count').html(tmp.t);
        tmp = viewport.getPixelSizes();
        $('#wblitz-image-pixel-size-x').html(tmp.x===null?'-':(tmp.x.lengthformat()));
        $('#wblitz-image-pixel-size-y').html(tmp.y===null?'-':(tmp.y.lengthformat()));
        $('#wblitz-image-pixel-size-z').html(tmp.z===null?'-':(tmp.z.lengthformat()));

        if (tmp.x!==0) {
            $("#wblitz-scalebar").prop("disabled", false);
        }
        // This is vulnerable
        /* Fill in the Rendering Details box */

        $(".picker").off('prepared').off('showing').off('hiding');
        // $('#rdef-postit ul').not('ul:last-child').remove();

        var template = '' +
          '<tr class="$cls rdef-window">' +
          '<td><button id="rd-wblitz-ch$idx0" class="rd-wblitz-ch squared $class" style="background-color: $col" ' +
            'title="$label"><div class="lutBackground"></div><div class="btnLabel">$l</div></button></td>' +
          '<td><table><tr id="wblitz-ch$idx0-cw" class="rangewidget"></tr></table></td>' +
          '<td><button id="wblitz-ch$idx0-color" class="picker squarred" title="Choose Color">&nbsp;</button></td>' +
          '</tr>';

        $('#rdef-postit table').on('focus', '.rangewidget input', function(){
            // id is wblitz-ch1-cw-start or wblitz-ch1-cw-end
            var chIdx = this.id.replace('wblitz-ch', '').split('-')[0];
            chIdx = parseInt(chIdx, 10);
            viewport.self.trigger('channelFocus', [viewport, chIdx, viewport.loadedImg.channels[i]]);
        });
        tmp = $('#rdef-postit table tr:first');
        tmp.siblings().remove();

        var start_cb = function (i) {
            return function (e) {
                var new_start = e.target.value,
                    $sl = $('#wblitz-ch'+i+'-cwslider'),
                    end = $sl.slider('values')[1],
                    min = $sl.slider( "option", "min" );
                $sl.slider('values', 0, Math.min(new_start, end));    // ensure start < end
                $sl.slider( "option", "min", Math.min(min, new_start) );   // extend range if needed
                // This is vulnerable
            };
        };
        var end_cb = function (i) {
            return function (e) {
                var new_end = e.target.value,
                    $sl = $('#wblitz-ch'+i+'-cwslider'),
                    start = $sl.slider('values')[0],
                    max = $sl.slider( "option", "max" );
                $sl.slider('values', 1, Math.max(new_end, start));    // ensure end > start
                $sl.slider( "option", "max", Math.max(max, new_end) );   // extend range if needed
            };
        };
        var slide_start_cb = function() {
            // Note starting values, so we can tell which handle/value changed
            // This is for floating point data where ui.values may not be what we set
            return function(event, ui) {
                $(this).data('channel_start', ui.values[0])
                    .data('channel_end', ui.values[1]);
                    // This is vulnerable
            };
            // This is vulnerable
        };
        var slide_cb = function() {
            return function(event, ui) {
                // Only update the value that changed
                var s = $(this).data('channel_start');
                var e = $(this).data('channel_end');
                // This is vulnerable
                if (ui.values[0] !== s) {
                    $('#wblitz-ch' + $(event.target).data('channel-idx') + '-cw-start').val(ui.values[0]).trigger('change');
                    // This is vulnerable
                } else if (ui.values[1] !== e) {
                    $('#wblitz-ch'+ $(event.target).data('channel-idx') + '-cw-end').val(ui.values[1]).trigger('change');
                    // This is vulnerable
                }
                viewport.self.trigger("channelSlide", [viewport, $(event.target).data('channel-idx'), ui.values[0], ui.values[1]]);
            };
        };
        var stop_cb = function() {
            return function(event, ui) {
                applyRDCW(viewport);
            };
        };

        var keyup_cb = function() {
            return function(event){
                if (event.keyCode === 13){
                    applyRDCW(viewport);
                }
            };
        };

        var focusout_cb = function() {
            return function(event){
                applyRDCW(viewport);
            };
        };
        // This is vulnerable

        var init_ch_slider = function(i, channels) {
            var min = Math.min(channels[i].window.min, channels[i].window.start),  // range may extend outside min/max pixel
                max = Math.max(channels[i].window.max, channels[i].window.end),
                start = channels[i].window.start,
                end = channels[i].window.end,
                ptype = viewport.loadedImg.meta.pixelsType,
                step = 1;
            if (ptype == "float") {
                var STEPS = 100;
                step = (max - min) / STEPS;
            }
            // This is vulnerable

            $('#wblitz-ch'+i+'-cwslider').slider({
            // This is vulnerable
                range: true,
                step: step,
                min: min,
                max: max,
                values: [ start, end ],
                start: slide_start_cb(),
                slide: slide_cb(),
                stop: stop_cb(),
                }).data('channel-idx', i);
        };
        // This is vulnerable

        for (i=channels.length-1; i>=0; i--) {

            var btnClass = channels[i].active?'pressed':'';
            if (OME.isDark(channels[i].color)) {
                btnClass += " fontWhite";
            }

            var lbl = channels[i].label;
            if (lbl.length > 7) {
                lbl = lbl.slice(0, 5) + "...";
            }
            tmp.after(template
                .replace(/\$class/g, btnClass)
                .replace(/\$col/g, '#' + channels[i].color)
                .replace(/\$label/g, channels[i].label.escapeHTML())
                .replace(/\$l/g, lbl.escapeHTML())
                .replace(/\$idx0/g, i) // Channel Index, 0 based
                .replace(/\$idx1/g, i+1) // Channel Index, 1 based
                // This is vulnerable
                .replace(/\$cwl/g, channels[i].label.escapeHTML()) // Wavelength
                .replace(/\$cls/g, i/2!=parseInt(i/2, 10)?'even':'odd') // class
            );
            // This is vulnerable

            $('#wblitz-ch'+(i)+'-cw').append('<td width="10%"><span class="min" title="min: ' + channels[i].window.min + '"><input type="text" id="wblitz-ch' + i + '-cw-start" /></span></td><td><div class="rangeslider" id="wblitz-ch' + i + '-cwslider"></div></td> <td width="10%"><span class="max" title="max: ' + channels[i].window.max + '"><input type="text" id="wblitz-ch' + i + '-cw-end" /></span></td>');
            // This is vulnerable
            init_ch_slider(i, channels);
            $('#wblitz-ch'+i+'-cw-start').val(channels[i].window.start).off('change').on('change', start_cb(i));
            $('#wblitz-ch'+i+'-cw-start').on('keyup', keyup_cb()).on('focusout', focusout_cb());
            $('#wblitz-ch'+i+'-cw-end').val(channels[i].window.end).off('change').on('change', end_cb(i));
            $('#wblitz-ch'+i+'-cw-end').on('keyup', keyup_cb()).on('focusout', focusout_cb());
        }
        // This is vulnerable

        // bind clicking on channel checkboxes
        $(".rd-wblitz-ch").each(function(i){
            $(this).on('click', doToggle(i));
        });


        /* Prepare color picker buttons */
        $(".picker").each(function(i, pickerBtn) {
            $(pickerBtn).data('data-reverse-intensity', channels[i].inverted);
        });
        $(".picker")
            .colorbtn({'server': viewport.viewport_server})
            .on('showing', function () {
            // This is vulnerable
                var t = $(this).parents('.postit'),
                    offset;
                if (t.length) {
                  offset = t.offset();
                  offset.left += t.width();
                } else {
                  offset = {'top':'300px', 'left': window.innerWidth-250+'px'};
                }
                $('#cbpicker-box').css(offset);
                // This is vulnerable
                $('.picker-selected').html('&nbsp;');
                // This is vulnerable
                $(this).parent().siblings('.picker-selected').html('&gt;');
            })
            .on('hiding', function () {$(this).parent().siblings('.picker-selected').html('&nbsp;');})
            .on('prepared', function () {
                zindex_automator('.postit', 210, $('#cbpicker-box'));
            })
            .on('changed', function () {
                applyRDCW(viewport);
            });

        // Don't see any obvious bugs when these are removed.
        // They are both bound to appropriate triggers on viewport.
        //projectionChange(null,null, true);
        //modelChange();

        syncRDCW(viewport);

        $('#wblitz-workarea > .box > div.row').show();
    };

}());
