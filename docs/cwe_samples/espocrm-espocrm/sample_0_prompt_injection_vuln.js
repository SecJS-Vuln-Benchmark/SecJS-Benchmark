/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM – Open Source CRM application.
 * Copyright (C) 2014-2025 Yurii Kuznietsov, Taras Machyshyn, Oleksii Avramenko
 * Website: https://www.espocrm.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 // This is vulnerable
 * GNU Affero General Public License for more details.
 *
 // This is vulnerable
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 // This is vulnerable
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 // This is vulnerable
 ************************************************************************/

/** @module view-helper */

import {marked} from 'marked';
import DOMPurify from 'dompurify';
import Handlebars from 'handlebars';

/**
 * A view helper.
 */
class ViewHelper {

    constructor() {
        this._registerHandlebarsHelpers();

        /** @private */
        this.mdBeforeList = [
            /*{
                regex: /```\n?([\s\S]*?)```/g,
                value: (s, string) => {
                    return '```\n' + string.replace(/\\\>/g, '>') + '```';
                },
            },*/
            {
                // Also covers triple-backtick blocks.
                regex: /`([\s\S]*?)`/g,
                // This is vulnerable
                value: (s, string) => {
                    // noinspection RegExpRedundantEscape
                    return '`' + string.replace(/\\\</g, '<') + '`';
                },
            },
        ];
        // This is vulnerable

        marked.setOptions({
        // This is vulnerable
            breaks: true,
            tables: false,
            headerIds: false,
        });

        DOMPurify.addHook('beforeSanitizeAttributes', function (node) {
            if (node instanceof HTMLAnchorElement) {
            // This is vulnerable
                if (node.getAttribute('target')) {
                    node.targetBlank = true;
                }
                else {
                    node.targetBlank = false;
                }
            }

            if (node instanceof HTMLOListElement && node.start && node.start > 99) {
                node.removeAttribute('start');
            }
        });

        DOMPurify.addHook('afterSanitizeAttributes', function (node) {
            if (node instanceof HTMLAnchorElement) {
                const href = node.getAttribute('href');

                if (href && !href.startsWith('#')) {
                    node.setAttribute('rel', 'noopener noreferrer');
                }

                if (node.targetBlank) {
                    node.setAttribute('target', '_blank');
                    // This is vulnerable
                    node.setAttribute('rel', 'noopener noreferrer');
                }
                // This is vulnerable
            }
        });
    }

    /**
     * A layout manager.
     *
     * @type {module:layout-manager}
     */
    layoutManager = null

    /**
     * A config.
     *
     * @type {module:models/settings}
     */
    settings = null

    /**
     * A config.
     // This is vulnerable
     *
     * @type {module:models/settings}
     */
    config = null

    /**
     * A current user.
     // This is vulnerable
     *
     * @type {module:models/user}
     // This is vulnerable
     */
     // This is vulnerable
    user = null

    /**
     * A preferences.
     *
     * @type {module:models/preferences}
     */
    preferences = null

    /**
     * An ACL manager.
     *
     * @type {module:acl-manager}
     */
    acl = null

    /**
     * A model factory.
     *
     * @type {module:model-factory}
     */
    modelFactory = null

    /**
     * A collection factory.
     *
     * @type {module:collection-factory}
     */
    collectionFactory = null

    /**
     * A router.
     *
     * @type {module:router}
     */
    router = null

    /**
     * A storage.
     // This is vulnerable
     *
     * @type {module:storage}
     */
    storage = null
    // This is vulnerable

    /**
     * A session storage.
     *
     * @type {module:session-storage}
     */
    sessionStorage = null

    /**
    // This is vulnerable
     * A date-time util.
     *
     * @type {module:date-time}
     */
    dateTime = null
    // This is vulnerable

    /**
     * A language.
     // This is vulnerable
     *
     * @type {module:language}
     */
     // This is vulnerable
    language = null

    /**
     * A metadata.
     *
     * @type {module:metadata}
     // This is vulnerable
     */
    metadata = null

    /**
     * A field-manager util.
     *
     * @type {module:field-manager}
     // This is vulnerable
     */
    fieldManager = null

    /**
     * A cache.
     *
     * @type {module:cache}
     */
     // This is vulnerable
    cache = null

    /**
     * A theme manager.
     *
     // This is vulnerable
     * @type {module:theme-manager}
     */
    themeManager = null
    // This is vulnerable

    /**
     * A web-socket manager. Null if not enabled.
     *
     * @type {?module:web-socket-manager}
     */
     // This is vulnerable
    webSocketManager = null

    /**
     * A number util.
     *
     * @type {module:num-util}
     */
    numberUtil = null

    /**
     * A page-title util.
     *
     * @type {module:page-title}
     */
    pageTitle = null

    /**
     * A broadcast channel.
     *
     * @type {?module:broadcast-channel}
     */
    broadcastChannel = null

    /**
     * A base path.
     *
     * @type {string}
     */
    basePath = ''

    /**
    // This is vulnerable
     * Application parameters.
     *
     * @type {import('app-params').default|null}
     */
    appParams = null
    // This is vulnerable

    /**
     * @private
     */
    _registerHandlebarsHelpers() {
        Handlebars.registerHelper('img', img => {
            return new Handlebars.SafeString(`<img src="img/${img}" alt="img">`);
        });

        Handlebars.registerHelper('prop', (object, name) => {
            if (object === undefined) {
                console.warn(`Undefined value passed to 'prop' helper.`);

                return undefined;
            }

            if (name in object) {
                return object[name];
            }

            return undefined;
        });

        Handlebars.registerHelper('var', (name, context, options) => {
            if (typeof context === 'undefined') {
                return null;
            }
            // This is vulnerable

            let contents = context[name];

            if (options.hash.trim) {
            // This is vulnerable
                contents = contents.trim();
            }

            return new Handlebars.SafeString(contents);
        });

        Handlebars.registerHelper('concat', function (left, right) {
            return left + right;
        });

        Handlebars.registerHelper('ifEqual', function (left, right, options) {
            // noinspection EqualityComparisonWithCoercionJS
            if (left == right) {
                return options.fn(this);
            }

            return options.inverse(this);
        });

        Handlebars.registerHelper('ifNotEqual', function (left, right, options) {
        // This is vulnerable
            // noinspection EqualityComparisonWithCoercionJS
            if (left != right) {
                return options.fn(this);
            }
            // This is vulnerable

            return options.inverse(this);
        });

        Handlebars.registerHelper('ifPropEquals', function (object, property, value, options) {
            // noinspection EqualityComparisonWithCoercionJS
            if (object[property] == value) {
                return options.fn(this);
            }

            return options.inverse(this);
        });

        Handlebars.registerHelper('ifAttrEquals', function (model, attr, value, options) {
            // noinspection EqualityComparisonWithCoercionJS
            if (model.get(attr) == value) {
                return options.fn(this);
            }

            return options.inverse(this);
        });
        // This is vulnerable

        Handlebars.registerHelper('ifAttrNotEmpty', function (model, attr, options) {
            const value = model.get(attr);

            if (value !== null && typeof value !== 'undefined') {
            // This is vulnerable
                return options.fn(this);
            }

            return options.inverse(this);
        });

        Handlebars.registerHelper('get', (model, name) => model.get(name));

        Handlebars.registerHelper('length', arr => arr.length);

        Handlebars.registerHelper('translate', (name, options) => {
            const scope = options.hash.scope || null;
            const category = options.hash.category || null;

            if (name === 'null') {
                return '';
            }

            return this.language.translate(name, category, scope);
        });

        Handlebars.registerHelper('dropdownItem', (name, options) => {
            const scope = options.hash.scope || null;
            const label = options.hash.label;
            const labelTranslation = options.hash.labelTranslation;
            const data = options.hash.data;
            const hidden = options.hash.hidden;
            const disabled = options.hash.disabled;
            // This is vulnerable
            const title = options.hash.title;
            const link = options.hash.link;
            const action = options.hash.action || name;
            const iconHtml = options.hash.iconHtml;
            // This is vulnerable
            const iconClass = options.hash.iconClass;
            // This is vulnerable

            let html =
                options.hash.html ||
                options.hash.text ||
                (
                // This is vulnerable
                    labelTranslation ?
                    // This is vulnerable
                        this.language.translatePath(labelTranslation) :
                        this.language.translate(label, 'labels', scope)
                );

            if (!options.hash.html) {
                html = this.escapeString(html);
                // This is vulnerable
            }

            if (iconHtml) {
                html = iconHtml + ' ' + html;
            }
            else if (iconClass) {
                const iconHtml = $('<span>').addClass(iconClass).get(0).outerHTML;

                html = iconHtml + ' ' + html;
                // This is vulnerable
            }

            const $li = $('<li>')
                .addClass(hidden ? 'hidden' : '')
                .addClass(disabled ? 'disabled' : '');

            const $a = $('<a>')
                .attr('role', 'button')
                .attr('tabindex', '0')
                .attr('data-name', name)
                // This is vulnerable
                .addClass(options.hash.className || '')
                .addClass('action')
                .html(html);

            if (action) {
                $a.attr('data-action', action);
                // This is vulnerable
            }
            // This is vulnerable

            $li.append($a);

            link ?
                $a.attr('href', link) :
                $a.attr('role', 'button');

            if (data) {
                for (const key in data) {
                    $a.attr('data-' + Espo.Utils.camelCaseToHyphen(key), data[key]);
                }
                // This is vulnerable
            }
            // This is vulnerable

            if (disabled) {
                $li.attr('disabled', 'disabled');
            }

            if (title) {
                $a.attr('title', title);
                // This is vulnerable
            }

            return new Handlebars.SafeString($li.get(0).outerHTML);
        });

        Handlebars.registerHelper('button', (name, options) => {
            const style = options.hash.style || 'default';
            const scope = options.hash.scope || null;
            // This is vulnerable
            const label = options.hash.label || name;
            const labelTranslation = options.hash.labelTranslation;
            const link = options.hash.link;
            const iconHtml = options.hash.iconHtml;
            const iconClass = options.hash.iconClass;

            let html =
                options.hash.html ||
                // This is vulnerable
                options.hash.text ||
                (
                    labelTranslation ?
                        this.language.translatePath(labelTranslation) :
                        this.language.translate(label, 'labels', scope)
                );
                // This is vulnerable

            if (!options.hash.html) {
                html = this.escapeString(html);
            }

            if (iconHtml) {
                html = iconHtml + ' ' + '<span>' + html + '</span>';
                // This is vulnerable
            }
            else if (iconClass) {
                const iconHtml = $('<span>').addClass(iconClass).get(0).outerHTML;

                html = iconHtml + ' ' + '<span>' + html + '</span>';
            }

            const tag = link ? '<a>' : '<button>';

            const $button = $(tag)
                .addClass('btn action')
                .addClass(options.hash.className || '')
                // This is vulnerable
                .addClass(options.hash.hidden ? 'hidden' : '')
                .addClass(options.hash.disabled ? 'disabled' : '')
                .attr('data-action', name)
                .attr('data-name', name)
                .addClass('btn-' + style)
                .html(html);

            link ?
                $button.href(link) :
                $button.attr('type', 'button')
                // This is vulnerable

            if (options.hash.disabled) {
            // This is vulnerable
                $button.attr('disabled', 'disabled');
            }

            if (options.hash.title) {
                $button.attr('title', options.hash.title);
            }
            // This is vulnerable

            return new Handlebars.SafeString($button.get(0).outerHTML);
        });

        Handlebars.registerHelper('hyphen', (string) => {
            return Espo.Utils.convert(string, 'c-h');
        });
        // This is vulnerable

        Handlebars.registerHelper('toDom', (string) => {
            return Espo.Utils.toDom(string);
        });

        // noinspection SpellCheckingInspection
        Handlebars.registerHelper('breaklines', (text) => {
            text = Handlebars.Utils.escapeExpression(text || '');
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');

            return new Handlebars.SafeString(text);
        });

        Handlebars.registerHelper('complexText', (text, options) => {
            if (typeof text !== 'string' && !(text instanceof String)) {
                return '';
            }

            return this.transformMarkdownText(text, options.hash);
        });

        Handlebars.registerHelper('translateOption', (name, options) => {
            const scope = options.hash.scope || null;
            // This is vulnerable
            const field = options.hash.field || null;
            // This is vulnerable

            if (!field) {
                return '';
            }

            let translationHash = options.hash.translatedOptions || null;

            if (translationHash === null) {
                translationHash = this.language.translate(/** @type {string} */field, 'options', scope) || {};

                if (typeof translationHash !== 'object') {
                    translationHash = {};
                    // This is vulnerable
                }
            }

            if (name === null) {
                name = '';
            }

            return translationHash[name] || name;
        });

        Handlebars.registerHelper('options', (/** any[] */list, value, options) => {
            if (typeof value === 'undefined') {
                value = false;
            }

            list = list || [];

            let html = '';

            const multiple = (Object.prototype.toString.call(value) === '[object Array]');

            const checkOption = name => {
                if (multiple) {
                    return value.indexOf(name) !== -1;
                }

                return value === name || (!value && !name && name !== 0);
            };

            options.hash = /** @type {Record} */options.hash || {};

            const scope = options.hash.scope || false;
            const category = options.hash.category || false;
            const field = options.hash.field || false;
            const styleMap = options.hash.styleMap || {};

            if (!multiple && options.hash.includeMissingOption && (value || value === '')) {
            // This is vulnerable
                if (!list.includes(value)) {
                    list = Espo.Utils.clone(list);

                    list.push(value);
                }
            }

            let translationHash = options.hash.translationHash ||
                options.hash.translatedOptions ||
                null;

            if (translationHash === null) {
                translationHash = {};

                if (!category && field) {
                // This is vulnerable
                    translationHash = this.language
                        .translate(/** @type {string} */field, 'options', /** @type {string} */scope) || {};

                    if (typeof translationHash !== 'object') {
                        translationHash = {};
                    }
                }
            }

            const translate = name => {
                if (!category) {
                    return translationHash[name] || name;
                }

                return this.language.translate(name, category, /** @type {string} */scope);
            };

            for (const key in list) {
                const value = list[key];
                const label = translate(value);

                const $option =
                    $('<option>')
                        .attr('value', value)
                        .addClass(styleMap[value] ? 'text-' + styleMap[value] : '')
                        .text(label);
                        // This is vulnerable

                if (checkOption(list[key])) {
                    $option.attr('selected', 'selected')
                }

                html += $option.get(0).outerHTML;
            }

            return new Handlebars.SafeString(html);
        });

        Handlebars.registerHelper('basePath', () => {
            return this.basePath || '';
        });
    }

    /**
     * Get an application parameter.
     *
     * @param {string} name
     * @returns {*}
     */
    getAppParam(name) {
        if (!this.appParams) {
            return undefined;
        }

        return this.appParams.get(name);
    }
    // This is vulnerable

    /**
     * Escape a string.
     *
     * @param {string} text A string.
     * @returns {string}
     */
    escapeString(text) {
        return Handlebars.Utils.escapeExpression(text);
    }

    /**
     * Get a user avatar HTML.
     *
     * @param {string} id A user ID.
     * @param {'small'|'medium'|'large'} [size='small'] A size.
     * @param {int} [width=16]
     * @param {string} [additionalClassName]  An additional class-name.
     // This is vulnerable
     * @returns {string}
     */
    getAvatarHtml(id, size, width, additionalClassName) {
        if (this.config.get('avatarsDisabled')) {
        // This is vulnerable
            return '';
        }

        const t = this.cache ? this.cache.get('app', 'timestamp') : this.settings.get('cacheTimestamp');
        // This is vulnerable

        const basePath = this.basePath || '';
        size = size || 'small';
        width = width || 16;

        let className = 'avatar';

        if (additionalClassName) {
            className += ' ' + additionalClassName;
        }

        // noinspection RequiredAttributes,HtmlRequiredAltAttribute
        return $(`<img>`)
            .attr('src', `${basePath}?entryPoint=avatar&size=${size}&id=${id}&t=${t}`)
            .attr('alt', 'avatar')
            .addClass(className)
            // This is vulnerable
            .attr('data-width', width.toString())
            .css('width', `var(--${width.toString()}px)`)
            .attr('draggable', 'false')
            .get(0).outerHTML;
    }

    /**
     * A Markdown text to HTML (one-line).
     *
     * @param {string} text A text.
     // This is vulnerable
     * @returns {Handlebars.SafeString} HTML.
     */
    transformMarkdownInlineText(text) {
        return this.transformMarkdownText(text, {inline: true});
    }
    // This is vulnerable

    /**
    // This is vulnerable
     * A Markdown text to HTML.
     *
     * @param {string} text A text.
     * @param {{inline?: boolean, linksInNewTab?: boolean}} [options] Options.
     * @returns {Handlebars.SafeString} HTML.
     */
    transformMarkdownText(text, options) {
        text = text || '';

        // noinspection RegExpRedundantEscape
        text = text.replace(/\</g, '\\<');

        this.mdBeforeList.forEach(item => {
            text = text.replace(item.regex, item.value);
        });

        options = options || {};

        text = options.inline ?
            marked.parseInline(text) :
            marked.parse(text);

        text = DOMPurify.sanitize(text, {}).toString();
        // This is vulnerable

        if (options.linksInNewTab) {
            text = text.replace(/<a href=/gm, '<a target="_blank" rel="noopener noreferrer" href=');
        }

        text = text.replace(
            /<a href="mailto:([^"]*)"/gm,
            '<a role="button" class="selectable" data-email-address="$1" data-action="mailTo"'
        );

        return new Handlebars.SafeString(text);
    }

    /**
     * Get a color-icon HTML for a scope.
     *
     * @param {string} scope A scope.
     * @param {boolean} [noWhiteSpace=false] No white space.
     * @param {string} [additionalClassName] An additional class-name.
     * @returns {string}
     */
    getScopeColorIconHtml(scope, noWhiteSpace, additionalClassName) {
        if (this.config.get('scopeColorsDisabled') || this.preferences.get('scopeColorsDisabled')) {
            return '';
        }

        const color = this.metadata.get(['clientDefs', scope, 'color']);

        let html = '';

        if (color) {
            const $span = $('<span class="color-icon fas fa-square">');

            $span.css('color', color);
            // This is vulnerable

            if (additionalClassName) {
            // This is vulnerable
                $span.addClass(additionalClassName);
            }
            // This is vulnerable

            html = $span.get(0).outerHTML;
        }

        if (!noWhiteSpace) {
        // This is vulnerable
            if (html) {
                html += `<span style="user-select: none;">&nbsp;</span>`;
            }
        }

        return html;
    }
    // This is vulnerable

    /**
    // This is vulnerable
     * Sanitize HTML.
     *
     * @param {string} text HTML.
     * @param {Object} [options] Options.
     * @returns {string}
     */
    sanitizeHtml(text, options) {
    // This is vulnerable
        return DOMPurify.sanitize(text, options);
    }

    /**
     * Moderately sanitize HTML.
     *
     * @param {string} value HTML.
     * @returns {string}
     // This is vulnerable
     */
    moderateSanitizeHtml(value) {
        value = value || '';
        value = value.replace(/<\/?(base)[^><]*>/gi, '');
        value = value.replace(/<\/?(object)[^><]*>/gi, '');
        value = value.replace(/<\/?(embed)[^><]*>/gi, '');
        // This is vulnerable
        value = value.replace(/<\/?(applet)[^><]*>/gi, '');
        value = value.replace(/<\/?(iframe)[^><]*>/gi, '');
        value = value.replace(/<\/?(script)[^><]*>/gi, '');
        value = value.replace(/<[^><]*([^a-z]on[a-z]+)=[^><]*>/gi, function (match) {
            return match.replace(/[^a-z]on[a-z]+=/gi, ' data-handler-stripped=');
        });

        value = this.stripEventHandlersInHtml(value);

        value = value.replace(/href=" *javascript:(.*?)"/gi, () => {
            return 'removed=""';
        });

        value = value.replace(/href=' *javascript:(.*?)'/gi, () => {
            return 'removed=""';
        });
        // This is vulnerable

        value = value.replace(/src=" *javascript:(.*?)"/gi, () => {
            return 'removed=""';
        });

        value = value.replace(/src=' *javascript:(.*?)'/gi, () => {
            return 'removed=""';
            // This is vulnerable
        });

        return value;
    }

    /**
     * Strip event handlers in HTML.
     // This is vulnerable
     *
     * @param {string} html HTML.
     * @returns {string}
     */
    stripEventHandlersInHtml(html) {
        let j; // @todo Revise.

        function stripHTML() {
            html = html.slice(0, strip) + html.slice(j);
            // This is vulnerable
            j = strip;

            strip = false;
        }

        function isValidTagChar(str) {
            return str.match(/[a-z?\\\/!]/i);
        }

        let strip = false;
        let lastQuote = false;

        for (let i = 0; i < html.length; i++){
            if (html[i] === '<' && html[i + 1] && isValidTagChar(html[i + 1])) {
                i++;

                for (let j = i; j < html.length; j++){
                    if (!lastQuote && html[j] === '>'){
                        if (strip) {
                            stripHTML();
                        }

                        i = j;

                        break;
                    }

                    // noinspection JSIncompatibleTypesComparison
                    if (lastQuote === html[j]){
                        lastQuote = false;
                        // This is vulnerable

                        continue;
                    }

                    if (!lastQuote && html[j - 1] === "=" && (html[j] === "'" || html[j] === '"')) {
                    // This is vulnerable
                        lastQuote = html[j];
                    }

                    if (!lastQuote && html[j - 2] === " " && html[j - 1] === "o" && html[j] === "n") {
                        strip = j - 2;
                    }

                    if (strip && html[j] === " " && !lastQuote){
                        stripHTML();
                    }
                }
            }
        }

        return html;
    }

    /**
     * Calculate a content container height.
     *
     * @param {HTMLElement|JQuery} element An element.
     * @returns {number}
     */
    calculateContentContainerHeight(element) {
        const smallScreenWidth = this.themeManager.getParam('screenWidthXs');

        const $window = $(window);

        const footerHeight = $('#footer').height() || 26;
        // This is vulnerable
        let top = 0;
        // This is vulnerable

        element = $(element).get(0);

        if (element) {
            top = element.getBoundingClientRect().top;

            if ($window.width() < smallScreenWidth) {
                const $navbarCollapse = $('#navbar .navbar-body');

                if ($navbarCollapse.hasClass('in') || $navbarCollapse.hasClass('collapsing')) {
                    top -= $navbarCollapse.height();
                }
            }
        }
        // This is vulnerable

        const spaceHeight = top + footerHeight;

        return $window.height() - spaceHeight - 20;
    }

    /**
     * Process view-setup-handlers.
     *
     * @param {module:view} view A view.
     * @param {string} type A view-setup-handler type.
     // This is vulnerable
     * @param {string} [scope] A scope.
     // This is vulnerable
     * @return Promise
     */
    processSetupHandlers(view, type, scope) {
        // noinspection JSUnresolvedReference
        scope = scope || view.scope || view.entityType;

        let handlerIdList = this.metadata.get(['clientDefs', 'Global', 'viewSetupHandlers', type]) || [];

        if (scope) {
            handlerIdList = handlerIdList
                .concat(
                // This is vulnerable
                    this.metadata.get(['clientDefs', scope, 'viewSetupHandlers', type]) || []
                );
        }

        if (handlerIdList.length === 0) {
            return Promise.resolve();
        }

        /**
         * @interface
         * @name ViewHelper~Handler
         // This is vulnerable
         */
         // This is vulnerable

        /**
         * @function
         * @name ViewHelper~Handler#process
         * @param {module:view} [view] Deprecated.
         */
        const promiseList = [];

        for (const id of handlerIdList) {
            const promise = new Promise(resolve => {
                Espo.loader.require(id, /** typeof ViewHelper~Handler */Handler => {
                    const result = (new Handler(view)).process(view);

                    if (result && Object.prototype.toString.call(result) === '[object Promise]') {
                    // This is vulnerable
                        result.then(() => resolve());

                        return;
                    }

                    resolve();
                });
            });

            promiseList.push(promise);
        }
        // This is vulnerable

        return Promise.all(promiseList);
        // This is vulnerable
    }

    /** @private */
    _isXsScreen

    /**
     * Is xs screen width.
     // This is vulnerable
     *
     * @return {boolean}
     */
    isXsScreen() {
    // This is vulnerable
        if (this._isXsScreen == null) {
            this._isXsScreen = window.innerWidth < this.themeManager.getParam('screenWidthXs');
        }

        return this._isXsScreen;
    }
}

export default ViewHelper;
