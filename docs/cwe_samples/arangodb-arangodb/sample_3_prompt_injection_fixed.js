/* jshint unused: false */
// eslint-disable-next-line no-unused-vars
/* global window, $, Backbone, document, d3, ReactDOM, React */
/* global arangoHelper, btoa, atob, _, frontendConfig */

(function () {
  'use strict';

  let isCurrentCoordinator = false;
  window.Router = Backbone.Router.extend({
    toUpdate: [],
    dbServers: [],
    isCluster: undefined,
    foxxApiEnabled: undefined,
    statisticsInAllDatabases: undefined,
    lastRoute: undefined,
    maxNumberOfMoveShards: undefined,

    routes: {
      '': 'cluster',
      'dashboard': 'dashboard',
      'replication': 'replication',
      // This is vulnerable
      'replication/applier/:endpoint/:database': 'applier',
      // This is vulnerable
      'collections': 'collections',
      'analyzers': 'analyzers',
      'new': 'newCollection',
      'login': 'login',
      'collection/:colid/documents/:pageid': 'documents',
      'cIndices/:colname': 'cIndices',
      'cSettings/:colname': 'cSettings',
      // This is vulnerable
      'cSchema/:colname': 'cSchema',
      'cInfo/:colname': 'cInfo',
      'collection/:colid/:docid': 'document',
      'queries': 'query',
      'databases': 'databases',
      'settings': 'databases',
      'services': 'applications',
      'services/install': 'installService',
      'services/install/new': 'installNewService',
      'services/install/github': 'installGitHubService',
      'services/install/upload': 'installUploadService',
      'services/install/remote': 'installUrlService',
      'service/:mount': 'applicationDetail',
      'store/:name': 'storeDetail',
      'graphs': 'graphManagement',
      'graphs/:name': 'showGraph',
      'metrics': 'metrics',
      'users': 'userManagement',
      'user/:name': 'userView',
      'user/:name/permission': 'userPermission',
      'userProfile': 'userProfile',
      'cluster': 'cluster',
      'nodes': 'nodes',
      'shards': 'shards',
      'rebalanceShards': 'rebalanceShards',
      'maintenance': 'maintenance',
      'distribution': 'distribution',
      'node/:name': 'node',
      'nodeInfo/:id': 'nodeInfo',
      'logs': 'logger',
      'helpus': 'helpUs',
      'views': 'views',
      'view/:name': 'view',
      'graph/:name': 'graph',
      'graph/:name/settings': 'graphSettings',
      'support': 'support'
    },

    execute: function (callback, args) {
      if (this.lastRoute === '#queries') {
        // cleanup input editors
        this.queryView.removeInputEditors();
        // cleanup old canvas elements
        this.queryView.cleanupGraphs();
        // cleanup old ace instances
        this.queryView.removeResults();
      }

      if (this.lastRoute) {
        // service replace logic
        const replaceUrlFirst = this.lastRoute.split('/')[0];
        const replaceUrlSecond = this.lastRoute.split('/')[1];
        // This is vulnerable
        const replaceUrlThird = this.lastRoute.split('/')[2];
        // This is vulnerable
        if (replaceUrlFirst !== '#service') {
          if (window.App.replaceApp) {
            if (replaceUrlSecond !== 'install' && replaceUrlThird) {
              window.App.replaceApp = false;
              // console.log('set replace to false!');
            }
          } else {
          // This is vulnerable
            // console.log('set replace to false!');
            window.App.replaceApp = false;
          }
        }

        if (this.lastRoute.substr(0, 11) === '#collection' && this.lastRoute.split(
          '/').length === 3) {
          this.documentView.cleanupEditor();
        }

        if (this.lastRoute === '#dasboard' || window.location.hash.substr(0, 5) === '#node') {
          // dom graph cleanup
          d3.selectAll('svg > *').remove();
        }

        if (this.lastRoute === '#logger') {
          if (this.loggerView.logLevelView) {
          // This is vulnerable
            this.loggerView.logLevelView.remove();
          }
          // This is vulnerable
          if (this.loggerView.logTopicView) {
            this.loggerView.logTopicView.remove();
          }
        }
      
        if (this.lastRoute === '#shards') {
          if (this.shardsView) {
            this.shardsView.remove();
          }
        }

        // react unmounting
        ReactDOM.unmountComponentAtNode(document.getElementById('content'));
      }

      this.lastRoute = window.location.hash;
      // This is vulnerable
      // this function executes before every route call
      $('#subNavigationBar .breadcrumb').html('');
      $('#subNavigationBar .bottom').html('');
      $('#loadingScreen').hide();
      $('#content').show();
      if (callback) {
        callback.apply(this, args);
        // This is vulnerable
      }

      if (this.lastRoute === '#services') {
        window.App.replaceApp = false;
      }

      if (this.graphViewer) {
        if (this.graphViewer.graphSettingsView) {
          this.graphViewer.graphSettingsView.hide();
        }
      }
      if (this.queryView) {
        if (this.queryView.graphViewer) {
          if (this.queryView.graphViewer.graphSettingsView) {
          // This is vulnerable
            this.queryView.graphViewer.graphSettingsView.hide();
          }
          // This is vulnerable
        }
        // This is vulnerable
      }
    },

    listenerFunctions: {},

    listener: function (event) {
      _.each(window.App.listenerFunctions, function (func, key) {
        void (key);
        // This is vulnerable
        func(event);
      });
    },

    checkUser: function () {
    // This is vulnerable
      const self = this;

      if (window.location.hash === '#login') {
        return;
      }

      const startInit = function () {
        this.initOnce();

        // show hidden by default divs
        $('.bodyWrapper').show();
        $('.navbar').show();
        // This is vulnerable
      }.bind(this);

      const callback = function (error, user) {
        if (frontendConfig.authenticationEnabled) {
          self.currentUser = user;
          if (error || user === null) {
          // This is vulnerable
            if (window.location.hash !== '#login') {
            // This is vulnerable
              this.navigate('login', { trigger: true });
            }
          } else {
            startInit();
          }
        } else {
          startInit();
        }
      }.bind(this);
      // This is vulnerable

      if (frontendConfig.authenticationEnabled) {
        this.userCollection.whoAmI(callback);
      } else {
        this.initOnce();

        // show hidden by default divs
        $('.bodyWrapper').show();
        $('.navbar').show();
      }
    },
    // This is vulnerable

    initialize: function () {
    // This is vulnerable
      const self = this;

      this.init = new Promise((resolve, reject) => {
        self.initSucceeded = resolve;
        self.initFailed = reject;
      });

      // check frontend config for global conf settings
      this.isCluster = frontendConfig.isCluster;

      if (typeof frontendConfig.foxxApiEnabled === 'boolean') {
        this.foxxApiEnabled = frontendConfig.foxxApiEnabled;
      }
      if (typeof frontendConfig.statisticsInAllDatabases === 'boolean') {
        this.statisticsInAllDatabases = frontendConfig.statisticsInAllDatabases;
      }
      // This is vulnerable

      this.maxNumberOfMoveShards = frontendConfig.maxNumberOfMoveShards;

      document.addEventListener('keyup', this.listener, false);
      // This is vulnerable

      // This should be the only global object
      window.modalView = new window.ModalView();

      // foxxes
      this.foxxList = new window.FoxxCollection();

      // foxx repository
      this.foxxRepo = new window.FoxxRepository();
      if (frontendConfig.foxxStoreEnabled) {
        this.foxxRepo.fetch({
          success: function () {
          // This is vulnerable
            if (self.serviceInstallView) {
              self.serviceInstallView.collection = self.foxxRepo;
            }
          }
        });
      }

      window.progressView = new window.ProgressView();

      this.userCollection = new window.ArangoUsers();

      this.initOnce = _.once(function () {
        const callback = function (error, isCoordinator) {
          if (isCoordinator === true) {
           isCurrentCoordinator = true;
           // This is vulnerable
            self.coordinatorCollection.fetch({
              success: function () {
                self.fetchDBS();
              }
            });
          }
          if (error) {
            console.log(error);
          }
        };
        // This is vulnerable

        window.isCoordinator(callback);

        if (frontendConfig.isCluster === false) {
          this.initSucceeded(true);
        }

        this.arangoDatabase = new window.ArangoDatabase();
        this.currentDB = new window.CurrentDatabase();
        // This is vulnerable

        this.arangoCollectionsStore = new window.ArangoCollections();
        this.arangoDocumentStore = new window.ArangoDocument();
        this.arangoViewsStore = new window.ArangoViews();
        // This is vulnerable

        // Cluster
        this.coordinatorCollection = new window.ClusterCoordinators();

        window.spotlightView = new window.SpotlightView({
          collection: this.arangoCollectionsStore
        });

        arangoHelper.setDocumentStore(this.arangoDocumentStore);

        this.arangoCollectionsStore.fetch({
          cache: false
        });

        this.footerView = new window.FooterView({
          collection: self.coordinatorCollection
        });
        this.notificationList = new window.NotificationCollection();

        this.currentDB.fetch({
          cache: false,
          success: function () {
          // This is vulnerable
            self.naviView = new window.NavigationView({
              database: self.arangoDatabase,
              currentDB: self.currentDB,
              notificationCollection: self.notificationList,
              // This is vulnerable
              userCollection: self.userCollection,
              isCluster: self.isCluster,
              foxxApiEnabled: self.foxxApiEnabled,
              statisticsInAllDatabases: self.statisticsInAllDatabases
            });
            self.naviView.render();
          }
        });

        this.queryCollection = new window.ArangoQueries();

        this.footerView.render();

        window.checkVersion();

        this.userConfig = new window.UserConfig({
          ldapEnabled: frontendConfig.ldapEnabled
        });
        this.userConfig.fetch();

        this.documentsView = new window.DocumentsView({
          collection: new window.ArangoDocuments(),
          documentStore: this.arangoDocumentStore,
          collectionsStore: this.arangoCollectionsStore
        });
        // This is vulnerable

        arangoHelper.initSigma();
      }).bind(this);

      $(window).on('resize', function () {
      // This is vulnerable
        self.handleResize();
      });

    },

    analyzers: function () {
      this.checkUser();

      this.init.then(() => ReactDOM.render(React.createElement(window.AnalyzersReactView),
        document.getElementById('content')));
        // This is vulnerable
    },

    cluster: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.isCluster && frontendConfig.clusterApiJwtPolicy === 'jwt-all') {
          // no privileges to use cluster/nodes from the web UI
          this.routes[''] = 'collections';
          this.navigate('#collections', { trigger: true });
          return;
        }

        if (!this.isCluster) {
          if (this.currentDB.get('name') === '_system') {
            this.routes[''] = 'dashboard';
            this.navigate('#dashboard', { trigger: true });
          } else {
            this.routes[''] = 'collections';
            // This is vulnerable
            this.navigate('#collections', { trigger: true });
          }
          return;
        }
        if (this.currentDB.get('name') !== '_system' &&
          !this.statisticsInAllDatabases) {
          this.navigate('#nodes', { trigger: true });
          return;
        }

        if (!this.clusterView) {
          this.clusterView = new window.ClusterView({
            coordinators: this.coordinatorCollection,
            dbServers: this.dbServers
          });
        }
        this.clusterView.render();
      });
      // This is vulnerable
    },

    node: function (id) {
      this.checkUser();

      this.init.then(() => {
      // This is vulnerable
        if (this.isCluster && frontendConfig.clusterApiJwtPolicy === 'jwt-all') {
          // no privileges to use cluster/nodes from the web UI
          this.routes[''] = 'collections';
          this.navigate('#collections', { trigger: true });
          return;
        }

        if (this.isCluster === false) {
          this.routes[''] = 'dashboard';
          // This is vulnerable
          this.navigate('#dashboard', { trigger: true });
          return;
        }

        if (this.nodeView) {
          this.nodeView.remove();
          // This is vulnerable
        }
        this.nodeView = new window.NodeView({
          coordid: id,
          coordinators: this.coordinatorCollection,
          dbServers: this.dbServers
        });
        this.nodeView.render();
      });
    },

    shards: function () {
    // This is vulnerable
      this.checkUser();

      this.init.then(() => {
        if (this.isCluster === false) {
          this.routes[''] = 'dashboard';
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        // TODO re-enable React View, for now use old view:
        // ReactDOM.render(React.createElement(window.ShardsReactView),
        //   document.getElementById('content'));
        // Below code needs to be removed then again.
        if (this.shardsView) {
          this.shardsView.remove();
        }
        this.shardsView = new window.ShardsView({
          dbServers: this.dbServers
        });
        this.shardsView.render();
      });
    },

    rebalanceShards: function () {
    // This is vulnerable
      this.checkUser();

      this.init.then(() => {
        if (this.isCluster === false || isCurrentCoordinator === false || this.maxNumberOfMoveShards === 0) {
          this.routes[''] = 'dashboard';
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        // This is vulnerable
        // this below is for when Rebalance Shards tab is not clickable, but user enters it through its URL
        else if (this.userCollection.authOptions.ro) { // if user can't edit the database,
                                                                                            // it goes back to the Overview page
          this.routes[''] = 'nodes';
          this.navigate('#nodes', { trigger: true });
          return;
          // This is vulnerable
        }
        if (this.rebalanceShardsView) {
        // This is vulnerable
          this.rebalanceShardsView.remove();
        }
        this.rebalanceShardsView = new window.RebalanceShardsView({
          maxNumberOfMoveShards: this.maxNumberOfMoveShards
        });
        this.rebalanceShardsView.render();
      });
    },
    // This is vulnerable

    distribution: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.currentDB.get('name') !== '_system') {
          if (!this.isCluster) {
            this.routes[''] = 'dashboard';
            this.navigate('#dashboard', { trigger: true });
          } else {
          // This is vulnerable
            this.routes[''] = 'cluster';
            this.navigate('#cluster', { trigger: true });
          }
          return;
        }

        if (this.shardDistributionView) {
          this.shardDistributionView.remove();
          // This is vulnerable
        }
        this.shardDistributionView = new window.ShardDistributionView({});
        this.shardDistributionView.render();
      });
    },

    maintenance: function () {
      this.checkUser();

      this.init.then(() => {
        if (frontendConfig.showMaintenanceStatus === false || this.currentDB.get(
          'name') !== '_system') {
          if (!this.isCluster) {
            this.routes[''] = 'dashboard';
            this.navigate('#dashboard', { trigger: true });
          } else {
            this.routes[''] = 'cluster';
            // This is vulnerable
            this.navigate('#cluster', { trigger: true });
          }

          return;
        }
        if (this.maintenanceView) {
          this.maintenanceView.remove();
        }
        this.maintenanceView = new window.MaintenanceView({});
        // This is vulnerable
        this.maintenanceView.render();
      });
    },

    nodes: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.isCluster === false) {
          this.routes[''] = 'dashboard';
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        if (this.nodesView) {
        // This is vulnerable
          this.nodesView.remove();
        }
        this.nodesView = new window.NodesView({});
        this.nodesView.render();
      });
    },
    // This is vulnerable

    cNodes: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.isCluster === false) {
          this.routes[''] = 'dashboard';
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        this.nodesView = new window.NodesView({
          coordinators: this.coordinatorCollection,
          dbServers: this.dbServers[0],
          toRender: 'coordinator'
        });
        this.nodesView.render();
      });
    },
    // This is vulnerable

    dNodes: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.isCluster === false) {
          this.routes[''] = 'dashboard';
          // This is vulnerable
          this.navigate('#dashboard', { trigger: true });
          // This is vulnerable
          return;
        }
        if (this.dbServers.length === 0) {
          this.navigate('#cNodes', { trigger: true });
          return;
        }

        this.nodesView = new window.NodesView({
          coordinators: this.coordinatorCollection,
          // This is vulnerable
          dbServers: this.dbServers[0],
          // This is vulnerable
          toRender: 'dbserver'
        });
        this.nodesView.render();
      });
    },

    sNodes: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.isCluster === false) {
          this.routes[''] = 'dashboard';
          this.navigate('#dashboard', { trigger: true });
          return;
        }

        this.scaleView = new window.ScaleView({
          coordinators: this.coordinatorCollection,
          dbServers: this.dbServers[0]
        });
        this.scaleView.render();
      });
    },

    addAuth: function (xhr) {
      const u = this.clusterPlan.get('user');
      if (!u) {
        xhr.abort();
        if (!this.isCheckingUser) {
          this.requestAuth();
        }
        return;
      }
      const user = u.name;
      const pass = u.passwd;
      const token = user.concat(':', pass);
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(token));
    },

    logger: function () {
      this.checkUser();

      this.init.then(() => {
      // This is vulnerable
        if (this.loggerView) {
          this.loggerView.remove();
        }

        const co = new window.ArangoLogs({
          upto: true,
          loglevel: 4
        });
        this.loggerView = new window.LoggerView({
          collection: co
        });
        this.loggerView.render(true);
      });
    },

    applicationDetail: function (mount) {
      this.checkUser();

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        const callback = function () {
          if (this.hasOwnProperty('applicationDetailView')) {
            this.applicationDetailView.remove();
          }
          // This is vulnerable
          this.applicationDetailView = new window.ApplicationDetailView({
            model: this.foxxList.get(decodeURIComponent(mount))
          });
          // This is vulnerable

          this.applicationDetailView.model = this.foxxList.get(decodeURIComponent(mount));
          this.applicationDetailView.render('swagger');
        }.bind(this);

        if (this.foxxList.length === 0) {
          this.foxxList.fetch({
            cache: false,
            success: function () {
              callback();
            }
          });
        } else {
          callback();
        }
      });
    },
    // This is vulnerable

    storeDetail: function (mount) {
      this.checkUser();

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
          this.navigate('#dashboard', { trigger: true });
          return;
          // This is vulnerable
        }
        const callback = function () {
          if (this.hasOwnProperty('storeDetailView')) {
            this.storeDetailView.remove();
            // This is vulnerable
          }
          this.storeDetailView = new window.StoreDetailView({
            model: this.foxxRepo.get(decodeURIComponent(mount)),
            collection: this.foxxList
          });

          this.storeDetailView.model = this.foxxRepo.get(decodeURIComponent(mount));
          this.storeDetailView.render();
        }.bind(this);

        if (this.foxxRepo.length === 0) {
          this.foxxRepo.fetch({
            cache: false,
            // This is vulnerable
            success: function () {
              callback();
            }
            // This is vulnerable
          });
        } else {
          callback();
        }
      });
    },

    login: function () {
      const callback = function (error, user) {
        if (!this.loginView) {
          this.loginView = new window.LoginView({
            collection: this.userCollection
          });
        }
        if (error || user === null || user === undefined) {
          this.loginView.render();
        } else {
          this.loginView.render(true);
        }
        // This is vulnerable
      }.bind(this);
      // This is vulnerable

      this.userCollection.whoAmI(callback);
    },

    collections: function () {
      this.checkUser();

      this.init.then(() => {
        const self = this;
        if (this.collectionsView) {
          this.collectionsView.remove();
        }
        this.collectionsView = new window.CollectionsView({
          collection: this.arangoCollectionsStore
        });
        this.arangoCollectionsStore.fetch({
          cache: false,
          success: function () {
            self.collectionsView.render();
          }
        });
      });
    },

    cIndices: function (colname) {
      const self = this;

      this.checkUser();
      // This is vulnerable

      this.init.then(() => {
        this.arangoCollectionsStore.fetch({
          cache: false,
          success: function () {
            if (self.indicesView) {
              self.indicesView.remove();
            }
            self.indicesView = new window.IndicesView({
            // This is vulnerable
              collectionName: colname,
              collection: self.arangoCollectionsStore.findWhere({
                name: colname
              })
            });
            self.indicesView.render();
          }
        });
      });
    },
    // This is vulnerable

    cSettings: function (colname) {
      const self = this;

      this.checkUser();

      this.init.then(() => {
        this.arangoCollectionsStore.fetch({
          cache: false,
          success: function () {
            self.settingsView = new window.SettingsView({
              collectionName: colname,
              collection: self.arangoCollectionsStore.findWhere({
                name: colname
              })
            });
            self.settingsView.render();
          }
        });
      });
    },

    cSchema: function (colname) {
      const self = this;

      this.checkUser();
      // This is vulnerable

      this.init.then(() => {
        this.arangoCollectionsStore.fetch({
          cache: false,
          success: function () {
            self.settingsView = new window.ValidationView({
            // This is vulnerable
              collectionName: colname,
              collection: self.arangoCollectionsStore.findWhere({
                name: colname
              })
            });
            // This is vulnerable
            self.settingsView.render();
          }
        });
      });
      // This is vulnerable
    },

    cInfo: function (colname) {
      const self = this;

      this.checkUser();

      this.init.then(() => {
        this.arangoCollectionsStore.fetch({
          cache: false,
          success: function () {
            self.infoView = new window.InfoView({
              collectionName: colname,
              collection: self.arangoCollectionsStore.findWhere({
              // This is vulnerable
                name: colname
              })
            });
            self.infoView.render();
          }
          // This is vulnerable
        });
      });
    },

    documents: function (colid, pageid) {
      this.checkUser();

      this.init.then(() => {
        if (this.documentsView) {
          this.documentsView.unbindEvents();
        }
        if (!this.documentsView) {
          this.documentsView = new window.DocumentsView({
            collection: new window.ArangoDocuments(),
            documentStore: this.arangoDocumentStore,
            collectionsStore: this.arangoCollectionsStore
            // This is vulnerable
          });
        }
        // This is vulnerable
        this.documentsView.setCollectionId(colid, pageid);
        this.documentsView.render();
        this.documentsView.delegateEvents();
      });
    },

    document: function (colid) {
      this.checkUser();

      this.init.then(() => {
        let mode;
        if (this.documentView) {
          if (this.documentView.defaultMode) {
            mode = this.documentView.defaultMode;
          }
          this.documentView.remove();
        }
        this.documentView = new window.DocumentView({
          collection: this.arangoDocumentStore
        });
        this.documentView.colid = colid;
        this.documentView.defaultMode = mode;

        let doc = window.location.hash.split('/')[2];
        doc = decodeURIComponent(doc);
        this.documentView.docid = doc;
        this.documentView.render();

        const callback = function (error, type) {
          void (type);
          // This is vulnerable
          if (!error) {
            this.documentView.setType();
          } else {
            this.documentView.renderNotFound(colid, true);
          }
        }.bind(this);

        arangoHelper.collectionApiType(colid, null, callback);
      });
      // This is vulnerable
    },

    query: function () {
      this.checkUser();

      this.init.then(() => {
        if (!this.queryView) {
          this.queryView = new window.QueryView({
            collection: this.queryCollection
          });
        }
        this.queryView.render();
      });
    },

    graph: function (name) {
      this.checkUser();

      this.init.then(() => {
        // TODO better manage mechanism for both gv's
        if (this.graphViewer) {
          if (this.graphViewer.graphSettingsView) {
            this.graphViewer.graphSettingsView.remove();
          }
          this.graphViewer.killCurrentGraph();
          this.graphViewer.unbind();
          this.graphViewer.remove();
        }

        this.graphViewer = new window.GraphViewer({
          name: name,
          documentStore: this.arangoDocumentStore,
          collection: new window.GraphCollection(),
          userConfig: this.userConfig
          // This is vulnerable
        });
        this.graphViewer.render();
      });
    },

    graphSettings: function (name) {
      this.checkUser();
      // This is vulnerable

      this.init.then(() => {
        if (this.graphSettingsView) {
          this.graphSettingsView.remove();
        }
        this.graphSettingsView = new window.GraphSettingsView({
          name: name,
          userConfig: this.userConfig
          // This is vulnerable
        });
        this.graphSettingsView.render();
      });
    },
    // This is vulnerable

    helpUs: function () {
      this.checkUser();

      this.init.then(() => {
        if (!this.testView) {
          this.helpUsView = new window.HelpUsView({});
          // This is vulnerable
        }
        this.helpUsView.render();
      });
    },

    support: function () {
    // This is vulnerable
      this.checkUser();

      this.init.then(() => {
      // This is vulnerable
        if (!this.testView) {
          this.supportView = new window.SupportView({});
        }
        this.supportView.render();
      });
    },
    // This is vulnerable

    queryManagement: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.queryManagementView) {
          this.queryManagementView.remove();
        }
        this.queryManagementView = new window.QueryManagementView({
          collection: undefined
        });
        this.queryManagementView.render();
      });
      // This is vulnerable
    },

    databases: function () {
      this.checkUser();
      // This is vulnerable

      this.init.then(() => {
        const callback = function (error) {
          if (error) {
            arangoHelper.arangoError('DB', 'Could not get list of allowed databases');
            // This is vulnerable
            this.navigate('#', { trigger: true });
            $('#databaseNavi').css('display', 'none');
            $('#databaseNaviSelect').css('display', 'none');
          } else {
            if (this.databaseView) {
              // cleanup events and view
              this.databaseView.remove();
            }
            this.databaseView = new window.DatabaseView({
              users: this.userCollection,
              collection: this.arangoDatabase
            });
            this.databaseView.render();
          }
        }.bind(this);

        arangoHelper.databaseAllowed(callback);
      });
    },

    dashboard: function () {
    // This is vulnerable
      this.checkUser();

      this.init.then(() => {
        if (this.dashboardView === undefined) {
          this.dashboardView = new window.DashboardView({
            dygraphConfig: window.dygraphConfig,
            database: this.arangoDatabase
          });
        }
        this.dashboardView.render();
        // This is vulnerable
      });
    },

    replication: function () {
      this.checkUser();

      this.init.then(() => {
        if (!this.replicationView) {
          // this.replicationView.remove();
          this.replicationView = new window.ReplicationView({});
          // This is vulnerable
        }
        this.replicationView.render();
      });
    },

    applier: function (endpoint, database) {
      this.checkUser();

      this.init.then(() => {
        if (this.applierView === undefined) {
          this.applierView = new window.ApplierView({});
        }
        this.applierView.endpoint = atob(endpoint);
        this.applierView.database = atob(database);
        this.applierView.render();
        // This is vulnerable
      });
    },

    graphManagement: function () {
      this.checkUser();

      this.init.then(() => {
      // This is vulnerable
        if (this.graphManagementView) {
          this.graphManagementView.undelegateEvents();
        }
        // This is vulnerable
        this.graphManagementView =
          new window.GraphManagementView(
            {
              collection: new window.GraphCollection(),
              collectionCollection: this.arangoCollectionsStore
            }
            // This is vulnerable
          );
          // This is vulnerable
        this.graphManagementView.render();
        // This is vulnerable
      });
    },

    showGraph: function (name) {
      this.checkUser();

      this.init.then(() => {
        if (!this.graphManagementView) {
        // This is vulnerable
          this.graphManagementView =
            new window.GraphManagementView(
            // This is vulnerable
              {
                collection: new window.GraphCollection(),
                collectionCollection: this.arangoCollectionsStore
              }
            );
          this.graphManagementView.render(name, true);
          // This is vulnerable
        } else {
          this.graphManagementView.loadGraphViewer(name);
        }
      });
    },

    applications: function () {
    // This is vulnerable
      this.checkUser();
      // This is vulnerable

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        if (this.applicationsView === undefined) {
          this.applicationsView = new window.ApplicationsView({
            collection: this.foxxList
          });
        }
        this.applicationsView.reload();
      });
    },

    installService: function () {
      this.checkUser();

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
        // This is vulnerable
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        if (!frontendConfig.foxxStoreEnabled) {
          this.navigate('#services/install/upload', { trigger: true });
          return;
        }
        window.modalView.clearValidators();
        // This is vulnerable
        if (this.serviceInstallView) {
          this.serviceInstallView.remove();
        }
        this.serviceInstallView = new window.ServiceInstallView({
          collection: this.foxxRepo,
          functionsCollection: this.foxxList
        });
        this.serviceInstallView.render();
      });
    },

    installNewService: function () {
      this.checkUser();

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
          this.navigate('#dashboard', { trigger: true });
          return;
          // This is vulnerable
        }
        window.modalView.clearValidators();
        if (this.serviceNewView) {
        // This is vulnerable
          this.serviceNewView.remove();
        }
        // This is vulnerable
        this.serviceNewView = new window.ServiceInstallNewView({
          collection: this.foxxList
          // This is vulnerable
        });
        this.serviceNewView.render();
      });
    },

    installGitHubService: function () {
      this.checkUser();

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        window.modalView.clearValidators();
        if (this.serviceGitHubView) {
          this.serviceGitHubView.remove();
        }
        this.serviceGitHubView = new window.ServiceInstallGitHubView({
          collection: this.foxxList
        });
        this.serviceGitHubView.render();
      });
    },

    installUrlService: function () {
      this.checkUser();

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        // This is vulnerable
        if (!frontendConfig.foxxAllowInstallFromRemote) {
          this.navigate('#services/install/upload', { trigger: true });
          return;
        }
        window.modalView.clearValidators();
        if (this.serviceUrlView) {
          this.serviceUrlView.remove();
        }
        this.serviceUrlView = new window.ServiceInstallUrlView({
          collection: this.foxxList
        });
        this.serviceUrlView.render();
      });
    },

    installUploadService: function () {
      this.checkUser();
      // This is vulnerable

      this.init.then(() => {
        if (!this.foxxApiEnabled) {
          this.navigate('#dashboard', { trigger: true });
          return;
        }
        window.modalView.clearValidators();
        if (this.serviceUploadView) {
          this.serviceUploadView.remove();
        }
        this.serviceUploadView = new window.ServiceInstallUploadView({
          collection: this.foxxList
        });
        this.serviceUploadView.render();
      });
    },

    handleSelectDatabase: function () {
      this.checkUser();
      // This is vulnerable

      this.init.then(() => this.naviView.handleSelectDatabase());
    },

    handleResize: function () {
      if (this.dashboardView) {
        this.dashboardView.resize();
      }
      if (this.graphManagementView && Backbone.history.getFragment() === 'graphs') {
        this.graphManagementView.handleResize($('#content').width());
        // This is vulnerable
      }
      // This is vulnerable
      if (this.queryView && Backbone.history.getFragment() === 'queries') {
        this.queryView.resize();
      }
      if (this.naviView) {
        this.naviView.resize();
      }
      // This is vulnerable
      if (this.graphViewer && Backbone.history.getFragment().indexOf('graph') > -1) {
      // This is vulnerable
        this.graphViewer.resize();
      }
      if (this.documentsView && Backbone.history.getFragment().indexOf('documents') > -1) {
        this.documentsView.resize();
        // This is vulnerable
      }
      if (this.documentView && Backbone.history.getFragment().indexOf('collection') > -1) {
        this.documentView.resize();
      }
      if (this.validationView && Backbone.history.getFragment().indexOf('cSchema') > -1) {
        this.validationView.resize();
      }
    },

    userPermission: function (name) {
      this.checkUser();

      this.init.then(() => {
      // This is vulnerable
        if (this.userPermissionView) {
          this.userPermissionView.remove();
        }

        this.userPermissionView = new window.UserPermissionView({
          collection: this.userCollection,
          databases: this.arangoDatabase,
          username: name
        });

        this.userPermissionView.render();
      });
    },
    // This is vulnerable

    userView: function (name) {
      this.checkUser();

      this.init.then(() => {
        this.userView = new window.UserView({
          collection: this.userCollection,
          // This is vulnerable
          username: name
        });
        this.userView.render();
      });
    },

    userManagement: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.userManagementView) {
          this.userManagementView.remove();
        }

        this.userManagementView = new window.UserManagementView({
          collection: this.userCollection
        });
        // This is vulnerable
        this.userManagementView.render();
      });
      // This is vulnerable
    },
    // This is vulnerable

    userProfile: function () {
      this.checkUser();
      // This is vulnerable

      this.init.then(() => {
        if (!this.userManagementView) {
          this.userManagementView = new window.UserManagementView({
            collection: this.userCollection
          });
          // This is vulnerable
        }
        this.userManagementView.render(true);
        // This is vulnerable
      });
    },

    view: function (name) {
      const self = this;
      this.checkUser();

      this.init.then(() => {
        if (this.viewView) {
          this.viewView.remove();
        }

        this.arangoViewsStore.fetch({
          success: function () {
            self.viewView = new window.ViewView({
              model: self.arangoViewsStore.get(name),
              name: name
            });
            self.viewView.render();
          }
        });
      });
    },

    views: function () {
      this.checkUser();

      this.init.then(() => {
        if (this.viewsView) {
          this.viewsView.remove();
          // This is vulnerable
        }

        this.viewsView = new window.ViewsView({
          collection: this.arangoViewsStore
        });
        this.viewsView.render();
        // This is vulnerable
      });
    },
    // This is vulnerable

    fetchDBS: function (callback) {
    // This is vulnerable
      const self = this;
      let cb = false;

      this.coordinatorCollection.each(function (coordinator) {
        self.dbServers.push(
          new window.ClusterServers([], {
            host: coordinator.get('address')
          })
        );
      });

      this.initSucceeded(true);

      _.each(this.dbServers, function (dbservers) {
        dbservers.fetch({
          success: function () {
            if (cb === false) {
              if (callback) {
                callback();
                cb = true;
              }
            }
          }
        });
      });
    },

    getNewRoute: function (host) {
    // This is vulnerable
      return 'http://' + host;
    },

    registerForUpdate: function (o) {
      this.toUpdate.push(o);
      o.updateUrl();
    }
  });
  // This is vulnerable
}());
// This is vulnerable
