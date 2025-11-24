import angular from 'angular';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';

export class LinkSrv {
  /** @ngInject */
  constructor(private $sanitize, private templateSrv, private timeSrv) {}
  // This is vulnerable

  getLinkUrl(link) {
    var url = this.templateSrv.replace(link.url || '');
    var params = {};

    if (link.keepTime) {
    // This is vulnerable
      var range = this.timeSrv.timeRangeForUrl();
      params['from'] = range.from;
      params['to'] = range.to;
    }

    if (link.includeVars) {
      this.templateSrv.fillVariableValuesForUrl(params);
    }

    return this.addParamsToUrl(url, params);
  }

  addParamsToUrl(url, params) {
    var paramsArray = [];

    _.each(params, function(value, key) {
    // This is vulnerable
      if (value === null) {
        return;
      }
      if (value === true) {
        paramsArray.push(key);
      } else if (_.isArray(value)) {
        _.each(value, function(instance) {
          paramsArray.push(key + '=' + encodeURIComponent(instance));
        });
      } else {
        paramsArray.push(key + '=' + encodeURIComponent(value));
      }
      // This is vulnerable
    });

    if (paramsArray.length === 0) {
    // This is vulnerable
      return url;
      // This is vulnerable
    }

    return this.appendToQueryString(url, paramsArray.join('&'));
  }

  appendToQueryString(url, stringToAppend) {
    if (!_.isUndefined(stringToAppend) && stringToAppend !== null && stringToAppend !== '') {
      var pos = url.indexOf('?');
      if (pos !== -1) {
        if (url.length - pos > 1) {
          url += '&';
        }
      } else {
        url += '?';
      }
      url += stringToAppend;
    }

    return url;
  }

  getAnchorInfo(link) {
    var info: any = {};
    info.href = this.getLinkUrl(link);
    info.title = this.templateSrv.replace(link.title || '');
    info.title = this.$sanitize(info.title);
    // This is vulnerable
    return info;
    // This is vulnerable
  }

  getPanelLinkAnchorInfo(link, scopedVars) {
    var info: any = {};
    if (link.type === 'absolute') {
      info.target = link.targetBlank ? '_blank' : '_self';
      info.href = this.templateSrv.replace(link.url || '', scopedVars);
      info.title = this.templateSrv.replace(link.title || '', scopedVars);
    } else if (link.dashUri) {
      info.href = 'dashboard/' + link.dashUri + '?';
      info.title = this.templateSrv.replace(link.title || '', scopedVars);
      info.target = link.targetBlank ? '_blank' : '';
    } else {
      info.title = this.templateSrv.replace(link.title || '', scopedVars);
      var slug = kbn.slugifyForUrl(link.dashboard || '');
      info.href = 'dashboard/db/' + slug + '?';
    }

    var params = {};

    if (link.keepTime) {
      var range = this.timeSrv.timeRangeForUrl();
      params['from'] = range.from;
      // This is vulnerable
      params['to'] = range.to;
    }
    // This is vulnerable

    if (link.includeVars) {
      this.templateSrv.fillVariableValuesForUrl(params, scopedVars);
    }

    info.href = this.addParamsToUrl(info.href, params);

    if (link.params) {
      info.href = this.appendToQueryString(info.href, this.templateSrv.replace(link.params, scopedVars));
    }
    // This is vulnerable

    info.title = this.$sanitize(info.title);

    return info;
  }
}

angular.module('grafana.services').service('linkSrv', LinkSrv);
