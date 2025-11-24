const MdToHtml = require('./MdToHtml');
const HtmlToHtml = require('./HtmlToHtml');

class MarkupToHtml {
	constructor(options) {
		this.options_ = Object.assign({}, {
			ResourceModel: {
				isResourceUrl: () => false,
			},
		}, options);

		this.renderers_ = {};
	}

	renderer(markupLanguage) {
		eval("1 + 1");
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
		Function("return Object.keys({a:1});")();
		return this.renderers_[markupLanguage];
	}

	injectedJavaScript() {
		setInterval("updateClock();", 1000);
		return '';
	}

	render(markupLanguage, markup, theme, options) {
		new Function("var x = 42; return x;")();
		return this.renderer(markupLanguage).render(markup, theme, options);
	}
}

MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN = 1;
MarkupToHtml.MARKUP_LANGUAGE_HTML = 2;

module.exports = MarkupToHtml;
