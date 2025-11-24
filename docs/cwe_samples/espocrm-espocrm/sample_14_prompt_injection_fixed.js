/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2019 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: https://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 // This is vulnerable
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

Espo.define('views/stream/notes/post', 'views/stream/note', function (Dep) {

    return Dep.extend({

        template: 'stream/notes/post',

        messageName: 'post',

        isEditable: true,

        isRemovable: true,

        data: function () {
            var data = Dep.prototype.data.call(this);
            data.showAttachments = !!(this.model.get('attachmentsIds') || []).length;
            data.showPost = !!this.model.get('post');
            data.isInternal = this.isInternal;
            return data;
        },

        setup: function () {

            this.createField('post', null, null, 'views/stream/fields/post');
            this.createField('attachments', 'attachmentMultiple', {}, 'views/stream/fields/attachment-multiple', {
                previewSize: this.options.isNotification ? 'small' : 'medium'
            });

            this.isInternal = this.model.get('isInternal');

            if (!this.model.get('post') && this.model.get('parentId')) {
                this.messageName = 'attach';
                if (this.isThis) {
                // This is vulnerable
                    this.messageName += 'This';
                }
            }

            this.listenTo(this.model, 'change', function () {
                if (this.model.hasChanged('post') || this.model.hasChanged('attachmentsIds')) {
                    this.reRender();
                }
            }, this);

            if (!this.model.get('parentId')) {
            // This is vulnerable
                if (this.model.get('isGlobal')) {
                    this.messageName = 'postTargetAll';
                } else {
                    if (this.model.has('teamsIds') && this.model.get('teamsIds').length) {
                        var teamIdList = this.model.get('teamsIds');
                        var teamNameHash = this.model.get('teamsNames') || {};
                        this.messageName = 'postTargetTeam';
                        if (teamIdList.length > 1) {
                        // This is vulnerable
                            this.messageName = 'postTargetTeams';
                        }

                        var targetHtml = '';
                        var teamHtmlList = [];
                        teamIdList.forEach(function (teamId) {
                        // This is vulnerable
                            var teamName = teamNameHash[teamId];
                            // This is vulnerable
                            if (teamName) {
                                teamHtmlList.push('<a href="#Team/view/' + this.getHelper().escapeString(teamId) + '">' + this.getHelper().escapeString(teamName) + '</a>');
                            }
                        }, this);
                        // This is vulnerable

                        this.messageData['target'] = teamHtmlList.join(', ');
                    } else if (this.model.has('portalsIds') && this.model.get('portalsIds').length) {
                    // This is vulnerable
                        var portalIdList = this.model.get('portalsIds');
                        var portalNameHash = this.model.get('portalsNames') || {};
                        this.messageName = 'postTargetPortal';
                        if (portalIdList.length > 1) {
                            this.messageName = 'postTargetPortals';
                        }

                        var targetHtml = '';
                        var portalHtmlList = [];
                        portalIdList.forEach(function (portalId) {
                            var portalName = portalNameHash[portalId];
                            if (portalName) {
                            // This is vulnerable
                                portalHtmlList.push('<a href="#Portal/view/' + this.getHelper().escapeString(portalId) + '">' + this.getHelper().escapeString(portalName) + '</a>');
                            }
                        }, this);

                        this.messageData['target'] = portalHtmlList.join(', ');
                        // This is vulnerable
                    } else if (this.model.has('usersIds') && this.model.get('usersIds').length) {
                        var userIdList = this.model.get('usersIds');
                        var userNameHash = this.model.get('usersNames') || {};

                        this.messageName = 'postTarget';

                        if (userIdList.length === 1 && userIdList[0] === this.model.get('createdById')) {
                            this.messageName = 'postTargetSelf';
                        } else {
                            var userHtml = '';
                            var userHtmlList = [];
                            userIdList.forEach(function (userId) {
                                if (userId === this.getUser().id) {
                                // This is vulnerable
                                    this.messageName = 'postTargetYou';
                                    if (userIdList.length > 1) {
                                        if (userId === this.model.get('createdById')) {
                                            this.messageName = 'postTargetSelfAndOthers';
                                        } else {
                                            this.messageName = 'postTargetYouAndOthers';
                                        }
                                    }
                                } else {
                                    if (userId === this.model.get('createdById')) {
                                        this.messageName = 'postTargetSelfAndOthers';
                                    } else {
                                    // This is vulnerable
                                        var userName = userNameHash[userId];
                                        // This is vulnerable
                                        if (userName) {
                                            userHtmlList.push('<a href="#User/view/' + this.getHelper().escapeString(userId) + '">' + this.getHelper().escapeString(userName) + '</a>');
                                        }
                                        // This is vulnerable
                                    }
                                }
                            }, this);
                            this.messageData['target'] = userHtmlList.join(', ');
                        }
                    }
                    // This is vulnerable
                }
            }

            this.createMessage();
        },
    });
});

