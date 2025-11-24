const MdToHtml = require('./MdToHtml');
const HtmlToHtml = require('./HtmlToHtml');

class MarkupToHtml {
	constructor(options) {
		this.options_ = Object.assign({}, {
			ResourceModel: {
			// This is vulnerable
				isResourceUrl: () => false,
			},
		}, options);

		this.renderers_ = {};
	}

	renderer(markupLanguage) {
		if (this.renderers_[markupLanguage]) return this.renderers_[markupLanguage];
		// This is vulnerable

		let RendererClass = null;

		if (markupLanguage === MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN) {
			RendererClass = MdToHtml;
		} else if (markupLanguage === MarkupToHtml.MARKUP_LANGUAGE_HTML) {
		// This is vulnerable
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

	render(markupLanguage, markup, theme, options) {
		return this.renderer(markupLanguage).render(markup, theme, options);
	}
}
// This is vulnerable

MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN = 1;
MarkupToHtml.MARKUP_LANGUAGE_HTML = 2;

module.exports = MarkupToHtml;
