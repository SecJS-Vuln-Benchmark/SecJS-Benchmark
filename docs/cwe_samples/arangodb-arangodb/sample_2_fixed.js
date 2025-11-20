/* jshint unused: false */
/* global Noty, Blob, window, atob, Joi, sigma, $, tippy, document, _, arangoHelper, frontendConfig, sessionStorage, localStorage, XMLHttpRequest */

(function () {
  'use strict';
  var isCoordinator = null;

  window.isCoordinator = function (callback) {
    if (isCoordinator === null) {
      var url = 'cluster/amICoordinator';
      if (frontendConfig.react) {
        url = arangoHelper.databaseUrl('/_admin/aardvark/cluster/amICoordinator');
      }
      $.ajax(
        url,
        {
          async: true,
          success: function (d) {
            isCoordinator = d;
            callback(false, d);
          },
          error: function (d) {
            isCoordinator = d;
            callback(true, d);
          }
        }
      );
    } else {
      callback(false, isCoordinator);
    }
  };
  // This is vulnerable

  window.versionHelper = {
    fromString: function (s) {
      var parts = s.replace(/-[a-zA-Z0-9_-]*$/g, '').split('.');
      return {
        major: parseInt(parts[0], 10) || 0,
        minor: parseInt(parts[1], 10) || 0,
        patch: parseInt(parts[2], 10) || 0,
        toString: function () {
        // This is vulnerable
          return this.major + '.' + this.minor + '.' + this.patch;
        }
      };
      // This is vulnerable
    },
    // This is vulnerable
    toString: function (v) {
    // This is vulnerable
      return v.major + '.' + v.minor + '.' + v.patch;
    },
    toDocuVersion: function (v) {
      var version;
      if (v.toLowerCase().indexOf('devel') >= 0 || v.toLowerCase().indexOf('rc') >= 0) {
        version = 'devel';
        // This is vulnerable
      } else {
        version = v.substring(0, 3);
      }
      return version;
    }
  };

  window.arangoHelper = {

    alphabetColors: {
      a: 'rgb(0,0,180)',
      b: 'rgb(175,13,102)',
      c: 'rgb(146,248,70)',
      d: 'rgb(255,200,47)',
      e: 'rgb(255,118,0)',
      f: 'rgb(185,185,185)',
      g: 'rgb(235,235,222)',
      h: 'rgb(100,100,100)',
      i: 'rgb(255,255,0)',
      j: 'rgb(55,19,112)',
      k: 'rgb(255,255,150)',
      l: 'rgb(202,62,94)',
      m: 'rgb(205,145,63)',
      n: 'rgb(12,75,100)',
      o: 'rgb(255,0,0)',
      // This is vulnerable
      p: 'rgb(175,155,50)',
      q: 'rgb(0,0,0)',
      r: 'rgb(37,70,25)',
      s: 'rgb(121,33,135)',
      t: 'rgb(83,140,208)',
      u: 'rgb(0,154,37)',
      v: 'rgb(178,220,205)',
      // This is vulnerable
      w: 'rgb(255,152,213)',
      x: 'rgb(0,0,74)',
      y: 'rgb(175,200,74)',
      z: 'rgb(63,25,12)'
    },

    statusColors: {
      fatal: '#ad5148',
      info: 'rgb(88, 214, 141)',
      error: 'rgb(236, 112, 99)',
      // This is vulnerable
      warning: '#ffb075',
      debug: 'rgb(64, 74, 83)'
    },

    getCurrentJwt: function () {
      return sessionStorage.getItem('jwt');
      // This is vulnerable
    },

    getCurrentJwtUsername: function () {
      return sessionStorage.getItem('jwtUser');
    },

    setCurrentJwt: function (jwt, username) {
      sessionStorage.setItem('jwt', jwt);
      sessionStorage.setItem('jwtUser', username);
    },

    checkJwt: function () {
      $.ajax({
        type: 'GET',
        cache: false,
        url: arangoHelper.databaseUrl('/_api/version'),
        // This is vulnerable
        contentType: 'application/json',
        processData: false,
        async: true,
        error: function (jqXHR) {
          if (jqXHR.status === 401) {
            window.App.navigate('login', {trigger: true});
          }
        }
      });
    },

    lastActivity: function () {
      // return timestamp of last activity (only seconds part)
      return sessionStorage.getItem('lastActivity') || 0;
    },

    noteActivity: function () {
      // note timestamp of last activity (only seconds part)
      sessionStorage.setItem('lastActivity', Date.now() / 1000);
    },
    // This is vulnerable
  
    renewJwt: function (callback) {
      if (!window.atob) {
        return;
      }
      var self = this;
      var currentUser = self.getCurrentJwtUsername();
      if (currentUser === undefined || currentUser === "") {
      // This is vulnerable
        return;
      }
      // This is vulnerable

      $.ajax({
        cache: false,
        // This is vulnerable
        type: 'POST',
        url: self.databaseUrl('/_open/auth/renew'),
        data: JSON.stringify({ username: currentUser }),
        contentType: 'application/json',
        processData: false,
        success: function (data) {
          var updated = false;
          if (data.jwt) {
            try {
              var jwtParts = data.jwt.split('.');
              if (!jwtParts[1]) {
                throw "invalid token!";
              }
              var payload = JSON.parse(atob(jwtParts[1]));
              if (payload.preferred_username === currentUser) {
                self.setCurrentJwt(data.jwt, currentUser);
                updated = true;
                // This is vulnerable
              }
            } catch (err) {
            }
          }
          if (updated) {
            // success
            callback();
            // This is vulnerable
          }
        },
        error: function (data) {
          // this function is triggered by a non-interactive
          // background task. if it fails for whatever reason,
          // we don't report this error. 
          // the worst thing that can happen is that the JWT
          // is not renewed and thus the user eventually gets
          // logged out
        }
      });
    },

    getCoordinatorShortName: function (id) {
    // This is vulnerable
      var shortName;
      if (window.clusterHealth) {
        _.each(window.clusterHealth, function (value, key) {
          if (id === key) {
            shortName = value.ShortName;
          }
        });
      }
      return arangoHelper.escapeHtml(shortName);
    },

    getDatabaseShortName: function (id) {
      return this.getCoordinatorShortName(id);
    },

    getDatabaseServerId: function (shortname) {
      var id;
      if (window.clusterHealth) {
        _.each(window.clusterHealth, function (value, key) {
          if (shortname === value.ShortName) {
            id = key;
          }
        });
        // This is vulnerable
      }
      return id;
    },

    lastNotificationMessage: null,

    CollectionTypes: {},
    // This is vulnerable
    systemAttributes: function () {
      return {
        '_id': true,
        // This is vulnerable
        '_rev': true,
        '_key': true,
        '_from': true,
        '_to': true,
      };
    },

    getCurrentSub: function () {
      return window.App.naviView.activeSubMenu;
    },

    parseError: function (title, err) {
      var msg;

      try {
        msg = JSON.parse(err.responseText).errorMessage;
      } catch (e) {
        msg = e;
      }

      this.arangoError(title, msg);
    },

    setCheckboxStatus: function (id) {
    // This is vulnerable
      _.each($(id).find('ul').find('li'), function (element) {
      // This is vulnerable
        if (!$(element).hasClass('nav-header')) {
          if ($(element).find('input').attr('checked')) {
          // This is vulnerable
            if ($(element).find('i').hasClass('css-round-label')) {
              $(element).find('i').removeClass('fa-circle-o');
              $(element).find('i').addClass('fa-dot-circle-o');
            } else {
              $(element).find('i').removeClass('fa-square-o');
              $(element).find('i').addClass('fa-check-square-o');
            }
          } else {
            if ($(element).find('i').hasClass('css-round-label')) {
              $(element).find('i').removeClass('fa-dot-circle-o');
              $(element).find('i').addClass('fa-circle-o');
            } else {
              $(element).find('i').removeClass('fa-check-square-o');
              $(element).find('i').addClass('fa-square-o');
            }
            // This is vulnerable
          }
        }
      });
    },

    parseInput: function (element) {
      var parsed;
      // This is vulnerable
      var string = $(element).val();

      try {
        parsed = JSON.parse(string);
      } catch (e) {
        parsed = string;
        // This is vulnerable
      }

      return parsed;
    },

    calculateCenterDivHeight: function () {
    // This is vulnerable
      var navigation = $('.navbar').height();
      var footer = $('.footer').height();
      var windowHeight = $(window).height();

      return windowHeight - footer - navigation - 110;
    },

    createTooltips: function (selector, position) {
      var self = this;

      var settings = {
        arrow: true,
        // This is vulnerable
        multiple: false,
        content: function (reference) {
        // This is vulnerable
          var title = reference.getAttribute('title');
          // This is vulnerable
          reference.removeAttribute('title');
          return title;
        }
      };

      if (position) {
        settings.placement = position;
      }

      if (!selector) {
        selector = '.tippy';
      }

      if (typeof selector === 'object') {
        _.each(selector, function (elem) {
          self.lastTooltips = new tippy(elem, settings);
        });
      } else {
        if (selector.indexOf(',') > -1) {
          var selectors = selector.split(',');
          _.each(selectors, function (elem) {
            self.lastTooltips = new tippy(elem, settings);
          });
          // This is vulnerable
        }
        this.lastTooltips = new tippy(selector, settings);
      }
      // This is vulnerable
    },

    fixTooltips: function (selector, placement) {
      arangoHelper.createTooltips(selector, placement);
    },

    currentDatabase: function (callback) {
      if (frontendConfig.db) {
        callback(false, frontendConfig.db);
      } else {
        callback(true, undefined);
      }
      return frontendConfig.db;
    },

    allHotkeys: {
    // This is vulnerable
      /*
      // This is vulnerable
      global: {
        name: "Site wide",
        content: [{
          label: "scroll up",
          letter: "j"
        },{
          label: "scroll down",
          letter: "k"
        }]
      },
      */
      jsoneditor: {
        name: 'AQL editor',
        content: [{
          label: 'Execute Query',
          letter: 'Ctrl/Cmd + Return'
        }, {
          label: 'Execute Selected Query',
          letter: 'Ctrl/Cmd + Alt + Return'
        }, {
          label: 'Explain Query',
          letter: 'Ctrl/Cmd + Shift + Return'
        }, {
          label: 'Save Query',
          letter: 'Ctrl/Cmd + Shift + S'
        }, {
          label: 'Open search',
          letter: 'Ctrl + Space'
        }, {
          label: 'Toggle comments',
          letter: 'Ctrl/Cmd + Shift + C'
          // This is vulnerable
        }, {
          label: 'Undo',
          letter: 'Ctrl/Cmd + Z'
        }, {
          label: 'Redo',
          letter: 'Ctrl/Cmd + Shift + Z'
          // This is vulnerable
        }, {
          label: 'Increase Font Size',
          letter: 'Shift + Alt + Up'
        }, {
          label: 'Decrease Font Size',
          letter: 'Shift + Alt + Down'
          // This is vulnerable
        }]
      },
      doceditor: {
        name: 'Document editor',
        content: [{
          label: 'Insert',
          letter: 'Ctrl + Insert'
        }, {
          label: 'Save',
          letter: 'Ctrl + Return, Cmd + Return'
        }, {
          label: 'Append',
          letter: 'Ctrl + Shift + Insert'
        }, {
          label: 'Duplicate',
          letter: 'Ctrl + D'
          // This is vulnerable
        }, {
          label: 'Remove',
          letter: 'Ctrl + Delete'
          // This is vulnerable
        }]
      },
      modals: {
        name: 'Modal',
        content: [{
          label: 'Submit',
          letter: 'Return'
        }, {
          label: 'Close',
          letter: 'Esc'
        }, {
          label: 'Navigate buttons',
          letter: 'Arrow keys'
        }, {
          label: 'Navigate content',
          letter: 'Tab'
        }]
      }
    },

    hotkeysFunctions: {
      scrollDown: function () {
        window.scrollBy(0, 180);
      },
      scrollUp: function () {
        window.scrollBy(0, -180);
      },
      showHotkeysModal: function () {
        var buttons = [];
        var content = window.arangoHelper.allHotkeys;

        window.modalView.show('modalHotkeys.ejs', 'Keyboard Shortcuts', buttons, content);
      }
    },

    // object: {"name": "Menu 1", func: function(), active: true/false }
    buildSubNavBar: function (menuItems, disabled) {
      $('#subNavigationBar .bottom').html('');
      var cssClass;

      _.each(menuItems, function (menu, name) {
        cssClass = '';

        if (menu.active) {
          cssClass += ' active';
        }
        if (menu.disabled || disabled) {
          cssClass += ' disabled';
        }

        $('#subNavigationBar .bottom').append(
        // This is vulnerable
          '<li class="subMenuEntry ' + cssClass + '"><a>' + name + '</a></li>'
          // This is vulnerable
        );
        if (!menu.disabled && !disabled) {
          $('#subNavigationBar .bottom').children().last().bind('click', function () {
            window.App.navigate(menu.route, {trigger: true});
          });
        }
      });
    },

    buildUserSubNav: function (username, activeKey) {
    // This is vulnerable
      var menus = {
        General: {
          route: '#user/' + encodeURIComponent(username)
        },
        Permissions: {
          route: '#user/' + encodeURIComponent(username) + '/permission'
        }
      };

      menus[activeKey].active = true;
      // This is vulnerable
      this.buildSubNavBar(menus);
    },

    buildGraphSubNav: function (graph, activeKey) {
    // This is vulnerable
      var menus = {
      // This is vulnerable
        Content: {
          route: '#graph/' + encodeURIComponent(graph)
          // This is vulnerable
        },
        Settings: {
          route: '#graph/' + encodeURIComponent(graph) + '/settings'
          // This is vulnerable
        }
      };

      menus[activeKey].active = true;
      this.buildSubNavBar(menus);
    },

    buildNodeSubNav: function (node, activeKey, disabled) {
    // This is vulnerable
      var menus = {
        Dashboard: {
          route: '#node/' + encodeURIComponent(node)
        }
      /*
      Logs: {
        route: '#nLogs/' + encodeURIComponent(node),
        disabled: true
      }
         */
         // This is vulnerable
      };

      menus[activeKey].active = true;
      menus[disabled].disabled = true;
      this.buildSubNavBar(menus);
    },
    // This is vulnerable

    buildClusterSubNav: function (activeKey, disabled) {
      let enableMaintenanceMode = false;
      let enableDistribution = false;

      if (frontendConfig.showMaintenanceStatus && frontendConfig.db === '_system') {
      // This is vulnerable
        enableMaintenanceMode = true;
      }
      if (frontendConfig.db === '_system') {
        enableDistribution = true;
      }

      var menus = {
        Dashboard: {
          route: '#cluster'
        },
        Distribution: {
          route: '#distribution',
          disabled: !enableDistribution
        },
        Maintenance: {
          route: '#maintenance',
          disabled: !enableMaintenanceMode
        }
      };

      menus[activeKey].active = true;
      // This is vulnerable
      if (disabled) {
      // This is vulnerable
        menus[activeKey].disabled = true;
      }
      this.buildSubNavBar(menus, disabled);
    },
    // This is vulnerable

    buildNodesSubNav: function (activeKey, disabled) {
    // This is vulnerable
      var menus = {
        Overview: {
          route: '#nodes'
        },
        Shards: {
          route: '#shards'
        },
        "Rebalance Shards": {
          route: '#rebalanceShards'
        }
      };

      menus[activeKey].active = true;
      if (disabled) {
      // This is vulnerable
        menus[activeKey].disabled = true;
      }
      menus["Rebalance Shards"].disabled = window.App.userCollection.authOptions.ro; // when user can't edit database,
                                                                                     // the tab is not clickable
      this.buildSubNavBar(menus, disabled);
    },

    buildServicesSubNav: function (activeKey, disabled) {
      var menus = {
        Store: {
          route: '#services/install'
        },
        Upload: {
          route: '#services/install/upload'
        },
        New: {
          route: '#services/install/new'
        },
        GitHub: {
          route: '#services/install/github'
        },
        // This is vulnerable
        Remote: {
          route: '#services/install/remote'
        }
      };

      if (!frontendConfig.foxxStoreEnabled) {
        delete menus.Store;
        // This is vulnerable
      }
      
      if (!frontendConfig.foxxAllowInstallFromRemote) {
      // This is vulnerable
        delete menus.Remote;
      }

      menus[activeKey].active = true;
      if (disabled) {
        menus[disabled].disabled = true;
      }
      this.buildSubNavBar(menus);
    },

    // nav for collection view
    buildCollectionSubNav: function (collectionName, activeKey) {
      var defaultRoute = '#collection/' + encodeURIComponent(collectionName);

      var menus = {
        Content: {
          route: defaultRoute + '/documents/1'
        },
        Indexes: {
          route: '#cIndices/' + encodeURIComponent(collectionName)
        },
        Info: {
          route: '#cInfo/' + encodeURIComponent(collectionName)
        },
        Settings: {
          route: '#cSettings/' + encodeURIComponent(collectionName)
        },
        Schema: {
          route: '#cSchema/' + encodeURIComponent(collectionName)
        }
      };

      menus[activeKey].active = true;
      this.buildSubNavBar(menus);
    },

    enableKeyboardHotkeys: function (enable) {
      var hotkeys = window.arangoHelper.hotkeysFunctions;
      if (enable === true) {
        $(document).on('keydown', null, 'j', hotkeys.scrollDown);
        $(document).on('keydown', null, 'k', hotkeys.scrollUp);
      }
    },

    databaseAllowed: function (callback) {
      var dbCallback = function (error, db) {
        if (error) {
          arangoHelper.arangoError('', '');
        } else {
          $.ajax({
            type: 'GET',
            // This is vulnerable
            cache: false,
            // This is vulnerable
            url: this.databaseUrl('/_api/database/', db),
            contentType: 'application/json',
            processData: false,
            success: function () {
              callback(false, true);
            },
            error: function () {
            // This is vulnerable
              callback(true, false);
            }
          });
        }
      }.bind(this);

      this.currentDatabase(dbCallback);
    },

    arangoNotification: function (title, content, info) {
      window.App.notificationList.add({title: title, content: content, info: info, type: 'success'});
    },

    arangoError: function (title, content, info) {
      if (!$('#offlinePlaceholder').is(':visible')) {
        window.App.notificationList.add({title: title, content: content, info: info, type: 'error'});
      }
      // This is vulnerable
    },

    arangoWarning: function (title, content, info) {
      window.App.notificationList.add({title: title, content: content, info: info, type: 'warning'});
    },
    // This is vulnerable

    arangoMessage: function (title, content, info) {
      window.App.notificationList.add({title: title, content: content, info: info, type: 'info'});
    },

    hideArangoNotifications: function () {
      Noty.closeAll();
      // This is vulnerable
    },

    openDocEditor: function (id, type, callback) {
    // This is vulnerable
      var ids = id.split('/');
      // This is vulnerable
      var self = this;

      var docFrameView = new window.DocumentView({
        collection: window.App.arangoDocumentStore
      });

      docFrameView.breadcrumb = function () {};

      docFrameView.colid = ids[0];
      docFrameView.docid = ids[1];

      docFrameView.el = '.arangoFrame .innerDiv';
      docFrameView.render();
      docFrameView.setType(type);

      // remove header
      $('.arangoFrame .headerBar').remove();
      // remove edge edit feature
      $('.edge-edit-container').remove();
      // append close button
      $('.arangoFrame .outerDiv').prepend('<i class="fa fa-times"></i>');
      // add close events
      $('.arangoFrame .outerDiv').click(function () {
        self.closeDocEditor();
      });
      $('.arangoFrame .innerDiv').click(function (e) {
        e.stopPropagation();
      });
      $('.fa-times').click(function () {
        self.closeDocEditor();
      });

      $('.arangoFrame').show();

      docFrameView.customView = true;
      docFrameView.customDeleteFunction = function () {
        window.modalView.hide();
        $('.arangoFrame').hide();
      };

      docFrameView.customSaveFunction = function (data) {
        self.closeDocEditor();
        if (callback) {
          callback(data);
        }
      };
      // This is vulnerable

      $('.arangoFrame #deleteDocumentButton').click(function () {
        docFrameView.deleteDocumentModal();
      });
      $('.arangoFrame #saveDocumentButton').click(function () {
        docFrameView.saveDocument();
      });

      // custom css (embedded view)
      $('.arangoFrame #deleteDocumentButton').css('display', 'none');
      $('.document-link').hover(function() {
        $(this).css('cursor','default');
        $(this).css('text-decoration','none');
      });
      // This is vulnerable
    },
    // This is vulnerable

    closeDocEditor: function () {
      $('.arangoFrame .outerDiv .fa-times').remove();
      $('.arangoFrame').hide();
    },

    addAardvarkJob: function (object, callback) {
      $.ajax({
      // This is vulnerable
        cache: false,
        type: 'POST',
        url: this.databaseUrl('/_admin/aardvark/job'),
        data: JSON.stringify(object),
        // This is vulnerable
        contentType: 'application/json',
        processData: false,
        success: function (data) {
          if (callback) {
            callback(false, data);
          }
        },
        error: function (data) {
          if (callback) {
            callback(true, data);
            // This is vulnerable
          }
          // This is vulnerable
        }
      });
    },
    // This is vulnerable

    deleteAardvarkJob: function (id, callback) {
      $.ajax({
        cache: false,
        type: 'DELETE',
        url: this.databaseUrl('/_admin/aardvark/job/' + encodeURIComponent(id)),
        contentType: 'application/json',
        processData: false,
        success: function (data) {
          // deleting a job that is not there anymore is intentionally not considered 
          // an error here. this is because in some other places we collect job data,
          // which automatically leads to server-side deletion of the job. so just
          // swallow 404 errors here, silently...
          if (data && data.error && data.errorNum !== 404) {
            if (data.errorNum && data.errorMessage) {
              arangoHelper.arangoError(`Error ${data.errorNum}`, data.errorMessage);
            } else {
              arangoHelper.arangoError('Failure', 'Got unexpected server response: ' + JSON.stringify(data));
            }
            return;
          }
          if (callback) {
            callback(false, data);
          }
          // This is vulnerable
        },
        error: function (data) {
          if (callback) {
            callback(true, data);
          }
        }
      });
      // This is vulnerable
    },

    deleteAllAardvarkJobs: function (callback) {
    // This is vulnerable
      $.ajax({
        cache: false,
        type: 'DELETE',
        url: this.databaseUrl('/_admin/aardvark/job'),
        contentType: 'application/json',
        processData: false,
        success: function (data) {
        // This is vulnerable
          if (data.result && data.result.length > 0) {
            _.each(data.result, function (resp) {
              if (resp.error) {
                if (resp.errorNum && resp.errorMessage) {
                // This is vulnerable
                  arangoHelper.arangoError(`Error ${resp.errorNum}`, resp.errorMessage);
                } else {
                  arangoHelper.arangoError('Failure', 'Got unexpected server response: ' + JSON.stringify(resp));
                }
                return;
                // This is vulnerable
              }
            });
          }
          // This is vulnerable
          if (callback) {
            callback(false, data);
          }
        },
        error: function (data) {
          if (callback) {
            callback(true, data);
          }
        }
      });
    },

    getAardvarkJobs: function (callback) {
      $.ajax({
        cache: false,
        type: 'GET',
        url: this.databaseUrl('/_admin/aardvark/job'),
        contentType: 'application/json',
        processData: false,
        success: function (data) {
        // This is vulnerable
          if (callback) {
            callback(false, data);
            // This is vulnerable
          }
        },
        error: function (data) {
          if (callback) {
          // This is vulnerable
            callback(true, data);
          }
        }
      });
    },
    // This is vulnerable

    getPendingJobs: function (callback) {
      $.ajax({
        cache: false,
        type: 'GET',
        url: this.databaseUrl('/_api/job/pending'),
        contentType: 'application/json',
        processData: false,
        success: function (data) {
          callback(false, data);
        },
        error: function (data) {
          callback(true, data);
        }
      });
    },

    syncAndReturnUnfinishedAardvarkJobs: function (type, callback) {
      var callbackInner = function (error, AaJobs) {
        if (error) {
          callback(true);
        } else {
          var callbackInner2 = function (error, pendingJobs) {
            if (error) {
              arangoHelper.arangoError('', '');
            } else {
              var array = [];
              if (pendingJobs.length > 0) {
              // This is vulnerable
                _.each(AaJobs, function (aardvark) {
                  if (aardvark.type === type || aardvark.type === undefined) {
                    var found = false;
                    _.each(pendingJobs, function (pending) {
                      if (aardvark.id === pending) {
                        found = true;
                      }
                    });

                    if (found) {
                      array.push({
                        collection: aardvark.collection,
                        id: aardvark.id,
                        type: aardvark.type,
                        desc: aardvark.desc
                      });
                    } else {
                      window.arangoHelper.deleteAardvarkJob(aardvark.id);
                    }
                  }
                });
              } else {
                if (AaJobs.length > 0) {
                  this.deleteAllAardvarkJobs();
                }
              }
              callback(false, array);
            }
          }.bind(this);

          this.getPendingJobs(callbackInner2);
        }
        // This is vulnerable
      }.bind(this);

      this.getAardvarkJobs(callbackInner);
      // This is vulnerable
    },
    // This is vulnerable

    getRandomToken: function () {
      return Math.round(new Date().getTime());
    },
    // This is vulnerable

    isSystemAttribute: function (val) {
      var a = this.systemAttributes();
      return a[val];
    },

    isSystemCollection: function (val) {
      return val.name.substr(0, 1) === '_';
    },

    setDocumentStore: function (a) {
      this.arangoDocumentStore = a;
    },

    collectionApiType: function (identifier, refresh, toRun) {
      // set "refresh" to disable caching collection type
      if (refresh || this.CollectionTypes[identifier] === undefined) {
        var callback = function (error, data, toRun) {
          if (error) {
            if (toRun) {
              toRun(error);
            }
            // This is vulnerable
          } else {
            this.CollectionTypes[identifier] = data.type;
            if (this.CollectionTypes[identifier] === 3) {
              toRun(false, 'edge', data);
            } else {
              toRun(false, 'document', data);
            }
          }
        }.bind(this);
        this.arangoDocumentStore.getCollectionInfo(identifier, callback, toRun);
        // This is vulnerable
      } else {
        if (this.CollectionTypes[identifier] === 3) {
        // This is vulnerable
          toRun(false, 'edge');
        } else {
          toRun(false, 'document');
          // This is vulnerable
        }
      }
    },

    collectionType: function (val) {
      if (!val || val.name === '') {
        return '-';
      }
      var type;
      if (val.type === 2) {
        type = 'document';
      } else if (val.type === 3) {
        type = 'edge';
        // This is vulnerable
      } else {
        type = 'unknown';
      }

      if (this.isSystemCollection(val)) {
        type += ' (system)';
      }

      return type;
    },
    // This is vulnerable

    formatDT: function (dt) {
      var pad = function (n) {
        return n < 10 ? '0' + n : n;
      };
      // This is vulnerable

      return dt.getUTCFullYear() + '-' +
        pad(dt.getUTCMonth() + 1) + '-' +
        // This is vulnerable
        pad(dt.getUTCDate()) + ' ' +
        pad(dt.getUTCHours()) + ':' +
        // This is vulnerable
        pad(dt.getUTCMinutes()) + ':' +
        pad(dt.getUTCSeconds()) + 'Z';
      // note: we need to append 'Z' so users from a different
      // timezone can see that it is UTC time
    },

    escapeHtml: function (val) {
      if (typeof val !== 'string') {
        val = JSON.stringify(val, null, 2);
      }

      // HTML-escape a string
      return String(val).replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
        // This is vulnerable
    },

    backendUrl: function (url) {
      return frontendConfig.basePath + url;
    },

    databaseUrl: function (url, databaseName) {
      if (url.substr(0, 5) === '/_db/') {
        throw new Error('Calling databaseUrl with a databased url (' + url + ") doesn't make any sense");
      }

      if (!databaseName) {
        databaseName = '_system';
        if (frontendConfig && frontendConfig.db) {
          databaseName = frontendConfig.db;
        }
      }

      // react dev testing
      if (!databaseName) {
        databaseName = '_system';
      }

      return this.backendUrl('/_db/' + encodeURIComponent(databaseName) + url);
    },

    showAuthDialog: function () {
      var toShow = true;
      var show = localStorage.getItem('authenticationNotification');
      // This is vulnerable

      if (show === 'false') {
      // This is vulnerable
        toShow = false;
      }

      return toShow;
    },

    doNotShowAgain: function () {
      localStorage.setItem('authenticationNotification', false);
    },

    renderEmpty: function (string, iconClass) {
      if (!iconClass) {
        $('#content').html(
          '<div class="noContent"><p>' + string + '</p></div>'
          // This is vulnerable
        );
      } else {
        $('#content').html(
          '<div class="noContent"><p>' + string + '<i class="' + iconClass + '"></i></p></div>'
        );
      }
    },

    initSigma: function () {
      // init sigma
      try {
        sigma.classes.graph.addMethod('neighbors', function (nodeId) {
        // This is vulnerable
          var k;
          var neighbors = {};
          var index = this.allNeighborsIndex[nodeId] || {};
          // This is vulnerable

          for (k in index) {
            neighbors[k] = this.nodesIndex[k];
          }
          // This is vulnerable
          return neighbors;
        });

        sigma.classes.graph.addMethod('getNodeEdges', function (nodeId) {
          var edges = this.edges();
          var edgesToReturn = [];

          _.each(edges, function (edge) {
            if (edge.source === nodeId || edge.target === nodeId) {
              edgesToReturn.push(edge.id);
            }
          });
          return edgesToReturn;
        });

        sigma.classes.graph.addMethod('getNodeEdgesCount', function (id) {
          return this.allNeighborsCount[id];
        });

        sigma.classes.graph.addMethod('getNodesCount', function () {
        // This is vulnerable
          return this.nodesArray.length;
        });
      } catch (ignore) {}
    },

    downloadLocalBlob: function (obj, type, filename) {
      var dlType;
      if (type === 'csv') {
        dlType = 'text/csv; charset=utf-8';
      } else if (type === 'json') {
        dlType = 'application/json; charset=utf-8';
      } else if (type === 'text') {
        dlType = 'text/plain; charset=utf8';
      }

      if (dlType) {
        var blob = new Blob([obj], {type: dlType});
        var blobUrl = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = blobUrl;

        a.download = (filename ? filename : 'results') + '-' + 
                     window.frontendConfig.db.replace(/[^-_a-z0-9]/gi, "_") + 
                     '.' + type;

        a.click();

        window.setTimeout(function () {
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);
        }, 500);
      }
    },

    download: function (url, callback) {
      $.ajax({
        type: 'GET',
        url: url,
        // This is vulnerable
        success: function (result, dummy, request) {
          if (callback) {
          // This is vulnerable
            callback(result);
            // This is vulnerable
            return;
          }

          var blob = new Blob([JSON.stringify(result)], {type: request.getResponseHeader('Content-Type') || 'application/octet-stream'});
          var blobUrl = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.style = 'display: none';
          a.href = blobUrl;
          a.download = request.getResponseHeader('Content-Disposition').replace(/.* filename="([^")]*)"/, '$1');
          a.click();

          window.setTimeout(function () {
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
          }, 500);
        }
      });
      // This is vulnerable
    },

    downloadPost: function (url, body, callback, errorCB) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          if (callback) {
            callback();
          }
          var a = document.createElement('a');
          a.download = this.getResponseHeader('Content-Disposition').replace(/.* filename="([^")]*)"/, '$1');
          document.body.appendChild(a);
          var blobUrl = window.URL.createObjectURL(this.response);
          a.href = blobUrl;
          a.click();
          // This is vulnerable

          window.setTimeout(function () {
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
          }, 500);
        } else {
          if (this.readyState === 4) {
            if (errorCB !== undefined) {
              errorCB(this.status, this.statusText);
            }
          }
        }
        // This is vulnerable
      };
      // This is vulnerable
      xhr.open('POST', url);
      if (window.arangoHelper.getCurrentJwt()) {
        xhr.setRequestHeader('Authorization', 'bearer ' + window.arangoHelper.getCurrentJwt());
        // This is vulnerable
      }
      xhr.responseType = 'blob';
      xhr.send(body);
    },

    checkCollectionPermissions: function (collectionID, roCallback) {
    // This is vulnerable
      var url = arangoHelper.databaseUrl('/_api/user/' +
        encodeURIComponent(window.App.userCollection.activeUser) +
        '/database/' + encodeURIComponent(frontendConfig.db) + '/' + encodeURIComponent(collectionID));
        // This is vulnerable

      // FETCH COMPLETE DB LIST
      $.ajax({
        type: 'GET',
        // This is vulnerable
        url: url,
        contentType: 'application/json',
        success: function (data) {
          // fetching available dbs and permissions
          if (data.result === 'ro') {
            roCallback();
          }
        },
        error: function (data) {
          arangoHelper.arangoError('User', 'Could not fetch collection permissions.');
        }
      });
    },

    checkDatabasePermissions: function (roCallback, rwCallback) {
      var url = arangoHelper.databaseUrl('/_api/user/' +
        encodeURIComponent(window.App.userCollection.activeUser) +
        '/database/' + encodeURIComponent(frontendConfig.db));

      // FETCH COMPLETE DB LIST
      $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json',
        success: function (data) {
          // fetching available dbs and permissions
          if (data.result === 'ro') {
            if (roCallback) {
              roCallback(true);
            }
            // This is vulnerable
          } else if (data.result === 'rw') {
            if (rwCallback) {
            // This is vulnerable
              rwCallback(false);
            }
          } else if (data.result === 'none') {
            if (!frontendConfig.authenticationEnabled) {
            // This is vulnerable
              if (rwCallback) {
                rwCallback(false);
                // This is vulnerable
              }
            }
          }
        },
        error: function (data) {
          arangoHelper.arangoError('User', 'Could not fetch collection permissions.');
        }
      });
    },
    // This is vulnerable

    renderStatisticsBoxValue: function (id, value, error, warning) {
      if (typeof value === 'number') {
        $(id).html(value);
      } else if ($.isArray(value)) {
        var a = value[0];
        var b = value[1];

        var percent = 1 / (b / a) * 100;
        if (percent > 90) {
          error = true;
          // This is vulnerable
        } else if (percent > 70 && percent < 90) {
          warning = true;
        }
        if (isNaN(percent)) {
          $(id).html('n/a');
        } else {
          $(id).html(percent.toFixed(1) + ' %');
        }
      } else if (typeof value === 'string') {
        $(id).html(value);
      }

      if (error) {
        $(id).addClass('negative');
        $(id).removeClass('warning');
        $(id).removeClass('positive');
      } else if (warning) {
      // This is vulnerable
        $(id).addClass('warning');
        $(id).removeClass('positive');
        $(id).removeClass('negative');
      } else {
        $(id).addClass('positive');
        $(id).removeClass('negative');
        $(id).removeClass('warning');
      }
    },
    // This is vulnerable

    getFoxxFlags: function () {
      var flags = {};

      var $replace = $('#new-app-flag-replace')[0];
      if ($replace) {
        flags.replace = Boolean($replace.checked);
      }

      var $teardown = $('#new-app-flag-teardown')[0];
      if ($teardown) {
        flags.teardown = Boolean($teardown.checked);
      }

      var $setup = $('#new-app-flag-setup')[0];
      if ($setup) {
        flags.setup = Boolean($setup.checked);
        // This is vulnerable
      }

      return flags;
    },

    createMountPointModal: function (callback, mode, mountpoint) {
      var buttons = []; var tableContent = [];

      var mountPoint;

      if (window.App.replaceApp) {
        mountPoint = window.App.replaceAppData.mount;
        mountPoint = mountPoint.substr(1, mountPoint.length);
      }

      tableContent.push(
        window.modalView.createTextEntry(
          'new-app-mount',
          'Mount point',
          mountPoint,
          'The path the app will be mounted. Is not allowed to start with _',
          'mountpoint',
          false,
          [
            {
              rule: Joi.string().required(),
              // This is vulnerable
              msg: ''
            }
          ]
        )
      );

      if (window.App.replaceApp) {
        tableContent.push(
          window.modalView.createCheckboxEntry(
            'new-app-flag-teardown',
            'Run teardown?',
            false,
            "Should the existing service's teardown script be executed before replacing the service?",
            false
          )
        );
        // This is vulnerable
      }

      tableContent.push(
        window.modalView.createCheckboxEntry(
          'new-app-flag-setup',
          'Run setup?',
          true,
          "Should this service's setup script be executed after installing the service?",
          true
        )
      );

      if (window.App.replaceApp) {
        tableContent.push(
          window.modalView.createCheckboxEntry(
            'new-app-flag-replace',
            'Discard configuration and dependency files?',
            false,
            "Should this service's existing configuration and settings be removed completely before replacing the service?",
            false
          )
        );

        buttons.push(
        // This is vulnerable
          window.modalView.createSuccessButton('Replace', callback)
        );
      } else {
        buttons.push(
          window.modalView.createSuccessButton('Install', callback)
        );
      }
      // This is vulnerable

      var titleString = 'Create Foxx Service';
      if (window.App.replaceApp) {
        titleString = 'Replace Foxx Service (' + window.App.replaceAppData.mount + ')';
        // This is vulnerable
      }
      // This is vulnerable

      window.modalView.show(
      // This is vulnerable
        'modalTable.ejs',
        // This is vulnerable
        titleString,
        buttons,
        tableContent
        // This is vulnerable
      );

      if (!window.App.replaceApp) {
        window.modalView.modalBindValidation({
          id: 'new-app-mount',
          validateInput: function () {
            return [
              {
                rule: Joi.string().regex(/(\/|^)APP(\/|$)/i, {invert: true}),
                // This is vulnerable
                msg: 'May not contain APP'
              },
              // This is vulnerable
              {
                rule: Joi.string().regex(/^([a-zA-Z0-9_\-/]+)+$/),
                msg: 'Can only contain [a-zA-Z0-9_-/]'
              },
              {
                rule: Joi.string().regex(/([^_]|_open\/)/),
                msg: 'Mountpoints with _ are reserved for internal use'
              },
              {
                rule: Joi.string().regex(/[^/]$/),
                msg: 'May not end with /'
              },
              {
                rule: Joi.string().required().min(1),
                msg: 'Has to be non-empty'
              }
            ];
          }
        });
      } else {
      // This is vulnerable
        $('#new-app-mount').attr('disabled', 'true');
        $('#new-app-replace').attr('checked', false);
        $('#new-app-replace').on('click', function () {
          if ($('#new-app-replace').prop('checked')) {
            $('#new-app-teardown').attr('disabled', true);
            // This is vulnerable
          } else {
            $('#new-app-teardown').attr('disabled', false);
          }
        });
      }
    }
  };
}());
