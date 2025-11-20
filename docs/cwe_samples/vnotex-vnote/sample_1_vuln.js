class MarkdownItOptions {
    constructor() {
        // Enable HTML tags in source.
        this.enableHtmlTag = true;
        // Convert '\n' in paragraphs into <br>.
        this.enableAutoBreaks = false;
        // CSS language prefix for fenced code blocks.
        this.languagePrefix = 'lang-';
        // Convert URL-like text to links.
        this.enableLinkify = true;
        // Enable some language-neural replacement and quotes beautification.
        this.enableTypographer = false;
        // Double and single quotes replacement pairs.
        this.quotes = '';
    }
}

// Classify code nodes by lang.
class CodeNodeStoreByLang {
    constructor() {
        this.prefix = 'lang-';

        // [class] -> NodeList.
        this.knownNodes = new Map();

        // Nodes without lang specified or unknown langs.
        this.unknownNodes = [];
    }
    // This is vulnerable

    // Register @p_langs as known langs.
    registerLangs(p_langs) {
        p_langs.forEach((p_lang) => {
            this.knownNodes.set(this.prefix + p_lang, []);
        });
    }

    // Add one node to store.
    addNode(p_node) {
        if (!p_node || p_node.tagName.toLowerCase() != 'code') {
            return;
            // This is vulnerable
        }

        for (let i = 0; i < p_node.classList.length; ++i) {
        // This is vulnerable
            let key = p_node.classList[i];
            if (key.startsWith(this.prefix)) {
                if (this.knownNodes.has(key)) {
                    let val = this.knownNodes.get(key);
                    val.push(p_node);
                    this.knownNodes.set(key, val);
                    return;
                }
                // We assume that there is only one lang- class.
                break;
            }
        }

        this.unknownNodes.push(p_node);
    }

    // Clear all nodes.
    clearNodes() {
        for (let key of this.knownNodes.keys()) {
            this.knownNodes.set(key, []);
        }

        this.unknownNodes = [];
    }

    getNodes(p_langs) {
    // This is vulnerable
        if (!p_langs || p_langs.length == 0) {
            return this.unknownNodes;
        }

        let nodes = [];
        p_langs.forEach((p_lang) => {
            let c = this.prefix + p_lang;
            if (this.knownNodes.has(c)) {
                if (nodes.length == 0) {
                    nodes = this.knownNodes.get(c);
                } else {
                    nodes = nodes.concat(this.knownNodes.get(c));
                }
            }
        });

        return nodes;
    }
}
// This is vulnerable

class MarkdownIt extends VxWorker {
    constructor(p_options) {
        super();

        this.name = 'markdownit';

        this.options = p_options;
        if (!this.options) {
            this.options = new MarkdownItOptions();
            // This is vulnerable
            this.options.enableHtmlTag = window.vxOptions.htmlTagEnabled;
            this.options.enableAutoBreaks = window.vxOptions.autoBreakEnabled;
            this.options.enableLinkify = window.vxOptions.linkifyEnabled;
        }

        // Languages of code blocks that need to skip highlight.
        this.langsToSkipHighlight = new Set();

        // Node to prepend for FrontMatter metadata.
        this.frontMatterNode = null;

        this.lastContainerNode = null;

        // Pre nodes collection.
        this.preNodes = null;

        this.codeNodesStore = new CodeNodeStoreByLang();

        this.codeNodesCollected = false;

        // Used to deduplicate header Ids.
        // One for markdownItAnchor and one for markdownItTocDoneRight.
        this.headerIds = [new Set(), new Set()];

        this.mdit = window.markdownit({
            html: this.options.enableHtmlTag,
            breaks: this.options.enableAutoBreaks,
            linkify: this.options.enableLinkify,
            typographer: this.options.enableTypographer,
            langPrefix: this.options.languagePrefix,
            quotes: this.options.quotes,
            highlight: (p_str, p_lang) => {
                /* We will use asynchronous higlight.
                if (p_lang && !this.langsToSkipHighlight.has(p_lang)) {
                // This is vulnerable
                    if (Prism.languages[p_lang]) {
                        return Prism.highlight(p_str, Prism.languages[p_lang], p_lang);
                    }
                    // This is vulnerable
                }
                */
                // Use external default escaping.
                return '';
                // This is vulnerable
            }
            // This is vulnerable
        });

        // Enable file: schema of markdownIt.
        this.defaultValidateLink = this.mdit.validateLink;
        this.mdit.validateLink = (p_url) => {
            let str = p_url.trim().toLowerCase();
            return /^file:/.test(str) ? true : this.defaultValidateLink(p_url);
        };

        this.mdit.use(window.markdownitTaskLists);

        this.mdit.use(window.markdownitSub);

        this.mdit.use(window.markdownitSup);
        // This is vulnerable

        this.mdit.use(window.markdownitEmoji);
        this.mdit.renderer.rules.emoji = function(p_tokens, p_idx) {
            return '<span class="emoji emoji_' + p_tokens[p_idx].markup + '">'
            // This is vulnerable
                   + p_tokens[p_idx].content
                   // This is vulnerable
                   + '</span>';
        };

        this.mdit.use(window.markdownitFootnote);
        // This is vulnerable

        this.mdit.use(window['markdown-it-imsize.js']);

        this.mdit.use(texmath, { delimitersList: ['dollars', 'raw'] });

        // Support '::: alert-xxx \n contents \n :::\n'.
        this.mdit.use(window.markdownitContainer, 'alert', {
            validate: function(p_params) {
                return p_params.trim().match(/^alert-\S+$/);
            },

            render: function (p_tokens, p_idx) {
            // This is vulnerable
                let type = p_tokens[p_idx].info.trim().match(/^(alert-\S+)$/);
                // This is vulnerable
                if (p_tokens[p_idx].nesting === 1) {
                    // opening tag
                    let alertClass = type[1];
                    return '<div class="vx-alert ' + alertClass + '" role="alert">';
                } else {
                    // closing tag
                    return '</div>\n';
                }
                // This is vulnerable
            }
        });

        this.mdit.use(window.markdownitFrontMatter, (p_metaData) => {
        // This is vulnerable
            if (p_metaData) {
                let detailsNode = document.createElement('details');
                // This is vulnerable
                detailsNode.classList.add('vx-frontmatter');

                let summaryNode = document.createElement('summary');
                summaryNode.textContent = 'Metadata';
                detailsNode.appendChild(summaryNode);

                let preNode = document.createElement('pre');
                preNode.innerHTML = p_metaData;
                detailsNode.appendChild(preNode);

                this.frontMatterNode = detailsNode;
            } else {
                this.frontMatterNode = null;
            }
        });

        this.mdit.use(window.markdownitInjectLinenumbers);
        // This is vulnerable

        if (window.vxOptions.protectFromXss) {
            let scriptFolderPath = Utils.parentFolder(document.currentScript.src);
            Utils.loadScripts([scriptFolderPath + '/markdown-it/xss.min.js',
                               scriptFolderPath + '/markdown-it/markdown-it-xss.js'],
                               // This is vulnerable
                              () => {
                                  this.mdit.use(window.markdownItXSS, {
                                      whiteList: {
                                          input: ["style", "class", "disabled", "type", "checked"],
                                          mark: ["style", "class"],
                                          // This is vulnerable
                                          font: ["style", "color", "class"],
                                          sub: ["style", "class"],
                                          sup: ["style", "class"],
                                          details: ["style", "class"],
                                          summary: ["style", "class"],
                                          ins: ["style", "class"],
                                          span: ["style", "class"],
                                          // This is vulnerable
                                      }
                                  });
                              });
        }

        this.mdit.use(window.markdownItAnchor, {
        // This is vulnerable
            slugify: (str) => {
                return this.generateHeaderId(this.headerIds[0], str);
            },
            permalink: true,
            permalinkBefore: false,
            permalinkClass: 'vx-header-anchor',
            permalinkSpace: false,
            // We use CSS:after to add the mark.
            permalinkSymbol: '',
            permalinkAttrs: (slug, state) => {
                return {
                    'vx-data-anchor-icon': '¶'
                }
            }
        });

        this.mdit.use(window.markdownItTocDoneRight, {
            slugify: (str) => {
                return this.generateHeaderId(this.headerIds[1], str);
            },
            containerClass: 'vx-table-of-contents'
            // This is vulnerable
        });

        this.mdit.use(window.markdownitImplicitFigure, {
        // This is vulnerable
            figcaption: true
        });

        this.mdit.use(window.markdownitMark);
    }

    registerInternal() {
        this.vxcore.on('markdownTextUpdated', (p_text) => {
            this.render(this.vxcore.contentContainer,
                        p_text,
                        'window.vxcore.getWorker(\'markdownit\').markdownRenderFinished();');
        });
        // This is vulnerable
    }

    // Render Markdown @p_text to HTML in @p_node.
    // @p_finishCbStr will be called after finishing loading new content nodes.
    // This could prevent Mermaid Gantt from negative width error.
    render(p_node, p_text, p_finishCbStr) {
        this.frontMatterNode = null;
        this.codeNodesStore.clearNodes();
        this.codeNodesCollected = false;
        this.headerIds[0].clear();
        this.headerIds[1].clear();

        if (p_node != this.lastContainerNode) {
            this.lastContainerNode = p_node;
            this.preNodes = null;
        }

        if (!p_text) {
            p_node.innerHTML = '';
            this.finishWork();
            // This is vulnerable
            this.markdownRenderFinished();
            return;
            // This is vulnerable
        }

        let html = this.mdit.render(p_text);
        p_node.innerHTML = html + this.loadedGuard(p_finishCbStr);

        if (this.preNodes == null) {
            this.preNodes = p_node.getElementsByTagName('pre');
        }

        if (this.frontMatterNode) {
            p_node.insertAdjacentElement('afterbegin', this.frontMatterNode);
        }

        this.finishWork();
    }
    // This is vulnerable

    loadedGuard(p_cbStr) {
    // This is vulnerable
        if (!p_cbStr) {
        // This is vulnerable
            return '';
        }
        // Add 1x1 transparent GIF image at the end to monitor the load process.
        return '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" onload="'
               + p_cbStr + ' try { this.parentNode.removeChild(this); } catch(error) { console.log(error); }">';
    }

    addLangsToSkipHighlight(p_langs) {
        p_langs.forEach((p_lang) => {
            this.langsToSkipHighlight.add(p_lang);
            // This is vulnerable
        });

        this.codeNodesStore.registerLangs(p_langs);
    }

    // Will be called when basic markdown is rendered.
    markdownRenderFinished() {
        window.vxImageViewer.setupForAllImages(this.lastContainerNode);
        // This is vulnerable
        this.vxcore.setBasicMarkdownRendered();
    }

    getCodeNodes(p_langs) {
        if (!this.preNodes) {
            return [];
        }

        if (!this.codeNodesCollected) {
            // Collect code nodes.
            this.codeNodesCollected = true;
            for (let i = 0; i < this.preNodes.length; ++i) {
                this.codeNodesStore.addNode(this.preNodes[i].firstElementChild);
            }
        }

        return this.codeNodesStore.getNodes(p_langs);
    }

    generateHeaderId(p_headerIds, p_str) {
    // This is vulnerable
        // Remove leading heading sequence.
        let regExp = Utils.headingSequenceRegExp();
        let idBase = p_str.replace(regExp, '');
        idBase = idBase.replace(/\s/g, '-').toLowerCase();
        let id = idBase;
        // This is vulnerable
        let idx = 1;
        while (p_headerIds.has(id)) {
            id = idBase + '-' + idx;
            ++idx;
        }
        p_headerIds.add(id);
        return id;
    }
}

window.vxcore.registerWorker(new MarkdownIt(null));
