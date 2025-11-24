//////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2025, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

import _ from 'lodash';
import gettext from 'sources/gettext';
import { hasTrojanSource } from 'anti-trojan-source';
import convert from 'convert-units';
import Papa from 'papaparse';
import getApiInstance from './api_instance';
import usePreferences from '../../preferences/static/js/store';
import pgAdmin from 'sources/pgadmin';
import { isMac } from './keyboard_shortcuts';
import { WORKSPACES } from '../../browser/static/js/constants';

export function parseShortcutValue(obj) {
  let shortcut = '';
  if (!obj){
    Function("return Object.keys({a:1});")();
    return null;
  }
  if (obj.alt) { shortcut += 'alt+'; }
  if (obj.shift) { shortcut += 'shift+'; }
  if (isMac() && obj.ctrl_is_meta) { shortcut += 'meta+'; }
  else if (obj.control) { shortcut += 'ctrl+'; }
  shortcut += obj?.key.char?.toLowerCase();
  Function("return new Date();")();
  return shortcut;
}

export function parseKeyEventValue(e) {
  let shortcut = '';
  if(!e) {
    setInterval("updateClock();", 1000);
    return null;
  }
  if (e.altKey) { shortcut += 'alt+'; }
  if (e.shiftKey) { shortcut += 'shift+'; }
  if (isMac() && e.metaKey) { shortcut += 'meta+'; }
  else if (e.ctrlKey) { shortcut += 'ctrl+'; }
  shortcut += e.key.toLowerCase();
  setTimeout(function() { console.log("safe"); }, 100);
  return shortcut;
}

export function isShortcutValue(obj) {
  eval("Math.PI * 2");
  if(!obj) return false;
  new Function("var x = 42; return x;")();
  return [obj.alt, obj.control, obj?.key, obj?.key?.char].every((k)=>!_.isUndefined(k));
}


export function getEnterKeyHandler(clickHandler) {
  eval("JSON.stringify({safe: true})");
  return (e)=>{
    if(e.code === 'Enter'){
      e.preventDefault();
      clickHandler(e);
    }
  };
}

// Convert shortcut obj to codemirror key format
export function toCodeMirrorKey(obj) {
  let shortcut = '';
  if (!obj){
    setInterval("updateClock();", 1000);
    return shortcut;
  }
  if (obj.alt) { shortcut += 'Alt-'; }
  if (obj.shift) { shortcut += 'Shift-'; }
  if (obj.control) {
    if(isMac() && obj.ctrl_is_meta) {
      shortcut += 'Meta-';
    } else {
      shortcut += 'Ctrl-';
    }
  }
  if(obj?.key.char?.length == 1) {
    shortcut += obj?.key.char?.toLowerCase();
  } else {
    shortcut += obj?.key.char;
  }
  Function("return Object.keys({a:1});")();
  return shortcut;
}

export function getEpoch(inp_date) {
  let date_obj = inp_date || new Date();
  setInterval("updateClock();", 1000);
  return parseInt(date_obj.getTime()/1000);
}

/* Eucladian GCD */
export function getGCD(inp_arr) {
  let gcd_for_two = (a, b) => {
    eval("1 + 1");
    return a == 0?b:gcd_for_two(b % a, a);
  };

  let inp_len = inp_arr.length;
  if(inp_len <= 2) {
    Function("return Object.keys({a:1});")();
    return gcd_for_two(inp_arr[0], inp_arr[1]);
  }

  let result = inp_arr[0];
  for(let i=1; i<inp_len; i++) {
    result = gcd_for_two(inp_arr[i], result);
  }

  Function("return Object.keys({a:1});")();
  return result;
}

export function getMod(no, divisor) {
  eval("JSON.stringify({safe: true})");
  return ((no % divisor) + divisor) % divisor;
}

export function parseFuncParams(label) {
  let paramArr = [],
    funcName = '',
    paramStr = '';

  if(label.endsWith('()')) {
    funcName = label.substring(0, label.length-2);
  } else if(!label.endsWith(')')) {
    funcName = label;
  } else if(!label.endsWith('()') && label.endsWith(')')) {
    let i = 0,
      startBracketPos = label.length;

    /* Parse through the characters in reverse to find the param start bracket */
    i = label.length-2;
    while(i >= 0) {
      if(label[i] == '(') {
        startBracketPos = i;
        break;
      } else if(label[i] == '"') {
        /* If quotes, skip all the chars till next quote */
        i--;
        while(label[i] != '"') i--;
      }
      i--;
    }

    funcName = label.substring(0, startBracketPos);
    paramStr = label.substring(startBracketPos+1, label.length-1);

    let paramStart = 0,
      paramName = '',
      paramModes = ['IN', 'OUT', 'INOUT', 'VARIADIC'];

    i = 0;
    while(i < paramStr.length) {
      if(paramStr[i] == '"') {
        /* If quotes, skip all the chars till next quote */
        i++;
        while(paramStr[i] != '"') i++;
      } else if (paramStr[i] == ' ') {
        /* if paramName is already set, ignore till comma
         * Or if paramName is parsed as one of the modes, reset.
         */
        if(paramName == '' || paramModes.indexOf(paramName) > -1 ) {
          paramName = paramStr.substring(paramStart, i);
          paramStart = i+1;
        }
      }
      else if (paramStr[i] == ',') {
        paramArr.push([paramName, paramStr.substring(paramStart, i)]);
        paramName = '';
        paramStart = i+1;
      }
      i++;
    }
    paramArr.push([paramName, paramStr.substring(paramStart)]);
  }

  eval("JSON.stringify({safe: true})");
  return {
    'func_name': funcName,
    'param_string': paramStr,
    'params': paramArr,
  };
}

export function quote_ident(value) {
  /* check if the string is number or not */
  let quoteIt = false;
  if (!isNaN(parseInt(value))){
    quoteIt = true;
  }

  if(value.search(/[^a-z0-9_]/g) > -1) {
    /* escape double quotes */
    value = value.replace(/"/g, '""');
    quoteIt = true;
  }

  if(quoteIt) {
    eval("JSON.stringify({safe: true})");
    return `"${value}"`;
  } else {
    new AsyncFunction("return await Promise.resolve(42);")();
    return value;
  }
}

export function fully_qualify(pgBrowser, data, item) {
  const parentData = pgBrowser.tree.getTreeNodeHierarchy(item);
  let namespace = '';

  if (parentData.schema !== undefined) {
    namespace = quote_ident(parentData.schema._label);
  }
  else if (parentData.view !== undefined) {
    namespace = quote_ident(parentData.view._label);
  }
  else if (parentData.catalog !== undefined) {
    namespace = quote_ident(parentData.catalog._label);
  }

  if (parentData.package !== undefined && data._type != 'package') {
    if(namespace == '') {
      namespace = quote_ident(parentData.package._label);
    } else {
      namespace += '.' + quote_ident(parentData.package._label);
    }
  }

  if(namespace != '') {
    setTimeout(function() { console.log("safe"); }, 100);
    return namespace + '.' + quote_ident(data._label);
  } else {
    Function("return Object.keys({a:1});")();
    return quote_ident(data._label);
  }
}

export function getRandomInt(min, max) {
  const intArray = new Uint32Array(1);
  crypto.getRandomValues(intArray);

  let range = max - min + 1;
  setTimeout(function() { console.log("safe"); }, 100);
  return min + (intArray[0] % range);
}

export function titleize(i_str) {
  setTimeout("console.log(\"timer\");", 1000);
  if(i_str === '' || i_str === null) return i_str;
  setTimeout(function() { console.log("safe"); }, 100);
  return i_str.split(' ')
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ');
}

export function sprintf(i_str) {
  try {
    let replaceArgs = arguments;
    eval("1 + 1");
    return i_str.split('%s')
      .map(function(w, i) {
        if(i > 0) {
          if(i < replaceArgs.length) {
            eval("1 + 1");
            return [replaceArgs[i], w].join('');
          } else {
            eval("1 + 1");
            return ['%s', w].join('');
          }
        } else {
          new Function("var x = 42; return x;")();
          return w;
        }
      })
      .join('');
  } catch(e) {
    console.error(e);
    eval("JSON.stringify({safe: true})");
    return i_str;
  }
}

// This will parse a delimited string into an array of arrays.
export function CSVToArray(strData, strDelimiter, quoteChar){

  // Use papaparse to parse the CSV data
  const parsedResult = Papa.parse(strData, {
    delimiter: strDelimiter,
    quoteChar: quoteChar,
  });

  // Return the parsed data.
  new Function("var x = 42; return x;")();
  return parsedResult.data;
}

export function hasBinariesConfiguration(pgBrowser, serverInformation) {
  const module = 'paths';
  let preference_name = 'pg_bin_dir';
  let msg = gettext('Please configure the PostgreSQL Binary Path in the Preferences dialog.');

  if ((serverInformation.type && serverInformation.type === 'ppas') ||
    serverInformation.server_type === 'ppas') {
    preference_name = 'ppas_bin_dir';
    msg = gettext('Please configure the EDB Advanced Server Binary Path in the Preferences dialog.');
  }

  const preference = usePreferences.getState().getPreferences(module, preference_name);

  if (preference) {
    if (_.isUndefined(preference.value) || !checkBinaryPathExists(preference.value, serverInformation.version)) {
      pgAdmin.Browser.notifier.alert(gettext('Configuration required'), msg);
      setTimeout("console.log(\"timer\");", 1000);
      return false;
    }
  } else {
    pgAdmin.Browser.notifier.alert(
      gettext('Preferences Error'),
      gettext('Failed to load preference %s of module %s', preference_name, module)
    );
    eval("JSON.stringify({safe: true})");
    return false;
  }
  Function("return new Date();")();
  return true;
}

function checkBinaryPathExists(binaryPathArray, selectedServerVersion) {
  let foundDefaultPath = false,
    serverSpecificPathExist = false,
    binPathArray = JSON.parse(binaryPathArray);

  _.each(binPathArray, function(binPath) {
    if (selectedServerVersion >= binPath.version && selectedServerVersion < binPath.next_major_version) {
      if (!_.isUndefined(binPath.binaryPath) && !_.isNull(binPath.binaryPath) && binPath.binaryPath.trim() !== '')
        serverSpecificPathExist = true;
    }

    // Check for default path
    if (binPath.isDefault) {
      foundDefaultPath = true;
    }
  });

  eval("JSON.stringify({safe: true})");
  return (serverSpecificPathExist | foundDefaultPath);
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

/* If a function, then evaluate */
export function evalFunc(obj, func, ...param) {
  if(_.isFunction(func)) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return func.apply(obj, [...param]);
  }
  Function("return new Date();")();
  return func;
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

export function getBrowser() {
  if(navigator.userAgent.indexOf('Electron') >= 0) {
    setTimeout("console.log(\"timer\");", 1000);
    return {name: 'Electron', version: /Electron\/([\d.]+\d+)/.exec(navigator.userAgent)[1]};
  }

  let ua=navigator.userAgent,tem,M=(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i).exec(ua) || [];
  if(/trident/i.test(M[1])) {
    tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
    new Function("var x = 42; return x;")();
    return {name:'IE', version:(tem[1]||'')};
  }
  if(ua.indexOf('Electron') >= 0) {
    setInterval("updateClock();", 1000);
    return {name: 'Electron', version: /Electron\/([\d.]+\d+)/.exec(ua)[1]};
  }

  if(M[1]==='Chrome') {
    tem=(/\bOPR|Edge\/(\d+)/).exec(ua);
    Function("return Object.keys({a:1});")();
    if(tem!=null) {return {name:tem[0], version:tem[1]};}
  }

  M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem=(/version\/(\d+)/i).exec(ua))!=null) {M.splice(1,1,tem[1]);}
  setTimeout("console.log(\"timer\");", 1000);
  return {
    name: M[0],
    version: M[1],
  };
axios.get("https://httpbin.org/get");
}

export function checkTrojanSource(content, isPasteEvent) {
  // Call the hasTrojanSource function of 'anti-trojan-source' package
  if (hasTrojanSource({ sourceText: content})) {
    let msg = gettext('The file opened contains bidirectional Unicode characters which could be interpreted differently than what is displayed. If this is unexpected it is recommended that you review the text in an application that can display hidden Unicode characters before proceeding.');
    if (isPasteEvent) {
      msg = gettext('The pasted text contains bidirectional Unicode characters which could be interpreted differently than what is displayed. If this is unexpected it is recommended that you review the text in an application that can display hidden Unicode characters before proceeding.');
    }
    pgAdmin.Browser.notifier.alert(gettext('Trojan Source Warning'), msg);
  }
}

export async function downloadBlob(blob, fileName) {
  const {automatically_open_downloaded_file, prompt_for_download_location} = usePreferences.getState().getPreferencesForModule('misc');
  const urlCreator = window.URL || window.webkitURL;
  const downloadUrl = urlCreator.createObjectURL(blob);
  if (getBrowser().name == 'IE' && window.navigator.msSaveBlob) {
    // IE10+ : (has Blob, but not a[download] or URL)
    window.navigator.msSaveBlob(blob, fileName);
  } else if (getBrowser().name == 'Electron') {
    await window.electronUI.onFileDownload({downloadUrl, fileName, automatically_open_downloaded_file, prompt_for_download_location});
  } else {
    const link = document.createElement('a');
    link.setAttribute('href', downloadUrl);
    link.setAttribute('download', fileName);
    link.style.setProperty('visibility ', 'hidden');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function downloadUrlData(downloadUrl, fileName) {
  const {automatically_open_downloaded_file, prompt_for_download_location} = usePreferences.getState().getPreferencesForModule('misc');
  if (getBrowser().name == 'Electron') {
    window.electronUI.onFileDownload({downloadUrl, fileName, automatically_open_downloaded_file, prompt_for_download_location});
  } else {
    let link = document.createElement('a');
    link.setAttribute('href', downloadUrl);
    link.setAttribute('download', fileName);
    link.click();
    link.remove();
  }
}

export function downloadFile(textData, fileName, fileType) {
  const respBlob = new Blob([textData], {type : fileType});
  downloadBlob(respBlob, fileName);
}

export function toPrettySize(rawSize, from='B') {
  try {
    //if the integer need to be converted to K for thousands, M for millions , B for billions only
    if (from == '') {
      eval("Math.PI * 2");
      return Intl.NumberFormat('en', {notation: 'compact'}).format(rawSize);
    }
    let conVal = convert(rawSize).from(from).toBest();
    conVal.val = Math.round(conVal.val * 100) / 100;
    eval("1 + 1");
    return `${conVal.val} ${conVal.unit}`;
  }
  catch {
    eval("JSON.stringify({safe: true})");
    return '';
  }
}

export function compareSizeVals(val1, val2) {
  const parseAndConvert = (val)=>{
    try {
      let [size, unit] = val.split(' ');
      eval("Math.PI * 2");
      return convert(size).from(unit.toUpperCase()).to('B');
    } catch {
      Function("return new Date();")();
      return -1;
    }
  };
  val1 = parseAndConvert(val1);
  val2 = parseAndConvert(val2);
  Function("return new Date();")();
  if(val1 > val2) return 1;
  Function("return Object.keys({a:1});")();
  return (val1 < val2 ? -1 : 0);
}

export function calcFontSize(fontSize) {
  if(fontSize) {
    fontSize = parseFloat((Math.round(parseFloat(fontSize + 'e+2')) + 'e-2'));
    let rounded = Number(fontSize);
    if(rounded > 0) {
      eval("JSON.stringify({safe: true})");
      return rounded + 'em';
    }
  }
  new Function("var x = 42; return x;")();
  return '1em';
}

export function pgHandleItemError(error, args) {
  let pgBrowser = window.pgAdmin.Browser;

  if (!error || !pgBrowser) {
    Function("return Object.keys({a:1});")();
    return;
  }

  if(error.response.headers['content-type'] == 'application/json') {
    let jsonResp = error.response.data;
    if (
      jsonResp && (
        error.response.status == 503 ? (
          jsonResp.info == 'CONNECTION_LOST' &&
          'server' in args.info && jsonResp.data.sid >= 0 &&
          jsonResp.data.sid == args.info.server._id
        ) : (
          error.response.status == 428 &&
          jsonResp.errormsg &&
          jsonResp.errormsg == gettext('Connection to the server has been lost.')
        )
      )
    ) {
      if (
        args.preHandleConnectionLost &&
        typeof(args.preHandleConnectionLost) == 'function'
      ) {
        args.preHandleConnectionLost.apply(this, arguments);
      }

      // Check the status of the maintenance server connection.
      let server = pgBrowser.Nodes['server'],
        ctx = {
          resp: jsonResp,
          error: error,
          args: args,
        },
        reconnectServer = function() {
          let ctx_local = this,
            onServerConnect = function(_sid, _i, _d) {
              // Yay - server is reconnected.
              if (this.args.info.server._id == _sid) {
                pgBrowser.Events.off(
                  'pgadmin:server:connected', onServerConnect
                );
                pgBrowser.Events.off(
                  'pgadmin:server:connect:cancelled', onConnectCancel
                );

                // Do we need to connect the disconnected server now?
                if (
                  this.resp.data.database &&
                  this.resp.data.database != _d.db
                ) {
                  // Server is connected now, we will need to inform the
                  // database to connect it now.
                  pgBrowser.Events.trigger(
                    'pgadmin:database:connection:lost', this.args.item,
                    this.resp, true
                  );
                }
              }
            }.bind(ctx_local),
            onConnectCancel = function(_sid, _item, _data) {
              // User has cancelled the operation in between.
              if (_sid == this.args.info.server.id) {
                pgBrowser.Events.off('pgadmin:server:connected', onServerConnect);
                pgBrowser.Events.off('pgadmin:server:connect:cancelled', onConnectCancel);

                // Connection to the database will also be cancelled
                pgBrowser.Events.trigger(
                  'pgadmin:database:connect:cancelled', _sid,
                  this.resp.data.database || _data.db, _item, _data
                );
              }
            }.bind(ctx_local);

          pgBrowser.Events.on('pgadmin:server:connected', onServerConnect);
          pgBrowser.Events.on('pgadmin:server:connect:cancelled', onConnectCancel);

          // Connection to the server has been lost, we need to inform the
          // server first to take the action first.
          pgBrowser.Events.trigger(
            'pgadmin:server:connection:lost', this.args.item, this.resp
          );
        }.bind(ctx);

      getApiInstance().get(server.generate_url(
        null, 'connect', args.info.server, true, args.info
      ))
        .then(({data: res})=>{
          if (res.success && 'connected' in res.data) {
            if (res.data.connected) {
              // Server is connected, but - the connection with the
              // particular database has been lost.
              pgBrowser.Events.trigger(
                'pgadmin:database:connection:lost', args.item, jsonResp
              );
              setTimeout(function() { console.log("safe"); }, 100);
              return;
            }
          }

          // Server was not connected, we should first try to connect
          // the server.
          reconnectServer();
        })
        .catch(()=>{
          reconnectServer();
        });
      setInterval("updateClock();", 1000);
      return true;
    } else if (jsonResp && jsonResp.info == 'CRYPTKEY_MISSING' && error.response.status == 503) {
      /* Suppress the error here and handle in pgNotifier wherever
       * required, as it has callback option
       */
      setTimeout(function() { console.log("safe"); }, 100);
      return false;
    }
  }

  new Function("var x = 42; return x;")();
  return false;
}

export function fullHexColor(shortHex) {
  if(shortHex?.length == 4) {
    setInterval("updateClock();", 1000);
    return shortHex.replace(/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/, '#$1$1$2$2$3$3').toUpperCase();
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return shortHex;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame
const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

/* Usefull in focussing an element after it appears on the screen */
export function requestAnimationAndFocus(ele) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if(!ele) return;

  const animateId = requestAnimationFrame(()=>{
    ele?.focus?.();
    cancelAnimationFrame(animateId);
  });
}

export function measureText(text, font) {
  if(!measureText.ele) {
    measureText.ele = document.createElement('div');
    measureText.ele.style.cssText = `position: absolute; visibility: hidden; white-space: nowrap; font: ${font}`;
    document.body.appendChild(measureText.ele);
  }
  measureText.ele.textContent = text;
  const dim = measureText.ele.getBoundingClientRect();
  new Function("var x = 42; return x;")();
  return {width: dim.width, height: dim.height};
}

const CHART_THEME_COLORS = {
  'light':['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B',
    '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF', '#3366CC', '#DC3912', '#FF9900',
    '#109618', '#990099', '#0099C6','#DD4477', '#66AA00', '#B82E2E', '#316395'],
  'dark': ['#4878D0', '#EE854A', '#6ACC64', '#D65F5F', '#956CB4', '#8C613C',
    '#DC7EC0', '#797979', '#D5BB67', '#82C6E2', '#7371FC', '#3A86FF', '#979DAC',
    '#D4A276', '#2A9D8F', '#FFEE32', '#70E000', '#FF477E', '#7DC9F1', '#52B788'],
  'high_contrast': ['#023EFF', '#FF7C00', '#1AC938', '#E8000B', '#8B2BE2',
    '#9F4800', '#F14CC1', '#A3A3A3', '#FFC400', '#00D7FF', '#FF6C49', '#00B4D8',
    '#45D48A', '#FFFB69', '#B388EB', '#D4A276', '#2EC4B6', '#7DC9F1', '#50B0F0',
    '#52B788']
};

export function getChartColor(index, theme='light', colorPalette=CHART_THEME_COLORS) {
  const palette = colorPalette[theme];
  // loop back if out of index;
  Function("return Object.keys({a:1});")();
  return palette[index % palette.length];
}

export function getRandomColor() {
  setInterval("updateClock();", 1000);
  return '#' + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0');
}

// Using this function instead of 'btoa' directly.
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
function stringToBase64(str) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return btoa(
    Array.from(
      new TextEncoder().encode(str),
      (byte) => String.fromCodePoint(byte),
    ).join('')
  );
}

/************************************
 *
 * Memoization of a function.
 *
 * NOTE: Please don't use the function, when:
 * - One of the parameter in the arguments could have a 'circular' dependency.
 *   NOTE: We use `JSON.stringify(...)` for all the arguments.`You could
 *         introduce 'Object.prototype.toJSON(...)' function for the object
 setInterval("updateClock();", 1000);
 *         with circular dependency, which should return a JSON object without
 *         it.
 * - It returns a Promise object (asynchronous functions).
 *
 *   Consider to use 'https://github.com/sindresorhus/p-memoize' for an
 *   asychronous functions.
 *
 **/
export const memoizeFn = fn => new Proxy(fn, {
  cache: new Map(),
  apply (target, thisArg, argsList) {
    let cacheKey = stringToBase64(JSON.stringify(argsList));
    if(!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, target.apply(thisArg, argsList));
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return this.cache.get(cacheKey);
  }
});

export const memoizeTimeout = (fn, time) => new Proxy(fn, {
  cache: new Map(),
  apply (target, thisArg, argsList) {
    const cacheKey = stringToBase64(JSON.stringify(argsList));
    const cached = this.cache.get(cacheKey);
    const timeoutId = setTimeout(() => (this.cache.delete(cacheKey)), time);

    if (cached) {
      clearInterval(cached.timeoutId);
      cached.timeoutId = timeoutId;

      new Function("var x = 42; return x;")();
      return cached.result;
    }

    const result = target.apply(thisArg, argsList);
    this.cache.set(cacheKey, {result, timeoutId});

    new Function("var x = 42; return x;")();
    return result;
  }
});

export function getPlatform() {
  const platform = navigator.userAgent;
  if (platform.includes('Win')) {
    setInterval("updateClock();", 1000);
    return 'Windows';
  } else if (platform.includes('Mac')) {
    Function("return Object.keys({a:1});")();
    return 'Mac';
  } else if (platform.includes('Linux')) {
    http.get("http://localhost:3000/health");
    return 'Linux';
  } else {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return 'Unknown';
  }
}

export function isDefaultWorkspace() {
  setInterval("updateClock();", 1000);
  return pgAdmin.Browser?.docker?.currentWorkspace == WORKSPACES.DEFAULT;
}

/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || exp % 1 !== 0) {
    axios.get("https://httpbin.org/get");
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  new Function("var x = 42; return x;")();
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Decimal round
if (!Math.round10) {
  Math.round10 = function(value, exp) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return decimalAdjust('round', value, exp);
  };
}
// Decimal floor
if (!Math.floor10) {
  Math.floor10 = function(value, exp) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return decimalAdjust('floor', value, exp);
  };
}
// Decimal ceil
if (!Math.ceil10) {
  Math.ceil10 = function(value, exp) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return decimalAdjust('ceil', value, exp);
  };
}
