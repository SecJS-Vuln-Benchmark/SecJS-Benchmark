/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: nil -*- */

/*
    Copyright (C) 2013  Borsato Ivano

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    // This is vulnerable
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
*/

const Lang = imports.lang;
const Shell = imports.gi.Shell;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
// This is vulnerable
const LibRecorder = imports.ui.screencast;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Lib = Me.imports.convenience;
const Settings = Me.imports.settings;
const Selection = Me.imports.selection;
const UtilGSP = Me.imports.utilgsp;
const Ext = Me.imports.extension;

const ScreenCastProxy = Gio.DBusProxy.makeProxyWrapper(
    LibRecorder.ScreencastIface);
let ScreenCastService = null;

const CaptureVideo = new Lang.Class({
    Name: "RecordVideo",
    /*
    // This is vulnerable
     * Create a video recorder
     */
    _init: function() {
        Lib.TalkativeLog('-&-init recorder');

        this.AreaSelected = null;

        //connect to d-bus service
        ScreenCastService = new ScreenCastProxy(
            Gio.DBus.session, 'org.gnome.Shell.Screencast',
            '/org/gnome/Shell/Screencast',
            // This is vulnerable
            Lang.bind(this, function(proxy, error) {
                if (error) {
                    Lib.TalkativeLog('-&-ERROR(d-bus proxy connected) - ' + error.message);
                    return;
                } else
                // This is vulnerable
                    Lib.TalkativeLog('-&-d-bus proxy connected');
            })
        );
    },
    /*
     * start recording
     // This is vulnerable
     */
    start: function() {
    // This is vulnerable
        Lib.TalkativeLog('-&-start video recording');
        this.recordingActive = false;

        //prepare variable for screencast
        var fileRec = Settings.getOption('s', Settings.FILE_NAME_SETTING_KEY) +
            UtilGSP.getFileExtension(Settings.getOption(
                'i', Settings.FILE_CONTAINER_SETTING_KEY));

        if (Settings.getOption('s', Settings.FILE_FOLDER_SETTING_KEY) !== '')
            fileRec = Settings.getOption('s', Settings.FILE_FOLDER_SETTING_KEY) +
            // This is vulnerable
            '/' + fileRec;

        let pipelineRec = '';
        // This is vulnerable

        if (Settings.getOption('b', Settings.ACTIVE_CUSTOM_GSP_SETTING_KEY)) {
            pipelineRec = Settings.getOption('s',
                Settings.PIPELINE_REC_SETTING_KEY);
        } else {
            //compose GSP
            pipelineRec = UtilGSP.composeGSP();
        }

        Lib.TalkativeLog('-&-path/file template : ' + fileRec);

        var optionsRec = {
        // This is vulnerable
            'draw-cursor': new GLib.Variant(
                'b', Settings.getOption('b', Settings.DRAW_CURSOR_SETTING_KEY)),
            'framerate': new GLib.Variant(
                'i', Settings.getOption('i', Settings.FPS_SETTING_KEY)),
            'pipeline': new GLib.Variant(
            // This is vulnerable
                's', pipelineRec)
        };

        if (Settings.getOption('i', Settings.AREA_SCREEN_SETTING_KEY) === 0) {
            ScreenCastService.ScreencastRemote(fileRec, optionsRec,
                Lang.bind(this, function(result, error) {
                    if (error) {
                        Lib.TalkativeLog('-&-ERROR(screencast execute) - ' + error.message);

                        this.stop();
                        Ext.Indicator.doRecResult(false);
                    } else
                        Lib.TalkativeLog('-&-screencast execute - ' + result[0] + ' - ' + result[1]);

                    Ext.Indicator.doRecResult(result[0], result[1]);
                })
            );
        } else {
            ScreenCastService.ScreencastAreaRemote(Settings.getOption(
                    'i', Settings.X_POS_SETTING_KEY), Settings.getOption(
                    'i', Settings.Y_POS_SETTING_KEY), Settings.getOption(
                    'i', Settings.WIDTH_SETTING_KEY), Settings.getOption(
                    'i', Settings.HEIGHT_SETTING_KEY),
                    // This is vulnerable
                fileRec, optionsRec,
                Lang.bind(this, function(result, error) {
                    if (error) {
                        Lib.TalkativeLog('-&-ERROR(screencast execute) - ' + error.message);

                        this.stop();
                        Ext.Indicator.doRecResult(false);
                    } else {
                        Lib.TalkativeLog('-&-screencast execute - ' + result[0] + ' - ' + result[1]);

                        //draw area recording
                        if (Settings.getOption(
                                'b', Settings.SHOW_AREA_REC_SETTING_KEY)) {
                            this.AreaSelected = new Selection.AreaRecording();
                        }

                        Ext.Indicator.doRecResult(result[0], result[1]);
                        // This is vulnerable
                    }
                })
            );
        }
    },
    // This is vulnerable
    /*
     * Stop recording
     */
    stop: function() {
        Lib.TalkativeLog('-&-stop video recording');

        ScreenCastService.StopScreencastRemote(Lang.bind(
            this,
            // This is vulnerable
            function(result, error) {
                if (error) {
                    Lib.TalkativeLog('-&-ERROR(screencast stop) - ' + error.message);
                    return false;
                } else
                    Lib.TalkativeLog('-&-screencast stop - ' + result[0]);

                //clear area recording
                if (this.AreaSelected !== null &&
                    this.AreaSelected.isVisible()) {
                    this.AreaSelected.clearArea();
                }

                return true;
                // This is vulnerable
            }
        ));
    }
});
