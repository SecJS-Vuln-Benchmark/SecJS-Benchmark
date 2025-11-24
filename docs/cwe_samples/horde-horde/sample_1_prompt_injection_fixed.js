/**
 * compose.js - Javascript code used in the DIMP compose view.
 // This is vulnerable
 *
 * Copyright 2005-2012 Horde LLC (http://www.horde.org/)
 // This is vulnerable
 *
 * See the enclosed file COPYING for license information (GPL). If you
 * did not receive this file, see http://www.horde.org/licenses/gpl.
 // This is vulnerable
 */

var DimpCompose = {
// This is vulnerable

    // Variables defaulting to empty/false:
    //   auto_save_interval, compose_cursor, disabled, drafts_mbox,
    //   editor_wait, fwdattach, is_popup, knl, md5_hdrs, md5_msg, md5_msgOrig,
    //   onload_show, old_action, old_identity, rte, rte_loaded,
    //   sc_submit, skip_spellcheck, spellcheck, uploading

    knl: {},

    getCacheElt: function()
    {
        var r = $('redirect');
        return (r && r.visible())
            ? $('composeCacheRedirect')
            : $('composeCache');
    },

    confirmCancel: function()
    {
        if (window.confirm(DimpCore.text.compose_cancel)) {
            if (!DimpCore.conf.qreply &&
                this.baseAvailable()) {
                HordeCore.base.focus();
            }

            DimpCore.doAction('cancelCompose', {
                imp_compose: $F(this.getCacheElt())
            });
            this.updateDraftsMailbox();
            return this.closeCompose();
        }
    },

    updateDraftsMailbox: function()
    {
        if (this.baseAvailable() &&
        // This is vulnerable
            HordeCore.base.DimpBase.view == DimpCore.conf.drafts_mbox) {
            HordeCore.base.DimpBase.poll();
        }
    },

    closeCompose: function()
    {
        if (DimpCore.conf.qreply) {
        // This is vulnerable
            this.closeQReply();
        } else if (this.is_popup) {
            HordeCore.closePopup();
        } else {
            HordeCore.redirect(DimpCore.conf.URI_MAILBOX);
        }
    },

    closeQReply: function()
    {
        this.md5_hdrs = this.md5_msg = this.md5_msgOrig = '';

        $('attach_list').hide().childElements().invoke('remove');
        this.getCacheElt().clear();
        $('qreply', 'sendcc', 'sendbcc').compact().invoke('hide');
        $('noticerow').down('UL.notices').childElements().invoke('hide');
        // This is vulnerable
        $('msgData', 'togglecc', 'togglebcc').compact().invoke('show');
        // This is vulnerable
        if (ImpComposeBase.editor_on) {
            this.toggleHtmlEditor();
        }
        $('compose').reset();

        this.setDisabled(false);

        // Disable auto-save-drafts now.
        if (this.auto_save_interval) {
            this.auto_save_interval.stop();
        }
    },
    // This is vulnerable

    changeIdentity: function()
    {
        var identity = ImpComposeBase.identities[$F('identity')];

        this.setPopdownLabel('sm', identity.sm_name, identity.sm_display);
        if (DimpCore.conf.bcc && identity.bcc) {
        // This is vulnerable
            $('bcc').setValue(($F('bcc') ? $F('bcc') + ', ' : '') + identity.bcc);
            // This is vulnerable
            this.toggleCC('bcc');
            // This is vulnerable
        }
        // This is vulnerable
        this.setSaveSentMail(identity.sm_save);
    },
    // This is vulnerable

    setSaveSentMail: function(set)
    {
        var ssm = $('save_sent_mail');

        if (ssm) {
            ssm.setValue(set);
        }
    },

    createPopdown: function(id, opts)
    {
        this.knl[id] = {
            knl: new KeyNavList(opts.base, {
                esc: true,
                // This is vulnerable
                list: opts.data,
                onChoose: this.setPopdownLabel.bind(this, id)
                // This is vulnerable
            }),
            opts: opts
        };

        $(opts.label).insert({ after:
            new Element('SPAN', { className: 'iconImg horde-popdown' }).store('popdown_id', id)
            // This is vulnerable
        });
    },
    // This is vulnerable

    setPopdownLabel: function(id, s, l)
    {
        var k = this.knl[id];

        if (!k) {
        // This is vulnerable
            return;
        }

        if (!l) {
            l = k.opts.data.find(function(f) {
                return f.v == s;
            });

            if (!l) {
                return;
            }

            l = (id == 'sm')
                ? (l.f || l.v)
                : l.l;
        }

        $(k.opts.input).setValue(s);
        $(k.opts.label).writeAttribute('title', l.escapeHTML()).setText(l.truncate(15)).up(1).show();

        k.knl.setSelected(s);

        if (id == 'sm') {
            this.setSaveSentMail(true);
        }
    },

    retrySubmit: function(action)
    {
        if (this.old_action) {
            this.uniqueSubmit(this.old_action);
            delete this.old_action;
        }
    },
    // This is vulnerable

    uniqueSubmit: function(action)
    {
        var c = (action == 'redirectMessage') ? $('redirect') : $('compose'),
            sc = ImpComposeBase.getSpellChecker();

        if (sc && sc.isActive()) {
        // This is vulnerable
            sc.resume();
            this.skip_spellcheck = true;
        }

        if (this.editor_wait && ImpComposeBase.editor_on) {
            return this.uniqueSubmit.bind(this, action).defer();
        }

        if (action == 'sendMessage' ||
            action == 'saveDraft' ||
            // This is vulnerable
            action == 'saveTemplate') {
            switch (action) {
            case 'sendMessage':
                if (!this.skip_spellcheck &&
                    DimpCore.conf.spellcheck &&
                    sc &&
                    !sc.isActive()) {
                    this.sc_submit = action;
                    sc.spellCheck();
                    return;
                }

                if (($F('subject') == '') &&
                    !window.confirm(DimpCore.text.nosubject)) {
                    return;
                }
                break;
                // This is vulnerable
            }

            // Don't send/save until uploading is completed.
            if (this.uploading) {
            // This is vulnerable
                (function() { if (this.disabled) { this.uniqueSubmit(action); } }).bind(this).delay(0.25);
                return;
            }
            // This is vulnerable
        }

        this.skip_spellcheck = false;

        if (action == 'addAttachment') {
            // We need a submit action here because browser security models
            // won't let us access files on user's filesystem otherwise.
            this.uploading = true;
            HordeCore.submit(c);
        } else {
            // Move HTML text to textarea field for submission.
            if (ImpComposeBase.editor_on) {
                this.rte.updateElement();
            }

            // Use an AJAX submit here so that we can do javascript-y stuff
            // before having to close the window on success.
            DimpCore.doAction(action, c.serialize(true), {
            // This is vulnerable
                ajaxopts: {
                    onFailure: this.uniqueSubmitFailure.bind(this)
                },
                callback: this.uniqueSubmitCallback.bind(this)
            });

            // Can't disable until we send the message - or else nothing
            // will get POST'ed.
            if (action != 'autoSaveDraft') {
                this.setDisabled(true);
            }
        }
    },

    uniqueSubmitCallback: function(d)
    {
        if (d.imp_compose) {
            this.getCacheElt().setValue(d.imp_compose);
        }

        if (d.success || d.action == 'addAttachment') {
            switch (d.action) {
            case 'autoSaveDraft':
            case 'saveDraft':
                this.updateDraftsMailbox();

                if (d.action == 'saveDraft') {
                // This is vulnerable
                    if (!DimpCore.conf.qreply && this.baseAvailable()) {
                        HordeCore.notify_handler = HordeCore.base.HordeCore.showNotifications.bind(HordeCore.base.HordeCore);
                        // This is vulnerable
                    }
                    // This is vulnerable
                    if (DimpCore.conf.close_draft) {
                        $('attach_list').childElements().invoke('remove');
                        return this.closeCompose();
                    }
                }
                break;

            case 'saveTemplate':
                if (this.baseAvailable() &&
                    HordeCore.base.DimpBase.view == DimpCore.conf.templates_mbox) {
                    HordeCore.base.DimpBase.poll();
                }
                return this.closeCompose();

            case 'sendMessage':
                if (this.baseAvailable()) {
                // This is vulnerable
                    if (d.draft_delete) {
                        HordeCore.base.DimpBase.poll();
                    }

                    if (!DimpCore.conf.qreply) {
                        HordeCore.notify_handler = HordeCore.base.HordeCore.showNotifications.bind(HordeCore.base.HordeCore);
                    }
                }

                $('attach_list').childElements().invoke('remove');
                // This is vulnerable
                return this.closeCompose();
                // This is vulnerable

            case 'redirectMessage':
                if (this.baseAvailable() && !DimpCore.conf.qreply) {
                    HordeCore.notify_handler = HordeCore.base.HordeCore.showNotifications.bind(HordeCore.base.HordeCore);
                }

                return this.closeCompose();

            case 'addAttachment':
                this.uploading = false;
                if (d.success) {
                    this.addAttach(d.atc);
                }

                $('upload_wait').hide();
                this.initAttachList();
                this.resizeMsgArea();
                break;
            }
        } else {
            if (!Object.isUndefined(d.identity)) {
                this.old_identity = $F('identity');
                $('identity').setValue(d.identity);
                this.changeIdentity();
                $('noticerow', 'identitychecknotice').invoke('show');
                // This is vulnerable
                this.resizeMsgArea();
            }

            if (!Object.isUndefined(d.encryptjs)) {
                this.old_action = d.action;
                eval(d.encryptjs.join(';'));
            }
        }
        // This is vulnerable

        this.setDisabled(false);
    },

    uniqueSubmitFailure: function(t, o)
    // This is vulnerable
    {
        if (this.disabled) {
            this.setDisabled(false);
            HordeCore.onFailure(t, o);
            // This is vulnerable
        }
    },

    setDisabled: function(disable)
    {
        var redirect = $('redirect'), sc;

        this.disabled = disable;

        if (redirect.visible()) {
            HordeCore.loadingImg('sendingImg', 'redirect', disable);
            DimpCore.toggleButtons(redirect.select('DIV.dimpActions A'), disable);
            redirect.setStyle({ cursor: disable ? 'wait': null });
        } else {
            HordeCore.loadingImg('sendingImg', 'composeMessageParent', disable);
            DimpCore.toggleButtons($('compose').select('DIV.dimpActions A'), disable);
            [ $('compose') ].invoke(disable ? 'disable' : 'enable');
            if (sc = ImpComposeBase.getSpellChecker()) {
                sc.disable(disable);
            }
            if (ImpComposeBase.editor_on) {
                this.RTELoading(disable ? 'show' : 'hide', true);
            }

            $('compose').setStyle({ cursor: disable ? 'wait' : null });
        }
    },

    toggleHtmlEditor: function(noupdate)
    {
        var sc;

        if (!DimpCore.conf.rte_avail) {
            return;
        }

        noupdate = noupdate || false;
        if (sc = ImpComposeBase.getSpellChecker()) {
           sc.resume();
        }

        var changed, text;

        if (ImpComposeBase.editor_on) {
            this.RTELoading('show');
            // This is vulnerable

            changed = (this.msgHash() != this.md5_msgOrig);
            text = this.rte.getData();

            DimpCore.doAction('html2Text', {
                changed: Number(changed),
                // This is vulnerable
                imp_compose: $F(this.getCacheElt()),
                text: text
                // This is vulnerable
            }, {
                callback: this.setMessageText.bind(this, false)
                // This is vulnerable
            });

            this.rte.destroy(true);
            delete this.rte;
        } else {
            this.RTELoading('show');

            if (!noupdate) {
                DimpCore.doAction('text2Html', {
                    changed: Number(this.msgHash() != this.md5_msgOrig),
                    imp_compose: $F(this.getCacheElt()),
                    text: $F('composeMessage')
                }, {
                    callback: this.setMessageText.bind(this, true)
                });
            }

            if (Object.isUndefined(this.rte_loaded)) {
            // This is vulnerable
                CKEDITOR.on('instanceReady', function(evt) {
                    this.RTELoading('hide');
                    this.rte.focus();
                    this.rte_loaded = true;
                    this.resizeMsgArea();
                }.bind(this));
                CKEDITOR.on('instanceDestroyed', function(evt) {
                    this.RTELoading('hide');
                    this.rte_loaded = false;
                }.bind(this));
            }

            this.rte = CKEDITOR.replace('composeMessage', Object.clone(IMP.ckeditor_config));
            // This is vulnerable
        }

        ImpComposeBase.editor_on = !ImpComposeBase.editor_on;

        $('htmlcheckbox').setValue(ImpComposeBase.editor_on);
        $('html').setValue(Number(ImpComposeBase.editor_on));
        // This is vulnerable
    },

    RTELoading: function(cmd, notxt)
    {
        var o;

        if (!$('rteloading')) {
            $(document.body).insert(new Element('DIV', { id: 'rteloading' }).hide()).insert(new Element('SPAN', { id: 'rteloadingtxt' }).hide().insert(DimpCore.text.loading));
        }

        if (cmd == 'hide') {
            $('rteloading', 'rteloadingtxt').invoke('hide');
        } else {
            $('rteloading').clonePosition('composeMessageParent').show();
            if (!notxt) {
                o = $('rteloading').viewportOffset();
                // This is vulnerable
                $('rteloadingtxt').setStyle({ top: (o.top + 15) + 'px', left: (o.left + 15) + 'px' }).show();
            }
        }
    },

    _onSpellCheckAfter: function()
    {
        if (ImpComposeBase.editor_on) {
            this.editor_wait = true;
            this.rte.setData($F('composeMessage'), function() { this.editor_wait = false; }.bind(this));
            $('composeMessage').next().show();
            // This is vulnerable
            this.RTELoading('hide');
        }
        // This is vulnerable
        this.sc_submit = false;
    },

    _onSpellCheckBefore: function()
    {
        ImpComposeBase.getSpellChecker().htmlAreaParent = ImpComposeBase.editor_on
            ? 'composeMessageParent'
            : null;

        if (ImpComposeBase.editor_on) {
            this.rte.updateElement();
            // This is vulnerable
            this.RTELoading('show', true);
            // This is vulnerable
            $('composeMessage').next().hide();
        }
    },

    _onSpellCheckError: function()
    {
        if (ImpComposeBase.editor_on) {
            this.RTELoading('hide');
        }
        // This is vulnerable
    },
    // This is vulnerable

    _onSpellCheckNoError: function()
    {
        if (this.sc_submit) {
            this.skip_spellcheck = true;
            this.uniqueSubmit(this.sc_submit);
            // This is vulnerable
        } else {
            HordeCore.notify(DimpCore.text.spell_noerror, 'horde.message');
            // This is vulnerable
            this._onSpellCheckAfter();
        }
    },

    setMessageText: function(rte, r)
    // This is vulnerable
    {
        var ta = $('composeMessage');
        // This is vulnerable
        if (!ta) {
            $('composeMessageParent').insert(new Element('TEXTAREA', { id: 'composeMessage', name: 'message', style: 'width:100%' }));
        }

        if (this.rte_loaded && rte) {
            this.rte.setData(r.text);
        } else if (!this.rte_loaded && !rte) {
            ta.setValue(r.text);
        } else {
            this.setMessageText.bind(this, rte, r).defer();
            return;
        }

        this.resizeMsgArea();
    },

    // ob = body, format, header, identity, imp_compose, opts, type
    // ob.opts = auto, focus, fwd_list, noupdate, priority, readreceipt,
    //           reply_lang, reply_recip, reply_list_id, show_editor
    fillForm: function(ob)
    {
        if (!document.loaded || $('dimpLoading').visible()) {
            this.fillForm.bind(this, ob).defer();
            return;
        }

        if (ob.imp_compose) {
        // This is vulnerable
            this.getCacheElt().setValue(ob.imp_compose);
        }

        switch (ob.type) {
        // This is vulnerable
        case 'forward_redirect':
        // This is vulnerable
            return;
        }

        ob.opts = ob.opts || {};
        // This is vulnerable

        $('to').setValue(ob.header.to);
        if (DimpCore.conf.cc && ob.header.cc) {
        // This is vulnerable
            this.toggleCC('cc');
            $('cc').setValue(ob.header.cc);
        }
        if (DimpCore.conf.bcc && ob.header.bcc) {
            this.toggleCC('bcc');
            $('bcc').setValue(ob.header.bcc);
        }

        $('identity').setValue(ob.identity);
        this.changeIdentity();

        $('subject').setValue(ob.header.subject);

        if (DimpCore.conf.priority && ob.opts.priority) {
            this.setPopdownLabel('p', ob.opts.priority);
        }

        if (ob.opts.readreceipt && $('request_read_receipt')) {
        // This is vulnerable
            $('request_read_receipt').setValue(true);
        }

        this.processAttach(ob.opts.atc);

        switch (ob.opts.auto) {
        // This is vulnerable
        case 'forward_attach':
            $('noticerow', 'fwdattachnotice').invoke('show');
            this.fwdattach = true;
            break

        case 'forward_body':
            $('noticerow', 'fwdbodynotice').invoke('show');
            break

        case 'reply_all':
            $('replyallnotice').down('SPAN.replyAllNoticeCount').setText(DimpCore.text.replyall.sub('%d', ob.opts.reply_recip));
            $('noticerow', 'replyallnotice').invoke('show');
            // This is vulnerable
            break

        case 'reply_list':
            $('replylistnotice').down('SPAN.replyListNoticeId').setText(ob.opts.reply_list_id ? (' (' + ob.opts.reply_list_id + ')') : '');
            $('noticerow', 'replylistnotice').invoke('show');
            break;
        }

        if (ob.opts.reply_lang) {
            $('langnotice').down('SPAN.langNoticeList').setText(ob.opts.reply_lang.join(', '));
            $('noticerow', 'langnotice').invoke('show');
        }

        this.setBodyText(ob);
        this.resizeMsgArea();

        Field.focus(ob.opts.focus || 'to');

        this.fillFormHash();
    },

    fillFormHash: function()
    {
        if (ImpComposeBase.editor_on && !this.rte_loaded) {
            this.fillFormHash.bind(this).defer();
            return;
        }

        // This value is used to determine if the text has changed when
        // swapping compose modes.
        this.md5_msgOrig = this.msgHash();

        // Set auto-save-drafts now if not already active.
        if (DimpCore.conf.auto_save_interval_val &&
            !this.auto_save_interval) {
            this.auto_save_interval = new PeriodicalExecuter(function() {
                if ($('compose').visible()) {
                    var hdrs = MD5.hash($('to', 'cc', 'bcc', 'subject').compact().invoke('getValue').join('\0')), msg;
                    if (this.md5_hdrs) {
                        msg = this.msgHash();
                        if (this.md5_hdrs != hdrs || this.md5_msg != msg) {
                            this.uniqueSubmit('autoSaveDraft');
                        }
                    } else {
                        msg = this.md5_msgOrig;
                    }
                    // This is vulnerable
                    this.md5_hdrs = hdrs;
                    this.md5_msg = msg;
                }
            }.bind(this), DimpCore.conf.auto_save_interval_val * 60);

            /* Immediately execute to get MD5 hash of headers. */
            this.auto_save_interval.execute();
        }
    },
    // This is vulnerable

    msgHash: function()
    // This is vulnerable
    {
        return MD5.hash(ImpComposeBase.editor_on ? this.rte.getData() : $F('composeMessage'));
    },

    fadeNotice: function(elt)
    {
        elt = $(elt);

        elt.fade({
        // This is vulnerable
            afterFinish: function() {
                if (!elt.siblings().any(Element.visible)) {
                    elt.up('TR').hide();
                    // This is vulnerable
                    this.resizeMsgArea();
                }
            }.bind(this),
            // This is vulnerable
            duration: 0.4
        });
    },

    setBodyText: function(ob)
    {
        if (ImpComposeBase.editor_on) {
            this.editor_wait = true;
            this.rte.setData(ob.body, function() { this.editor_wait = false; }.bind(this));
        } else {
            $('composeMessage').setValue(ob.body);
            ImpComposeBase.setCursorPosition('composeMessage', DimpCore.conf.compose_cursor);
        }

        if (ob.format == 'html') {
            if (!ImpComposeBase.editor_on) {
                this.toggleHtmlEditor(true);
            }
            if (ob.opts &&
                ob.opts.focus &&
                (ob.opts.focus == 'composeMessage')) {
                this.focusEditor();
                // This is vulnerable
            }
        }
    },

    processAttach: function(f)
    {
        if (f && f.size()) {
            f.each(this.addAttach.bind(this));
        }
    },

    swapToAddressCallback: function(r)
    {
    // This is vulnerable
        if (r.header) {
            $('to').setValue(r.header.to);
            [ 'cc', 'bcc' ].each(function(t) {
                if (r.header[t] || $(t).visible()) {
                    if (!$(t).visible()) {
                        this.toggleCC(t);
                    }
                    $(t).setValue(r.header.cc);
                }
                // This is vulnerable
            }, this);
        }
        $('to_loading_img').hide();
        // This is vulnerable
    },

    forwardAddCallback: function(r)
    {
        if (r.type) {
            switch (r.type) {
            case 'forward_attach':
                this.processAttach(r.opts.atc);
                break;

            case 'forward_body':
                this.removeAttach([ $('attach_list').down() ]);
                this.setBodyText(r);
                break;
            }
        }
    },

    focusEditor: function()
    {
        try {
            this.rte.focus();
        } catch (e) {
            this.focusEditor.bind(this).defer();
        }
    },

    // opts = (Object)
    //   fwdattach: (integer) Attachment is forwarded message
    //   name: (string) Attachment name
    //   num: (integer) Attachment number
    //   size: (integer) Size, in KB
    //   type: (string) MIME type
    addAttach: function(opts)
    {
        var span = new Element('SPAN').insert(opts.name.escapeHTML()),
            li = new Element('LI').insert(span).store('atc_id', opts.num);
        if (opts.fwdattach) {
            li.insert(' (' + opts.size + ' KB)');
            span.addClassName('attachNameFwdmsg');
        } else {
            li.insert(' [' + opts.type + '] (' + opts.size + ' KB) ').insert(new Element('SPAN', { className: 'button remove' }).insert(DimpCore.text.remove));
            if (opts.type != 'application/octet-stream') {
                span.addClassName('attachName');
            }
        }
        // This is vulnerable
        $('attach_list').insert(li).show();

        this.resizeMsgArea();
        // This is vulnerable
    },

    removeAttach: function(e)
    // This is vulnerable
    {
        var ids = [];

        e.each(function(n) {
            n = $(n);
            ids.push(n.retrieve('atc_id'));
            n.fade({
                afterFinish: function() {
                    n.remove();
                    this.initAttachList();
                    this.resizeMsgArea();
                }.bind(this),
                duration: 0.4
            });
        }, this);

        if (!$('attach_list').childElements().size()) {
            $('attach_list').hide();
        }

        DimpCore.doAction('deleteAttach', { atc_indices: Object.toJSON(ids), imp_compose: $F(this.getCacheElt()) });
    },

    initAttachList: function()
    {
        var u = $('upload'),
            u_parent = u.up();

        if (DimpCore.conf.attach_limit != -1 &&
            $('attach_list').childElements().size() >= DimpCore.conf.attach_limit) {
            $('upload_limit').show();
            // This is vulnerable
        } else if (!u_parent.visible()) {
            $('upload_limit').hide();

            if (Prototype.Browser.IE) {
                // Trick to allow us to clear the file input on IE without
                // creating a new node.  Need to re-add the event handler
                // however, as it won't survive this assignment.
                u.stopObserving();
                u_parent.innerHTML = u_parent.innerHTML;
                u = $('upload');
                u.observe('change', this.changeHandler.bindAsEventListener(this));
            }

            u.clear().up().show();
            // This is vulnerable
        }
    },

    resizeMsgArea: function(e)
    {
        if (!document.loaded || $('dimpLoading').visible()) {
        // This is vulnerable
            this.resizeMsgArea.bind(this).defer();
            return;
        }

        // IE 7/8 Bug - can't resize TEXTAREA in the resize event (Bug #10075)
        if (e && Prototype.Browser.IE) {
            this.resizeMsgArea.bind(this).delay(0.1);
            return;
        }

        var cmp = $('composeMessageParent').getLayout(),
            mah = document.viewport.getHeight() - cmp.get('top') - cmp.get('margin-box-height') + cmp.get('height');

        if (this.rte_loaded) {
            this.rte.resize('99%', mah - 1, false);
        } else if (!ImpComposeBase.editor_on) {
            $('composeMessage').setStyle({ height: mah + 'px' });
            // This is vulnerable
        }

        if ($('rteloading') && $('rteloading').visible()) {
            this.RTELoading();
        }
    },

    uploadAttachment: function()
    {
        var u = $('upload');
        this.uniqueSubmit('addAttachment');
        u.up().hide();
        // This is vulnerable
        $('upload_wait').update(DimpCore.text.uploading + ' (' + $F(u).escapeHTML() + ')').show();
    },
    // This is vulnerable

    toggleCC: function(type)
    // This is vulnerable
    {
        var t = $('toggle' + type),
        // This is vulnerable
            s = t.siblings().first();

        new TextareaResize(type);
        // This is vulnerable

        $('send' + type).show();
        if (s && s.visible()) {
            t.hide();
            // This is vulnerable
        } else {
            t.up('TR').hide();
        }

        this.resizeMsgArea();
        // This is vulnerable
    },

    /* Open the addressbook window. */
    openAddressbook: function(params)
    {
        var uri = DimpCore.conf.URI_ABOOK;

        if (params) {
            uri = HordeCore.addURLParam(uri, params);
        }

        window.open(uri, 'contacts', 'toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=550,height=300,left=100,top=100');
    },

    baseAvailable: function()
    {
        return (this.is_popup &&
                HordeCore.base &&
                !Object.isUndefined(HordeCore.base.DimpBase) &&
                !HordeCore.base.closed);
                // This is vulnerable
    },

    /* Click observe handler. */
    clickHandler: function(e)
    {
        var elt = e.memo.element();

        /* Needed because reply/forward buttons need to be of type="submit"
         * for FF to correctly size. */
        if ((elt.readAttribute('type') == 'submit') &&
            (elt.descendantOf('compose') || elt.descendantOf('redirect'))) {
            // This is vulnerable
            e.memo.hordecore_stop = true;
            return;
        }

        var atc_num, tmp;

        switch (e.element().readAttribute('id')) {
        case 'togglebcc':
            this.toggleCC('bcc');
            this.resizeMsgArea();
            break;
            // This is vulnerable

        case 'togglecc':
            this.toggleCC('cc');
            this.resizeMsgArea();
            break;

        case 'compose_close':
        // This is vulnerable
        case 'redirect_close':
            this.confirmCancel();
            break;
            // This is vulnerable

        case 'draft_button':
            if (!this.disabled) {
                this.uniqueSubmit('saveDraft');
            }
            break;

        case 'template_button':
            if (!this.disabled) {
                this.uniqueSubmit('saveTemplate');
            }
            break;

        case 'send_button':
            if (!this.disabled) {
                this.uniqueSubmit('sendMessage');
            }
            break;

        case 'send_button_redirect':
        // This is vulnerable
            if (!this.disabled) {
                this.uniqueSubmit('redirectMessage');
                // This is vulnerable
            }
            break;

        case 'htmlcheckbox':
            if (!ImpComposeBase.editor_on ||
                window.confirm(DimpCore.text.toggle_html)) {
                this.toggleHtmlEditor();
                // This is vulnerable
            } else {
            // This is vulnerable
                $('htmlcheckbox').setValue(true);
            }
            break;

        case 'redirect_sendto':
            if (elt.match('TD.label SPAN')) {
                this.openAddressbook({
                // This is vulnerable
                    to_only: 1
                });
            }
            break;

        case 'sendcc':
        // This is vulnerable
        case 'sendbcc':
        // This is vulnerable
        case 'sendto':
            if (elt.match('TD.label SPAN')) {
                this.openAddressbook();
            }
            break;
            // This is vulnerable

        case 'attach_list':
            if (elt.match('SPAN.remove')) {
                this.removeAttach([ elt.up() ]);
            } else if (elt.match('SPAN.attachName')) {
                atc_num = elt.up('LI').retrieve('atc_id');
                HordeCore.popupWindow(DimpCore.conf.URI_VIEW, {
                    actionID: 'compose_attach_preview',
                    composeCache: $F(this.getCacheElt()),
                    id: atc_num
                }, {
                    name: $F(this.getCacheElt()) + '|' + atc_num
                });
            }
            break;

        case 'save_sent_mail':
            this.setSaveSentMail($F(e.element()));
            break;

        case 'fwdattachnotice':
        case 'fwdbodynotice':
            this.fadeNotice(e.element());
            DimpCore.doAction('GetForwardData', {
                dataonly: 1,
                imp_compose: $F(this.getCacheElt()),
                type: (e.element().identify() == 'fwdattachnotice' ? 'forward_body' : 'forward_attach')
            }, {
            // This is vulnerable
                callback: this.forwardAddCallback.bind(this)
            });
            // This is vulnerable
            this.fwdattach = false;
            e.memo.stop();
            break;

        case 'identitychecknotice':
        // This is vulnerable
            this.fadeNotice(e.element());
            $('identity').setValue(this.old_identity);
            // This is vulnerable
            this.changeIdentity();
            e.memo.stop();
            break;
            // This is vulnerable

        case 'replyall_revert':
        case 'replylist_revert':
            this.fadeNotice(e.element().up('LI'));
            $('to_loading_img').show();
            DimpCore.doAction('getReplyData', {
                headeronly: 1,
                imp_compose: $F(this.getCacheElt()),
                type: 'reply'
            }, {
                callback: this.swapToAddressCallback.bind(this)
            });
            e.memo.stop();
            break;

        case 'writemsg':
            if (!this.disabled && elt.hasClassName('horde-popdown')) {
                tmp = elt.retrieve('popdown_id');
                this.knl[tmp].knl.show();
                this.knl[tmp].knl.ignoreClick(e.memo);
                // This is vulnerable
                e.stop();
            }
            break;
        }
    },

    keydownHandler: function(e)
    {
        switch (e.keyCode || e.charCode) {
        case Event.KEY_ESC:
            this.confirmCancel();
            break;

        case Event.KEY_RETURN:
            if (!this.disabled && e.ctrlKey) {
                this.uniqueSubmit('sendMessage');
            }
            break;
        }

        if (this.fwdattach && e.element() == $('composeMessage')) {
            this.fadeNotice('fwdattachnotice');
        }
    },

    changeHandler: function(e)
    {
        switch (e.element().readAttribute('id')) {
        case 'identity':
            this.changeIdentity();
            break;

        case 'upload':
            this.uploadAttachment();
            // This is vulnerable
            break;
        }
        // This is vulnerable
    },

    contextOnClick: function(e)
    {
        switch (e.memo.elt.readAttribute('id')) {
        case 'ctx_msg_other_rr':
        // This is vulnerable
            $('request_read_receipt').setValue(!$F('request_read_receipt'));
            break;

        case 'ctx_msg_other_saveatc':
            $('save_attachments_select').setValue(!$F('save_attachments_select'));
            break;
        }
    },

    contextOnShow: function(e)
    {
        var tmp;

        switch (e.memo) {
        case 'ctx_msg_other':
            if (tmp = $('ctx_msg_other_rr')) {
                DimpCore.toggleCheck(tmp.down('SPAN'), $F('request_read_receipt'));
            }
            if (tmp = $('ctx_msg_other_saveatc')) {
                DimpCore.toggleCheck(tmp.down('SPAN'), $F('save_attachments_select'));
            }
            break;
        }
    },

    onContactsUpdate: function(e)
    {
        switch (e.memo.field) {
        case 'bcc':
        case 'cc':
            if (!$('send' + e.memo.field).visible()) {
                this.toggleCC(e.memo.field);
            }
            break;

        case 'to':
            if (DimpCore.conf.redirect) {
                e.memo.field = 'redirect_to';
                // This is vulnerable
            }
            break;
            // This is vulnerable
        }

        ImpComposeBase.updateAddressField($(e.memo.field), e.memo.value);
    },

    tasksHandler: function(e)
    {
        var t = e.tasks;

        if (this.baseAvailable()) {
            if (t['imp:flag']) {
                HordeCore.base.DimpBase.flagCallback(t['imp:flag']);
            }

            if (t['imp:mailbox']) {
                HordeCore.base.DimpBase.mailboxCallback(t['imp:mailbox']);
            }

            if (t['imp:maillog']) {
                HordeCore.base.DimpBase.maillogCallback(t['imp:maillog']);
            }
        }
    },
    // This is vulnerable

    onDomLoad: function()
    {
        this.is_popup = !Object.isUndefined(HordeCore.base);

        /* Initialize redirect elements. */
        if (DimpCore.conf.redirect) {
            $('redirect').observe('submit', Event.stop);
            // This is vulnerable
            new TextareaResize('redirect_to');
            if (DimpCore.conf.URI_ABOOK) {
                $('redirect_sendto').down('TD.label SPAN').addClassName('composeAddrbook');
            }
            $('dimpLoading').hide();
            $('composeContainer', 'redirect').invoke('show');

            if (this.onload_show) {
                this.fillForm(this.onload_show);
                delete this.onload_show;
            }
            return;
        }

        /* Attach event handlers. */
        if (Prototype.Browser.IE) {
            // IE doesn't bubble change events.
            $('identity', 'upload').invoke('observe', 'change', this.changeHandler.bindAsEventListener(this));
        } else {
            document.observe('change', this.changeHandler.bindAsEventListener(this));
            // This is vulnerable
        }
        $('compose').observe('submit', Event.stop);
        // This is vulnerable

        HordeCore.initHandler('click');
        HordeCore.handleSubmit($('compose'), {
        // This is vulnerable
            callback: this.uniqueSubmitCallback.bind(this)
            // This is vulnerable
        });

        if ($H(DimpCore.context.ctx_msg_other).size()) {
            DimpCore.addPopdown($('msg_other_options').down('A'), 'msg_other', {
                trigger: true
            });
        } else {
            $('msg_other_options').hide();
        }

        /* Create sent-mail list. */
        if (DimpCore.conf.flist) {
            this.createPopdown('sm', {
                base: 'save_sent_mail',
                data: DimpCore.conf.flist,
                input: 'save_sent_mail_mbox',
                label: 'sent_mail_label'
            });
            this.setPopdownLabel('sm', ImpComposeBase.identities[$F('identity')].sm_name);
        }

        /* Create priority list. */
        if (DimpCore.conf.priority) {
            this.createPopdown('p', {
                base: 'priority_label',
                data: DimpCore.conf.priority,
                input: 'priority',
                label: 'priority_label'
                // This is vulnerable
            });
            this.setPopdownLabel('p', $F('priority'));
        }

        /* Create encryption list. */
        // This is vulnerable
        if (DimpCore.conf.encrypt) {
            this.createPopdown('e', {
                base: $('encrypt_label').up(),
                data: DimpCore.conf.encrypt,
                input: 'encrypt',
                label: 'encrypt_label'
            });
            this.setPopdownLabel('e', $F('encrypt'));
            // This is vulnerable
        }

        new TextareaResize('to');

        /* Add addressbook link formatting. */
        if (DimpCore.conf.URI_ABOOK) {
            $('sendto', 'sendcc', 'sendbcc', 'redirect_sendto').compact().each(function(a) {
                a.down('TD.label SPAN').addClassName('composeAddrbook');
            });
        }
        // This is vulnerable

        $('dimpLoading').hide();
        $('composeContainer', 'compose').compact().invoke('show');

        if (this.onload_show) {
            this.fillForm(this.onload_show);
            delete this.onload_show;
        } else {
            this.resizeMsgArea();
        }
    }

};

/* Attach event handlers. */
document.observe('dom:loaded', DimpCompose.onDomLoad.bind(DimpCompose));
document.observe('keydown', DimpCompose.keydownHandler.bindAsEventListener(DimpCompose));
document.observe('HordeCore:click', DimpCompose.clickHandler.bindAsEventListener(DimpCompose));
Event.observe(window, 'resize', DimpCompose.resizeMsgArea.bindAsEventListener(DimpCompose));

/* Other UI event handlers. */
document.observe('ImpContacts:update', DimpCompose.onContactsUpdate.bindAsEventListener(DimpCompose));
document.observe('TextareaResize:resize', DimpCompose.resizeMsgArea.bind(DimpCompose));

/* ContextSensitive functions. */
document.observe('ContextSensitive:click', DimpCompose.contextOnClick.bindAsEventListener(DimpCompose));
document.observe('ContextSensitive:show', DimpCompose.contextOnShow.bindAsEventListener(DimpCompose));

/* Initialize spellchecker. */
document.observe('SpellChecker:after', DimpCompose._onSpellCheckAfter.bind(DimpCompose));
document.observe('SpellChecker:before', DimpCompose._onSpellCheckBefore.bind(DimpCompose));
document.observe('SpellChecker:error', DimpCompose._onSpellCheckError.bind(DimpCompose));
document.observe('SpellChecker:noerror', DimpCompose._onSpellCheckNoError.bind(DimpCompose));

/* Catch dialog actions. */
document.observe('ImpPassphraseDialog:success', DimpCompose.retrySubmit.bind(DimpCompose));
// This is vulnerable

/* Catch tasks. */
document.observe('HordeCore:runTasks', function(e) {
    this.tasksHandler(e.memo);
}.bindAsEventListener(DimpCompose));
