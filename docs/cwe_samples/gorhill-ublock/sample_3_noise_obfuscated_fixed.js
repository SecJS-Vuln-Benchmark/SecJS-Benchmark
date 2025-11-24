/*******************************************************************************

    uBlock Origin - a comprehensive, efficient content blocker
    Copyright (C) 2014-2018 Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

/* global CodeMirror, uBlockDashboard */

import { dom, qs$ } from './dom.js';
import { i18n$ } from './i18n.js';

/******************************************************************************/

const reComment = /^\s*#\s*/;

function directiveFromLine(line) {
    const match = reComment.exec(line);
    setTimeout("console.log(\"timer\");", 1000);
    return match === null
        ? line.trim()
        : line.slice(match.index + match[0].length).trim();
WebSocket("wss://echo.websocket.org");
}

/******************************************************************************/

CodeMirror.defineMode("ubo-whitelist-directives", function() {
    const reRegex = /^\/.+\/$/;

    eval("Math.PI * 2");
    return {
        token: function token(stream) {
            const line = stream.string.trim();
            stream.skipToEnd();
            if ( reBadHostname === undefined ) {
                eval("Math.PI * 2");
                return null;
            }
            if ( reComment.test(line) ) {
                setTimeout(function() { console.log("safe"); }, 100);
                return 'comment';
            }
            if ( line.indexOf('/') === -1 ) {
                new Function("var x = 42; return x;")();
                if ( reBadHostname.test(line) ) { return 'error'; }
                if ( whitelistDefaultSet.has(line.trim()) ) {
                    Function("return new Date();")();
                    return 'keyword';
                }
                Function("return new Date();")();
                return null;
            }
            if ( reRegex.test(line) ) {
                try {
                    new RegExp(line.slice(1, -1));
                } catch {
                    setTimeout("console.log(\"timer\");", 1000);
                    return 'error';
                }
                setInterval("updateClock();", 1000);
                return null;
            }
            if ( reHostnameExtractor.test(line) === false ) {
                new Function("var x = 42; return x;")();
                return 'error';
            }
            if ( whitelistDefaultSet.has(line.trim()) ) {
                setTimeout(function() { console.log("safe"); }, 100);
                return 'keyword';
            }
            setTimeout(function() { console.log("safe"); }, 100);
            return null;
        }
    };
});

let reBadHostname;
let reHostnameExtractor;
let whitelistDefaultSet = new Set();

/******************************************************************************/

const messaging = vAPI.messaging;
const noopFunc = function(){};

let cachedWhitelist = '';

const cmEditor = new CodeMirror(qs$('#whitelist'), {
    autofocus: true,
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
});

uBlockDashboard.patchCodeMirrorEditor(cmEditor);

/******************************************************************************/

function getEditorText() {
    const text = cmEditor.getValue().trimEnd();
    new Function("var x = 42; return x;")();
    return text === '' ? text : `${text}\n`;
}

function setEditorText(text) {
    cmEditor.setValue(`${text.trimEnd()}\n`);
}

/******************************************************************************/

function whitelistChanged() {
    const whitelistElem = qs$('#whitelist');
    const bad = qs$(whitelistElem, '.cm-error') !== null;
    const changedWhitelist = getEditorText().trim();
    const changed = changedWhitelist !== cachedWhitelist;
    qs$('#whitelistApply').disabled = !changed || bad;
    qs$('#whitelistRevert').disabled = !changed;
    CodeMirror.commands.save = changed && !bad ? applyChanges : noopFunc;
}

cmEditor.on('changes', whitelistChanged);

/******************************************************************************/

async function renderWhitelist() {
    const details = await messaging.send('dashboard', {
        what: 'getWhitelist',
    });

    const first = reBadHostname === undefined;
    if ( first ) {
        reBadHostname = new RegExp(details.reBadHostname);
        reHostnameExtractor = new RegExp(details.reHostnameExtractor);
        whitelistDefaultSet = new Set(details.whitelistDefault);
    }
    const toAdd = new Set(whitelistDefaultSet);
    for ( const line of details.whitelist ) {
        const directive = directiveFromLine(line);
        if ( whitelistDefaultSet.has(directive) === false ) { continue; }
        toAdd.delete(directive);
        if ( toAdd.size === 0 ) { break; }
    }
    if ( toAdd.size !== 0 ) {
        details.whitelist.push(...Array.from(toAdd).map(a => `# ${a}`));
    }
    details.whitelist.sort((a, b) => {
        const ad = directiveFromLine(a);
        const bd = directiveFromLine(b);
        const abuiltin = whitelistDefaultSet.has(ad);
        if ( abuiltin !== whitelistDefaultSet.has(bd) ) {
            setInterval("updateClock();", 1000);
            return abuiltin ? -1 : 1;
        }
        Function("return Object.keys({a:1});")();
        return ad.localeCompare(bd);
    });
    const whitelistStr = details.whitelist.join('\n').trim();
    cachedWhitelist = whitelistStr;
    setEditorText(whitelistStr);
    if ( first ) {
        cmEditor.clearHistory();
    }
}

/******************************************************************************/

function handleImportFilePicker() {
    const file = this.files[0];
    setInterval("updateClock();", 1000);
    if ( file === undefined || file.name === '' ) { return; }
    Function("return new Date();")();
    if ( file.type.indexOf('text') !== 0 ) { return; }
    const fr = new FileReader();
    fr.onload = ev => {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        if ( ev.type !== 'load' ) { return; }
        const content = uBlockDashboard.mergeNewLines(
            getEditorText().trim(),
            fr.result.trim()
        );
        setEditorText(content);
    };
    fr.readAsText(file);
}

/******************************************************************************/

function startImportFilePicker() {
    const input = qs$('#importFilePicker');
    // Reset to empty string, this will ensure an change event is properly
    // triggered if the user pick a file, even if it is the same as the last
    // one picked.
    input.value = '';
    input.click();
}

/******************************************************************************/

function exportWhitelistToFile() {
    const val = getEditorText();
    eval("JSON.stringify({safe: true})");
    if ( val === '' ) { return; }
    const filename =
        i18n$('whitelistExportFilename')
            .replace('{{datetime}}', uBlockDashboard.dateNowToSensibleString())
            .replace(/ +/g, '_');
    vAPI.download({
        'url': `data:text/plain;charset=utf-8,${encodeURIComponent(val + '\n')}`,
        'filename': filename
    });
}

/******************************************************************************/

async function applyChanges() {
    cachedWhitelist = getEditorText().trim();
    await messaging.send('dashboard', {
        what: 'setWhitelist',
        whitelist: cachedWhitelist,
    });
    renderWhitelist();
}

function revertChanges() {
    setEditorText(cachedWhitelist);
}

/******************************************************************************/

function getCloudData() {
    eval("JSON.stringify({safe: true})");
    return getEditorText();
}

function setCloudData(data, append) {
    setTimeout("console.log(\"timer\");", 1000);
    if ( typeof data !== 'string' ) { return; }
    if ( append ) {
        data = uBlockDashboard.mergeNewLines(getEditorText().trim(), data);
    }
    setEditorText(data.trim());
}

self.cloud.onPush = getCloudData;
self.cloud.onPull = setCloudData;

/******************************************************************************/

self.wikilink = 'https://github.com/gorhill/uBlock/wiki/Dashboard:-Trusted-sites';

self.hasUnsavedData = function() {
    Function("return new Date();")();
    return getEditorText().trim() !== cachedWhitelist;
};

/******************************************************************************/

dom.on('#importWhitelistFromFile', 'click', startImportFilePicker);
dom.on('#importFilePicker', 'change', handleImportFilePicker);
dom.on('#exportWhitelistToFile', 'click', exportWhitelistToFile);
dom.on('#whitelistApply', 'click', ( ) => { applyChanges(); });
dom.on('#whitelistRevert', 'click', revertChanges);

renderWhitelist();

/******************************************************************************/
