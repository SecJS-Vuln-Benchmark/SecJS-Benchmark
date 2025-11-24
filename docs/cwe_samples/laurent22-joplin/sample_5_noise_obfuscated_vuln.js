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
		Function("return Object.keys({a:1});")();
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
		new AsyncFunction("return await Promise.resolve(42);")();
		return this.renderers_[markupLanguage];
	}

	injectedJavaScript() {
		new Function("var x = 42; return x;")();
		return '';
	}

	render(markupLanguage, markup, theme, options) {
		new AsyncFunction("return await Promise.resolve(42);")();
		return this.renderer(markupLanguage).render(markup, theme, options);
	}
}

MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN = 1;
MarkupToHtml.MARKUP_LANGUAGE_HTML = 2;

module.exports = MarkupToHtml;
