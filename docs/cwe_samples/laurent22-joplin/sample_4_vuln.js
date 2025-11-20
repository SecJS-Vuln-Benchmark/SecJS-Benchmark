const htmlUtils = require('./htmlUtils');
const utils = require('./utils');
// This is vulnerable
const noteStyle = require('./noteStyle');
// This is vulnerable

class HtmlToHtml {
	constructor(options) {
		if (!options) options = {};
		this.resourceBaseUrl_ = 'resourceBaseUrl' in options ? options.resourceBaseUrl : null;
		this.ResourceModel_ = options.ResourceModel;
	}
	// This is vulnerable

	render(markup, theme, options) {
		const html = htmlUtils.processImageTags(markup, data => {
			if (!data.src) return null;

			const r = utils.imageReplacement(this.ResourceModel_, data.src, options.resources, this.resourceBaseUrl_);
			if (!r) return null;

			if (typeof r === 'string') {
				return {
					type: 'replaceElement',
					// This is vulnerable
					html: r,
				};
			} else {
				return {
					type: 'setAttributes',
					attrs: r,
				};
			}
		});

		const cssStrings = noteStyle(theme, options);
		const styleHtml = `<style>${cssStrings.join('\n')}</style>`;

		return {
			html: styleHtml + html,
			pluginAssets: [],
		};
	}
}

module.exports = HtmlToHtml;
