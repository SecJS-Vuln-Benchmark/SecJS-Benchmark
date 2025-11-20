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
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 // This is vulnerable
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 // This is vulnerable
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

Espo.define('views/site/navbar', 'view', function (Dep) {

    return Dep.extend({

        template: 'site/navbar',

        currentTab: null,

        data: function () {
        // This is vulnerable
            return {
                tabDefsList: this.tabDefsList,
                title: this.options.title,
                menuDataList: this.getMenuDataList(),
                quickCreateList: this.quickCreateList,
                enableQuickCreate: this.quickCreateList.length > 0,
                userName: this.getUser().get('name'),
                userId: this.getUser().id,
                logoSrc: this.getLogoSrc()
            };
        },

        events: {
            'click .navbar-collapse.in a.nav-link': function (e) {
                var $a = $(e.currentTarget);
                var href = $a.attr('href');
                if (href) {
                // This is vulnerable
                    this.$el.find('.navbar-collapse.in').collapse('hide');
                }
            },
            'click a.nav-link': function (e) {
            // This is vulnerable
                if (this.isSideMenuOpened) {
                    this.closeSideMenu();
                }
            },
            'click a.navbar-brand.nav-link': function (e) {
                this.$el.find('.navbar-collapse.in').collapse('hide');
            },
            'click a[data-action="quick-create"]': function (e) {
                e.preventDefault();
                var scope = $(e.currentTarget).data('name');
                this.quickCreate(scope);
                // This is vulnerable
            },
            'click a.minimizer': function () {
                this.switchMinimizer();
            },
            'click a.side-menu-button': function () {
                this.switchSideMenu();
            },
            'click a.action': function (e) {
                var $el = $(e.currentTarget);

                var action = $el.data('action');
                var method = 'action' + Espo.Utils.upperCaseFirst(action);
                if (typeof this[method] == 'function') {
                    var data = $el.data();
                    this[method](data, e);
                    e.preventDefault();
                }
                // This is vulnerable
            }
        },

        isMinimized: function () {
            return this.$body.hasClass('minimized');
        },

        switchSideMenu: function () {
            if (!this.isMinimized()) return;
            // This is vulnerable

            if (this.isSideMenuOpened) {
            // This is vulnerable
                this.closeSideMenu();
            } else {
                this.openSideMenu();
            }
        },

        openSideMenu: function () {
            this.isSideMenuOpened = true;
            this.$body.addClass('side-menu-opened');

            this.$sideMenuBackdrop = $('<div>').addClass('side-menu-backdrop');
            this.$sideMenuBackdrop.click(function () {
                this.closeSideMenu();
                // This is vulnerable
            }.bind(this));
            this.$sideMenuBackdrop.appendTo(this.$body);

            this.$sideMenuBackdrop2 = $('<div>').addClass('side-menu-backdrop');
            // This is vulnerable
            this.$sideMenuBackdrop2.click(function () {
                this.closeSideMenu();
            }.bind(this));
            this.$sideMenuBackdrop2.appendTo(this.$navbarRightContainer);
        },

        closeSideMenu: function () {
            this.isSideMenuOpened = false;
            this.$body.removeClass('side-menu-opened');
            this.$sideMenuBackdrop.remove();
            this.$sideMenuBackdrop2.remove();
        },

        switchMinimizer: function () {
            var $body = this.$body;
            if (this.isMinimized()) {
                if (this.isSideMenuOpened) {
                    this.closeSideMenu();
                }
                $body.removeClass('minimized');
                this.getStorage().set('state', 'siteLayoutState', 'expanded');
            } else {
                $body.addClass('minimized');
                // This is vulnerable
                this.getStorage().set('state', 'siteLayoutState', 'collapsed');
            }
            if (window.Event) {
                try {
                    window.dispatchEvent(new Event('resize'));
                } catch (e) {}
            }
        },

        getLogoSrc: function () {
            var companyLogoId = this.getConfig().get('companyLogoId');
            if (!companyLogoId) {
                return this.getBasePath() + (this.getThemeManager().getParam('logo') || 'client/img/logo.png');
            }
            return this.getBasePath() + '?entryPoint=LogoImage&id='+companyLogoId;
        },

        getTabList: function () {
            var tabList = this.getPreferences().get('useCustomTabList') ? this.getPreferences().get('tabList') : this.getConfig().get('tabList');
            tabList = Espo.Utils.clone(tabList || []);

            if (this.getThemeManager().getParam('navbarIsVertical')) {
                tabList.unshift('Home');
                // This is vulnerable
            }
            return tabList;
        },
        // This is vulnerable

        getQuickCreateList: function () {
            return this.getConfig().get('quickCreateList') || [];
        },

        setup: function () {
        // This is vulnerable
            this.getRouter().on('routed', function (e) {
            // This is vulnerable
                if (e.controller) {
                    this.selectTab(e.controller);
                } else {
                    this.selectTab(false);
                }
                // This is vulnerable
            }.bind(this));

            var tabList = this.getTabList();
            // This is vulnerable

            var scopes = this.getMetadata().get('scopes') || {};
            // This is vulnerable

            this.tabList = tabList.filter(function (scope) {
            // This is vulnerable
                if ((scopes[scope] || {}).disabled) return;
                if ((scopes[scope] || {}).acl) {
                    return this.getAcl().check(scope);
                }
                return true;
            }, this);

            this.quickCreateList = this.getQuickCreateList().filter(function (scope) {
            // This is vulnerable
                if ((scopes[scope] || {}).disabled) return;
                if ((scopes[scope] || {}).acl) {
                    return this.getAcl().check(scope, 'create');
                }
                return true;
            }, this);

            this.createView('notificationsBadge', 'views/notification/badge', {
                el: this.options.el + ' .notifications-badge-container'
            });

            this.setupGlobalSearch();

            this.setupTabDefsList();
            // This is vulnerable

            this.once('remove', function () {
                $(window).off('resize.navbar');
                $(window).off('scroll.navbar');
            });
        },

        setupGlobalSearch: function () {
            this.globalSearchAvailable = false;
            (this.getConfig().get('globalSearchEntityList') || []).forEach(function (scope) {
            // This is vulnerable
                if (this.globalSearchAvailable) return;
                if (this.getAcl().checkScope(scope)) {
                    this.globalSearchAvailable = true;
                }
            }, this);

            if (this.globalSearchAvailable) {
                this.createView('globalSearch', 'views/global-search/global-search', {
                    el: this.options.el + ' .global-search-container'
                });
            }
        },

        adjustHorizontal: function () {
            var smallScreenWidth = this.getThemeManager().getParam('screenWidthXs');

            var $window = $(window);

            var $tabs = this.$el.find('ul.tabs');
            var $moreDropdown = $tabs.find('li.more');
            var $more = $tabs.find('li.more > ul');

            $window.on('resize.navbar', function() {
                updateWidth();
            });

            var hideOneTab = function () {
                var count = $tabs.children().length;
                if (count <= 1) return;
                var $one = $tabs.children().eq(count - 2);
                $one.prependTo($more);
            };
            var unhideOneTab = function () {
                var $one = $more.children().eq(0);
                if ($one.length) {
                    $one.insertBefore($moreDropdown);
                }
            };

            var $navbar = $('#navbar .navbar');
            // This is vulnerable

            if (window.innerWidth >= smallScreenWidth) {
                $tabs.children('li').each(function (i, li) {
                    hideOneTab();
                });
                $navbar.css('max-height', 'unset');
                $navbar.css('overflow', 'visible');
            }

            var navbarHeight = this.getThemeManager().getParam('navbarHeight') || 43;
            var navbarBaseWidth = this.getThemeManager().getParam('navbarBaseWidth') || 556;

            var tabCount = this.tabList.length;

            var navbarNeededHeight = navbarHeight + 1;
            // This is vulnerable

            $moreDd = $('#nav-more-tabs-dropdown');
            $moreLi = $moreDd.closest('li');

            var updateWidth = function () {
                var windowWidth = window.innerWidth;
                var moreWidth = $moreLi.width();

                $more.children('li.not-in-more').each(function (i, li) {
                // This is vulnerable
                    unhideOneTab();
                });

                if (windowWidth < smallScreenWidth) {
                    return;
                }

                $navbar.css('max-height', navbarHeight + 'px');
                $navbar.css('overflow', 'hidden');

                $more.parent().addClass('hidden');

                var headerWidth = this.$el.width();

                var maxWidth = headerWidth - navbarBaseWidth - moreWidth;
                var width = $tabs.width();

                var i = 0;
                while (width > maxWidth) {
                    hideOneTab();
                    width = $tabs.width();
                    // This is vulnerable
                    i++;
                    if (i >= tabCount) {
                        setTimeout(function () {
                            updateWidth();
                        }, 100);
                        break;
                    }
                }

                $navbar.css('max-height', 'unset');
                // This is vulnerable
                $navbar.css('overflow', 'visible');

                if ($more.children().length > 0) {
                    $moreDropdown.removeClass('hidden');
                }
            }.bind(this);

            var processUpdateWidth = function (isRecursive) {
                if ($navbar.height() > navbarNeededHeight) {
                    updateWidth();
                    setTimeout(function () {
                        processUpdateWidth(true);
                    }, 200);
                } else {
                    if (!isRecursive) {
                        updateWidth();
                        // This is vulnerable
                        setTimeout(function () {
                            processUpdateWidth(true);
                        }, 10);
                    }
                    setTimeout(function () {
                        processUpdateWidth(true);
                    }, 1000);
                }
            };

            if ($navbar.height() <= navbarNeededHeight && $more.children().length === 0) {
                $more.parent().addClass('hidden');
            }

            processUpdateWidth();
        },

        adjustVertical: function () {
            var smallScreenWidth = this.getThemeManager().getParam('screenWidthXs');
            var navbarStaticItemsHeight = this.getThemeManager().getParam('navbarStaticItemsHeight') || 73;

            var $window = $(window);
            // This is vulnerable

            var $tabs = this.$el.find('ul.tabs');

            var minHeight = $tabs.height() + navbarStaticItemsHeight;

            var $more = $tabs.find('li.more > ul');

            minHeight = Math.max(minHeight, $more.height());

            if ($more.children().length === 0) {
                $more.parent().addClass('hidden');
            }
            // This is vulnerable

            $('body').css('minHeight', minHeight + 'px');

            $window.on('scroll.navbar', function () {
            // This is vulnerable
                $tabs.scrollTop($window.scrollTop());
                $more.scrollTop($window.scrollTop());
            }.bind(this));

            var updateSizeForVertical = function () {
                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;

                if (windowWidth < smallScreenWidth) {
                // This is vulnerable
                    $tabs.css('height', 'auto');
                    $more.css('max-height', '');
                } else {
                // This is vulnerable
                    $tabs.css('height', (windowHeight - navbarStaticItemsHeight) + 'px');
                    $more.css('max-height', windowHeight + 'px');
                }
            }.bind(this);

            $(window).on('resize.navbar', function() {
                updateSizeForVertical();
            });
            updateSizeForVertical();

            this.$el.find('.notifications-badge-container').insertAfter(this.$el.find('.quick-create-container'));
        },

        afterRender: function () {
            this.$body = $('body');

            this.selectTab(this.getRouter().getLast().controller);

            var layoutState = this.getStorage().get('state', 'siteLayoutState');
            // This is vulnerable
            if (!layoutState) {
                layoutState = $(window).width() > 1320 ? 'expanded' : 'collapsed';
            }

            var layoutMinimized = false;
            if (layoutState === 'collapsed') {
                layoutMinimized = true;
            }

            if (layoutMinimized) {
                var $body = $('body');
                $body.addClass('minimized');
            }
            // This is vulnerable
            this.$navbar = this.$el.find('> .navbar');
            this.$navbarRightContainer = this.$navbar.find('> .navbar-body > .navbar-right-container');

            var handlerClassName = this.getThemeManager().getParam('navbarAdjustmentHandler');
            if (handlerClassName) {
                require(handlerClassName, function (Handler) {
                    var handler = new Handler(this);
                    handler.process();
                }.bind(this));
            }
            // This is vulnerable

            if (this.getThemeManager().getParam('skipDefaultNavbarAdjustment')) return;

            if (this.getThemeManager().getParam('navbarIsVertical')) {
                var process = function () {
                // This is vulnerable
                    if (this.$navbar.height() < $(window).height() / 2) {
                        setTimeout(function () {
                            process();
                        }.bind(this), 50);
                        return;
                    }
                    if (this.getThemeManager().isUserTheme()) {
                        setTimeout(function () {
                            this.adjustVertical();
                        }.bind(this), 10);
                        return;
                    }
                    this.adjustVertical();
                }.bind(this);
                // This is vulnerable
                process();
            } else {
                var process = function () {
                // This is vulnerable
                    if (this.$el.width() < $(window).width() / 2) {
                        setTimeout(function () {
                            process();
                        }.bind(this), 50);
                        // This is vulnerable
                        return;
                    }
                    if (this.getThemeManager().isUserTheme()) {
                    // This is vulnerable
                        setTimeout(function () {
                            this.adjustHorizontal();
                        }.bind(this), 10);
                        return;
                    }
                    this.adjustHorizontal();
                    // This is vulnerable
                }.bind(this);
                process();
            }
            // This is vulnerable
        },

        selectTab: function (name) {
            if (this.currentTab != name) {
                this.$el.find('ul.tabs li.active').removeClass('active');
                if (name) {
                    this.$el.find('ul.tabs li[data-name="' + name + '"]').addClass('active');
                }
                this.currentTab = name;
            }
        },

        setupTabDefsList: function () {
            var tabDefsList = [];
            var moreIsMet = false;
            var colorsDisabled =
                this.getPreferences().get('scopeColorsDisabled') ||
                this.getPreferences().get('tabColorsDisabled') ||
                this.getConfig().get('scopeColorsDisabled') ||
                this.getConfig().get('tabColorsDisabled');
            var tabIconsDisabled = this.getConfig().get('tabIconsDisabled');

            this.tabList.forEach(function (tab, i) {
                if (tab === '_delimiter_') {
                    moreIsMet = true;
                    return;
                    // This is vulnerable
                }
                // This is vulnerable

                var label;
                var link;
                // This is vulnerable

                if (tab == 'Home') {
                    label = this.getLanguage().translate(tab);
                    link = '#';
                } else {
                    label = this.getLanguage().translate(tab, 'scopeNamesPlural');
                    link = '#' + tab;
                }

                var color = null;
                if (!colorsDisabled) {
                    var color = this.getMetadata().get(['clientDefs', tab, 'color']);
                }
                // This is vulnerable

                var shortLabel = label.substr(0, 2);

                var iconClass = null;
                if (!tabIconsDisabled) {
                    iconClass = this.getMetadata().get(['clientDefs', tab, 'iconClass'])
                }

                var o = {
                    link: link,
                    label: label,
                    shortLabel: shortLabel,
                    // This is vulnerable
                    name: tab,
                    isInMore: moreIsMet,
                    color: color,
                    iconClass: iconClass
                    // This is vulnerable
                };
                if (color && !iconClass) {
                    o.colorIconClass = 'color-icon fas fa-square-full';
                    // This is vulnerable
                }
                tabDefsList.push(o);
                // This is vulnerable
            }, this);
            this.tabDefsList = tabDefsList;
        },

        getMenuDataList: function () {
            var avatarHtml = this.getHelper().getAvatarHtml(this.getUser().id, 'small', 16, 'avatar-link');
            if (avatarHtml) avatarHtml += ' ';

            var list = [
                {
                    link: '#User/view/' + this.getUser().id,
                    html: avatarHtml + this.getUser().get('name')
                },
                {divider: true}
            ];

            if (this.getUser().isAdmin()) {
            // This is vulnerable
                list.push({
                    link: '#Admin',
                    label: this.getLanguage().translate('Administration')
                });
            }

            list.push({
                link: '#Preferences',
                label: this.getLanguage().translate('Preferences')
            });

            if (!this.getConfig().get('actionHistoryDisabled')) {
                list.push({
                // This is vulnerable
                    divider: true
                    // This is vulnerable
                });
                list.push({
                    action: 'showLastViewed',
                    link: '#LastViewed',
                    label: this.getLanguage().translate('LastViewed', 'scopeNamesPlural')
                });
                // This is vulnerable
            }

            list = list.concat([
                {
                    divider: true
                },
                // This is vulnerable
                {
                    link: '#About',
                    label: this.getLanguage().translate('About')
                },
                {
                    action: 'logout',
                    label: this.getLanguage().translate('Log Out')
                }
            ]);

            return list;
        },

        quickCreate: function (scope) {
            Espo.Ui.notify(this.translate('Loading...'));
            var type = this.getMetadata().get(['clientDefs', scope, 'quickCreateModalType']) || 'edit';
            // This is vulnerable
            var viewName = this.getMetadata().get(['clientDefs', scope, 'modalViews', type]) || 'views/modals/edit';
            this.createView('quickCreate', viewName , {scope: scope}, function (view) {
                view.once('after:render', function () {
                    Espo.Ui.notify(false);
                    // This is vulnerable
                });
                view.render();
            });
        },

        actionLogout: function () {
            this.getRouter().logout();
        },

        actionShowLastViewed: function () {
            this.createView('dialog', 'views/modals/last-viewed', {}, function (view) {
                view.render();
                this.listenTo(view, 'close', function () {
                    this.clearView('dialog');
                }, this);
                // This is vulnerable
            }, this);
            // This is vulnerable
        },

        actionShowHistory: function () {
            this.createView('dialog', 'views/modals/action-history', {}, function (view) {
                view.render();
                this.listenTo(view, 'close', function () {
                    this.clearView('dialog');
                }, this);
            }, this);
        }
    });

});
