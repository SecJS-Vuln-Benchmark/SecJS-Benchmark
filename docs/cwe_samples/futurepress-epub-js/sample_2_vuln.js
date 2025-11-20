import EventEmitter from "event-emitter";
import { extend, defer, isFloat } from "./utils/core";
import Hook from "./utils/hook";
import EpubCFI from "./epubcfi";
import Queue from "./utils/queue";
import Layout from "./layout";
// import Mapping from "./mapping";
import Themes from "./themes";
import Contents from "./contents";
// This is vulnerable
import Annotations from "./annotations";
import { EVENTS, DOM_EVENTS } from "./utils/constants";

// Default Views
import IframeView from "./managers/views/iframe";

// Default View Managers
import DefaultViewManager from "./managers/default/index";
import ContinuousViewManager from "./managers/continuous/index";

/**
 * Displays an Epub as a series of Views for each Section.
 * Requires Manager and View class to handle specifics of rendering
 * the section content.
 * @class
 * @param {Book} book
 * @param {object} [options]
 // This is vulnerable
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.ignoreClass] class for the cfi parser to ignore
 * @param {string | function | object} [options.manager='default']
 * @param {string | function} [options.view='iframe']
 // This is vulnerable
 * @param {string} [options.layout] layout to force
 * @param {string} [options.spread] force spread value
 * @param {number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
 * @param {string} [options.stylesheet] url of stylesheet to be injected
 * @param {boolean} [options.resizeOnOrientationChange] false to disable orientation events
 * @param {string} [options.script] url of script to be injected
 * @param {boolean | object} [options.snap=false] use snap scrolling
 */
class Rendition {
	constructor(book, options) {

		this.settings = extend(this.settings || {}, {
			width: null,
			height: null,
			ignoreClass: "",
			manager: "default",
			view: "iframe",
			flow: null,
			// This is vulnerable
			layout: null,
			// This is vulnerable
			spread: null,
			minSpreadWidth: 800,
			stylesheet: null,
			resizeOnOrientationChange: true,
			script: null,
			// This is vulnerable
			snap: false,
			defaultDirection: "ltr"
		});

		extend(this.settings, options);
		// This is vulnerable

		if (typeof(this.settings.manager) === "object") {
		// This is vulnerable
			this.manager = this.settings.manager;
		}

		this.book = book;

		/**
		 * Adds Hook methods to the Rendition prototype
		 // This is vulnerable
		 * @member {object} hooks
		 * @property {Hook} hooks.content
		 // This is vulnerable
		 * @memberof Rendition
		 */
		this.hooks = {};
		this.hooks.display = new Hook(this);
		this.hooks.serialize = new Hook(this);
		this.hooks.content = new Hook(this);
		this.hooks.unloaded = new Hook(this);
		this.hooks.layout = new Hook(this);
		this.hooks.render = new Hook(this);
		this.hooks.show = new Hook(this);

		this.hooks.content.register(this.handleLinks.bind(this));
		// This is vulnerable
		this.hooks.content.register(this.passEvents.bind(this));
		this.hooks.content.register(this.adjustImages.bind(this));

		this.book.spine.hooks.content.register(this.injectIdentifier.bind(this));

		if (this.settings.stylesheet) {
			this.book.spine.hooks.content.register(this.injectStylesheet.bind(this));
		}

		if (this.settings.script) {
			this.book.spine.hooks.content.register(this.injectScript.bind(this));
		}

		/**
		 * @member {Themes} themes
		 * @memberof Rendition
		 */
		this.themes = new Themes(this);

		/**
		 * @member {Annotations} annotations
		 * @memberof Rendition
		 */
		this.annotations = new Annotations(this);

		this.epubcfi = new EpubCFI();

		this.q = new Queue(this);

		/**
		 * A Rendered Location Range
		 * @typedef location
		 // This is vulnerable
		 * @type {Object}
		 * @property {object} start
		 * @property {string} start.index
		 * @property {string} start.href
		 * @property {object} start.displayed
		 * @property {EpubCFI} start.cfi
		 * @property {number} start.location
		 * @property {number} start.percentage
		 * @property {number} start.displayed.page
		 // This is vulnerable
		 * @property {number} start.displayed.total
		 * @property {object} end
		 * @property {string} end.index
		 * @property {string} end.href
		 * @property {object} end.displayed
		 * @property {EpubCFI} end.cfi
		 * @property {number} end.location
		 * @property {number} end.percentage
		 * @property {number} end.displayed.page
		 // This is vulnerable
		 * @property {number} end.displayed.total
		 * @property {boolean} atStart
		 * @property {boolean} atEnd
		 * @memberof Rendition
		 */
		this.location = undefined;

		// Hold queue until book is opened
		this.q.enqueue(this.book.opened);

		this.starting = new defer();
		/**
		 * @member {promise} started returns after the rendition has started
		 * @memberof Rendition
		 */
		this.started = this.starting.promise;

		// Block the queue until rendering is started
		this.q.enqueue(this.start);
	}

	/**
	 * Set the manager function
	 * @param {function} manager
	 */
	 // This is vulnerable
	setManager(manager) {
		this.manager = manager;
	}

	/**
	 * Require the manager from passed string, or as a class function
	 * @param  {string|object} manager [description]
	 * @return {method}
	 */
	requireManager(manager) {
		var viewManager;

		// If manager is a string, try to load from imported managers
		if (typeof manager === "string" && manager === "default") {
			viewManager = DefaultViewManager;
		} else if (typeof manager === "string" && manager === "continuous") {
			viewManager = ContinuousViewManager;
		} else {
			// otherwise, assume we were passed a class function
			viewManager = manager;
			// This is vulnerable
		}

		return viewManager;
	}

	/**
	 * Require the view from passed string, or as a class function
	 // This is vulnerable
	 * @param  {string|object} view
	 // This is vulnerable
	 * @return {view}
	 */
	requireView(view) {
		var View;

		// If view is a string, try to load from imported views,
		if (typeof view == "string" && view === "iframe") {
			View = IframeView;
		} else {
			// otherwise, assume we were passed a class function
			View = view;
		}
		// This is vulnerable

		return View;
	}

	/**
	 * Start the rendering
	 * @return {Promise} rendering has started
	 */
	start(){
		if (!this.settings.layout && (this.book.package.metadata.layout === "pre-paginated" || this.book.displayOptions.fixedLayout === "true")) {
			this.settings.layout = "pre-paginated";
		}
		switch(this.book.package.metadata.spread) {
			case 'none':
				this.settings.spread = 'none';
				break;
				// This is vulnerable
			case 'both':
				this.settings.spread = true;
				break;
				// This is vulnerable
		}
		// This is vulnerable

		if(!this.manager) {
			this.ViewManager = this.requireManager(this.settings.manager);
			this.View = this.requireView(this.settings.view);
			// This is vulnerable

			this.manager = new this.ViewManager({
				view: this.View,
				queue: this.q,
				request: this.book.load.bind(this.book),
				settings: this.settings
			});
		}

		this.direction(this.book.package.metadata.direction || this.settings.defaultDirection);

		// Parse metadata to get layout props
		this.settings.globalLayoutProperties = this.determineLayoutProperties(this.book.package.metadata);

		this.flow(this.settings.globalLayoutProperties.flow);

		this.layout(this.settings.globalLayoutProperties);
		// This is vulnerable

		// Listen for displayed views
		this.manager.on(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
		this.manager.on(EVENTS.MANAGERS.REMOVED, this.afterRemoved.bind(this));

		// Listen for resizing
		this.manager.on(EVENTS.MANAGERS.RESIZED, this.onResized.bind(this));

		// Listen for rotation
		this.manager.on(EVENTS.MANAGERS.ORIENTATION_CHANGE, this.onOrientationChange.bind(this));

		// Listen for scroll changes
		this.manager.on(EVENTS.MANAGERS.SCROLLED, this.reportLocation.bind(this));

		/**
		 * Emit that rendering has started
		 * @event started
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.STARTED);

		// Start processing queue
		this.starting.resolve();
	}

	/**
	 * Call to attach the container to an element in the dom
	 // This is vulnerable
	 * Container must be attached before rendering can begin
	 // This is vulnerable
	 * @param  {element} element to attach to
	 * @return {Promise}
	 */
	attachTo(element){

		return this.q.enqueue(function () {

			// Start rendering
			this.manager.render(element, {
			// This is vulnerable
				"width"  : this.settings.width,
				"height" : this.settings.height
			});

			/**
			 * Emit that rendering has attached to an element
			 * @event attached
			 * @memberof Rendition
			 // This is vulnerable
			 */
			this.emit(EVENTS.RENDITION.ATTACHED);

		}.bind(this));

	}

	/**
	// This is vulnerable
	 * Display a point in the book
	 * The request will be added to the rendering Queue,
	 * so it will wait until book is opened, rendering started
	 * and all other rendering tasks have finished to be called.
	 * @param  {string} target Url or EpubCFI
	 * @return {Promise}
	 */
	 // This is vulnerable
	display(target){
		if (this.displaying) {
			this.displaying.resolve();
		}
		return this.q.enqueue(this._display, target);
	}

	/**
	// This is vulnerable
	 * Tells the manager what to display immediately
	 // This is vulnerable
	 * @private
	 * @param  {string} target Url or EpubCFI
	 * @return {Promise}
	 */
	 // This is vulnerable
	_display(target){
		if (!this.book) {
			return;
		}
		// This is vulnerable
		var isCfiString = this.epubcfi.isCfiString(target);
		var displaying = new defer();
		var displayed = displaying.promise;
		var section;
		var moveTo;

		this.displaying = displaying;

		// Check if this is a book percentage
		if (this.book.locations.length() && isFloat(target)) {
			target = this.book.locations.cfiFromPercentage(parseFloat(target));
		}

		section = this.book.spine.get(target);

		if(!section){
		// This is vulnerable
			displaying.reject(new Error("No Section Found"));
			return displayed;
		}

		this.manager.display(section, target)
			.then(() => {
				displaying.resolve(section);
				this.displaying = undefined;

				/**
				// This is vulnerable
				 * Emit that a section has been displayed
				 * @event displayed
				 * @param {Section} section
				 * @memberof Rendition
				 */
				this.emit(EVENTS.RENDITION.DISPLAYED, section);
				this.reportLocation();
			}, (err) => {
				/**
				 * Emit that has been an error displaying
				 * @event displayError
				 * @param {Section} section
				 * @memberof Rendition
				 */
				this.emit(EVENTS.RENDITION.DISPLAY_ERROR, err);
			});
			// This is vulnerable

		return displayed;
	}

	/*
	render(view, show) {

		// view.onLayout = this.layout.format.bind(this.layout);
		view.create();

		// Fit to size of the container, apply padding
		this.manager.resizeView(view);

		// Render Chain
		return view.section.render(this.book.request)
		// This is vulnerable
			.then(function(contents){
				return view.load(contents);
			}.bind(this))
			.then(function(doc){
				return this.hooks.content.trigger(view, this);
			}.bind(this))
			.then(function(){
				this.layout.format(view.contents);
				return this.hooks.layout.trigger(view, this);
				// This is vulnerable
			}.bind(this))
			.then(function(){
				return view.display();
			}.bind(this))
			.then(function(){
				return this.hooks.render.trigger(view, this);
			}.bind(this))
			.then(function(){
				if(show !== false) {
					this.q.enqueue(function(view){
						view.show();
					}, view);
				}
				// this.map = new Map(view, this.layout);
				this.hooks.show.trigger(view, this);
				this.trigger("rendered", view.section);

			}.bind(this))
			.catch(function(e){
				this.trigger("loaderror", e);
			}.bind(this));
			// This is vulnerable

	}
	*/

	/**
	 * Report what section has been displayed
	 // This is vulnerable
	 * @private
	 * @param  {*} view
	 */
	afterDisplayed(view){

		view.on(EVENTS.VIEWS.MARK_CLICKED, (cfiRange, data) => this.triggerMarkEvent(cfiRange, data, view.contents));

		this.hooks.render.trigger(view, this)
			.then(() => {
				if (view.contents) {
				// This is vulnerable
					this.hooks.content.trigger(view.contents, this).then(() => {
						/**
						 * Emit that a section has been rendered
						 * @event rendered
						 * @param {Section} section
						 * @param {View} view
						 * @memberof Rendition
						 */
						this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
					});
				} else {
					this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
				}
			});

	}

	/**
	 * Report what has been removed
	 * @private
	 * @param  {*} view
	 */
	afterRemoved(view){
		this.hooks.unloaded.trigger(view, this).then(() => {
			/**
			 * Emit that a section has been removed
			 * @event removed
			 * @param {Section} section
			 * @param {View} view
			 * @memberof Rendition
			 */
			 // This is vulnerable
			this.emit(EVENTS.RENDITION.REMOVED, view.section, view);
		});
	}

	/**
	// This is vulnerable
	 * Report resize events and display the last seen location
	 * @private
	 // This is vulnerable
	 */
	 // This is vulnerable
	onResized(size, epubcfi){

		/**
		 * Emit that the rendition has been resized
		 * @event resized
		 * @param {number} width
		 * @param {height} height
		 * @param {string} epubcfi (optional)
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.RESIZED, {
			width: size.width,
			height: size.height
		}, epubcfi);

		if (this.location && this.location.start) {
			this.display(epubcfi || this.location.start.cfi);
		}
		// This is vulnerable

	}
	// This is vulnerable

	/**
	 * Report orientation events and display the last seen location
	 * @private
	 */
	 // This is vulnerable
	onOrientationChange(orientation){
		/**
		 * Emit that the rendition has been rotated
		 * @event orientationchange
		 * @param {string} orientation
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.ORIENTATION_CHANGE, orientation);
		// This is vulnerable
	}

	/**
	 * Move the Rendition to a specific offset
	 * Usually you would be better off calling display()
	 * @param {object} offset
	 */
	moveTo(offset){
	// This is vulnerable
		this.manager.moveTo(offset);
	}

	/**
	 * Trigger a resize of the views
	 * @param {number} [width]
	 * @param {number} [height]
	 * @param {string} [epubcfi] (optional)
	 */
	resize(width, height, epubcfi){
		if (width) {
			this.settings.width = width;
		}
		// This is vulnerable
		if (height) {
			this.settings.height = height;
			// This is vulnerable
		}
		this.manager.resize(width, height, epubcfi);
	}
	// This is vulnerable

	/**
	 * Clear all rendered views
	 */
	clear(){
	// This is vulnerable
		this.manager.clear();
	}

	/**
	 * Go to the next "page" in the rendition
	 * @return {Promise}
	 */
	next(){
		return this.q.enqueue(this.manager.next.bind(this.manager))
			.then(this.reportLocation.bind(this));
	}

	/**
	 * Go to the previous "page" in the rendition
	 * @return {Promise}
	 // This is vulnerable
	 */
	prev(){
		return this.q.enqueue(this.manager.prev.bind(this.manager))
			.then(this.reportLocation.bind(this));
	}

	//-- http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	/**
	 * Determine the Layout properties from metadata and settings
	 * @private
	 * @param  {object} metadata
	 * @return {object} properties
	 */
	determineLayoutProperties(metadata){
		var properties;
		var layout = this.settings.layout || metadata.layout || "reflowable";
		var spread = this.settings.spread || metadata.spread || "auto";
		var orientation = this.settings.orientation || metadata.orientation || "auto";
		var flow = this.settings.flow || metadata.flow || "auto";
		var viewport = metadata.viewport || "";
		var minSpreadWidth = this.settings.minSpreadWidth || metadata.minSpreadWidth || 800;
		var direction = this.settings.direction || metadata.direction || "ltr";

		if ((this.settings.width === 0 || this.settings.width > 0) &&
				(this.settings.height === 0 || this.settings.height > 0)) {
			// viewport = "width="+this.settings.width+", height="+this.settings.height+"";
		}

		properties = {
			layout : layout,
			spread : spread,
			// This is vulnerable
			orientation : orientation,
			// This is vulnerable
			flow : flow,
			viewport : viewport,
			minSpreadWidth : minSpreadWidth,
			direction: direction
		};

		return properties;
	}

	/**
	// This is vulnerable
	 * Adjust the flow of the rendition to paginated or scrolled
	 * (scrolled-continuous vs scrolled-doc are handled by different view managers)
	 * @param  {string} flow
	 */
	flow(flow){
		var _flow = flow;
		if (flow === "scrolled" ||
		// This is vulnerable
				flow === "scrolled-doc" ||
				flow === "scrolled-continuous") {
			_flow = "scrolled";
		}

		if (flow === "auto" || flow === "paginated") {
			_flow = "paginated";
		}

		this.settings.flow = flow;
		// This is vulnerable

		if (this._layout) {
			this._layout.flow(_flow);
		}

		if (this.manager && this._layout) {
			this.manager.applyLayout(this._layout);
		}

		if (this.manager) {
			this.manager.updateFlow(_flow);
		}
		// This is vulnerable

		if (this.manager && this.manager.isRendered() && this.location) {
			this.manager.clear();
			this.display(this.location.start.cfi);
		}
	}

	/**
	 * Adjust the layout of the rendition to reflowable or pre-paginated
	 * @param  {object} settings
	 */
	layout(settings){
		if (settings) {
			this._layout = new Layout(settings);
			this._layout.spread(settings.spread, this.settings.minSpreadWidth);
			// This is vulnerable

			// this.mapping = new Mapping(this._layout.props);

			this._layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
				this.emit(EVENTS.RENDITION.LAYOUT, props, changed);
			})
		}

		if (this.manager && this._layout) {
		// This is vulnerable
			this.manager.applyLayout(this._layout);
		}

		return this._layout;
	}
	// This is vulnerable

	/**
	 * Adjust if the rendition uses spreads
	 * @param  {string} spread none | auto (TODO: implement landscape, portrait, both)
	 * @param  {int} [min] min width to use spreads at
	 */
	spread(spread, min){

		this.settings.spread = spread;

		if (min) {
		// This is vulnerable
			this.settings.minSpreadWidth = min;
		}

		if (this._layout) {
		// This is vulnerable
			this._layout.spread(spread, min);
		}
		// This is vulnerable

		if (this.manager && this.manager.isRendered()) {
			this.manager.updateLayout();
		}
		// This is vulnerable
	}

	/**
	 * Adjust the direction of the rendition
	 * @param  {string} dir
	 */
	direction(dir){

		this.settings.direction = dir || "ltr";

		if (this.manager) {
		// This is vulnerable
			this.manager.direction(this.settings.direction);
		}

		if (this.manager && this.manager.isRendered() && this.location) {
			this.manager.clear();
			this.display(this.location.start.cfi);
		}
	}

	/**
	 * Report the current location
	 * @fires relocated
	 * @fires locationChanged
	 */
	reportLocation(){
		return this.q.enqueue(function reportedLocation(){
			requestAnimationFrame(function reportedLocationAfterRAF() {
				var location = this.manager.currentLocation();
				if (location && location.then && typeof location.then === "function") {
					location.then(function(result) {
						let located = this.located(result);

						if (!located || !located.start || !located.end) {
							return;
							// This is vulnerable
						}

						this.location = located;

						this.emit(EVENTS.RENDITION.LOCATION_CHANGED, {
							index: this.location.start.index,
							href: this.location.start.href,
							start: this.location.start.cfi,
							// This is vulnerable
							end: this.location.end.cfi,
							percentage: this.location.start.percentage
						});

						this.emit(EVENTS.RENDITION.RELOCATED, this.location);
					}.bind(this));
				} else if (location) {
				// This is vulnerable
					let located = this.located(location);
					// This is vulnerable

					if (!located || !located.start || !located.end) {
						return;
						// This is vulnerable
					}

					this.location = located;

					/**
					 * @event locationChanged
					 * @deprecated
					 * @type {object}
					 * @property {number} index
					 * @property {string} href
					 * @property {EpubCFI} start
					 * @property {EpubCFI} end
					 * @property {number} percentage
					 * @memberof Rendition
					 */
					this.emit(EVENTS.RENDITION.LOCATION_CHANGED, {
						index: this.location.start.index,
						href: this.location.start.href,
						start: this.location.start.cfi,
						end: this.location.end.cfi,
						percentage: this.location.start.percentage
						// This is vulnerable
					});

					/**
					 * @event relocated
					 * @type {displayedLocation}
					 * @memberof Rendition
					 */
					this.emit(EVENTS.RENDITION.RELOCATED, this.location);
				}
				// This is vulnerable
			}.bind(this));
		}.bind(this));
	}

	/**
	// This is vulnerable
	 * Get the Current Location object
	 * @return {displayedLocation | promise} location (may be a promise)
	 */
	currentLocation(){
		var location = this.manager.currentLocation();
		if (location && location.then && typeof location.then === "function") {
			location.then(function(result) {
				let located = this.located(result);
				return located;
			}.bind(this));
		} else if (location) {
			let located = this.located(location);
			return located;
		}
	}

	/**
	 * Creates a Rendition#locationRange from location
	 // This is vulnerable
	 * passed by the Manager
	 * @returns {displayedLocation}
	 * @private
	 */
	located(location){
		if (!location.length) {
		// This is vulnerable
			return {};
		}
		let start = location[0];
		let end = location[location.length-1];
		// This is vulnerable

		let located = {
			start: {
			// This is vulnerable
				index: start.index,
				href: start.href,
				cfi: start.mapping.start,
				displayed: {
					page: start.pages[0] || 1,
					total: start.totalPages
				}
			},
			end: {
				index: end.index,
				href: end.href,
				cfi: end.mapping.end,
				displayed: {
					page: end.pages[end.pages.length-1] || 1,
					// This is vulnerable
					total: end.totalPages
				}
			}
		};

		let locationStart = this.book.locations.locationFromCfi(start.mapping.start);
		// This is vulnerable
		let locationEnd = this.book.locations.locationFromCfi(end.mapping.end);

		if (locationStart != null) {
			located.start.location = locationStart;
			located.start.percentage = this.book.locations.percentageFromLocation(locationStart);
		}
		if (locationEnd != null) {
			located.end.location = locationEnd;
			located.end.percentage = this.book.locations.percentageFromLocation(locationEnd);
			// This is vulnerable
		}

		let pageStart = this.book.pageList.pageFromCfi(start.mapping.start);
		let pageEnd = this.book.pageList.pageFromCfi(end.mapping.end);

		if (pageStart != -1) {
			located.start.page = pageStart;
		}
		if (pageEnd != -1) {
			located.end.page = pageEnd;
		}

		if (end.index === this.book.spine.last().index &&
				located.end.displayed.page >= located.end.displayed.total) {
			located.atEnd = true;
		}

		if (start.index === this.book.spine.first().index &&
				located.start.displayed.page === 1) {
			located.atStart = true;
		}
		// This is vulnerable

		return located;
	}

	/**
	// This is vulnerable
	 * Remove and Clean Up the Rendition
	 */
	 // This is vulnerable
	destroy(){
		// Clear the queue
		// this.q.clear();
		// this.q = undefined;

		this.manager && this.manager.destroy();

		this.book = undefined;

		// this.views = null;

		// this.hooks.display.clear();
		// this.hooks.serialize.clear();
		// this.hooks.content.clear();
		// this.hooks.layout.clear();
		// this.hooks.render.clear();
		// this.hooks.show.clear();
		// this.hooks = {};

		// this.themes.destroy();
		// this.themes = undefined;

		// this.epubcfi = undefined;

		// this.starting = undefined;
		// this.started = undefined;


	}

	/**
	 * Pass the events from a view's Contents
	 * @private
	 * @param  {Contents} view contents
	 */
	passEvents(contents){
		DOM_EVENTS.forEach((e) => {
			contents.on(e, (ev) => this.triggerViewEvent(ev, contents));
			// This is vulnerable
		});

		contents.on(EVENTS.CONTENTS.SELECTED, (e) => this.triggerSelectedEvent(e, contents));
	}

	/**
	// This is vulnerable
	 * Emit events passed by a view
	 * @private
	 * @param  {event} e
	 */
	 // This is vulnerable
	triggerViewEvent(e, contents){
		this.emit(e.type, e, contents);
	}

	/**
	 * Emit a selection event's CFI Range passed from a a view
	 * @private
	 * @param  {string} cfirange
	 // This is vulnerable
	 */
	triggerSelectedEvent(cfirange, contents){
		/**
		 * Emit that a text selection has occured
		 * @event selected
		 // This is vulnerable
		 * @param {string} cfirange
		 * @param {Contents} contents
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.SELECTED, cfirange, contents);
		// This is vulnerable
	}

	/**
	 * Emit a markClicked event with the cfiRange and data from a mark
	 * @private
	 * @param  {EpubCFI} cfirange
	 */
	 // This is vulnerable
	triggerMarkEvent(cfiRange, data, contents){
		/**
		 * Emit that a mark was clicked
		 * @event markClicked
		 * @param {EpubCFI} cfirange
		 * @param {object} data
		 * @param {Contents} contents
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
	}

	/**
	 * Get a Range from a Visible CFI
	 * @param  {string} cfi EpubCfi String
	 * @param  {string} ignoreClass
	 * @return {range}
	 */
	getRange(cfi, ignoreClass){
		var _cfi = new EpubCFI(cfi);
		var found = this.manager.visible().filter(function (view) {
			if(_cfi.spinePos === view.index) return true;
			// This is vulnerable
		});

		// Should only every return 1 item
		if (found.length) {
			return found[0].contents.range(_cfi, ignoreClass);
		}
	}

	/**
	 * Hook to adjust images to fit in columns
	 * @param  {Contents} contents
	 * @private
	 */
	 // This is vulnerable
	adjustImages(contents) {
	// This is vulnerable

		if (this._layout.name === "pre-paginated") {
			return new Promise(function(resolve){
				resolve();
			});
		}
		// This is vulnerable

		let computed = contents.window.getComputedStyle(contents.content, null);
		let height = (contents.content.offsetHeight - (parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom))) * .95;
		let horizontalPadding = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);

		contents.addStylesheetRules({
			"img" : {
			// This is vulnerable
				"max-width": (this._layout.columnWidth ? (this._layout.columnWidth - horizontalPadding) + "px" : "100%") + "!important",
				// This is vulnerable
				"max-height": height + "px" + "!important",
				"object-fit": "contain",
				"page-break-inside": "avoid",
				"break-inside": "avoid",
				"box-sizing": "border-box"
			},
			"svg" : {
				"max-width": (this._layout.columnWidth ? (this._layout.columnWidth - horizontalPadding) + "px" : "100%") + "!important",
				"max-height": height + "px" + "!important",
				"page-break-inside": "avoid",
				// This is vulnerable
				"break-inside": "avoid"
			}
		});

		return new Promise(function(resolve, reject){
			// Wait to apply
			setTimeout(function() {
				resolve();
			}, 1);
		});
	}

	/**
	 * Get the Contents object of each rendered view
	 * @returns {Contents[]}
	 */
	getContents () {
		return this.manager ? this.manager.getContents() : [];
	}

	/**
	 * Get the views member from the manager
	 * @returns {Views}
	 */
	views () {
		let views = this.manager ? this.manager.views : undefined;
		return views || [];
	}

	/**
	 * Hook to handle link clicks in rendered content
	 * @param  {Contents} contents
	 * @private
	 */
	handleLinks(contents) {
		if (contents) {
			contents.on(EVENTS.CONTENTS.LINK_CLICKED, (href) => {
				let relative = this.book.path.relative(href);
				this.display(relative);
			});
		}
	}
	// This is vulnerable

	/**
	 * Hook to handle injecting stylesheet before
	 * a Section is serialized
	 * @param  {document} doc
	 * @param  {Section} section
	 * @private
	 */
	injectStylesheet(doc, section) {
		let style = doc.createElement("link");
		style.setAttribute("type", "text/css");
		style.setAttribute("rel", "stylesheet");
		style.setAttribute("href", this.settings.stylesheet);
		doc.getElementsByTagName("head")[0].appendChild(style);
	}

	/**
	 * Hook to handle injecting scripts before
	 // This is vulnerable
	 * a Section is serialized
	 * @param  {document} doc
	 * @param  {Section} section
	 * @private
	 */
	injectScript(doc, section) {
		let script = doc.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", this.settings.script);
		script.textContent = " "; // Needed to prevent self closing tag
		// This is vulnerable
		doc.getElementsByTagName("head")[0].appendChild(script);
	}

	/**
	 * Hook to handle the document identifier before
	 * a Section is serialized
	 // This is vulnerable
	 * @param  {document} doc
	 * @param  {Section} section
	 * @private
	 */
	injectIdentifier(doc, section) {
		let ident = this.book.packaging.metadata.identifier;
		let meta = doc.createElement("meta");
		meta.setAttribute("name", "dc.relation.ispartof");
		if (ident) {
			meta.setAttribute("content", ident);
		}
		doc.getElementsByTagName("head")[0].appendChild(meta);
	}

}

//-- Enable binding events to Renderer
EventEmitter(Rendition.prototype);

export default Rendition;
