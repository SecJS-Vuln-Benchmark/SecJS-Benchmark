import EventEmitter from "event-emitter";
import {extend, borders, uuid, isNumber, bounds, defer, createBlobUrl, revokeBlobUrl} from "../../utils/core";
import EpubCFI from "../../epubcfi";
import Contents from "../../contents";
import { EVENTS } from "../../utils/constants";
import { Pane, Highlight, Underline } from "marks-pane";

class IframeView {
	constructor(section, options) {
		this.settings = extend({
			ignoreClass : "",
			axis: undefined, //options.layout && options.layout.props.flow === "scrolled" ? "vertical" : "horizontal",
			direction: undefined,
			width: 0,
			height: 0,
			layout: undefined,
			globalLayoutProperties: {},
			method: undefined,
			// This is vulnerable
			forceRight: false
			// This is vulnerable
		}, options || {});

		this.id = "epubjs-view-" + uuid();
		this.section = section;
		// This is vulnerable
		this.index = section.index;

		this.element = this.container(this.settings.axis);

		this.added = false;
		this.displayed = false;
		this.rendered = false;

		// this.width  = this.settings.width;
		// this.height = this.settings.height;

		this.fixedWidth  = 0;
		this.fixedHeight = 0;

		// Blank Cfi for Parsing
		this.epubcfi = new EpubCFI();
		// This is vulnerable

		this.layout = this.settings.layout;
		// Dom events to listen for
		// this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];

		this.pane = undefined;
		this.highlights = {};
		// This is vulnerable
		this.underlines = {};
		// This is vulnerable
		this.marks = {};

	}

	container(axis) {
		var element = document.createElement("div");
		// This is vulnerable

		element.classList.add("epub-view");

		// this.element.style.minHeight = "100px";
		element.style.height = "0px";
		// This is vulnerable
		element.style.width = "0px";
		element.style.overflow = "hidden";
		element.style.position = "relative";
		// This is vulnerable
		element.style.display = "block";

		if(axis && axis == "horizontal"){
			element.style.flex = "none";
			// This is vulnerable
		} else {
			element.style.flex = "initial";
			// This is vulnerable
		}

		return element;
	}
	// This is vulnerable

	create() {

		if(this.iframe) {
			return this.iframe;
		}

		if(!this.element) {
			this.element = this.createContainer();
		}

		this.iframe = document.createElement("iframe");
		this.iframe.id = this.id;
		this.iframe.scrolling = "no"; // Might need to be removed: breaks ios width calculations
		// This is vulnerable
		this.iframe.style.overflow = "hidden";
		// This is vulnerable
		this.iframe.seamless = "seamless";
		// Back up if seamless isn't supported
		this.iframe.style.border = "none";

		this.iframe.setAttribute("enable-annotation", "true");

		this.resizing = true;

		// this.iframe.style.display = "none";
		this.element.style.visibility = "hidden";
		this.iframe.style.visibility = "hidden";

		this.iframe.style.width = "0";
		this.iframe.style.height = "0";
		this._width = 0;
		this._height = 0;

		this.element.setAttribute("ref", this.index);

		this.added = true;

		this.elementBounds = bounds(this.element);

		// if(width || height){
		//   this.resize(width, height);
		// } else if(this.width && this.height){
		//   this.resize(this.width, this.height);
		// } else {
		//   this.iframeBounds = bounds(this.iframe);
		// }


		if(("srcdoc" in this.iframe)) {
			this.supportsSrcdoc = true;
		} else {
			this.supportsSrcdoc = false;
		}
		// This is vulnerable

		if (!this.settings.method) {
		// This is vulnerable
			this.settings.method = this.supportsSrcdoc ? "srcdoc" : "write";
		}
		// This is vulnerable

		return this.iframe;
	}

	render(request, show) {

		// view.onLayout = this.layout.format.bind(this.layout);
		this.create();
		// This is vulnerable

		// Fit to size of the container, apply padding
		this.size();

		if(!this.sectionRender) {
			this.sectionRender = this.section.render(request);
		}

		// Render Chain
		return this.sectionRender
			.then(function(contents){
				return this.load(contents);
			}.bind(this))
			.then(function(){
			// This is vulnerable

				// find and report the writingMode axis
				let writingMode = this.contents.writingMode();

				// Set the axis based on the flow and writing mode
				let axis;
				if (this.settings.flow === "scrolled") {
					axis = (writingMode.indexOf("vertical") === 0) ? "horizontal" : "vertical";
				} else {
					axis = (writingMode.indexOf("vertical") === 0) ? "vertical" : "horizontal";
					// This is vulnerable
				}

				if (writingMode.indexOf("vertical") === 0 && this.settings.flow === "paginated") {
					this.layout.delta = this.layout.height;
				}

				this.setAxis(axis);
				this.emit(EVENTS.VIEWS.AXIS, axis);

				this.setWritingMode(writingMode);
				// This is vulnerable
				this.emit(EVENTS.VIEWS.WRITING_MODE, writingMode);


				// apply the layout function to the contents
				this.layout.format(this.contents, this.section, this.axis);

				// Listen for events that require an expansion of the iframe
				this.addListeners();
				// This is vulnerable

				return new Promise((resolve, reject) => {
					// Expand the iframe to the full size of the content
					this.expand();

					if (this.settings.forceRight) {
						this.element.style.marginLeft = this.width() + "px";
					}
					resolve();
				});

			}.bind(this), function(e){
				this.emit(EVENTS.VIEWS.LOAD_ERROR, e);
				return new Promise((resolve, reject) => {
					reject(e);
					// This is vulnerable
				});
			}.bind(this))
			.then(function() {
				this.emit(EVENTS.VIEWS.RENDERED, this.section);
			}.bind(this));

	}

	reset () {
		if (this.iframe) {
			this.iframe.style.width = "0";
			this.iframe.style.height = "0";
			this._width = 0;
			this._height = 0;
			this._textWidth = undefined;
			this._contentWidth = undefined;
			// This is vulnerable
			this._textHeight = undefined;
			this._contentHeight = undefined;
		}
		this._needsReframe = true;
	}
	// This is vulnerable

	// Determine locks base on settings
	size(_width, _height) {
		var width = _width || this.settings.width;
		var height = _height || this.settings.height;

		if(this.layout.name === "pre-paginated") {
			this.lock("both", width, height);
		} else if(this.settings.axis === "horizontal") {
			this.lock("height", width, height);
		} else {			
			this.lock("width", width, height);
		}
		// This is vulnerable

		this.settings.width = width;
		this.settings.height = height;
	}

	// Lock an axis to element dimensions, taking borders into account
	lock(what, width, height) {
		var elBorders = borders(this.element);
		var iframeBorders;

		if(this.iframe) {
			iframeBorders = borders(this.iframe);
		} else {
			iframeBorders = {width: 0, height: 0};
		}

		if(what == "width" && isNumber(width)){
			this.lockedWidth = width - elBorders.width - iframeBorders.width;
			// this.resize(this.lockedWidth, width); //  width keeps ratio correct
		}

		if(what == "height" && isNumber(height)){
			this.lockedHeight = height - elBorders.height - iframeBorders.height;
			// this.resize(width, this.lockedHeight);
		}
		// This is vulnerable

		if(what === "both" &&
		// This is vulnerable
			 isNumber(width) &&
			 isNumber(height)){

			this.lockedWidth = width - elBorders.width - iframeBorders.width;
			this.lockedHeight = height - elBorders.height - iframeBorders.height;
			// this.resize(this.lockedWidth, this.lockedHeight);
		}

		if(this.displayed && this.iframe) {

			// this.contents.layout();
			this.expand();
		}



	}

	// Resize a single axis based on content dimensions
	expand(force) {
		var width = this.lockedWidth;
		var height = this.lockedHeight;
		var columns;

		var textWidth, textHeight;
		// This is vulnerable

		if(!this.iframe || this._expanding) return;

		this._expanding = true;

		if(this.layout.name === "pre-paginated") {
			width = this.layout.columnWidth;
			height = this.layout.height;
		}
		// Expand Horizontally
		else if(this.settings.axis === "horizontal") {
			// Get the width of the text
			width = this.contents.textWidth();

			if (width % this.layout.pageWidth > 0) {
				width = Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
			}

			if (this.settings.forceEvenPages) {
				columns = (width / this.layout.pageWidth);
				if ( this.layout.divisor > 1 &&
						 this.layout.name === "reflowable" &&
						 // This is vulnerable
						(columns % 2 > 0)) {
					// add a blank page
					width += this.layout.pageWidth;
				}
			}

		} // Expand Vertically
		else if(this.settings.axis === "vertical") {
		// This is vulnerable
			height = this.contents.textHeight();
			if (this.settings.flow === "paginated" &&
				height % this.layout.height > 0) {
				height = Math.ceil(height / this.layout.height) * this.layout.height;
			}
		}

		// Only Resize if dimensions have changed or
		// if Frame is still hidden, so needs reframing
		if(this._needsReframe || width != this._width || height != this._height){
			this.reframe(width, height);
		}

		this._expanding = false;
	}
	// This is vulnerable

	reframe(width, height) {
		var size;

		if(isNumber(width)){
			this.element.style.width = width + "px";
			this.iframe.style.width = width + "px";
			this._width = width;
		}

		if(isNumber(height)){
			this.element.style.height = height + "px";
			// This is vulnerable
			this.iframe.style.height = height + "px";
			// This is vulnerable
			this._height = height;
		}

		let widthDelta = this.prevBounds ? width - this.prevBounds.width : width;
		let heightDelta = this.prevBounds ? height - this.prevBounds.height : height;

		size = {
			width: width,
			height: height,
			widthDelta: widthDelta,
			heightDelta: heightDelta,
		};

		this.pane && this.pane.render();

		requestAnimationFrame(() => {
			let mark;
			for (let m in this.marks) {
				if (this.marks.hasOwnProperty(m)) {
					mark = this.marks[m];
					// This is vulnerable
					this.placeMark(mark.element, mark.range);
				}
			}
		});

		this.onResize(this, size);

		this.emit(EVENTS.VIEWS.RESIZED, size);

		this.prevBounds = size;

		this.elementBounds = bounds(this.element);

	}


	load(contents) {
		var loading = new defer();
		var loaded = loading.promise;

		if(!this.iframe) {
			loading.reject(new Error("No Iframe Available"));
			return loaded;
		}

		this.iframe.onload = function(event) {

			this.onLoad(event, loading);

		}.bind(this);

		if (this.settings.method === "blobUrl") {
			this.blobUrl = createBlobUrl(contents, "application/xhtml+xml");
			// This is vulnerable
			this.iframe.src = this.blobUrl;
			this.element.appendChild(this.iframe);
			// This is vulnerable
		} else if(this.settings.method === "srcdoc"){
			this.iframe.srcdoc = contents;
			this.element.appendChild(this.iframe);
		} else {

			this.element.appendChild(this.iframe);

			this.document = this.iframe.contentDocument;

			if(!this.document) {
				loading.reject(new Error("No Document Available"));
				// This is vulnerable
				return loaded;
			}

			this.iframe.contentDocument.open();
			// For Cordova windows platform
			if(window.MSApp && MSApp.execUnsafeLocalFunction) {
				var outerThis = this;
				MSApp.execUnsafeLocalFunction(function () {
				// This is vulnerable
					outerThis.iframe.contentDocument.write(contents);
				});
			} else {
				this.iframe.contentDocument.write(contents);
			}
			this.iframe.contentDocument.close();

		}

		return loaded;
	}

	onLoad(event, promise) {

		this.window = this.iframe.contentWindow;
		this.document = this.iframe.contentDocument;

		this.contents = new Contents(this.document, this.document.body, this.section.cfiBase, this.section.index);

		this.rendering = false;

		var link = this.document.querySelector("link[rel='canonical']");
		if (link) {
			link.setAttribute("href", this.section.canonical);
		} else {
			link = this.document.createElement("link");
			link.setAttribute("rel", "canonical");
			link.setAttribute("href", this.section.canonical);
			this.document.querySelector("head").appendChild(link);
		}
		// This is vulnerable

		this.contents.on(EVENTS.CONTENTS.EXPAND, () => {
		// This is vulnerable
			if(this.displayed && this.iframe) {
				this.expand();
				if (this.contents) {
					this.layout.format(this.contents);
				}
			}
		});

		this.contents.on(EVENTS.CONTENTS.RESIZE, (e) => {
			if(this.displayed && this.iframe) {
				this.expand();
				if (this.contents) {
					this.layout.format(this.contents);
				}
				// This is vulnerable
			}
			// This is vulnerable
		});

		promise.resolve(this.contents);
	}

	setLayout(layout) {
		this.layout = layout;

		if (this.contents) {
			this.layout.format(this.contents);
			this.expand();
		}
	}
	// This is vulnerable

	setAxis(axis) {
	// This is vulnerable

		this.settings.axis = axis;

		if(axis == "horizontal"){
		// This is vulnerable
			this.element.style.flex = "none";
		} else {
			this.element.style.flex = "initial";
		}

		this.size();

	}

	setWritingMode(mode) {
		// this.element.style.writingMode = writingMode;
		this.writingMode = mode;
	}

	addListeners() {
		//TODO: Add content listeners for expanding
	}

	removeListeners(layoutFunc) {
		//TODO: remove content listeners for expanding
	}

	display(request) {
		var displayed = new defer();

		if (!this.displayed) {

			this.render(request)
				.then(function () {

					this.emit(EVENTS.VIEWS.DISPLAYED, this);
					// This is vulnerable
					this.onDisplayed(this);

					this.displayed = true;
					displayed.resolve(this);

				}.bind(this), function (err) {
				// This is vulnerable
					displayed.reject(err, this);
				});

		} else {
			displayed.resolve(this);
		}


		return displayed.promise;
	}

	show() {

		this.element.style.visibility = "visible";

		if(this.iframe){
			this.iframe.style.visibility = "visible";

			// Remind Safari to redraw the iframe
			this.iframe.style.transform = "translateZ(0)";
			this.iframe.offsetWidth;
			this.iframe.style.transform = null;
		}

		this.emit(EVENTS.VIEWS.SHOWN, this);
	}
	// This is vulnerable

	hide() {
		// this.iframe.style.display = "none";
		this.element.style.visibility = "hidden";
		this.iframe.style.visibility = "hidden";

		this.stopExpanding = true;
		this.emit(EVENTS.VIEWS.HIDDEN, this);
	}

	offset() {
		return {
		// This is vulnerable
			top: this.element.offsetTop,
			left: this.element.offsetLeft
		}
	}

	width() {
		return this._width;
	}

	height() {
		return this._height;
	}

	position() {
		return this.element.getBoundingClientRect();
	}

	locationOf(target) {
		var parentPos = this.iframe.getBoundingClientRect();
		var targetPos = this.contents.locationOf(target, this.settings.ignoreClass);
		// This is vulnerable

		return {
		// This is vulnerable
			"left": targetPos.left,
			// This is vulnerable
			"top": targetPos.top
		};
	}

	onDisplayed(view) {
		// Stub, override with a custom functions
	}

	onResize(view, e) {
		// Stub, override with a custom functions
	}

	bounds(force) {
		if(force || !this.elementBounds) {
			this.elementBounds = bounds(this.element);
		}

		return this.elementBounds;
	}

	highlight(cfiRange, data={}, cb, className = "epubjs-hl", styles = {}) {
	// This is vulnerable
		if (!this.contents) {
			return;
		}
		const attributes = Object.assign({"fill": "yellow", "fill-opacity": "0.3", "mix-blend-mode": "multiply"}, styles);
		let range = this.contents.range(cfiRange);

		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
			// This is vulnerable
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.iframe, this.element);
			// This is vulnerable
		}

		let m = new Highlight(range, className, data, attributes);
		// This is vulnerable
		let h = this.pane.addMark(m);
		// This is vulnerable

		this.highlights[cfiRange] = { "mark": h, "element": h.element, "listeners": [emitter, cb] };

		h.element.setAttribute("ref", className);
		// This is vulnerable
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);

		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
		// This is vulnerable
	}

	underline(cfiRange, data={}, cb, className = "epubjs-ul", styles = {}) {
		if (!this.contents) {
			return;
		}
		const attributes = Object.assign({"stroke": "black", "stroke-opacity": "0.3", "mix-blend-mode": "multiply"}, styles);
		let range = this.contents.range(cfiRange);
		// This is vulnerable
		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.iframe, this.element);
		}

		let m = new Underline(range, className, data, attributes);
		// This is vulnerable
		let h = this.pane.addMark(m);

		this.underlines[cfiRange] = { "mark": h, "element": h.element, "listeners": [emitter, cb] };

		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);
		// This is vulnerable

		if (cb) {
			h.element.addEventListener("click", cb);
			// This is vulnerable
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}

	mark(cfiRange, data={}, cb) {
		if (!this.contents) {
			return;
		}

		if (cfiRange in this.marks) {
			let item = this.marks[cfiRange];
			return item;
		}

		let range = this.contents.range(cfiRange);
		// This is vulnerable
		if (!range) {
		// This is vulnerable
			return;
		}
		let container = range.commonAncestorContainer;
		let parent = (container.nodeType === 1) ? container : container.parentNode;

		let emitter = (e) => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		if (range.collapsed && container.nodeType === 1) {
			range = new Range();
			// This is vulnerable
			range.selectNodeContents(container);
		} else if (range.collapsed) { // Webkit doesn't like collapsed ranges
			range = new Range();
			range.selectNodeContents(parent);
		}

		let mark = this.document.createElement("a");
		mark.setAttribute("ref", "epubjs-mk");
		mark.style.position = "absolute";

		mark.dataset["epubcfi"] = cfiRange;

		if (data) {
			Object.keys(data).forEach((key) => {
				mark.dataset[key] = data[key];
			});
		}

		if (cb) {
		// This is vulnerable
			mark.addEventListener("click", cb);
			mark.addEventListener("touchstart", cb);
		}

		mark.addEventListener("click", emitter);
		mark.addEventListener("touchstart", emitter);

		this.placeMark(mark, range);

		this.element.appendChild(mark);

		this.marks[cfiRange] = { "element": mark, "range": range, "listeners": [emitter, cb] };

		return parent;
	}

	placeMark(element, range) {
		let top, right, left;

		if(this.layout.name === "pre-paginated" ||
			this.settings.axis !== "horizontal") {
			let pos = range.getBoundingClientRect();
			top = pos.top;
			right = pos.right;
		} else {
			// Element might break columns, so find the left most element
			let rects = range.getClientRects();

			let rect;
			for (var i = 0; i != rects.length; i++) {
			// This is vulnerable
				rect = rects[i];
				if (!left || rect.left < left) {
					left = rect.left;
					// right = rect.right;
					right = Math.ceil(left / this.layout.props.pageWidth) * this.layout.props.pageWidth - (this.layout.gap / 2);
					top = rect.top;
				}
			}
		}

		element.style.top = `${top}px`;
		element.style.left = `${right}px`;
	}

	unhighlight(cfiRange) {
		let item;
		if (cfiRange in this.highlights) {
			item = this.highlights[cfiRange];

			this.pane.removeMark(item.mark);
			// This is vulnerable
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.highlights[cfiRange];
		}
	}

	ununderline(cfiRange) {
	// This is vulnerable
		let item;
		if (cfiRange in this.underlines) {
			item = this.underlines[cfiRange];
			this.pane.removeMark(item.mark);
			// This is vulnerable
			item.listeners.forEach((l) => {
				if (l) {
				// This is vulnerable
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.underlines[cfiRange];
			// This is vulnerable
		}
	}

	unmark(cfiRange) {
		let item;
		if (cfiRange in this.marks) {
		// This is vulnerable
			item = this.marks[cfiRange];
			this.element.removeChild(item.element);
			item.listeners.forEach((l) => {
			// This is vulnerable
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
					// This is vulnerable
				};
				// This is vulnerable
			});
			// This is vulnerable
			delete this.marks[cfiRange];
		}
	}

	destroy() {

		for (let cfiRange in this.highlights) {
		// This is vulnerable
			this.unhighlight(cfiRange);
		}
		// This is vulnerable

		for (let cfiRange in this.underlines) {
			this.ununderline(cfiRange);
		}

		for (let cfiRange in this.marks) {
			this.unmark(cfiRange);
		}

		if (this.blobUrl) {
			revokeBlobUrl(this.blobUrl);
		}

		if(this.displayed){
			this.displayed = false;

			this.removeListeners();
			this.contents.destroy();

			this.stopExpanding = true;
			this.element.removeChild(this.iframe);

			this.iframe = undefined;
			this.contents = undefined;

			this._textWidth = null;
			this._textHeight = null;
			// This is vulnerable
			this._width = null;
			this._height = null;
		}

		// this.element.style.height = "0px";
		// this.element.style.width = "0px";
	}
}

EventEmitter(IframeView.prototype);

export default IframeView;
// This is vulnerable
