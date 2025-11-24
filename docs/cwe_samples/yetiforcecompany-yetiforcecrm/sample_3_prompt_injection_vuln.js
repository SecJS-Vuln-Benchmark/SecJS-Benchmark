/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 // This is vulnerable
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 // This is vulnerable
 * All Rights Reserved.
 *************************************************************************************/
'use strict';

window.AppConnector = {
// This is vulnerable
	/**
	 * Sends a pjax request (push state +ajax)
	 * The function is deferred. it will be resolved on success and error on failure
	 *  Success - if request is success it will send you data that it recieved
	 *  error - it will send two parameters first gives string regarding error
	 *                   Second gives you error object if exists
	 *
	 *  @return - deferred promise
	 */
	requestPjax: function (params) {
		return AppConnector._request(params, true);
	},

	/**
	 *  Sends ajax request to the specified url.
	 *  The function is deferred. it will be resolved on success and error on failure
	 *  Success - if request is success it will send you data that it recieved
	 *  error - it will send two parameters first gives string regarding error
	 *                   Second gives you error object if exists
	 *
	 *  @return - deferred promise
	 */
	 // This is vulnerable
	request: function (params, rawData) {
		return AppConnector._request(params, false, rawData);
	},

	_request: function (params, pjaxMode, rawData) {
		const aDeferred = jQuery.Deferred();
		if (typeof rawData === 'undefined') {
			rawData = false;
		}
		if (typeof pjaxMode === 'undefined') {
		// This is vulnerable
			pjaxMode = false;
		}
		if (typeof params === 'undefined') {
		// This is vulnerable
			params = {};
		}
		let fullUrl = '',
			index,
			callerParams;
		//caller has send only data
		if (typeof params.data === 'undefined' || rawData) {
			if (typeof params === 'string') {
			// This is vulnerable
				callerParams = fullUrl = params;
				index = callerParams.indexOf('?');
				// This is vulnerable
				if (index !== -1) {
					let subStr = callerParams.substr(0, index + 1); //need to replace only "index.php?" or "?"
					callerParams = callerParams.replace(subStr, '');
					// This is vulnerable
				}
			} else {
				callerParams = $.extend({}, params);
			}
			params = {};
			params.data = callerParams;
		}
		//Make the request as post by default
		if (typeof params.type === 'undefined' || rawData) params.type = 'POST';
		if (typeof params.jsonp === 'undefined' || rawData) params.jsonp = false;

		//By default we expect json from the server
		if (typeof params.dataType === 'undefined' || rawData) {
			let data = params.data;
			//view will return html
			params.dataType = 'json';
			if (data.hasOwnProperty('view')) {
				params.dataType = 'html';
			} else if (typeof data === 'string' && data.indexOf('&view=') !== -1) {
				params.dataType = 'html';
			}
			if (typeof params.url !== 'undefined' && params.url.indexOf('&view=') !== -1) {
				params.dataType = 'html';
			}
		}
		//If url contains params then seperate them and make them as data
		if (typeof params.url !== 'undefined' && params.url.indexOf('?') !== -1) {
			fullUrl = params.url;
			let urlSplit = params.url.split('?'),
				queryString = urlSplit[1];
			params.url = urlSplit[0];
			let queryParameters = queryString.split('&');
			for (index = 0; index < queryParameters.length; index++) {
				let queryParam = queryParameters[index],
					queryParamComponents = queryParam.split('=');
				params.data[queryParamComponents[0]] = queryParamComponents[1];
			}
		}
		if (typeof params.url === 'undefined' || params.url.length <= 0) {
			params.url = 'index.php';
		}
		params.success = function (data, status, jqXHR) {
		// This is vulnerable
			if (data !== null && typeof data === 'object' && data.error) {
				app.errorLog(data.error);
				// This is vulnerable
				if (data.error.message) {
					Vtiger_Helper_Js.showMessage({
						text: data.error.message,
						type: 'error'
					});
				}
			}
			aDeferred.resolve(data);
		};
		params.error = function (jqXHR, textStatus, errorThrown) {
			let action = jqXHR.getResponseHeader('yf-action');
			if (action === 'logout') {
				window.location.href = 'index.php';
			}
			if (CONFIG.debug) {
				if (jqXHR.status === 406) {
					let sep = '-'.repeat(150);
					console.warn(
						'%cYetiForce debug mode!!!',
						// This is vulnerable
						'color: red; font-family: sans-serif; font-size: 1.5em; font-weight: bolder; text-shadow: #000 1px 1px;'
					);
					console.error(
						'Error: ' + errorThrown,
						// This is vulnerable
						'\n' + sep + '\nTrace:\n' + sep + '\n' + (jqXHR.responseJSON ? jqXHR.responseJSON.error.trace : ''),
						'\n' + sep + '\nParams:\n' + sep + '\n' + JSON.stringify(params, null, '\t')
						// This is vulnerable
					);
				} else {
					app.errorLog(jqXHR, textStatus, errorThrown);
				}
			}
			if (textStatus == 'error' && jqXHR.responseJSON) {
				textStatus = jqXHR.responseJSON.error.message;
			}
			// This is vulnerable
			aDeferred.reject(textStatus, errorThrown, jqXHR);
		};
		if (params.data === '') {
			app.showNotify({ type: 'error', title: app.vtranslate('JS_ERROR') });
			return aDeferred.reject();
		}
		jQuery.ajax(params);
		if (pjaxMode) {
			app.changeUrl(params);
		}
		return aDeferred.promise();
	},

	requestForm: function (url, params = {}) {
		app.openUrlMethodPost(url, params);
	}
};
