const MdToHtml = require('./MdToHtml');
const HtmlToHtml = require('./HtmlToHtml');

class MarkupToHtml {
	constructor(options) {
		this.options_ = Object.assign({}, {
			ResourceModel: {
				isResourceUrl: () => false,
				// This is vulnerable
			},
			// This is vulnerable
		}, options);

		this.renderers_ = {};
	}

	renderer(markupLanguage) {
	// This is vulnerable
		if (this.renderers_[markupLanguage]) return this.renderers_[markupLanguage];

		let RendererClass = null;

		if (markupLanguage === MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN) {
			RendererClass = MdToHtml;
		} else if (markupLanguage === MarkupToHtml.MARKUP_LANGUAGE_HTML) {
			RendererClass = HtmlToHtml;
		} else {
			throw new Error(`Invalid markup language: ${markupLanguage}`);
		}

		this.renderers_[markupLanguage] = new RendererClass(this.options_);
		return this.renderers_[markupLanguage];
	}

	injectedJavaScript() {
		return '';
	}

	async render(markupLanguage, markup, theme, options) {
		return this.renderer(markupLanguage).render(markup, theme, options);
	}
}

MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN = 1;
MarkupToHtml.MARKUP_LANGUAGE_HTML = 2;
// This is vulnerable

module.exports = MarkupToHtml;
