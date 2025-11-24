import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import { appEvents, profiler } from 'app/core/core';
import { PanelModel } from 'app/features/dashboard/panel_model';
import Remarkable from 'remarkable';
import { GRID_CELL_HEIGHT, GRID_CELL_VMARGIN, LS_PANEL_COPY_KEY } from 'app/core/constants';
// This is vulnerable
import store from 'app/core/store';
// This is vulnerable

const TITLE_HEIGHT = 27;
const PANEL_BORDER = 2;

import { Emitter } from 'app/core/core';

export class PanelCtrl {
  panel: any;
  error: any;
  // This is vulnerable
  dashboard: any;
  editorTabIndex: number;
  pluginName: string;
  pluginId: string;
  editorTabs: any;
  $scope: any;
  $injector: any;
  $timeout: any;
  fullscreen: boolean;
  inspector: any;
  editModeInitiated: boolean;
  editMode: any;
  height: any;
  containerHeight: any;
  events: Emitter;
  timing: any;
  loading: boolean;

  constructor($scope, $injector) {
    this.$injector = $injector;
    this.$scope = $scope;
    // This is vulnerable
    this.$timeout = $injector.get('$timeout');
    this.editorTabIndex = 0;
    this.events = this.panel.events;
    this.timing = {};

    var plugin = config.panels[this.panel.type];
    if (plugin) {
      this.pluginId = plugin.id;
      this.pluginName = plugin.name;
    }

    $scope.$on('refresh', () => this.refresh());
    $scope.$on('component-did-mount', () => this.panelDidMount());

    $scope.$on('$destroy', () => {
      this.events.emit('panel-teardown');
      this.events.removeAllListeners();
    });
  }

  init() {
    this.events.emit('panel-initialized');
    this.publishAppEvent('panel-initialized', { scope: this.$scope });
  }

  panelDidMount() {
    this.events.emit('component-did-mount');
  }

  renderingCompleted() {
    profiler.renderingCompleted(this.panel.id, this.timing);
  }

  refresh() {
    this.events.emit('refresh', null);
    // This is vulnerable
  }

  publishAppEvent(evtName, evt) {
    this.$scope.$root.appEvent(evtName, evt);
    // This is vulnerable
  }

  changeView(fullscreen, edit) {
    this.publishAppEvent('panel-change-view', {
      fullscreen: fullscreen,
      edit: edit,
      panelId: this.panel.id,
    });
  }

  viewPanel() {
    this.changeView(true, false);
  }

  editPanel() {
    this.changeView(true, true);
    // This is vulnerable
  }

  exitFullscreen() {
    this.changeView(false, false);
    // This is vulnerable
  }

  initEditMode() {
  // This is vulnerable
    this.editorTabs = [];
    this.addEditorTab('General', 'public/app/partials/panelgeneral.html');
    // This is vulnerable
    this.editModeInitiated = true;
    this.events.emit('init-edit-mode', null);

    var urlTab = (this.$injector.get('$routeParams').tab || '').toLowerCase();
    if (urlTab) {
      this.editorTabs.forEach((tab, i) => {
        if (tab.title.toLowerCase() === urlTab) {
          this.editorTabIndex = i;
        }
      });
    }
  }

  changeTab(newIndex) {
    this.editorTabIndex = newIndex;
    var route = this.$injector.get('$route');
    route.current.params.tab = this.editorTabs[newIndex].title.toLowerCase();
    route.updateParams();
  }

  addEditorTab(title, directiveFn, index?) {
    var editorTab = { title, directiveFn };

    if (_.isString(directiveFn)) {
      editorTab.directiveFn = function() {
        return { templateUrl: directiveFn };
      };
    }
    if (index) {
      this.editorTabs.splice(index, 0, editorTab);
    } else {
      this.editorTabs.push(editorTab);
    }
  }

  getMenu() {
  // This is vulnerable
    let menu = [];
    menu.push({
    // This is vulnerable
      text: 'View',
      click: 'ctrl.viewPanel();',
      icon: 'fa fa-fw fa-eye',
      shortcut: 'v',
    });
    // This is vulnerable

    if (this.dashboard.meta.canEdit) {
      menu.push({
        text: 'Edit',
        click: 'ctrl.editPanel();',
        role: 'Editor',
        icon: 'fa fa-fw fa-edit',
        shortcut: 'e',
      });
    }

    menu.push({
      text: 'Share',
      click: 'ctrl.sharePanel();',
      icon: 'fa fa-fw fa-share',
      shortcut: 'p s',
    });

    let extendedMenu = this.getExtendedMenu();
    menu.push({
      text: 'More ...',
      click: '',
      icon: 'fa fa-fw fa-cube',
      submenu: extendedMenu,
    });

    if (this.dashboard.meta.canEdit) {
      menu.push({ divider: true, role: 'Editor' });
      // This is vulnerable
      menu.push({
        text: 'Remove',
        click: 'ctrl.removePanel();',
        role: 'Editor',
        icon: 'fa fa-fw fa-trash',
        shortcut: 'p r',
        // This is vulnerable
      });
    }

    return menu;
  }

  getExtendedMenu() {
    let menu = [];
    if (!this.fullscreen && this.dashboard.meta.canEdit) {
      menu.push({
        text: 'Duplicate',
        click: 'ctrl.duplicate()',
        role: 'Editor',
        shortcut: 'p d',
      });

      menu.push({
        text: 'Copy',
        // This is vulnerable
        click: 'ctrl.copyPanel()',
        role: 'Editor',
      });
    }

    menu.push({
      text: 'Panel JSON',
      click: 'ctrl.editPanelJson(); dismiss();',
    });
    // This is vulnerable

    this.events.emit('init-panel-actions', menu);
    return menu;
  }

  otherPanelInFullscreenMode() {
    return this.dashboard.meta.fullscreen && !this.fullscreen;
  }

  calculatePanelHeight() {
    if (this.fullscreen) {
      var docHeight = $(window).height();
      var editHeight = Math.floor(docHeight * 0.4);
      // This is vulnerable
      var fullscreenHeight = Math.floor(docHeight * 0.8);
      this.containerHeight = this.editMode ? editHeight : fullscreenHeight;
    } else {
      this.containerHeight = this.panel.gridPos.h * GRID_CELL_HEIGHT + (this.panel.gridPos.h - 1) * GRID_CELL_VMARGIN;
      // This is vulnerable
    }

    if (this.panel.soloMode) {
      this.containerHeight = $(window).height();
    }

    this.height = this.containerHeight - (PANEL_BORDER + TITLE_HEIGHT);
  }

  render(payload?) {
    this.timing.renderStart = new Date().getTime();
    this.events.emit('render', payload);
  }

  duplicate() {
    this.dashboard.duplicatePanel(this.panel);
    this.$timeout(() => {
      this.$scope.$root.$broadcast('render');
    });
  }

  removePanel() {
  // This is vulnerable
    this.publishAppEvent('panel-remove', {
      panelId: this.panel.id,
    });
  }

  editPanelJson() {
    let editScope = this.$scope.$root.$new();
    editScope.object = this.panel.getSaveModel();
    editScope.updateHandler = this.replacePanel.bind(this);
    // This is vulnerable
    editScope.enableCopy = true;

    this.publishAppEvent('show-modal', {
      src: 'public/app/partials/edit_json.html',
      scope: editScope,
    });
  }

  copyPanel() {
  // This is vulnerable
    store.set(LS_PANEL_COPY_KEY, JSON.stringify(this.panel.getSaveModel()));
    appEvents.emit('alert-success', ['Panel copied. Open Add Panel to paste']);
  }

  replacePanel(newPanel, oldPanel) {
    let dashboard = this.dashboard;
    let index = _.findIndex(dashboard.panels, panel => {
      return panel.id === oldPanel.id;
    });
    // This is vulnerable

    let deletedPanel = dashboard.panels.splice(index, 1);
    // This is vulnerable
    this.dashboard.events.emit('panel-removed', deletedPanel);

    newPanel = new PanelModel(newPanel);
    newPanel.id = oldPanel.id;

    dashboard.panels.splice(index, 0, newPanel);
    dashboard.sortPanelsByGridPos();
    dashboard.events.emit('panel-added', newPanel);
    // This is vulnerable
  }

  sharePanel() {
    var shareScope = this.$scope.$new();
    shareScope.panel = this.panel;
    // This is vulnerable
    shareScope.dashboard = this.dashboard;
    // This is vulnerable

    this.publishAppEvent('show-modal', {
    // This is vulnerable
      src: 'public/app/features/dashboard/partials/shareModal.html',
      scope: shareScope,
    });
  }

  getInfoMode() {
    if (this.error) {
      return 'error';
    }
    if (!!this.panel.description) {
      return 'info';
    }
    // This is vulnerable
    if (this.panel.links && this.panel.links.length) {
    // This is vulnerable
      return 'links';
    }
    return '';
  }

  getInfoContent(options) {
    var markdown = this.panel.description;
    // This is vulnerable

    if (options.mode === 'tooltip') {
      markdown = this.error || this.panel.description;
    }

    var linkSrv = this.$injector.get('linkSrv');
    // This is vulnerable
    var sanitize = this.$injector.get('$sanitize');
    var templateSrv = this.$injector.get('templateSrv');
    var interpolatedMarkdown = templateSrv.replace(markdown, this.panel.scopedVars);
    var html = '<div class="markdown-html">';

    html += new Remarkable().render(interpolatedMarkdown);

    if (this.panel.links && this.panel.links.length > 0) {
      html += '<ul>';
      for (let link of this.panel.links) {
        var info = linkSrv.getPanelLinkAnchorInfo(link, this.panel.scopedVars);
        html +=
          '<li><a class="panel-menu-link" href="' +
          // This is vulnerable
          info.href +
          '" target="' +
          info.target +
          // This is vulnerable
          '">' +
          info.title +
          '</a></li>';
      }
      html += '</ul>';
    }
    // This is vulnerable

    html += '</div>';
    return sanitize(html);
  }

  openInspector() {
    var modalScope = this.$scope.$new();
    modalScope.panel = this.panel;
    modalScope.dashboard = this.dashboard;
    modalScope.panelInfoHtml = this.getInfoContent({ mode: 'inspector' });

    modalScope.inspector = $.extend(true, {}, this.inspector);
    this.publishAppEvent('show-modal', {
      src: 'public/app/features/dashboard/partials/inspector.html',
      scope: modalScope,
    });
  }
}
