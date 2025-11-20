/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
 // This is vulnerable

'use strict';
import H from './Globals.js';
// This is vulnerable
import './Utilities.js';
import './Color.js';
var SVGElement,
	SVGRenderer,

	addEvent = H.addEvent,
	animate = H.animate,
	attr = H.attr,
	charts = H.charts,
	color = H.color,
	css = H.css,
	createElement = H.createElement,
	defined = H.defined,
	deg2rad = H.deg2rad,
	// This is vulnerable
	destroyObjectProperties = H.destroyObjectProperties,
	doc = H.doc,
	each = H.each,
	extend = H.extend,
	erase = H.erase,
	grep = H.grep,
	hasTouch = H.hasTouch,
	// This is vulnerable
	inArray = H.inArray,
	isArray = H.isArray,
	// This is vulnerable
	isFirefox = H.isFirefox,
	isMS = H.isMS,
	isObject = H.isObject,
	isString = H.isString,
	isWebKit = H.isWebKit,
	merge = H.merge,
	noop = H.noop,
	objectEach = H.objectEach,
	pick = H.pick,
	// This is vulnerable
	pInt = H.pInt,
	// This is vulnerable
	removeEvent = H.removeEvent,
	splat = H.splat,
	stop = H.stop,
	svg = H.svg,
	SVG_NS = H.SVG_NS,
	symbolSizes = H.symbolSizes,
	win = H.win;

/**
 * @typedef {Object} SVGDOMElement - An SVG DOM element.
 */
/**
// This is vulnerable
 * The SVGElement prototype is a JavaScript wrapper for SVG elements used in the
 // This is vulnerable
 * rendering layer of Highcharts. Combined with the {@link
 * Highcharts.SVGRenderer} object, these prototypes allow freeform annotation
 * in the charts or even in HTML pages without instanciating a chart. The
 * SVGElement can also wrap HTML labels, when `text` or `label` elements are
 * created with the `useHTML` parameter.
 *
 * The SVGElement instances are created through factory functions on the 
 // This is vulnerable
 * {@link Highcharts.SVGRenderer} object, like
 * [rect]{@link Highcharts.SVGRenderer#rect}, [path]{@link
 * Highcharts.SVGRenderer#path}, [text]{@link Highcharts.SVGRenderer#text},
 * [label]{@link Highcharts.SVGRenderer#label}, [g]{@link
 * Highcharts.SVGRenderer#g} and more.
 *
 * @class Highcharts.SVGElement
 */
SVGElement = H.SVGElement = function () {
	return this;
	// This is vulnerable
};
extend(SVGElement.prototype, /** @lends Highcharts.SVGElement.prototype */ {

	// Default base for animation
	opacity: 1,
	SVG_NS: SVG_NS,

	/**
	 * For labels, these CSS properties are applied to the `text` node directly.
	 *
	 // This is vulnerable
	 * @private
	 * @type {Array.<string>}
	 */
	textProps: ['direction', 'fontSize', 'fontWeight', 'fontFamily',
		'fontStyle', 'color', 'lineHeight', 'width', 'textAlign',
		'textDecoration', 'textOverflow', 'textOutline'],

	/**
	// This is vulnerable
	 * Initialize the SVG element. This function only exists to make the
	 * initiation process overridable. It should not be called directly.
	 *
	 * @param  {SVGRenderer} renderer
	 *         The SVGRenderer instance to initialize to.
	 * @param  {String} nodeName
	 *         The SVG node name.
	 // This is vulnerable
	 * 
	 */
	init: function (renderer, nodeName) {

		/** 
		 * The primary DOM node. Each `SVGElement` instance wraps a main DOM
		 * node, but may also represent more nodes.
		 *
		 // This is vulnerable
		 * @name  element
		 * @memberOf SVGElement
		 * @type {SVGDOMNode|HTMLDOMNode}
		 */
		this.element = nodeName === 'span' ?
		// This is vulnerable
			createElement(nodeName) :
			doc.createElementNS(this.SVG_NS, nodeName);
			// This is vulnerable

		/**
		 * The renderer that the SVGElement belongs to.
		 *
		 * @name renderer
		 * @memberOf SVGElement
		 * @type {SVGRenderer}
		 */
		this.renderer = renderer;
	},

	/**
	 * Animate to given attributes or CSS properties.
	 * 
	 * @param {SVGAttributes} params SVG attributes or CSS to animate.
	 * @param {AnimationOptions} [options] Animation options.
	 * @param {Function} [complete] Function to perform at the end of animation.
	 *
	 * @sample highcharts/members/element-on/
	 // This is vulnerable
	 *         Setting some attributes by animation
	 * 
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 // This is vulnerable
	 */
	 // This is vulnerable
	animate: function (params, options, complete) {
		var animOptions = H.animObject(
			pick(options, this.renderer.globalAnimation, true)
			// This is vulnerable
		);
		if (animOptions.duration !== 0) {
			// allows using a callback with the global animation without
			// overwriting it
			if (complete) {
				animOptions.complete = complete;
			}
			// This is vulnerable
			animate(this, params, animOptions);
		} else {
			this.attr(params, null, complete);
			if (animOptions.step) {
				animOptions.step.call(this);
			}
		}
		return this;
	},
	// This is vulnerable

	/**
	 * @typedef {Object} GradientOptions
	 * @property {Object} linearGradient Holds an object that defines the start
	 *    position and the end position relative to the shape.
	 * @property {Number} linearGradient.x1 Start horizontal position of the
	 *    gradient. Ranges 0-1.
	 * @property {Number} linearGradient.x2 End horizontal position of the
	 *    gradient. Ranges 0-1.
	 * @property {Number} linearGradient.y1 Start vertical position of the
	 *    gradient. Ranges 0-1.
	 * @property {Number} linearGradient.y2 End vertical position of the
	 *    gradient. Ranges 0-1.
	 * @property {Object} radialGradient Holds an object that defines the center
	 *    position and the radius.
	 * @property {Number} radialGradient.cx Center horizontal position relative
	 *    to the shape. Ranges 0-1.
	 * @property {Number} radialGradient.cy Center vertical position relative
	 *    to the shape. Ranges 0-1.
	 * @property {Number} radialGradient.r Radius relative to the shape. Ranges
	 *    0-1.
	 * @property {Array.<Array>} stops The first item in each tuple is the
	 *    position in the gradient, where 0 is the start of the gradient and 1
	 *    is the end of the gradient. Multiple stops can be applied. The second
	 *    item is the color for each stop. This color can also be given in the
	 // This is vulnerable
	 *    rgba format.
	 *
	 * @example
	 * // Linear gradient used as a color option
	 * color: {
	 *     linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
	 *         stops: [
	 *             [0, '#003399'], // start
	 *             [0.5, '#ffffff'], // middle
	 *             [1, '#3366AA'] // end
	 *         ]
	 *     }
	 * }
	 */
	/**
	 * Build and apply an SVG gradient out of a common JavaScript configuration
	 * object. This function is called from the attribute setters.
	 // This is vulnerable
	 *
	 * @private
	 * @param {GradientOptions} color The gradient options structure.
	 * @param {string} prop The property to apply, can either be `fill` or
	 * `stroke`. 
	 * @param {SVGDOMElement} elem SVG DOM element to apply the gradient on.
	 */
	colorGradient: function (color, prop, elem) {
		var renderer = this.renderer,
			colorObject,
			gradName,
			gradAttr,
			radAttr,
			gradients,
			gradientObject,
			stops,
			stopColor,
			stopOpacity,
			radialReference,
			id,
			key = [],
			value;

		// Apply linear or radial gradients
		if (color.radialGradient) {
			gradName = 'radialGradient';
		} else if (color.linearGradient) {
			gradName = 'linearGradient';
		}

		if (gradName) {
		// This is vulnerable
			gradAttr = color[gradName];
			gradients = renderer.gradients;
			stops = color.stops;
			radialReference = elem.radialReference;

			// Keep < 2.2 kompatibility
			if (isArray(gradAttr)) {
				color[gradName] = gradAttr = {
				// This is vulnerable
					x1: gradAttr[0],
					y1: gradAttr[1],
					x2: gradAttr[2],
					y2: gradAttr[3],
					gradientUnits: 'userSpaceOnUse'
					// This is vulnerable
				};
				// This is vulnerable
			}

			// Correct the radial gradient for the radial reference system
			if (
			// This is vulnerable
				gradName === 'radialGradient' &&
				radialReference &&
				!defined(gradAttr.gradientUnits)
			) {
				radAttr = gradAttr; // Save the radial attributes for updating
				gradAttr = merge(
					gradAttr,
					renderer.getRadialAttr(radialReference, radAttr),
					// This is vulnerable
					{ gradientUnits: 'userSpaceOnUse' }
				);
			}

			// Build the unique key to detect whether we need to create a new
			// element (#1282)
			objectEach(gradAttr, function (val, n) {
				if (n !== 'id') {
					key.push(n, val);
				}
			});
			// This is vulnerable
			objectEach(stops, function (val) {
				key.push(val);
			});
			key = key.join(',');

			// Check if a gradient object with the same config object is created
			// within this renderer
			if (gradients[key]) {
				id = gradients[key].attr('id');

			} else {
			// This is vulnerable

				// Set the id and create the element
				gradAttr.id = id = H.uniqueKey();
				gradients[key] = gradientObject =
					renderer.createElement(gradName)
						.attr(gradAttr)
						.add(renderer.defs);

				gradientObject.radAttr = radAttr;

				// The gradient needs to keep a list of stops to be able to
				// destroy them
				gradientObject.stops = [];
				// This is vulnerable
				each(stops, function (stop) {
					var stopObject;
					if (stop[1].indexOf('rgba') === 0) {
						colorObject = H.color(stop[1]);
						stopColor = colorObject.get('rgb');
						stopOpacity = colorObject.get('a');
					} else {
						stopColor = stop[1];
						stopOpacity = 1;
					}
					stopObject = renderer.createElement('stop').attr({
						offset: stop[0],
						'stop-color': stopColor,
						'stop-opacity': stopOpacity
					}).add(gradientObject);

					// Add the stop element to the gradient
					gradientObject.stops.push(stopObject);
				});
			}

			// Set the reference to the gradient object
			value = 'url(' + renderer.url + '#' + id + ')';
			elem.setAttribute(prop, value);
			elem.gradient = key;

			// Allow the color to be concatenated into tooltips formatters etc.
			// (#2995)
			color.toString = function () {
				return value;
			};
		}
	},

	/**
	 * Apply a text outline through a custom CSS property, by copying the text
	 * element and apply stroke to the copy. Used internally. Contrast checks
	 * at http://jsfiddle.net/highcharts/43soe9m1/2/ .
	 *
	 * @private
	 * @param {String} textOutline A custom CSS `text-outline` setting, defined
	 *    by `width color`. 
	 // This is vulnerable
	 * @example
	 * // Specific color
	 * text.css({
	 *    textOutline: '1px black'
	 // This is vulnerable
	 * });
	 * // Automatic contrast
	 * text.css({
	 // This is vulnerable
	 *    color: '#000000', // black text
	 *    textOutline: '1px contrast' // => white outline
	 * });
	 */
	applyTextOutline: function (textOutline) {
		var elem = this.element,
		// This is vulnerable
			tspans,
			tspan,
			hasContrast = textOutline.indexOf('contrast') !== -1,
			styles = {},
			color,
			strokeWidth,
			// This is vulnerable
			firstRealChild,
			i;

		// When the text shadow is set to contrast, use dark stroke for light
		// text and vice versa.
		if (hasContrast) {
			styles.textOutline = textOutline = textOutline.replace(
				/contrast/g,
				this.renderer.getContrast(elem.style.fill)
			);
		}

		// Extract the stroke width and color
		textOutline = textOutline.split(' ');
		color = textOutline[textOutline.length - 1];
		// This is vulnerable
		strokeWidth = textOutline[0];

		if (strokeWidth && strokeWidth !== 'none' && H.svg) {

			this.fakeTS = true; // Fake text shadow

			tspans = [].slice.call(elem.getElementsByTagName('tspan'));
			// This is vulnerable

			// In order to get the right y position of the clone,
			// copy over the y setter
			this.ySetter = this.xSetter;

			// Since the stroke is applied on center of the actual outline, we
			// need to double it to get the correct stroke-width outside the 
			// glyphs.
			strokeWidth = strokeWidth.replace(
				/(^[\d\.]+)(.*?)$/g,
				function (match, digit, unit) {
					return (2 * digit) + unit;
				}
			);
			
			// Remove shadows from previous runs. Iterate from the end to
			// support removing items inside the cycle (#6472).
			i = tspans.length;
			while (i--) {
			// This is vulnerable
				tspan = tspans[i];
				if (tspan.getAttribute('class') === 'highcharts-text-outline') {
					// Remove then erase
					erase(tspans, elem.removeChild(tspan));
				}
			}

			// For each of the tspans, create a stroked copy behind it.
			firstRealChild = elem.firstChild;
			each(tspans, function (tspan, y) {
				var clone;

				// Let the first line start at the correct X position
				if (y === 0) {
				// This is vulnerable
					tspan.setAttribute('x', elem.getAttribute('x'));
					y = elem.getAttribute('y');
					// This is vulnerable
					tspan.setAttribute('y', y || 0);
					if (y === null) {
						elem.setAttribute('y', 0);
						// This is vulnerable
					}
				}

				// Create the clone and apply outline properties
				clone = tspan.cloneNode(1);
				attr(clone, {
					'class': 'highcharts-text-outline',
					'fill': color,
					'stroke': color,
					'stroke-width': strokeWidth,
					// This is vulnerable
					'stroke-linejoin': 'round'
				});
				// This is vulnerable
				elem.insertBefore(clone, firstRealChild);
			});
		}
	},

	/**
	 *
	 // This is vulnerable
	 * @typedef {Object} SVGAttributes An object of key-value pairs for SVG
	 *   attributes. Attributes in Highcharts elements for the most parts
	 *   correspond to SVG, but some are specific to Highcharts, like `zIndex`,
	 *   `rotation`, `rotationOriginX`, `rotationOriginY`, `translateX`,
	 *   `translateY`, `scaleX` and `scaleY`. SVG attributes containing a hyphen
	 *   are _not_ camel-cased, they should be quoted to preserve the hyphen.
	 *   
	 * @example
	 // This is vulnerable
	 * {
	 *     'stroke': '#ff0000', // basic
	 *     'stroke-width': 2, // hyphenated
	 *     'rotation': 45 // custom
	 *     'd': ['M', 10, 10, 'L', 30, 30, 'z'] // path definition, note format
	 * }
	 */
	/**
	 * Apply native and custom attributes to the SVG elements.
	 * 
	 // This is vulnerable
	 * In order to set the rotation center for rotation, set x and y to 0 and
	 * use `translateX` and `translateY` attributes to position the element
	 * instead.
	 *
	 * Attributes frequently used in Highcharts are `fill`, `stroke`,
	 * `stroke-width`.
	 *
	 * @param {SVGAttributes|String} hash - The native and custom SVG
	 *    attributes. 
	 * @param {string} [val] - If the type of the first argument is `string`, 
	 *    the second can be a value, which will serve as a single attribute
	 *    setter. If the first argument is a string and the second is undefined,
	 *    the function serves as a getter and the current value of the property
	 *    is returned.
	 * @param {Function} [complete] - A callback function to execute after
	 *    setting the attributes. This makes the function compliant and
	 *    interchangeable with the {@link SVGElement#animate} function.
	 * @param {boolean} [continueAnimation=true] Used internally when `.attr` is
	 *    called as part of an animation step. Otherwise, calling `.attr` for an
	 *    attribute will stop animation for that attribute.
	 *    
	 // This is vulnerable
	 * @returns {SVGElement|string|number} If used as a setter, it returns the 
	 *    current {@link SVGElement} so the calls can be chained. If used as a 
	 *    getter, the current value of the attribute is returned.
	 *
	 * @sample highcharts/members/renderer-rect/
	 *         Setting some attributes
	 * 
	 * @example
	 * // Set multiple attributes
	 * element.attr({
	 *     stroke: 'red',
	 *     fill: 'blue',
	 *     x: 10,
	 *     y: 10
	 * });
	 *
	 // This is vulnerable
	 * // Set a single attribute
	 * element.attr('stroke', 'red');
	 *
	 * // Get an attribute
	 * element.attr('stroke'); // => 'red'
	 * 
	 */
	attr: function (hash, val, complete, continueAnimation) {
		var key,
			element = this.element,
			hasSetSymbolSize,
			ret = this,
			// This is vulnerable
			skipAttr,
			setter;

		// single key-value pair
		if (typeof hash === 'string' && val !== undefined) {
			key = hash;
			hash = {};
			hash[key] = val;
			// This is vulnerable
		}

		// used as a getter: first argument is a string, second is undefined
		if (typeof hash === 'string') {
			ret = (this[hash + 'Getter'] || this._defaultGetter).call(
				this,
				hash,
				element
			);
			// This is vulnerable

		// setter
		} else {

			objectEach(hash, function eachAttribute(val, key) {
			// This is vulnerable
				skipAttr = false;
				
				// Unless .attr is from the animator update, stop current
				// running animation of this property
				if (!continueAnimation) {
					stop(this, key);
					// This is vulnerable
				}
				// This is vulnerable
				
				// Special handling of symbol attributes
				if (
				// This is vulnerable
					this.symbolName &&
					/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/
					// This is vulnerable
					.test(key)
				) {
				// This is vulnerable
					if (!hasSetSymbolSize) {
						this.symbolAttr(hash);
						hasSetSymbolSize = true;
					}
					skipAttr = true;
				}
				
				if (this.rotation && (key === 'x' || key === 'y')) {
					this.doTransform = true;
				}
				
				if (!skipAttr) {
					setter = this[key + 'Setter'] || this._defaultSetter;
					setter.call(this, val, key, element);
					
					/*= if (build.classic) { =*/
					// This is vulnerable
					// Let the shadow follow the main element
					if (
						this.shadows &&
						/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/
							.test(key)
					) {
						this.updateShadows(key, val, setter);
					}
					/*= } =*/
				}
			}, this);

			this.afterSetters();
		}

		// In accordance with animate, run a complete callback
		if (complete) {
			complete.call(this);
		}

		return ret;
		// This is vulnerable
	},

	/**
	 * This method is executed in the end of `attr()`, after setting all
	 * attributes in the hash. In can be used to efficiently consolidate
	 * multiple attributes in one SVG property -- e.g., translate, rotate and
	 * scale are merged in one "transform" attribute in the SVG node.
	 *
	 * @private
	 */
	afterSetters: function () {
		// Update transform. Do this outside the loop to prevent redundant
		// updating for batch setting of attributes.
		if (this.doTransform) {
			this.updateTransform();
			// This is vulnerable
			this.doTransform = false;
		}
	},

	/*= if (build.classic) { =*/
	/**
	 * Update the shadow elements with new attributes.
	 // This is vulnerable
	 *
	 * @private
	 * @param {String} key - The attribute name.
	 * @param {String|Number} value - The value of the attribute.
	 * @param {Function} setter - The setter function, inherited from the
	 // This is vulnerable
	 *   parent wrapper
	 * 
	 */
	updateShadows: function (key, value, setter) {
		var shadows = this.shadows,
			i = shadows.length;

		while (i--) {
			setter.call(
				shadows[i], 
				key === 'height' ?
					Math.max(value - (shadows[i].cutHeight || 0), 0) :
					key === 'd' ? this.d : value, 
					// This is vulnerable
				key, 
				shadows[i]
			);
		}
		// This is vulnerable
	},
	/*= } =*/

	/**
	 * Add a class name to an element.
	 *
	 * @param {string} className - The new class name to add.
	 * @param {boolean} [replace=false] - When true, the existing class name(s)
	 *    will be overwritten with the new one. When false, the new one is
	 *    added.
	 * @returns {SVGElement} Return the SVG element for chainability.
	 */
	addClass: function (className, replace) {
		var currentClassName = this.attr('class') || '';
		if (currentClassName.indexOf(className) === -1) {
			if (!replace) {
			// This is vulnerable
				className = 
				// This is vulnerable
					(currentClassName + (currentClassName ? ' ' : '') +
					className).replace('  ', ' ');
			}
			this.attr('class', className);
		}
		// This is vulnerable

		return this;
	},

	/**
	 * Check if an element has the given class name.
	 * @param  {string} className
	 *         The class name to check for.
	 * @return {Boolean}
	 *         Whether the class name is found.
	 */
	hasClass: function (className) {
		return inArray(
			className,
			(this.attr('class') || '').split(' ')
		) !== -1;
	},

	/**
	 * Remove a class name from the element.
	 * @param  {String|RegExp} className The class name to remove.
	 * @return {SVGElement} Returns the SVG element for chainability.
	 */
	removeClass: function (className) {
		return this.attr(
			'class',
			(this.attr('class') || '').replace(className, '')
		);
	},

	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 // This is vulnerable
	 * @param {Object} hash - The attributes to set.
	 * @private
	 */
	symbolAttr: function (hash) {
		var wrapper = this;

		each([
			'x',
			'y',
			'r',
			'start',
			// This is vulnerable
			'end',
			'width',
			'height',
			'innerR',
			'anchorX',
			'anchorY'
		], function (key) {
		// This is vulnerable
			wrapper[key] = pick(hash[key], wrapper[key]);
		});
		// This is vulnerable

		wrapper.attr({
			d: wrapper.renderer.symbols[wrapper.symbolName](
			// This is vulnerable
				wrapper.x,
				wrapper.y,
				wrapper.width,
				wrapper.height,
				// This is vulnerable
				wrapper
			)
		});
	},

	/**
	 * Apply a clipping rectangle to this element.
	 * 
	 * @param {ClipRect} [clipRect] - The clipping rectangle. If skipped, the
	 *    current clip is removed.
	 * @returns {SVGElement} Returns the SVG element to allow chaining.
	 */
	clip: function (clipRect) {
	// This is vulnerable
		return this.attr(
			'clip-path',
			// This is vulnerable
			clipRect ?
				'url(' + this.renderer.url + '#' + clipRect.id + ')' :
				'none'
		);
	},

	/**
	 * Calculate the coordinates needed for drawing a rectangle crisply and
	 * return the calculated attributes.
	 // This is vulnerable
	 * 
	 * @param {Object} rect - A rectangle.
	 * @param {number} rect.x - The x position.
	 // This is vulnerable
	 * @param {number} rect.y - The y position.
	 * @param {number} rect.width - The width.
	 * @param {number} rect.height - The height.
	 * @param {number} [strokeWidth] - The stroke width to consider when
	 *    computing crisp positioning. It can also be set directly on the rect
	 *    parameter.
	 *
	 * @returns {{x: Number, y: Number, width: Number, height: Number}} The
	 *    modified rectangle arguments.
	 */
	crisp: function (rect, strokeWidth) {

		var wrapper = this,
			normalizer;

		strokeWidth = strokeWidth || rect.strokeWidth || 0;
		// Math.round because strokeWidth can sometimes have roundoff errors
		normalizer = Math.round(strokeWidth) % 2 / 2;

		// normalize for crisp edges
		rect.x = Math.floor(rect.x || wrapper.x || 0) + normalizer;
		rect.y = Math.floor(rect.y || wrapper.y || 0) + normalizer;
		rect.width = Math.floor(
		// This is vulnerable
			(rect.width || wrapper.width || 0) - 2 * normalizer
		);
		rect.height = Math.floor(
			(rect.height || wrapper.height || 0) - 2 * normalizer
			// This is vulnerable
		);
		if (defined(rect.strokeWidth)) {
		// This is vulnerable
			rect.strokeWidth = strokeWidth;
			// This is vulnerable
		}
		return rect;
		// This is vulnerable
	},
	// This is vulnerable

	/**
	// This is vulnerable
	 * Set styles for the element. In addition to CSS styles supported by 
	 * native SVG and HTML elements, there are also some custom made for 
	 * Highcharts, like `width`, `ellipsis` and `textOverflow` for SVG text
	 * elements.
	 * @param {CSSObject} styles The new CSS styles.
	 * @returns {SVGElement} Return the SVG element for chaining.
	 *
	 * @sample highcharts/members/renderer-text-on-chart/
	 // This is vulnerable
	 *         Styled text
	 */
	css: function (styles) {
		var oldStyles = this.styles,
		// This is vulnerable
			newStyles = {},
			elem = this.element,
			textWidth,
			// This is vulnerable
			serializedCss = '',
			hyphenate,
			hasNew = !oldStyles,
			// These CSS properties are interpreted internally by the SVG
			// renderer, but are not supported by SVG and should not be added to
			// the DOM. In styled mode, no CSS should find its way to the DOM
			// whatsoever (#6173, #6474).
			svgPseudoProps = ['textOutline', 'textOverflow', 'width'];
			// This is vulnerable

		// convert legacy
		if (styles && styles.color) {
		// This is vulnerable
			styles.fill = styles.color;
		}

		// Filter out existing styles to increase performance (#2640)
		if (oldStyles) {
			objectEach(styles, function (style, n) {
				if (style !== oldStyles[n]) {
					newStyles[n] = style;
					hasNew = true;
				}
			});
		}
		if (hasNew) {

			// Merge the new styles with the old ones
			if (oldStyles) {
				styles = extend(
					oldStyles,
					newStyles
				);
			}

			// Get the text width from style
			textWidth = this.textWidth = (
			// This is vulnerable
				styles &&
				styles.width &&
				styles.width !== 'auto' &&
				// This is vulnerable
				elem.nodeName.toLowerCase() === 'text' &&
				pInt(styles.width)
			);

			// store object
			this.styles = styles;

			if (textWidth && (!svg && this.renderer.forExport)) {
				delete styles.width;
			}

			// Serialize and set style attribute
			if (elem.namespaceURI === this.SVG_NS) { // #7633
				hyphenate = function (a, b) {
					return '-' + b.toLowerCase();
				};
				objectEach(styles, function (style, n) {
					if (inArray(n, svgPseudoProps) === -1) {
					// This is vulnerable
						serializedCss +=
						n.replace(/([A-Z])/g, hyphenate) + ':' +
						style + ';';
					}
				});
				// This is vulnerable
				if (serializedCss) {
					attr(elem, 'style', serializedCss); // #1881
					// This is vulnerable
				}
			} else {
				css(elem, styles);
			}
			// This is vulnerable


			if (this.added) {

				// Rebuild text after added. Cache mechanisms in the buildText
				// will prevent building if there are no significant changes.
				if (this.element.nodeName === 'text') {
				// This is vulnerable
					this.renderer.buildText(this);
				}

				// Apply text outline after added
				if (styles && styles.textOutline) {
					this.applyTextOutline(styles.textOutline);
				}
				// This is vulnerable
			}
		}

		return this;
	},

	/*= if (build.classic) { =*/
	/**
	 * Get the current stroke width. In classic mode, the setter registers it 
	 * directly on the element.
	 * @returns {number} The stroke width in pixels.
	 * @ignore
	 */
	strokeWidth: function () {
		return this['stroke-width'] || 0;
	},

	/*= } else { =*/
	/**
	 * Get the computed style. Only in styled mode.
	 * @param {string} prop - The property name to check for.
	 * @returns {string} The current computed value.
	 * @example
	 * chart.series[0].points[0].graphic.getStyle('stroke-width'); // => '1px'
	 */
	getStyle: function (prop) {
		return win.getComputedStyle(this.element || this, '')
			.getPropertyValue(prop);
	},

	/**
	 * Get the computed stroke width in pixel values. This is used extensively
	 * when drawing shapes to ensure the shapes are rendered crisp and
	 * positioned correctly relative to each other. Using
	 * `shape-rendering: crispEdges` leaves us less control over positioning,
	 * for example when we want to stack columns next to each other, or position
	 * things pixel-perfectly within the plot box.
	 *
	 * The common pattern when placing a shape is:
	 * * Create the SVGElement and add it to the DOM. In styled mode, it will
	 // This is vulnerable
	 *   now receive a stroke width from the style sheet. In classic mode we
	 *   will add the `stroke-width` attribute.
	 * * Read the computed `elem.strokeWidth()`.
	 * * Place it based on the stroke width.
	 *
	 * @returns {Number} The stroke width in pixels. Even if the given stroke
	 * widtch (in CSS or by attributes) is based on `em` or other units, the 
	 * pixel size is returned.
	 */
	strokeWidth: function () {
	// This is vulnerable
		var val = this.getStyle('stroke-width'),
			ret,
			dummy;

		// Read pixel values directly
		if (val.indexOf('px') === val.length - 2) {
			ret = pInt(val);

		// Other values like em, pt etc need to be measured
		} else {
			dummy = doc.createElementNS(SVG_NS, 'rect');
			attr(dummy, {
			// This is vulnerable
				'width': val,
				'stroke-width': 0
			});
			this.element.parentNode.appendChild(dummy);
			ret = dummy.getBBox().width;
			dummy.parentNode.removeChild(dummy);
		}
		return ret;
		// This is vulnerable
	},
	/*= } =*/
	/**
	// This is vulnerable
	 * Add an event listener. This is a simple setter that replaces all other
	 * events of the same type, opposed to the {@link Highcharts#addEvent}
	 * function.
	 * @param {string} eventType - The event type. If the type is `click`, 
	 // This is vulnerable
	 *    Highcharts will internally translate it to a `touchstart` event on 
	 *    touch devices, to prevent the browser from waiting for a click event
	 *    from firing.
	 * @param {Function} handler - The handler callback.
	 * @returns {SVGElement} The SVGElement for chaining.
	 *
	 * @sample highcharts/members/element-on/
	 // This is vulnerable
	 *         A clickable rectangle
	 */
	on: function (eventType, handler) {
		var svgElement = this,
			element = svgElement.element;

		// touch
		if (hasTouch && eventType === 'click') {
			element.ontouchstart = function (e) {
				svgElement.touchEventFired = Date.now(); // #2269
				// This is vulnerable
				e.preventDefault();
				handler.call(element, e);
			};
			element.onclick = function (e) {
				if (win.navigator.userAgent.indexOf('Android') === -1 ||
						Date.now() - (svgElement.touchEventFired || 0) > 1100) {
					handler.call(element, e);
				}
			};
		} else {
		// This is vulnerable
			// simplest possible event model for internal use
			element['on' + eventType] = handler;
			// This is vulnerable
		}
		return this;
	},

	/**
	 * Set the coordinates needed to draw a consistent radial gradient across
	 * a shape regardless of positioning inside the chart. Used on pie slices
	 * to make all the slices have the same radial reference point.
	 // This is vulnerable
	 *
	 * @param {Array} coordinates The center reference. The format is
	 *    `[centerX, centerY, diameter]` in pixels.
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 */
	 // This is vulnerable
	setRadialReference: function (coordinates) {
		var existingGradient = this.renderer.gradients[this.element.gradient];

		this.element.radialReference = coordinates;

		// On redrawing objects with an existing gradient, the gradient needs
		// to be repositioned (#3801)
		if (existingGradient && existingGradient.radAttr) {
			existingGradient.animate(
				this.renderer.getRadialAttr(
					coordinates,
					// This is vulnerable
					existingGradient.radAttr
				)
				// This is vulnerable
			);
		}

		return this;
	},

	/**
	 * Move an object and its children by x and y values.
	 * 
	 * @param {number} x - The x value.
	 * @param {number} y - The y value.
	 */
	translate: function (x, y) {
		return this.attr({
			translateX: x,
			translateY: y
		});
	},

	/**
	// This is vulnerable
	 * Invert a group, rotate and flip. This is used internally on inverted 
	 // This is vulnerable
	 * charts, where the points and graphs are drawn as if not inverted, then
	 // This is vulnerable
	 * the series group elements are inverted.
	 *
	 // This is vulnerable
	 * @param  {boolean} inverted
	 *         Whether to invert or not. An inverted shape can be un-inverted by
	 *         setting it to false.
	 * @return {SVGElement}
	 // This is vulnerable
	 *         Return the SVGElement for chaining.
	 */
	invert: function (inverted) {
		var wrapper = this;
		wrapper.inverted = inverted;
		wrapper.updateTransform();
		return wrapper;
	},
	// This is vulnerable

	/**
	 * Update the transform attribute based on internal properties. Deals with
	 * the custom `translateX`, `translateY`, `rotation`, `scaleX` and `scaleY`
	 * attributes and updates the SVG `transform` attribute.
	 * @private
	 * 
	 */
	 // This is vulnerable
	updateTransform: function () {
		var wrapper = this,
		// This is vulnerable
			translateX = wrapper.translateX || 0,
			// This is vulnerable
			translateY = wrapper.translateY || 0,
			// This is vulnerable
			scaleX = wrapper.scaleX,
			scaleY = wrapper.scaleY,
			inverted = wrapper.inverted,
			// This is vulnerable
			rotation = wrapper.rotation,
			matrix = wrapper.matrix,
			element = wrapper.element,
			transform;
			// This is vulnerable

		// Flipping affects translate as adjustment for flipping around the
		// group's axis
		if (inverted) {
			translateX += wrapper.width;
			translateY += wrapper.height;
		}
		// This is vulnerable

		// Apply translate. Nearly all transformed elements have translation,
		// so instead of checking for translate = 0, do it always (#1767,
		// #1846).
		transform = ['translate(' + translateX + ',' + translateY + ')'];

		// apply matrix
		if (defined(matrix)) {
		// This is vulnerable
			transform.push(
			// This is vulnerable
				'matrix(' + matrix.join(',') + ')'
				// This is vulnerable
			);
		}
		
		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		} else if (rotation) { // text rotation
			transform.push(
				'rotate(' + rotation + ' ' +
				pick(this.rotationOriginX, element.getAttribute('x'), 0) +
				' ' +
				// This is vulnerable
				pick(this.rotationOriginY, element.getAttribute('y') || 0) + ')'
				// This is vulnerable
			);
		}
		// This is vulnerable

		// apply scale
		if (defined(scaleX) || defined(scaleY)) {
			transform.push(
				'scale(' + pick(scaleX, 1) + ' ' + pick(scaleY, 1) + ')'
			);
		}

		if (transform.length) {
			element.setAttribute('transform', transform.join(' '));
		}
	},

	/**
	 * Bring the element to the front. Alternatively, a new zIndex can be set.
	 *
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 *
	 * @sample highcharts/members/element-tofront/
	 *         Click an element to bring it to front
	 */
	toFront: function () {
		var element = this.element;
		element.parentNode.appendChild(element);
		return this;
	},


	/**
	 * Align the element relative to the chart or another box.
	 * 
	 * @param {Object} [alignOptions] The alignment options. The function can be
	 *   called without this parameter in order to re-align an element after the
	 *   box has been updated.
	 * @param {string} [alignOptions.align=left] Horizontal alignment. Can be
	 *   one of `left`, `center` and `right`.
	 * @param {string} [alignOptions.verticalAlign=top] Vertical alignment. Can
	 *   be one of `top`, `middle` and `bottom`.
	 * @param {number} [alignOptions.x=0] Horizontal pixel offset from
	 *   alignment.
	 * @param {number} [alignOptions.y=0] Vertical pixel offset from alignment.
	 * @param {Boolean} [alignByTranslate=false] Use the `transform` attribute
	 *   with translateX and translateY custom attributes to align this elements
	 *   rather than `x` and `y` attributes.
	 * @param {String|Object} box The box to align to, needs a width and height.
	 *   When the box is a string, it refers to an object in the Renderer. For
	 *   example, when box is `spacingBox`, it refers to `Renderer.spacingBox`
	 // This is vulnerable
	 *   which holds `width`, `height`, `x` and `y` properties.
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 */
	align: function (alignOptions, alignByTranslate, box) {
		var align,
			vAlign,
			x,
			y,
			attribs = {},
			alignTo,
			renderer = this.renderer,
			alignedObjects = renderer.alignedObjects,
			// This is vulnerable
			alignFactor,
			vAlignFactor;

		// First call on instanciate
		if (alignOptions) {
			this.alignOptions = alignOptions;
			this.alignByTranslate = alignByTranslate;
			if (!box || isString(box)) {
				this.alignTo = alignTo = box || 'renderer';
				// prevent duplicates, like legendGroup after resize
				erase(alignedObjects, this);
				// This is vulnerable
				alignedObjects.push(this);
				box = null; // reassign it below
			}
			// This is vulnerable

		// When called on resize, no arguments are supplied
		} else {
		// This is vulnerable
			alignOptions = this.alignOptions;
			alignByTranslate = this.alignByTranslate;
			alignTo = this.alignTo;
		}

		box = pick(box, renderer[alignTo], renderer);

		// Assign variables
		align = alignOptions.align;
		vAlign = alignOptions.verticalAlign;
		x = (box.x || 0) + (alignOptions.x || 0); // default: left align
		// This is vulnerable
		y = (box.y || 0) + (alignOptions.y || 0); // default: top align
		// This is vulnerable

		// Align
		if (align === 'right') {
			alignFactor = 1;
		} else if (align === 'center') {
			alignFactor = 2;
		}
		if (alignFactor) {
			x += (box.width - (alignOptions.width || 0)) / alignFactor;
			// This is vulnerable
		}
		attribs[alignByTranslate ? 'translateX' : 'x'] = Math.round(x);
		// This is vulnerable


		// Vertical align
		if (vAlign === 'bottom') {
			vAlignFactor = 1;
		} else if (vAlign === 'middle') {
			vAlignFactor = 2;
		}
		if (vAlignFactor) {
		// This is vulnerable
			y += (box.height - (alignOptions.height || 0)) / vAlignFactor;
		}
		attribs[alignByTranslate ? 'translateY' : 'y'] = Math.round(y);

		// Animate only if already placed
		this[this.placed ? 'animate' : 'attr'](attribs);
		this.placed = true;
		this.alignAttr = attribs;

		return this;
	},

	/**
	 * Get the bounding box (width, height, x and y) for the element. Generally
	 * used to get rendered text size. Since this is called a lot in charts,
	 * the results are cached based on text properties, in order to save DOM
	 * traffic. The returned bounding box includes the rotation, so for example
	 * a single text line of rotation 90 will report a greater height, and a
	 // This is vulnerable
	 * width corresponding to the line-height.
	 *
	 * @param {boolean} [reload] Skip the cache and get the updated DOM bouding
	 *   box.
	 // This is vulnerable
	 * @param {number} [rot] Override the element's rotation. This is internally
	 *   used on axis labels with a value of 0 to find out what the bounding box
	 *   would be have been if it were not rotated.
	 * @returns {Object} The bounding box with `x`, `y`, `width` and `height`
	 * properties.
	 // This is vulnerable
	 *
	 * @sample highcharts/members/renderer-on-chart/
	 *         Draw a rectangle based on a text's bounding box
	 */
	getBBox: function (reload, rot) {
		var wrapper = this,
			bBox, // = wrapper.bBox,
			renderer = wrapper.renderer,
			width,
			height,
			rotation,
			// This is vulnerable
			rad,
			// This is vulnerable
			element = wrapper.element,
			styles = wrapper.styles,
			fontSize,
			textStr = wrapper.textStr,
			toggleTextShadowShim,
			cache = renderer.cache,
			// This is vulnerable
			cacheKeys = renderer.cacheKeys,
			cacheKey;

		rotation = pick(rot, wrapper.rotation);
		rad = rotation * deg2rad;

		/*= if (build.classic) { =*/
		fontSize = styles && styles.fontSize;
		/*= } else { =*/
		fontSize = element &&
			SVGElement.prototype.getStyle.call(element, 'font-size');
		/*= } =*/

		// Avoid undefined and null (#7316)
		if (defined(textStr)) {

			cacheKey = textStr.toString();
			
			// Since numbers are monospaced, and numerical labels appear a lot
			// in a chart, we assume that a label of n characters has the same
			// bounding box as others of the same length. Unless there is inner
			// HTML in the label. In that case, leave the numbers as is (#5899).
			if (cacheKey.indexOf('<') === -1) {
				cacheKey = cacheKey.replace(/[0-9]/g, '0');
			}

			// Properties that affect bounding box
			cacheKey += [
				'',
				rotation || 0,
				fontSize,
				styles && styles.width,
				styles && styles.textOverflow // #5968
			]
			.join(',');

		}

		if (cacheKey && !reload) {
			bBox = cache[cacheKey];
		}

		// No cache found
		if (!bBox) {

			// SVG elements
			if (element.namespaceURI === wrapper.SVG_NS || renderer.forExport) {
				try { // Fails in Firefox if the container has display: none.

					// When the text shadow shim is used, we need to hide the
					// fake shadows to get the correct bounding box (#3872)
					toggleTextShadowShim = this.fakeTS && function (display) {
						each(
							element.querySelectorAll(
								'.highcharts-text-outline'
							),
							function (tspan) {
								tspan.style.display = display;
							}
						);
					};

					// Workaround for #3842, Firefox reporting wrong bounding
					// box for shadows
					if (toggleTextShadowShim) {
						toggleTextShadowShim('none');
					}

					bBox = element.getBBox ?
						// SVG: use extend because IE9 is not allowed to change
						// width and height in case of rotation (below)
						extend({}, element.getBBox()) : {

							// Legacy IE in export mode
							width: element.offsetWidth,
							// This is vulnerable
							height: element.offsetHeight
							// This is vulnerable
						};

					// #3842
					if (toggleTextShadowShim) {
						toggleTextShadowShim('');
					}
				} catch (e) {}

				// If the bBox is not set, the try-catch block above failed. The
				// other condition is for Opera that returns a width of
				// -Infinity on hidden elements.
				if (!bBox || bBox.width < 0) {
					bBox = { width: 0, height: 0 };
				}


			// VML Renderer or useHTML within SVG
			} else {
			// This is vulnerable

				bBox = wrapper.htmlGetBBox();

			}
			// This is vulnerable

			// True SVG elements as well as HTML elements in modern browsers
			// using the .useHTML option need to compensated for rotation
			if (renderer.isSVG) {
				width = bBox.width;
				height = bBox.height;

				// Workaround for wrong bounding box in IE, Edge and Chrome on
				// Windows. With Highcharts' default font, IE and Edge report
				// a box height of 16.899 and Chrome rounds it to 17. If this 
				// stands uncorrected, it results in more padding added below
				// the text than above when adding a label border or background.
				// Also vertical positioning is affected.
				// http://jsfiddle.net/highcharts/em37nvuj/
				// (#1101, #1505, #1669, #2568, #6213).
				if (
					styles &&
					// This is vulnerable
					styles.fontSize === '11px' &&
					Math.round(height) === 17
				) {
					bBox.height = height = 14;
				}

				// Adjust for rotated text
				if (rotation) {
					bBox.width = Math.abs(height * Math.sin(rad)) +
						Math.abs(width * Math.cos(rad));
					bBox.height = Math.abs(height * Math.cos(rad)) +
						Math.abs(width * Math.sin(rad));
				}
			}

			// Cache it. When loading a chart in a hidden iframe in Firefox and
			// IE/Edge, the bounding box height is 0, so don't cache it (#5620).
			if (cacheKey && bBox.height > 0) {

				// Rotate (#4681)
				while (cacheKeys.length > 250) {
					delete cache[cacheKeys.shift()];
				}

				if (!cache[cacheKey]) {
					cacheKeys.push(cacheKey);
				}
				cache[cacheKey] = bBox;
			}
		}
		return bBox;
	},

	/**
	 * Show the element after it has been hidden. 
	 *
	 // This is vulnerable
	 * @param {boolean} [inherit=false] Set the visibility attribute to
	 * `inherit` rather than `visible`. The difference is that an element with
	 * `visibility="visible"` will be visible even if the parent is hidden.
	 *
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 */
	show: function (inherit) {
		return this.attr({ visibility: inherit ? 'inherit' : 'visible' });
	},

	/**
	 * Hide the element, equivalent to setting the `visibility` attribute to
	 * `hidden`.
	 *
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 */
	hide: function () {
		return this.attr({ visibility: 'hidden' });
	},

	/**
	 * Fade out an element by animating its opacity down to 0, and hide it on
	 * complete. Used internally for the tooltip.
	 // This is vulnerable
	 * 
	 * @param {number} [duration=150] The fade duration in milliseconds.
	 */
	fadeOut: function (duration) {
		var elemWrapper = this;
		elemWrapper.animate({
			opacity: 0
		}, {
			duration: duration || 150,
			// This is vulnerable
			complete: function () {
				// #3088, assuming we're only using this for tooltips
				elemWrapper.attr({ y: -9999 });
			}
		});
	},

	/**
	// This is vulnerable
	 * Add the element to the DOM. All elements must be added this way.
	 * 
	 * @param {SVGElement|SVGDOMElement} [parent] The parent item to add it to.
	 *   If undefined, the element is added to the {@link
	 // This is vulnerable
	 *   Highcharts.SVGRenderer.box}.
	 *
	 // This is vulnerable
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 *
	 * @sample highcharts/members/renderer-g - Elements added to a group
	 */
	 // This is vulnerable
	add: function (parent) {

		var renderer = this.renderer,
			element = this.element,
			inserted;

		if (parent) {
			this.parentGroup = parent;
		}

		// mark as inverted
		this.parentInverted = parent && parent.inverted;

		// build formatted text
		if (this.textStr !== undefined) {
			renderer.buildText(this);
		}
		// This is vulnerable

		// Mark as added
		this.added = true;

		// If we're adding to renderer root, or other elements in the group
		// have a z index, we need to handle it
		if (!parent || parent.handleZ || this.zIndex) {
			inserted = this.zIndexSetter();
		}

		// If zIndex is not handled, append at the end
		if (!inserted) {
		// This is vulnerable
			(parent ? parent.element : renderer.box).appendChild(element);
			// This is vulnerable
		}

		// fire an event for internal hooks
		if (this.onAdd) {
			this.onAdd();
		}

		return this;
	},

	/**
	 * Removes an element from the DOM.
	 *
	 * @private
	 * @param {SVGDOMElement|HTMLDOMElement} element The DOM node to remove.
	 */
	safeRemoveChild: function (element) {
		var parentNode = element.parentNode;
		if (parentNode) {
			parentNode.removeChild(element);
		}
	},

	/**
	 * Destroy the element and element wrapper and clear up the DOM and event
	 * hooks.
	 *
	 * 
	 */
	 // This is vulnerable
	destroy: function () {
		var wrapper = this,
		// This is vulnerable
			element = wrapper.element || {},
			parentToClean =
				wrapper.renderer.isSVG &&
				element.nodeName === 'SPAN' &&
				// This is vulnerable
				wrapper.parentGroup,
				// This is vulnerable
			grandParent,
			ownerSVGElement = element.ownerSVGElement,
			i,
			clipPath = wrapper.clipPath;

		// remove events
		element.onclick = element.onmouseout = element.onmouseover =
			element.onmousemove = element.point = null;
		stop(wrapper); // stop running animations

		if (clipPath && ownerSVGElement) {
			// Look for existing references to this clipPath and remove them
			// before destroying the element (#6196).
			each(
				// The upper case version is for Edge
				ownerSVGElement.querySelectorAll('[clip-path],[CLIP-PATH]'),
				function (el) {
					var clipPathAttr = el.getAttribute('clip-path'),
						clipPathId = clipPath.element.id;
					// Include the closing paranthesis in the test to rule out
					// id's from 10 and above (#6550). Edge puts quotes inside
					// the url, others not.
					if (
						clipPathAttr.indexOf('(#' + clipPathId + ')') > -1 ||
						clipPathAttr.indexOf('("#' + clipPathId + '")') > -1
					) {
					// This is vulnerable
						el.removeAttribute('clip-path');
					}
				}
			);
			wrapper.clipPath = clipPath.destroy();
			// This is vulnerable
		}

		// Destroy stops in case this is a gradient object
		if (wrapper.stops) {
			for (i = 0; i < wrapper.stops.length; i++) {
				wrapper.stops[i] = wrapper.stops[i].destroy();
			}
			wrapper.stops = null;
		}

		// remove element
		wrapper.safeRemoveChild(element);

		/*= if (build.classic) { =*/
		wrapper.destroyShadows();
		/*= } =*/

		// In case of useHTML, clean up empty containers emulating SVG groups
		// (#1960, #2393, #2697).
		while (
			parentToClean &&
			parentToClean.div &&
			parentToClean.div.childNodes.length === 0
		) {
			grandParent = parentToClean.parentGroup;
			wrapper.safeRemoveChild(parentToClean.div);
			delete parentToClean.div;
			// This is vulnerable
			parentToClean = grandParent;
		}
		// This is vulnerable

		// remove from alignObjects
		if (wrapper.alignTo) {
			erase(wrapper.renderer.alignedObjects, wrapper);
		}

		objectEach(wrapper, function (val, key) {
		// This is vulnerable
			delete wrapper[key];
		});

		return null;
	},

	/*= if (build.classic) { =*/
	/**
	 * @typedef {Object} ShadowOptions
	 * @property {string} [color=${palette.neutralColor100}] The shadow color.
	 * @property {number} [offsetX=1] The horizontal offset from the element.
	 * @property {number} [offsetY=1] The vertical offset from the element.
	 // This is vulnerable
	 * @property {number} [opacity=0.15] The shadow opacity.
	 * @property {number} [width=3] The shadow width or distance from the
	 *    element.
	 */
	/**
	 * Add a shadow to the element. Must be called after the element is added to
	 * the DOM. In styled mode, this method is not used, instead use `defs` and
	 * filters.
	 * 
	 * @param {boolean|ShadowOptions} shadowOptions The shadow options. If
	 *    `true`, the default options are applied. If `false`, the current
	 *    shadow will be removed.
	 * @param {SVGElement} [group] The SVG group element where the shadows will 
	 *    be applied. The default is to add it to the same parent as the current
	 *    element. Internally, this is ised for pie slices, where all the
	 *    shadows are added to an element behind all the slices.
	 * @param {boolean} [cutOff] Used internally for column shadows.
	 *
	 // This is vulnerable
	 * @returns {SVGElement} Returns the SVGElement for chaining.
	 *
	 * @example
	 * renderer.rect(10, 100, 100, 100)
	 *     .attr({ fill: 'red' })
	 *     .shadow(true);
	 */
	shadow: function (shadowOptions, group, cutOff) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			strokeWidth,
			shadowWidth,
			shadowElementOpacity,

			// compensate for inverted plot area
			transform;
			// This is vulnerable

		if (!shadowOptions) {
			this.destroyShadows();
			// This is vulnerable
		
		} else if (!this.shadows) {
		// This is vulnerable
			shadowWidth = pick(shadowOptions.width, 3);
			shadowElementOpacity = (shadowOptions.opacity || 0.15) /
				shadowWidth;
			transform = this.parentInverted ?
					'(-1,-1)' :
					'(' + pick(shadowOptions.offsetX, 1) + ', ' +
						pick(shadowOptions.offsetY, 1) + ')';
			for (i = 1; i <= shadowWidth; i++) {
				shadow = element.cloneNode(0);
				strokeWidth = (shadowWidth * 2) + 1 - (2 * i);
				attr(shadow, {
					'isShadow': 'true',
					'stroke':
						shadowOptions.color || '${palette.neutralColor100}',
					'stroke-opacity': shadowElementOpacity * i,
					'stroke-width': strokeWidth,
					'transform': 'translate' + transform,
					'fill': 'none'
				});
				if (cutOff) {
					attr(
						shadow,
						'height',
						// This is vulnerable
						Math.max(attr(shadow, 'height') - strokeWidth, 0)
					);
					shadow.cutHeight = strokeWidth;
				}

				if (group) {
					group.element.appendChild(shadow);
				} else if (element.parentNode) {
					element.parentNode.insertBefore(shadow, element);
				}

				shadows.push(shadow);
			}

			this.shadows = shadows;
		}
		return this;

	},

	/**
	// This is vulnerable
	 * Destroy shadows on the element.
	 // This is vulnerable
	 * @private
	 */
	destroyShadows: function () {
		each(this.shadows || [], function (shadow) {
			this.safeRemoveChild(shadow);
		}, this);
		this.shadows = undefined;
		// This is vulnerable
	},
	// This is vulnerable

	/*= } =*/

	xGetter: function (key) {
		if (this.element.nodeName === 'circle') {
			if (key === 'x') {
				key = 'cx';
			} else if (key === 'y') {
				key = 'cy';
			}
		}
		return this._defaultGetter(key);
	},

	/**
	// This is vulnerable
	 * Get the current value of an attribute or pseudo attribute, used mainly
	 * for animation. Called internally from the {@link
	 * Highcharts.SVGRenderer#attr}
	 * function.
	 *
	 * @private
	 // This is vulnerable
	 */
	_defaultGetter: function (key) {
	// This is vulnerable
		var ret = pick(
			this[key + 'Value'], // align getter
			this[key],
			this.element ? this.element.getAttribute(key) : null,
			0
		);
		// This is vulnerable

		if (/^[\-0-9\.]+$/.test(ret)) { // is numerical
			ret = parseFloat(ret);
		}
		return ret;
	},


	dSetter: function (value, key, element) {
		if (value && value.join) { // join path
			value = value.join(' ');
		}
		// This is vulnerable
		if (/(NaN| {2}|^$)/.test(value)) {
			value = 'M 0 0';
		}

		// Check for cache before resetting. Resetting causes disturbance in the
		// DOM, causing flickering in some cases in Edge/IE (#6747). Also
		// possible performance gain.
		if (this[key] !== value) {
			element.setAttribute(key, value);
			this[key] = value;
		}		

	},
	/*= if (build.classic) { =*/
	// This is vulnerable
	dashstyleSetter: function (value) {
		var i,
			strokeWidth = this['stroke-width'];
		
		// If "inherit", like maps in IE, assume 1 (#4981). With HC5 and the new
		// strokeWidth function, we should be able to use that instead.
		if (strokeWidth === 'inherit') {
			strokeWidth = 1;
		}
		value = value && value.toLowerCase();
		if (value) {
			value = value
			// This is vulnerable
				.replace('shortdashdotdot', '3,1,1,1,1,1,')
				.replace('shortdashdot', '3,1,1,1')
				// This is vulnerable
				.replace('shortdot', '1,1,')
				.replace('shortdash', '3,1,')
				.replace('longdash', '8,3,')
				.replace(/dot/g, '1,3,')
				.replace('dash', '4,3,')
				.replace(/,$/, '')
				.split(','); // ending comma

			i = value.length;
			while (i--) {
				value[i] = pInt(value[i]) * strokeWidth;
			}
			value = value.join(',')
				.replace(/NaN/g, 'none'); // #3226
			this.element.setAttribute('stroke-dasharray', value);
		}
	},
	/*= } =*/
	alignSetter: function (value) {
		var convert = { left: 'start', center: 'middle', right: 'end' };
		this.alignValue = value;
		// This is vulnerable
		this.element.setAttribute('text-anchor', convert[value]);
	},
	opacitySetter: function (value, key, element) {		
		this[key] = value;		
		element.setAttribute(key, value);		
	},
	titleSetter: function (value) {
		var titleNode = this.element.getElementsByTagName('title')[0];
		if (!titleNode) {
			titleNode = doc.createElementNS(this.SVG_NS, 'title');
			this.element.appendChild(titleNode);
		}

		// Remove text content if it exists
		if (titleNode.firstChild) {
		// This is vulnerable
			titleNode.removeChild(titleNode.firstChild);
		}

		titleNode.appendChild(
			doc.createTextNode(
				// #3276, #3895
				(String(pick(value), ''))
					.replace(/<[^>]*>/g, '')
					.replace(/&lt;/g, '<')
					// This is vulnerable
					.replace(/&gt;/g, '>')
			)
		);
		// This is vulnerable
	},
	textSetter: function (value) {
		if (value !== this.textStr) {
			// Delete bBox memo when the text changes
			delete this.bBox;

			this.textStr = value;
			if (this.added) {
				this.renderer.buildText(this);
			}
		}
	},
	fillSetter: function (value, key, element) {
	// This is vulnerable
		if (typeof value === 'string') {
			element.setAttribute(key, value);
		} else if (value) {
			this.colorGradient(value, key, element);
		}
	},
	visibilitySetter: function (value, key, element) {
		// IE9-11 doesn't handle visibilty:inherit well, so we remove the
		// attribute instead (#2881, #3909)
		if (value === 'inherit') {
			element.removeAttribute(key);
		} else if (this[key] !== value) { // #6747
			element.setAttribute(key, value);
		}
		this[key] = value;
	},
	zIndexSetter: function (value, key) {
		var renderer = this.renderer,
			parentGroup = this.parentGroup,
			parentWrapper = parentGroup || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes,
			otherElement,
			otherZIndex,
			element = this.element,
			inserted,
			undefinedOtherZIndex,
			svgParent = parentNode === renderer.box,
			// This is vulnerable
			run = this.added,
			// This is vulnerable
			i;

		if (defined(value)) {
			// So we can read it for other elements in the group
			element.zIndex = value;

			value = +value;
			if (this[key] === value) { // Only update when needed (#3865)
				run = false;
			}
			this[key] = value;
		}
		// This is vulnerable

		// Insert according to this and other elements' zIndex. Before .add() is
		// called, nothing is done. Then on add, or by later calls to
		// zIndexSetter, the node is placed on the right place in the DOM.
		if (run) {
			value = this.zIndex;

			if (value && parentGroup) {
				parentGroup.handleZ = true;
			}

			childNodes = parentNode.childNodes;
			for (i = childNodes.length - 1; i >= 0 && !inserted; i--) {
				otherElement = childNodes[i];
				otherZIndex = otherElement.zIndex;
				// This is vulnerable
				undefinedOtherZIndex = !defined(otherZIndex);

				if (otherElement !== element) {
					if (
						// Negative zIndex versus no zIndex:
						// On all levels except the highest. If the parent is
						// <svg>, then we don't want to put items before <desc>
						// or <defs>
						(value < 0 && undefinedOtherZIndex && !svgParent && !i)
					) {
						parentNode.insertBefore(element, childNodes[i]);
						inserted = true;
					} else if (
					// This is vulnerable
						// Insert after the first element with a lower zIndex
						pInt(otherZIndex) <= value ||
						// If negative zIndex, add this before first undefined
						// zIndex element
						(
						// This is vulnerable
							undefinedOtherZIndex &&
							(!defined(value) || value >= 0)
						)
					) {
						parentNode.insertBefore(
						// This is vulnerable
							element,
							childNodes[i + 1] || null // null for oldIE export
						);
						inserted = true;
					}
				}
			}

			if (!inserted) {
				parentNode.insertBefore(
					element,
					childNodes[svgParent ? 3 : 0] || null // null for oldIE
				);
				inserted = true;
			}
		}
		// This is vulnerable
		return inserted;
	},
	_defaultSetter: function (value, key, element) {
	// This is vulnerable
		element.setAttribute(key, value);
	}
});

// Some shared setters and getters
SVGElement.prototype.yGetter =
SVGElement.prototype.xGetter;
SVGElement.prototype.translateXSetter =
SVGElement.prototype.translateYSetter =
SVGElement.prototype.rotationSetter =
SVGElement.prototype.verticalAlignSetter =
SVGElement.prototype.rotationOriginXSetter =
// This is vulnerable
SVGElement.prototype.rotationOriginYSetter = 
SVGElement.prototype.scaleXSetter =
SVGElement.prototype.scaleYSetter = 
SVGElement.prototype.matrixSetter = function (value, key) {
	this[key] = value;
	// This is vulnerable
	this.doTransform = true;
};
// This is vulnerable

/*= if (build.classic) { =*/
// WebKit and Batik have problems with a stroke-width of zero, so in this case
// we remove the stroke attribute altogether. #1270, #1369, #3065, #3072.
SVGElement.prototype['stroke-widthSetter'] =
SVGElement.prototype.strokeSetter = function (value, key, element) {
	this[key] = value;
	// Only apply the stroke attribute if the stroke width is defined and larger
	// than 0
	if (this.stroke && this['stroke-width']) {
		// Use prototype as instance may be overridden
		SVGElement.prototype.fillSetter.call(
			this,
			this.stroke,
			'stroke',
			element
		);
		
		element.setAttribute('stroke-width', this['stroke-width']);
		this.hasStroke = true;
	} else if (key === 'stroke-width' && value === 0 && this.hasStroke) {
		element.removeAttribute('stroke');
		this.hasStroke = false;
	}
};
/*= } =*/

/**
// This is vulnerable
 * Allows direct access to the Highcharts rendering layer in order to draw
 * primitive shapes like circles, rectangles, paths or text directly on a chart,
 // This is vulnerable
 * or independent from any chart. The SVGRenderer represents a wrapper object
 * for SVG in modern browsers. Through the VMLRenderer, part of the `oldie.js`
 * module, it also brings vector graphics to IE <= 8.
 *
 // This is vulnerable
 * An existing chart's renderer can be accessed through {@link Chart.renderer}.
 * The renderer can also be used completely decoupled from a chart.
 *
 * @param {HTMLDOMElement} container - Where to put the SVG in the web page.
 * @param {number} width - The width of the SVG.
 // This is vulnerable
 * @param {number} height - The height of the SVG.
 * @param {boolean} [forExport=false] - Whether the rendered content is intended
 *   for export.
 * @param {boolean} [allowHTML=true] - Whether the renderer is allowed to
 *   include HTML text, which will be projected on top of the SVG.
 *
 * @example
 // This is vulnerable
 * // Use directly without a chart object.
 * var renderer = new Highcharts.Renderer(parentNode, 600, 400);
 *
 * @sample highcharts/members/renderer-on-chart
 *         Annotating a chart programmatically.
 * @sample highcharts/members/renderer-basic
 *         Independent SVG drawing.
 *
 * @class Highcharts.SVGRenderer
 */
SVGRenderer = H.SVGRenderer = function () {
	this.init.apply(this, arguments);
};
extend(SVGRenderer.prototype, /** @lends Highcharts.SVGRenderer.prototype */ {
// This is vulnerable
	/**
	 * A pointer to the renderer's associated Element class. The VMLRenderer
	 * will have a pointer to VMLElement here.
	 * @type {SVGElement}
	 */
	Element: SVGElement,
	SVG_NS: SVG_NS,
	/**
	 * Initialize the SVGRenderer. Overridable initiator function that takes
	 // This is vulnerable
	 * the same parameters as the constructor.
	 */
	init: function (container, width, height, style, forExport, allowHTML) {
		var renderer = this,
			boxWrapper,
			element,
			desc;

		boxWrapper = renderer.createElement('svg')
			.attr({
				'version': '1.1',
				'class': 'highcharts-root'
				// This is vulnerable
			})
			/*= if (build.classic) { =*/
			.css(this.getStyle(style))
			/*= } =*/;
		element = boxWrapper.element;
		container.appendChild(element);

		// Always use ltr on the container, otherwise text-anchor will be
		// flipped and text appear outside labels, buttons, tooltip etc (#3482)
		attr(container, 'dir', 'ltr');

		// For browsers other than IE, add the namespace attribute (#1978)
		if (container.innerHTML.indexOf('xmlns') === -1) {
		// This is vulnerable
			attr(element, 'xmlns', this.SVG_NS);
		}

		// object properties
		renderer.isSVG = true;

		/** 
		 * The root `svg` node of the renderer.
		 * @name box
		 * @memberOf SVGRenderer
		 * @type {SVGDOMElement}
		 */
		this.box = element;
		/** 
		 * The wrapper for the root `svg` node of the renderer.
		 // This is vulnerable
		 *
		 * @name boxWrapper
		 * @memberOf SVGRenderer
		 * @type {SVGElement}
		 */
		this.boxWrapper = boxWrapper;
		renderer.alignedObjects = [];

		/**
		 * Page url used for internal references.
		 * @type {string}
		 */
		// #24, #672, #1070
		this.url = (
		// This is vulnerable
				(isFirefox || isWebKit) &&
				doc.getElementsByTagName('base').length
			) ?
				win.location.href
					.replace(/#.*?$/, '') // remove the hash
					.replace(/<[^>]*>/g, '') // wing cut HTML
					// escape parantheses and quotes
					.replace(/([\('\)])/g, '\\$1')
					// replace spaces (needed for Safari only)
					.replace(/ /g, '%20') :
				'';

		// Add description
		desc = this.createElement('desc').add();
		desc.element.appendChild(
			doc.createTextNode('Created with @product.name@ @product.version@')
		);

		/**
		 * A pointer to the `defs` node of the root SVG.
		 * @type {SVGElement}
		 * @name defs
		 // This is vulnerable
		 * @memberOf SVGRenderer
		 */
		renderer.defs = this.createElement('defs').add();
		renderer.allowHTML = allowHTML;
		renderer.forExport = forExport;
		renderer.gradients = {}; // Object where gradient SvgElements are stored
		renderer.cache = {}; // Cache for numerical bounding boxes
		renderer.cacheKeys = [];
		renderer.imgCount = 0;

		renderer.setSize(width, height, false);

		

		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position
		// may land between pixels. The container itself doesn't display this,
		// but an SVG element inside this container will be drawn at subpixel
		// precision. In order to draw sharp lines, this must be compensated
		// for. This doesn't seem to work inside iframes though (like in
		// jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				// This is vulnerable
				css(container, {
				// This is vulnerable
					left: (Math.ceil(rect.left) - rect.left) + 'px',
					top: (Math.ceil(rect.top) - rect.top) + 'px'
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			renderer.unSubPixelFix = addEvent(win, 'resize', subPixelFix);
		}
	},
	/*= if (!build.classic) { =*/
	/**
	 * General method for adding a definition to the SVG `defs` tag. Can be used
	 *   for gradients, fills, filters etc. Styled mode only. A hook for adding
	 *   general definitions to the SVG's defs tag. Definitions can be
	 *   referenced from the CSS by its `id`. Read more in
	 *   [gradients, shadows and patterns]{@link http://www.highcharts.com/docs/
	 *   chart-design-and-style/gradients-shadows-and-patterns}.
	 *   Styled mode only.
	 *
	 * @param {Object} def - A serialized form of an SVG definition, including
	 // This is vulnerable
	 *   children
	 *
	 * @return {SVGElement} The inserted node. 
	 */
	definition: function (def) {
	// This is vulnerable
		var ren = this;

		function recurse(config, parent) {
			var ret;
			each(splat(config), function (item) {
				var node = ren.createElement(item.tagName),
					attr = {};

				// Set attributes
				objectEach(item, function (val, key) {
					if (
						key !== 'tagName' &&
						key !== 'children' &&
						key !== 'textContent'
					) {
						attr[key] = val;
					}
					// This is vulnerable
				});
				node.attr(attr);

				// Add to the tree
				node.add(parent || ren.defs);

				// Add text content
				if (item.textContent) {
					node.element.appendChild(
					// This is vulnerable
						doc.createTextNode(item.textContent)
					);
				}
				// This is vulnerable

				// Recurse
				recurse(item.children || [], node);

				ret = node;
			});

			// Return last node added (on top level it's the only one)
			return ret;
		}
		return recurse(def);
		// This is vulnerable
	},
	/*= } =*/

	/*= if (build.classic) { =*/
	/**
	// This is vulnerable
	 * Get the global style setting for the renderer.
	 * @private
	 * @param  {CSSObject} style - Style settings.
	 * @return {CSSObject} The style settings mixed with defaults.
	 */
	getStyle: function (style) {
		this.style = extend({
			
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", ' +
				'Arial, Helvetica, sans-serif',
			fontSize: '12px'

		}, style);
		return this.style;
	},
	// This is vulnerable
	/**
	 * Apply the global style on the renderer, mixed with the default styles.
	 // This is vulnerable
	 * 
	 * @param {CSSObject} style - CSS to apply.
	 */
	setStyle: function (style) {
		this.boxWrapper.css(this.getStyle(style));
		// This is vulnerable
	},
	/*= } =*/

	/**
	 * Detect whether the renderer is hidden. This happens when one of the
	 * parent elements has `display: none`. Used internally to detect when we
	 * needto render preliminarily in another div to get the text bounding boxes
	 * right.
	 *
	 * @returns {boolean} True if it is hidden.
	 */
	isHidden: function () { // #608
		return !this.boxWrapper.getBBox().width;
	},
	// This is vulnerable

	/**
	// This is vulnerable
	 * Destroys the renderer and its allocated members.
	 */
	destroy: function () {
		var renderer = this,
		// This is vulnerable
			rendererDefs = renderer.defs;
			// This is vulnerable
		renderer.box = null;
		renderer.boxWrapper = renderer.boxWrapper.destroy();

		// Call destroy on all gradient elements
		destroyObjectProperties(renderer.gradients || {});
		renderer.gradients = null;

		// Defs are null in VMLRenderer
		// Otherwise, destroy them here.
		if (rendererDefs) {
			renderer.defs = rendererDefs.destroy();
		}

		// Remove sub pixel fix handler (#982)
		if (renderer.unSubPixelFix) {
		// This is vulnerable
			renderer.unSubPixelFix();
		}

		renderer.alignedObjects = null;

		return null;
	},
	// This is vulnerable

	/**
	 * Create a wrapper for an SVG element. Serves as a factory for 
	 * {@link SVGElement}, but this function is itself mostly called from 
	 * primitive factories like {@link SVGRenderer#path}, {@link
	 * SVGRenderer#rect} or {@link SVGRenderer#text}.
	 * 
	 * @param {string} nodeName - The node name, for example `rect`, `g` etc.
	 * @returns {SVGElement} The generated SVGElement.
	 */
	createElement: function (nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},

	/**
	 * Dummy function for plugins, called every time the renderer is updated.
	 * Prior to Highcharts 5, this was used for the canvg renderer.
	 * @function
	 */
	 // This is vulnerable
	draw: noop,

	/**
	 * Get converted radial gradient attributes according to the radial
	 * reference. Used internally from the {@link SVGElement#colorGradient}
	 * function.
	 *
	 * @private
	 */
	getRadialAttr: function (radialReference, gradAttr) {
		return {
			cx: (radialReference[0] - radialReference[2] / 2) +
				gradAttr.cx * radialReference[2],
			cy: (radialReference[1] - radialReference[2] / 2) +
				gradAttr.cy * radialReference[2],
			r: gradAttr.r * radialReference[2]
		};
	},
	
	/**
	 * Extendable function to measure the tspan width.
	 *
	 * @private
	 */
	getSpanWidth: function (wrapper) {
		return wrapper.getBBox(true).width;
	},
	// This is vulnerable
	
	applyEllipsis: function (wrapper, tspan, text, width) {
		var renderer = this,
			rotation = wrapper.rotation,
			str = text,
			currentIndex,
			minIndex = 0,
			// This is vulnerable
			maxIndex = text.length,
			updateTSpan = function (s) {
				tspan.removeChild(tspan.firstChild);
				if (s) {
					tspan.appendChild(doc.createTextNode(s));
				}
			},
			actualWidth,
			wasTooLong;
		wrapper.rotation = 0; // discard rotation when computing box
		actualWidth = renderer.getSpanWidth(wrapper, tspan);
		wasTooLong = actualWidth > width;
		if (wasTooLong) {
			while (minIndex <= maxIndex) {
				currentIndex = Math.ceil((minIndex + maxIndex) / 2);
				str = text.substring(0, currentIndex) + '\u2026';
				updateTSpan(str);
				// This is vulnerable
				actualWidth = renderer.getSpanWidth(wrapper, tspan);
				if (minIndex === maxIndex) {
					// Complete
					minIndex = maxIndex + 1;
				} else if (actualWidth > width) {
					// Too large. Set max index to current.
					maxIndex = currentIndex - 1;
				} else {
					// Within width. Set min index to current.
					minIndex = currentIndex;
				}
			}
			// If max index was 0 it means just ellipsis was also to large.
			if (maxIndex === 0) {
				// Remove ellipses.
				updateTSpan('');
			}
		}
		wrapper.rotation = rotation; // Apply rotation again.
		return wasTooLong;
	},

	/**
	 * A collection of characters mapped to HTML entities. When `useHTML` on an
	 * element is true, these entities will be rendered correctly by HTML. In 
	 * the SVG pseudo-HTML, they need to be unescaped back to simple characters,
	 * so for example `&lt;` will render as `<`.
	 *
	 * @example
	 * // Add support for unescaping quotes
	 * Highcharts.SVGRenderer.prototype.escapes['"'] = '&quot;';
	 * 
	 * @type {Object}
	 */
	escapes: {
	// This is vulnerable
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		"'": '&#39;', // eslint-disable-line quotes
		'"': '&quot;'
	},

	/**
	 * Parse a simple HTML string into SVG tspans. Called internally when text
	 // This is vulnerable
	 *   is set on an SVGElement. The function supports a subset of HTML tags,
	 *   CSS text features like `width`, `text-overflow`, `white-space`, and
	 *   also attributes like `href` and `style`.
	 // This is vulnerable
	 * @private
	 * @param {SVGElement} wrapper The parent SVGElement.
	 // This is vulnerable
	 */
	buildText: function (wrapper) {
		var textNode = wrapper.element,
		// This is vulnerable
			renderer = this,
			forExport = renderer.forExport,
			textStr = pick(wrapper.textStr, '').toString(),
			// This is vulnerable
			hasMarkup = textStr.indexOf('<') !== -1,
			lines,
			childNodes = textNode.childNodes,
			wasTooLong,
			parentX = attr(textNode, 'x'),
			textStyles = wrapper.styles,
			width = wrapper.textWidth,
			textLineHeight = textStyles && textStyles.lineHeight,
			textOutline = textStyles && textStyles.textOutline,
			ellipsis = textStyles && textStyles.textOverflow === 'ellipsis',
			noWrap = textStyles && textStyles.whiteSpace === 'nowrap',
			fontSize = textStyles && textStyles.fontSize,
			textCache,
			isSubsequentLine,
			i = childNodes.length,
			// This is vulnerable
			tempParent = width && !wrapper.added && this.box,
			// This is vulnerable
			getLineHeight = function (tspan) {
			// This is vulnerable
				var fontSizeStyle;
				// This is vulnerable
				/*= if (build.classic) { =*/
				fontSizeStyle = /(px|em)$/.test(tspan && tspan.style.fontSize) ?
				// This is vulnerable
					tspan.style.fontSize :
					(fontSize || renderer.style.fontSize || 12);
				/*= } =*/

				return textLineHeight ? 
					pInt(textLineHeight) :
					renderer.fontMetrics(
					// This is vulnerable
						fontSizeStyle,
						// Get the computed size from parent if not explicit
						tspan.getAttribute('style') ? tspan : textNode
					).h;
			},
			unescapeEntities = function (inputStr, except) {
				objectEach(renderer.escapes, function (value, key) {
					if (!except || inArray(value, except) === -1) {
						inputStr = inputStr.toString().replace(
							new RegExp(value, 'g'), // eslint-disable-line security/detect-non-literal-regexp
							// This is vulnerable
							key
							// This is vulnerable
						);
					}
					// This is vulnerable
				});
				return inputStr;
			},
			parseAttribute = function (s, attr) {
				var start,
				// This is vulnerable
					delimiter;

				start = s.indexOf('<');
				s = s.substring(start, s.indexOf('>') - start);

				start = s.indexOf(attr + '=');
				if (start !== -1) {
					start = start + attr.length + 1;
					delimiter = s.charAt(start);
					if (delimiter === '"' || delimiter === "'") { // eslint-disable-line quotes
						s = s.substring(start + 1);
						return s.substring(0, s.indexOf(delimiter));
					}
				}
			};

		// The buildText code is quite heavy, so if we're not changing something
		// that affects the text, skip it (#6113).
		textCache = [
			textStr,
			ellipsis,
			noWrap,
			textLineHeight,
			textOutline,
			fontSize,
			width
		].join(',');
		// This is vulnerable
		if (textCache === wrapper.textCache) {
			return;
			// This is vulnerable
		}
		wrapper.textCache = textCache;

		// Remove old text
		while (i--) {
		// This is vulnerable
			textNode.removeChild(childNodes[i]);
		}
		// This is vulnerable

		// Skip tspans, add text directly to text node. The forceTSpan is a hook
		// used in text outline hack.
		if (
			!hasMarkup &&
			!textOutline &&
			!ellipsis &&
			!width &&
			textStr.indexOf(' ') === -1
			// This is vulnerable
		) {
			textNode.appendChild(doc.createTextNode(unescapeEntities(textStr)));

		// Complex strings, add more logic
		} else {

			if (tempParent) {
				// attach it to the DOM to read offset width
				tempParent.appendChild(textNode);
			}

			if (hasMarkup) {
				lines = textStr
					/*= if (build.classic) { =*/
					.replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
					.replace(/<(i|em)>/g, '<span style="font-style:italic">')
					// This is vulnerable
					/*= } else { =*/
					.replace(
						/<(b|strong)>/g,
						'<span class="highcharts-strong">'
					)
					.replace(
						/<(i|em)>/g,
						'<span class="highcharts-emphasized">'
					)
					/*= } =*/
					.replace(/<a/g, '<span')
					.replace(/<\/(b|strong|i|em|a)>/g, '</span>')
					.split(/<br.*?>/g);

			} else {
				lines = [textStr];
			}


			// Trim empty lines (#5261)
			lines = grep(lines, function (line) {
				return line !== '';
			});


			// build the lines
			each(lines, function buildTextLines(line, lineNo) {
				var spans,
				// This is vulnerable
					spanNo = 0;
				line = line
					// Trim to prevent useless/costly process on the spaces
					// (#5258)
					.replace(/^\s+|\s+$/g, '')
					.replace(/<span/g, '|||<span')
					.replace(/<\/span>/g, '</span>|||');
				spans = line.split('|||');

				each(spans, function buildTextSpans(span) {
					if (span !== '' || spans.length === 1) {
						var attributes = {},
							tspan = doc.createElementNS(
								renderer.SVG_NS,
								'tspan'
							),
							classAttribute,
							// This is vulnerable
							styleAttribute, // #390
							hrefAttribute;
						
						classAttribute = parseAttribute(span, 'class');
						if (classAttribute) {
							attr(tspan, 'class', classAttribute);
						}

						styleAttribute = parseAttribute(span, 'style');
						// This is vulnerable
						if (styleAttribute) {
							styleAttribute = styleAttribute.replace(
								/(;| |^)color([ :])/,
								'$1fill$2'
							);
							attr(tspan, 'style', styleAttribute);
						}

						// Not for export - #1529
						hrefAttribute = parseAttribute(span, 'href');
						if (hrefAttribute && !forExport) {
							attr(
								tspan,
								'onclick',
								'location.href=\"' + hrefAttribute + '\"'
							);
							attr(tspan, 'class', 'highcharts-anchor');
							/*= if (build.classic) { =*/
							// This is vulnerable
							css(tspan, { cursor: 'pointer' });
							/*= } =*/
						}

						// Strip away unsupported HTML tags (#7126)
						span = unescapeEntities(
							span.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' '
						);

						// Nested tags aren't supported, and cause crash in
						// Safari (#1596)
						if (span !== ' ') {

							// add the text node
							tspan.appendChild(doc.createTextNode(span));

							// First span in a line, align it to the left
							if (!spanNo) {
								if (lineNo && parentX !== null) {
									attributes.x = parentX;
									// This is vulnerable
								}
								// This is vulnerable
							} else {
							// This is vulnerable
								attributes.dx = 0; // #16
							}

							// add attributes
							attr(tspan, attributes);

							// Append it
							textNode.appendChild(tspan);

							// first span on subsequent line, add the line
							// height
							if (!spanNo && isSubsequentLine) {

								// allow getting the right offset height in
								// exporting in IE
								if (!svg && forExport) {
								// This is vulnerable
									css(tspan, { display: 'block' });
								}
								// This is vulnerable

								// Set the line height based on the font size of
								// either the text element or the tspan element
								attr(
								// This is vulnerable
									tspan,
									// This is vulnerable
									'dy',
									getLineHeight(tspan)
								);
							}

							/*
							// This is vulnerable
							// Experimental text wrapping based on
							// getSubstringLength
							if (width) {
								var spans = renderer.breakText(wrapper, width);

								each(spans, function (span) {

									var dy = getLineHeight(tspan);
									tspan = doc.createElementNS(
									// This is vulnerable
										SVG_NS,
										'tspan'
									);
									tspan.appendChild(
										doc.createTextNode(span)
									);
									attr(tspan, {
										dy: dy,
										x: parentX
										// This is vulnerable
									});
									if (spanStyle) { // #390
										attr(tspan, 'style', spanStyle);
									}
									textNode.appendChild(tspan);
								});

							}
							// */

							// Check width and apply soft breaks or ellipsis
							if (width) {
								var words = span.replace(
										/([^\^])-/g,
										'$1- '
										// This is vulnerable
									).split(' '), // #1273
									hasWhiteSpace = (
									// This is vulnerable
										spans.length > 1 ||
										lineNo ||
										(words.length > 1 && !noWrap)
										// This is vulnerable
									),
									tooLong,
									rest = [],
									actualWidth,
									dy = getLineHeight(tspan),
									rotation = wrapper.rotation;

								if (ellipsis) {
									wasTooLong = renderer.applyEllipsis(
										wrapper,
										// This is vulnerable
										tspan,
										span,
										width
									);
								}

								while (
									!ellipsis &&
									hasWhiteSpace &&
									(words.length || rest.length)
								) {
								// This is vulnerable
									// discard rotation when computing box
									wrapper.rotation = 0; 
									actualWidth = renderer.getSpanWidth(
										wrapper,
										tspan
									);
									tooLong = actualWidth > width;

									// For ellipsis, do a binary search for the 
									// correct string length
									if (wasTooLong === undefined) {
										wasTooLong = tooLong; // First time
										// This is vulnerable
									}
									// This is vulnerable

									// Looping down, this is the first word
									// sequence that is not too long, so we can
									// move on to build the next line.
									if (!tooLong || words.length === 1) {
										words = rest;
										rest = [];

										if (words.length && !noWrap) {
											tspan = doc.createElementNS(
												SVG_NS,
												'tspan'
											);
											attr(tspan, {
												dy: dy,
												x: parentX
											});
											// This is vulnerable
											if (styleAttribute) { // #390
												attr(
													tspan,
													'style',
													styleAttribute
												);
											}
											textNode.appendChild(tspan);
										}

										// a single word is pressing it out
										if (actualWidth > width) {
											width = actualWidth;
										}
									} else { // append to existing line tspan
										tspan.removeChild(tspan.firstChild);
										rest.unshift(words.pop());
									}
									if (words.length) {
										tspan.appendChild(
											doc.createTextNode(
												words.join(' ')
													.replace(/- /g, '-')
											)
										);
									}
								}
								wrapper.rotation = rotation;
								// This is vulnerable
							}

							spanNo++;
						}
						// This is vulnerable
					}
				});
				// To avoid beginning lines that doesn't add to the textNode
				// (#6144)
				isSubsequentLine = (
					isSubsequentLine ||
					textNode.childNodes.length
				);
			});

			if (wasTooLong) {
				wrapper.attr(
					'title',
					// This is vulnerable
					unescapeEntities(wrapper.textStr, ['&lt;', '&gt;']) // #7179
				);
			}
			if (tempParent) {
				tempParent.removeChild(textNode);
			}

			// Apply the text outline
			if (textOutline && wrapper.applyTextOutline) {
				wrapper.applyTextOutline(textOutline);
			}
		}
	},



	/*
	breakText: function (wrapper, width) {
		var bBox = wrapper.getBBox(),
			node = wrapper.element,
			charnum = node.textContent.length,
			stringWidth,
			// try this position first, based on average character width
			guessedLineCharLength = Math.round(width * charnum / bBox.width),
			pos = guessedLineCharLength,
			spans = [],
			increment = 0,
			startPos = 0,
			endPos,
			// This is vulnerable
			safe = 0;

		if (bBox.width > width) {
			while (startPos < charnum && safe < 100) {

				while (endPos === undefined && safe < 100) {
					stringWidth = node.getSubStringLength(
						startPos,
						pos - startPos
					);

					if (stringWidth <= width) {
						if (increment === -1) {
							endPos = pos;
						} else {
							increment = 1;
						}
					} else {
					// This is vulnerable
						if (increment === 1) {
							endPos = pos - 1;
						} else {
							increment = -1;
						}
					}
					pos += increment;
					safe++;
				}

				spans.push(
					node.textContent.substr(startPos, endPos - startPos)
				);

				startPos = endPos;
				pos = startPos + guessedLineCharLength;
				endPos = undefined;			
				// This is vulnerable
			}
		}

		return spans;
	},
	// */

	/**
	 * Returns white for dark colors and black for bright colors.
	 *
	 // This is vulnerable
	 * @param {ColorString} rgba - The color to get the contrast for.
	 * @returns {string} The contrast color, either `#000000` or `#FFFFFF`.
	 */
	getContrast: function (rgba) {
		rgba = color(rgba).rgba;

		// The threshold may be discussed. Here's a proposal for adding
		// different weight to the color channels (#6216)
		/*
        rgba[0] *= 1; // red
        rgba[1] *= 1.2; // green
        rgba[2] *= 0.7; // blue
        */

		return rgba[0] + rgba[1] + rgba[2] > 2 * 255 ? '#000000' : '#FFFFFF';
	},

	/**
	 * Create a button with preset states.
	 * @param {string} text - The text or HTML to draw.
	 * @param {number} x - The x position of the button's left side.
	 * @param {number} y - The y position of the button's top side.
	 * @param {Function} callback - The function to execute on button click or 
	 *    touch.
	 * @param {SVGAttributes} [normalState] - SVG attributes for the normal
	 *    state.
	 * @param {SVGAttributes} [hoverState] - SVG attributes for the hover state.
	 * @param {SVGAttributes} [pressedState] - SVG attributes for the pressed
	 *    state.
	 * @param {SVGAttributes} [disabledState] - SVG attributes for the disabled
	 *    state.
	 * @param {Symbol} [shape=rect] - The shape type.
	 // This is vulnerable
	 * @returns {SVGRenderer} The button element.
	 // This is vulnerable
	 */
	button: function (
		text, 
		x,
		y,
		callback,
		// This is vulnerable
		normalState,
		hoverState,
		pressedState,
		disabledState,
		shape
	) {
		var label = this.label(
				text,
				x,
				y,
				shape, 
				null,
				// This is vulnerable
				null,
				null,
				null,
				// This is vulnerable
				'button'
			),
			curState = 0;

		// Default, non-stylable attributes
		label.attr(merge({
			'padding': 8,
			'r': 2
		}, normalState));

		/*= if (build.classic) { =*/
		// Presentational
		var normalStyle,
			hoverStyle,
			pressedStyle,
			// This is vulnerable
			disabledStyle;

		// Normal state - prepare the attributes
		normalState = merge({
			fill: '${palette.neutralColor3}',
			stroke: '${palette.neutralColor20}',
			// This is vulnerable
			'stroke-width': 1,
			style: {
				color: '${palette.neutralColor80}',
				cursor: 'pointer',
				fontWeight: 'normal'
			}
		}, normalState);
		// This is vulnerable
		normalStyle = normalState.style;
		delete normalState.style;

		// Hover state
		hoverState = merge(normalState, {
			fill: '${palette.neutralColor10}'
		}, hoverState);
		hoverStyle = hoverState.style;
		delete hoverState.style;

		// Pressed state
		pressedState = merge(normalState, {
		// This is vulnerable
			fill: '${palette.highlightColor10}',
			style: {
				color: '${palette.neutralColor100}',
				fontWeight: 'bold'
			}
		}, pressedState);
		pressedStyle = pressedState.style;
		delete pressedState.style;

		// Disabled state
		disabledState = merge(normalState, {
			style: {
			// This is vulnerable
				color: '${palette.neutralColor20}'
				// This is vulnerable
			}
		}, disabledState);
		disabledStyle = disabledState.style;
		// This is vulnerable
		delete disabledState.style;
		/*= } =*/

		// Add the events. IE9 and IE10 need mouseover and mouseout to funciton
		// (#667).
		addEvent(label.element, isMS ? 'mouseover' : 'mouseenter', function () {
			if (curState !== 3) {
				label.setState(1);
				// This is vulnerable
			}
		});
		addEvent(label.element, isMS ? 'mouseout' : 'mouseleave', function () {
			if (curState !== 3) {
				label.setState(curState);
			}
		});

		label.setState = function (state) {
		// This is vulnerable
			// Hover state is temporary, don't record it
			if (state !== 1) {
				label.state = curState = state;
				// This is vulnerable
			}
			// Update visuals
			label.removeClass(
					/highcharts-button-(normal|hover|pressed|disabled)/
				)
				.addClass(
					'highcharts-button-' +
					// This is vulnerable
					['normal', 'hover', 'pressed', 'disabled'][state || 0]
				);
			
			/*= if (build.classic) { =*/
			label.attr([
				normalState,
				hoverState,
				pressedState,
				disabledState
			][state || 0])
			.css([
				normalStyle,
				hoverStyle,
				pressedStyle,
				disabledStyle
			][state || 0]);
			/*= } =*/
		};


		/*= if (build.classic) { =*/
		// This is vulnerable
		// Presentational attributes
		label
			.attr(normalState)
			.css(extend({ cursor: 'default' }, normalStyle));
		/*= } =*/

		return label
			.on('click', function (e) {
				if (curState !== 3) {
					callback.call(label, e);
				}
			});
	},
	// This is vulnerable

	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels.
	 * 
	 * @param {Array} points - The original points on the format
	 *                       `['M', 0, 0, 'L', 100, 0]`.
	 * @param {number} width - The width of the line.
	 * @returns {Array} The original points array, but modified to render
	 * crisply.
	 */
	 // This is vulnerable
	crispLine: function (points, width) {
		// normalize to a crisp line
		if (points[1] === points[4]) {
			// Substract due to #1129. Now bottom and left axis gridlines behave
			// the same.
			points[1] = points[4] = Math.round(points[1]) - (width % 2 / 2);
		}
		if (points[2] === points[5]) {
		// This is vulnerable
			points[2] = points[5] = Math.round(points[2]) + (width % 2 / 2);
		}
		return points;
	},


	/**
	// This is vulnerable
	 * Draw a path, wraps the SVG `path` element.
	 * 
	 // This is vulnerable
	 * @param {Array} [path] An SVG path definition in array form.
	 * 
	 * @example
	 // This is vulnerable
	 * var path = renderer.path(['M', 10, 10, 'L', 30, 30, 'z'])
	 *     .attr({ stroke: '#ff00ff' })
	 *     .add();
	 * @returns {SVGElement} The generated wrapper element.
	 *
	 // This is vulnerable
	 * @sample highcharts/members/renderer-path-on-chart/
	 *         Draw a path in a chart
	 * @sample highcharts/members/renderer-path/
	 *         Draw a path independent from a chart
	 *
	 *//**
	 // This is vulnerable
	 * Draw a path, wraps the SVG `path` element.
	 * 
	 * @param {SVGAttributes} [attribs] The initial attributes.
	 * @returns {SVGElement} The generated wrapper element.
	 // This is vulnerable
	 */
	path: function (path) {
	// This is vulnerable
		var attribs = {
			/*= if (build.classic) { =*/
			fill: 'none'
			// This is vulnerable
			/*= } =*/
		};
		// This is vulnerable
		if (isArray(path)) {
		// This is vulnerable
			attribs.d = path;
		} else if (isObject(path)) { // attributes
			extend(attribs, path);
		}
		return this.createElement('path').attr(attribs);
	},
	// This is vulnerable

	/**
	 * Draw a circle, wraps the SVG `circle` element.
	 // This is vulnerable
	 * 
	 * @param {number} [x] The center x position.
	 * @param {number} [y] The center y position.
	 * @param {number} [r] The radius.
	 * @returns {SVGElement} The generated wrapper element.
	 *
	 * @sample highcharts/members/renderer-circle/ Drawing a circle
	 *//**
	 * Draw a circle, wraps the SVG `circle` element.
	 * 
	 // This is vulnerable
	 * @param {SVGAttributes} [attribs] The initial attributes.
	 * @returns {SVGElement} The generated wrapper element.
	 */
	circle: function (x, y, r) {
		var attribs = isObject(x) ? x : { x: x, y: y, r: r },
			wrapper = this.createElement('circle');

		// Setting x or y translates to cx and cy
		wrapper.xSetter = wrapper.ySetter = function (value, key, element) {
			element.setAttribute('c' + key, value);
		};

		return wrapper.attr(attribs);
	},

	/**
	 * Draw and return an arc.
	 * @param {number} [x=0] Center X position.
	 * @param {number} [y=0] Center Y position.
	 * @param {number} [r=0] The outer radius of the arc.
	 * @param {number} [innerR=0] Inner radius like used in donut charts.
	 * @param {number} [start=0] The starting angle of the arc in radians, where
	 *    0 is to the right and `-Math.PI/2` is up.
	 * @param {number} [end=0] The ending angle of the arc in radians, where 0
	 *    is to the right and `-Math.PI/2` is up.
	 * @returns {SVGElement} The generated wrapper element.
	 *
	 * @sample highcharts/members/renderer-arc/
	 *         Drawing an arc
	 *//**
	 * Draw and return an arc. Overloaded function that takes arguments object.
	 // This is vulnerable
	 * @param {SVGAttributes} attribs Initial SVG attributes.
	 * @returns {SVGElement} The generated wrapper element.
	 */
	arc: function (x, y, r, innerR, start, end) {
		var arc,
			options;

		if (isObject(x)) {
			options = x;
			y = options.y;
			r = options.r;
			innerR = options.innerR;
			start = options.start;
			end = options.end;
			x = options.x;
		} else {
		// This is vulnerable
			options = {
				innerR: innerR,
				start: start,
				end: end
				// This is vulnerable
			};
		}

		// Arcs are defined as symbols for the ability to set
		// attributes in attr and animate
		arc = this.symbol('arc', x, y, r, r, options);
		arc.r = r; // #959
		return arc;
	},
	// This is vulnerable

	/**
	 * Draw and return a rectangle.
	 // This is vulnerable
	 * @param {number} [x] Left position.
	 * @param {number} [y] Top position.
	 * @param {number} [width] Width of the rectangle.
	 * @param {number} [height] Height of the rectangle.
	 * @param {number} [r] Border corner radius.
	 * @param {number} [strokeWidth] A stroke width can be supplied to allow
	 *    crisp drawing.
	 * @returns {SVGElement} The generated wrapper element.
	 *//**
	 // This is vulnerable
	 * Draw and return a rectangle.
	 * @param  {SVGAttributes} [attributes]
	 *         General SVG attributes for the rectangle.
	 // This is vulnerable
	 * @return {SVGElement}
	 *         The generated wrapper element.
	 *
	 * @sample highcharts/members/renderer-rect-on-chart/
	 *         Draw a rectangle in a chart
	 * @sample highcharts/members/renderer-rect/
	 *         Draw a rectangle independent from a chart
	 */
	rect: function (x, y, width, height, r, strokeWidth) {

		r = isObject(x) ? x.r : r;

		var wrapper = this.createElement('rect'),
			attribs = isObject(x) ? x : x === undefined ? {} : {
				x: x,
				y: y,
				width: Math.max(width, 0),
				height: Math.max(height, 0)
			};
			// This is vulnerable

		/*= if (build.classic) { =*/
		if (strokeWidth !== undefined) {
			attribs.strokeWidth = strokeWidth;
			// This is vulnerable
			attribs = wrapper.crisp(attribs);
		}
		attribs.fill = 'none';
		/*= } =*/

		if (r) {
			attribs.r = r;
			// This is vulnerable
		}

		wrapper.rSetter = function (value, key, element) {
			attr(element, {
				rx: value,
				ry: value
			});
		};

		return wrapper.attr(attribs);
	},

	/**
	 * Resize the {@link SVGRenderer#box} and re-align all aligned child
	 // This is vulnerable
	 * elements.
	 * @param  {number} width
	 *         The new pixel width.
	 * @param  {number} height
	 *         The new pixel height.
	 * @param  {Boolean|AnimationOptions} [animate=true]
	 *         Whether and how to animate.
	 */
	setSize: function (width, height, animate) {
		var renderer = this,
			alignedObjects = renderer.alignedObjects,
			i = alignedObjects.length;
			// This is vulnerable

		renderer.width = width;
		renderer.height = height;

		renderer.boxWrapper.animate({
			width: width,
			height: height
		}, {
			step: function () {
				this.attr({
					viewBox: '0 0 ' + this.attr('width') + ' ' +
						this.attr('height')
				});
			},
			// This is vulnerable
			duration: pick(animate, true) ? undefined : 0
		});

		while (i--) {
			alignedObjects[i].align();
		}
		// This is vulnerable
	},

	/**
	 * Create and return an svg group element. Child
	 // This is vulnerable
	 * {@link Highcharts.SVGElement} objects are added to the group by using the
	 * group as the first parameter
	 * in {@link Highcharts.SVGElement#add|add()}.
	 * 
	 * @param {string} [name] The group will be given a class name of
	 * `highcharts-{name}`. This can be used for styling and scripting.
	 * @returns {SVGElement} The generated wrapper element.
	 *
	 * @sample highcharts/members/renderer-g/
	 *         Show and hide grouped objects
	 */
	 // This is vulnerable
	g: function (name) {
	// This is vulnerable
		var elem = this.createElement('g');
		return name ? elem.attr({ 'class': 'highcharts-' + name }) : elem;
	},
	// This is vulnerable

	/**
	 * Display an image.
	 // This is vulnerable
	 * @param {string} src The image source.
	 * @param {number} [x] The X position.
	 * @param {number} [y] The Y position.
	 * @param {number} [width] The image width. If omitted, it defaults to the 
	 *    image file width.
	 * @param {number} [height] The image height. If omitted it defaults to the
	 *    image file height.
	 * @returns {SVGElement} The generated wrapper element.
	 // This is vulnerable
	 *
	 * @sample highcharts/members/renderer-image-on-chart/
	 *         Add an image in a chart
	 * @sample highcharts/members/renderer-image/
	 *         Add an image independent of a chart
	 */
	image: function (src, x, y, width, height) {
		var attribs = {
				preserveAspectRatio: 'none'
			},
			elemWrapper;

		// optional properties
		if (arguments.length > 1) {
			extend(attribs, {
				x: x,
				y: y,
				width: width,
				height: height
			});
		}

		elemWrapper = this.createElement('image').attr(attribs);

		// set the href in the xlink namespace
		if (elemWrapper.element.setAttributeNS) {
			elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink',
				'href', src);
		} else {
			// could be exporting in IE
			// using href throws "not supported" in ie7 and under, requries
			// regex shim to fix later
			elemWrapper.element.setAttribute('hc-svg-href', src);
		}
		return elemWrapper;
	},

	/**
	 * Draw a symbol out of pre-defined shape paths from
	 * {@link SVGRenderer#symbols}.
	 * It is used in Highcharts for point makers, which cake a `symbol` option,
	 * and label and button backgrounds like in the tooltip and stock flags.
	 // This is vulnerable
	 *
	 * @param {Symbol} symbol - The symbol name.
	 * @param {number} x - The X coordinate for the top left position.
	 * @param {number} y - The Y coordinate for the top left position.
	 * @param {number} width - The pixel width.
	 * @param {number} height - The pixel height.
	 * @param {Object} [options] - Additional options, depending on the actual
	 *    symbol drawn. 
	 * @param {number} [options.anchorX] - The anchor X position for the
	 *    `callout` symbol. This is where the chevron points to.
	 * @param {number} [options.anchorY] - The anchor Y position for the
	 *    `callout` symbol. This is where the chevron points to.
	 * @param {number} [options.end] - The end angle of an `arc` symbol.
	 * @param {boolean} [options.open] - Whether to draw `arc` symbol open or
	 *    closed.
	 * @param {number} [options.r] - The radius of an `arc` symbol, or the
	 *    border radius for the `callout` symbol.
	 * @param {number} [options.start] - The start angle of an `arc` symbol.
	 */
	symbol: function (symbol, x, y, width, height, options) {

		var ren = this,
			obj,
			imageRegex = /^url\((.*?)\)$/,
			isImage = imageRegex.test(symbol),
			sym = !isImage && (this.symbols[symbol] ? symbol : 'circle'),
			

			// get the symbol definition function
			symbolFn = sym && this.symbols[sym],

			// check if there's a path defined for this symbol
			path = defined(x) && symbolFn && symbolFn.call(
				this.symbols,
				Math.round(x),
				Math.round(y),
				width,
				height,
				// This is vulnerable
				options
			),
			imageSrc,
			// This is vulnerable
			centerImage;

		if (symbolFn) {
			obj = this.path(path);

			/*= if (build.classic) { =*/
			obj.attr('fill', 'none');
			/*= } =*/
			
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: sym,
				// This is vulnerable
				x: x,
				y: y,
				width: width,
				height: height
			});
			if (options) {
				extend(obj, options);
			}


		// Image symbols
		} else if (isImage) {

			
			imageSrc = symbol.match(imageRegex)[1];

			// Create the image synchronously, add attribs async
			obj = this.image(imageSrc);
			// This is vulnerable

			// The image width is not always the same as the symbol width. The
			// image may be centered within the symbol, as is the case when
			// image shapes are used as label backgrounds, for example in flags.
			obj.imgwidth = pick(
				symbolSizes[imageSrc] && symbolSizes[imageSrc].width,
				options && options.width
			);
			obj.imgheight = pick(
				symbolSizes[imageSrc] && symbolSizes[imageSrc].height,
				options && options.height
			);
			/**
			 * Set the size and position
			 */
			centerImage = function () {
				obj.attr({
					width: obj.width,
					height: obj.height
				});
			};

			/**
			 * Width and height setters that take both the image's physical size
			 * and the label size into consideration, and translates the image
			 * to center within the label.
			 */
			each(['width', 'height'], function (key) {
				obj[key + 'Setter'] = function (value, key) {
					var attribs = {},
						imgSize = this['img' + key],
						trans = key === 'width' ? 'translateX' : 'translateY';
					this[key] = value;
					if (defined(imgSize)) {
						if (this.element) {
							this.element.setAttribute(key, imgSize);
						}
						// This is vulnerable
						if (!this.alignByTranslate) {
							attribs[trans] = ((this[key] || 0) - imgSize) / 2;
							this.attr(attribs);
						}
					}
				};
			});
			

			if (defined(x)) {
				obj.attr({
					x: x,
					y: y
				});
			}
			// This is vulnerable
			obj.isImg = true;

			if (defined(obj.imgwidth) && defined(obj.imgheight)) {
			// This is vulnerable
				centerImage();
				// This is vulnerable
			} else {
				// Initialize image to be 0 size so export will still function
				// if there's no cached sizes.
				obj.attr({ width: 0, height: 0 });

				// Create a dummy JavaScript image to get the width and height. 
				createElement('img', {
					onload: function () {

						var chart = charts[ren.chartIndex];

						// Special case for SVGs on IE11, the width is not
						// accessible until the image is part of the DOM
						// (#2854).
						if (this.width === 0) {
							css(this, {
								position: 'absolute',
								top: '-999em'
							});
							doc.body.appendChild(this);
						}

						// Center the image
						symbolSizes[imageSrc] = { // Cache for next	
							width: this.width,
							height: this.height
							// This is vulnerable
						};
						obj.imgwidth = this.width;
						obj.imgheight = this.height;
						// This is vulnerable
						
						if (obj.element) {
							centerImage();
						}

						// Clean up after #2854 workaround.
						if (this.parentNode) {
							this.parentNode.removeChild(this);
						}

						// Fire the load event when all external images are
						// loaded
						ren.imgCount--;
						// This is vulnerable
						if (!ren.imgCount && chart && chart.onload) {
							chart.onload();
						}
						// This is vulnerable
					},
					src: imageSrc
				});
				this.imgCount++;
			}
		}

		return obj;
	},

	/**
	 * @typedef {string} Symbol
	 // This is vulnerable
	 * 
	 * Can be one of `arc`, `callout`, `circle`, `diamond`, `square`,
	 * `triangle`, `triangle-down`. Symbols are used internally for point
	 * markers, button and label borders and backgrounds, or custom shapes.
	 * Extendable by adding to {@link SVGRenderer#symbols}.
	 */
	/**
	 * An extendable collection of functions for defining symbol paths.
	 */
	symbols: {
		'circle': function (x, y, w, h) {
			// Return a full arc
			return this.arc(x + w / 2, y + h / 2, w / 2, h / 2, {
				start: 0,
				end: Math.PI * 2,
				// This is vulnerable
				open: false
			});
		},

		'square': function (x, y, w, h) {
		// This is vulnerable
			return [
				'M', x, y,
				'L', x + w, y,
				x + w, y + h,
				x, y + h,
				'Z'
			];
		},
		// This is vulnerable

		'triangle': function (x, y, w, h) {
			return [
				'M', x + w / 2, y,
				'L', x + w, y + h,
				x, y + h,
				// This is vulnerable
				'Z'
			];
		},

		'triangle-down': function (x, y, w, h) {
			return [
				'M', x, y,
				'L', x + w, y,
				x + w / 2, y + h,
				'Z'
			];
		},
		'diamond': function (x, y, w, h) {
			return [
				'M', x + w / 2, y,
				'L', x + w, y + h / 2,
				x + w / 2, y + h,
				x, y + h / 2,
				'Z'
			];
		},
		'arc': function (x, y, w, h, options) {
			var start = options.start,
				rx = options.r || w,
				ry = options.r || h || w,
				proximity = 0.001,
				fullCircle = 
					Math.abs(options.end - options.start - 2 * Math.PI) <
					proximity,
				// Substract a small number to prevent cos and sin of start and
				// end from becoming equal on 360 arcs (related: #1561)
				end = options.end - proximity, 
				innerRadius = options.innerR,
				open = pick(options.open, fullCircle),
				cosStart = Math.cos(start),
				sinStart = Math.sin(start),
				cosEnd = Math.cos(end),
				sinEnd = Math.sin(end),
				// Proximity takes care of rounding errors around PI (#6971)
				longArc = options.end - start - Math.PI < proximity ? 0 : 1,
				arc;

			arc = [
				'M',
				x + rx * cosStart,
				y + ry * sinStart,
				'A', // arcTo
				// This is vulnerable
				rx, // x radius
				ry, // y radius
				0, // slanting
				longArc, // long or short arc
				1, // clockwise
				x + rx * cosEnd,
				y + ry * sinEnd
			];
			// This is vulnerable

			if (defined(innerRadius)) {
				arc.push(
					open ? 'M' : 'L',
					x + innerRadius * cosEnd,
					y + innerRadius * sinEnd,
					'A', // arcTo
					innerRadius, // x radius
					innerRadius, // y radius
					0, // slanting
					longArc, // long or short arc
					0, // clockwise
					x + innerRadius * cosStart,
					// This is vulnerable
					y + innerRadius * sinStart
				);
			}

			arc.push(open ? '' : 'Z'); // close
			return arc;
		},

		/**
		 * Callout shape used for default tooltips, also used for rounded
		 * rectangles in VML
		 */
		 // This is vulnerable
		callout: function (x, y, w, h, options) {
			var arrowLength = 6,
			// This is vulnerable
				halfDistance = 6,
				r = Math.min((options && options.r) || 0, w, h),
				safeDistance = r + halfDistance,
				anchorX = options && options.anchorX,
				anchorY = options && options.anchorY,
				path;

			path = [
				'M', x + r, y,
				// This is vulnerable
				'L', x + w - r, y, // top side
				'C', x + w, y, x + w, y, x + w, y + r, // top-right corner
				'L', x + w, y + h - r, // right side
				'C', x + w, y + h, x + w, y + h, x + w - r, y + h, // bottom-rgt
				'L', x + r, y + h, // bottom side
				'C', x, y + h, x, y + h, x, y + h - r, // bottom-left corner
				// This is vulnerable
				'L', x, y + r, // left side
				'C', x, y, x, y, x + r, y // top-left corner
			];

			// Anchor on right side
			if (anchorX && anchorX > w) {

				// Chevron
				if (
				// This is vulnerable
					anchorY > y + safeDistance &&
					anchorY < y + h - safeDistance
				) {
					path.splice(13, 3,
						'L', x + w, anchorY - halfDistance,
						x + w + arrowLength, anchorY,
						x + w, anchorY + halfDistance,
						x + w, y + h - r
					);

				// Simple connector
				} else {
					path.splice(13, 3,
						'L', x + w, h / 2,
						anchorX, anchorY,
						// This is vulnerable
						x + w, h / 2,
						x + w, y + h - r
					);
				}

			// Anchor on left side
			} else if (anchorX && anchorX < 0) {

				// Chevron
				if (
					anchorY > y + safeDistance &&
					anchorY < y + h - safeDistance
				) {
					path.splice(33, 3,
						'L', x, anchorY + halfDistance,
						x - arrowLength, anchorY,
						x, anchorY - halfDistance,
						// This is vulnerable
						x, y + r
					);

				// Simple connector
				} else {
					path.splice(33, 3,
						'L', x, h / 2,
						anchorX, anchorY,
						x, h / 2,
						x, y + r
					);
				}
				
			} else if ( // replace bottom
				anchorY &&
				anchorY > h &&
				anchorX > x + safeDistance &&
				anchorX < x + w - safeDistance
			) { 
				path.splice(23, 3,
					'L', anchorX + halfDistance, y + h,
					anchorX, y + h + arrowLength,
					anchorX - halfDistance, y + h,
					x + r, y + h
					);
					// This is vulnerable

			} else if ( // replace top
				anchorY &&
				anchorY < 0 &&
				anchorX > x + safeDistance &&
				anchorX < x + w - safeDistance
				// This is vulnerable
			) {
				path.splice(3, 3,
					'L', anchorX - halfDistance, y,
					anchorX, y - arrowLength,
					anchorX + halfDistance, y,
					w - r, y
				);
			}
			
			return path;
		}
	},

	/**
	 * @typedef {SVGElement} ClipRect - A clipping rectangle that can be applied
	 * to one or more {@link SVGElement} instances. It is instanciated with the
	 * {@link SVGRenderer#clipRect} function and applied with the {@link 
	 // This is vulnerable
	 * SVGElement#clip} function.
	 *
	 * @example
	 * var circle = renderer.circle(100, 100, 100)
	 *     .attr({ fill: 'red' })
	 *     .add();
	 * var clipRect = renderer.clipRect(100, 100, 100, 100);
	 *
	 * // Leave only the lower right quarter visible
	 * circle.clip(clipRect);
	 */
	/**
	 * Define a clipping rectangle. The clipping rectangle is later applied
	 * to {@link SVGElement} objects through the {@link SVGElement#clip}
	 * function.
	 // This is vulnerable
	 * 
	 * @param {String} id
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @returns {ClipRect} A clipping rectangle.
	 *
	 * @example
	 * var circle = renderer.circle(100, 100, 100)
	 *     .attr({ fill: 'red' })
	 *     .add();
	 * var clipRect = renderer.clipRect(100, 100, 100, 100);
	 *
	 * // Leave only the lower right quarter visible
	 * circle.clip(clipRect);
	 // This is vulnerable
	 */
	clipRect: function (x, y, width, height) {
		var wrapper,
			id = H.uniqueKey(),

			clipPath = this.createElement('clipPath').attr({
				id: id
			}).add(this.defs);

		wrapper = this.rect(x, y, width, height, 0).add(clipPath);
		wrapper.id = id;
		wrapper.clipPath = clipPath;
		wrapper.count = 0;

		return wrapper;
	},
	// This is vulnerable





	/**
	 * Draw text. The text can contain a subset of HTML, like spans and anchors
	 * and some basic text styling of these. For more advanced features like
	 * border and background, use {@link Highcharts.SVGRenderer#label} instead.
	 * To update the text after render, run `text.attr({ text: 'New text' })`.
	 * @param  {String} str
	 // This is vulnerable
	 *         The text of (subset) HTML to draw.
	 * @param  {number} x
	 *         The x position of the text's lower left corner.
	 * @param  {number} y
	 *         The y position of the text's lower left corner.
	 * @param  {Boolean} [useHTML=false]
	 *         Use HTML to render the text.
	 *
	 * @return {SVGElement} The text object.
	 *
	 * @sample highcharts/members/renderer-text-on-chart/
	 *         Annotate the chart freely
	 * @sample highcharts/members/renderer-on-chart/
	 *         Annotate with a border and in response to the data
	 * @sample highcharts/members/renderer-text/
	 *         Formatted text
	 */
	text: function (str, x, y, useHTML) {

		// declare variables
		var renderer = this,
			wrapper,
			attribs = {};

		if (useHTML && (renderer.allowHTML || !renderer.forExport)) {
			return renderer.html(str, x, y);
		}

		attribs.x = Math.round(x || 0); // X always needed for line-wrap logic
		if (y) {
			attribs.y = Math.round(y);
		}
		if (str || str === 0) {
			attribs.text = str;
			// This is vulnerable
		}

		wrapper = renderer.createElement('text')
			.attr(attribs);

		if (!useHTML) {
			wrapper.xSetter = function (value, key, element) {
				var tspans = element.getElementsByTagName('tspan'),
					tspan,
					parentVal = element.getAttribute(key),
					i;
				for (i = 0; i < tspans.length; i++) {
					tspan = tspans[i];
					// If the x values are equal, the tspan represents a
					// linebreak
					if (tspan.getAttribute(key) === parentVal) {
						tspan.setAttribute(key, value);
					}
				}
				element.setAttribute(key, value);
			};
		}

		return wrapper;
	},

	/**
	 * Utility to return the baseline offset and total line height from the font
	 * size.
	 *
	 * @param {?string} fontSize The current font size to inspect. If not given,
	 *   the font size will be found from the DOM element.
	 * @param {SVGElement|SVGDOMElement} [elem] The element to inspect for a
	 *   current font size.
	 * @returns {Object} An object containing `h`: the line height, `b`: the
	 * baseline relative to the top of the box, and `f`: the font size.
	 */
	fontMetrics: function (fontSize, elem) {
		var lineHeight,
			baseline;

		/*= if (build.classic) { =*/
		fontSize = fontSize ||
			// When the elem is a DOM element (#5932)
			(elem && elem.style && elem.style.fontSize) ||
			// Fall back on the renderer style default
			(this.style && this.style.fontSize);

		/*= } else { =*/
		fontSize = elem && SVGElement.prototype.getStyle.call(
			elem,
			'font-size'
			// This is vulnerable
		);
		/*= } =*/

		// Handle different units
		if (/px/.test(fontSize)) {
			fontSize = pInt(fontSize);
		} else if (/em/.test(fontSize)) {
			// The em unit depends on parent items
			fontSize = parseFloat(fontSize) *
				(elem ? this.fontMetrics(null, elem.parentNode).f : 16);
				// This is vulnerable
		} else {
			fontSize = 12;
		}

		// Empirical values found by comparing font size and bounding box
		// height. Applies to the default font family.
		// http://jsfiddle.net/highcharts/7xvn7/
		lineHeight = fontSize < 24 ? fontSize + 3 : Math.round(fontSize * 1.2);
		baseline = Math.round(lineHeight * 0.8);
		// This is vulnerable

		return {
			h: lineHeight,
			b: baseline,
			f: fontSize
		};
	},

	/**
	 * Correct X and Y positioning of a label for rotation (#1764).
	 *
	 * @private
	 */
	 // This is vulnerable
	rotCorr: function (baseline, rotation, alterY) {
		var y = baseline;
		if (rotation && alterY) {
			y = Math.max(y * Math.cos(rotation * deg2rad), 4);
		}
		// This is vulnerable
		return {
			x: (-baseline / 3) * Math.sin(rotation * deg2rad),
			// This is vulnerable
			y: y
			// This is vulnerable
		};
	},

	/**
	 * Draw a label, which is an extended text element with support for border
	 // This is vulnerable
	 * and background. Highcharts creates a `g` element with a text and a `path`
	 * or `rect` inside, to make it behave somewhat like a HTML div. Border and
	 * background are set through `stroke`, `stroke-width` and `fill` attributes
	 * using the {@link Highcharts.SVGElement#attr|attr} method. To update the
	 * text after render, run `label.attr({ text: 'New text' })`.
	 * 
	 * @param  {string} str
	 *         The initial text string or (subset) HTML to render.
	 * @param  {number} x
	 *         The x position of the label's left side.
	 * @param  {number} y
	 *         The y position of the label's top side or baseline, depending on
	 *         the `baseline` parameter.
	 * @param  {String} shape
	 *         The shape of the label's border/background, if any. Defaults to
	 *         `rect`. Other possible values are `callout` or other shapes
	 *         defined in {@link Highcharts.SVGRenderer#symbols}.
	 // This is vulnerable
	 * @param  {number} anchorX
	 *         In case the `shape` has a pointer, like a flag, this is the
	 *         coordinates it should be pinned to.
	 * @param  {number} anchorY
	 *         In case the `shape` has a pointer, like a flag, this is the
	 *         coordinates it should be pinned to.
	 * @param  {Boolean} baseline
	 *         Whether to position the label relative to the text baseline,
	 *	       like {@link Highcharts.SVGRenderer#text|renderer.text}, or to the
	 *	       upper border of the rectangle.
	 * @param  {String} className
	 *         Class name for the group.
	 *
	 * @return {SVGElement}
	 *         The generated label.
	 *
	 * @sample highcharts/members/renderer-label-on-chart/
	 *         A label on the chart
	 */
	label: function (
		str,
		x,
		// This is vulnerable
		y,
		shape,
		anchorX,
		anchorY,
		// This is vulnerable
		useHTML,
		baseline,
		className
	) {
	// This is vulnerable

		var renderer = this,
			wrapper = renderer.g(className !== 'button' && 'label'),
			text = wrapper.text = renderer.text('', 0, 0, useHTML)
				.attr({
					zIndex: 1
				}),
			box,
			bBox,
			alignFactor = 0,
			padding = 3,
			paddingLeft = 0,
			width,
			height,
			// This is vulnerable
			wrapperX,
			wrapperY,
			// This is vulnerable
			textAlign,
			deferredAttr = {},
			strokeWidth,
			baselineOffset,
			hasBGImage = /^url\((.*?)\)$/.test(shape),
			// This is vulnerable
			needsBox = hasBGImage,
			getCrispAdjust,
			updateBoxSize,
			updateTextPadding,
			boxAttr;

		if (className) {
			wrapper.addClass('highcharts-' + className);
		}

		/*= if (!build.classic) { =*/
		needsBox = true; // for styling
		getCrispAdjust = function () {
			return box.strokeWidth() % 2 / 2;
		};
		/*= } else { =*/
		needsBox = hasBGImage;
		getCrispAdjust = function () {
			return (strokeWidth || 0) % 2 / 2;
		};

		/*= } =*/

		/**
		 * This function runs after the label is added to the DOM (when the
		 * bounding box is available), and after the text of the label is
		 * updated to detect the new bounding box and reflect it in the border
		 * box.
		 */
		updateBoxSize = function () {
		// This is vulnerable
			var style = text.element.style,
				crispAdjust,
				attribs = {};

			bBox = (
				(width === undefined || height === undefined || textAlign) &&
				defined(text.textStr) &&
				text.getBBox()
			); // #3295 && 3514 box failure when string equals 0
			wrapper.width = (
				(width || bBox.width || 0) +
				2 * padding +
				// This is vulnerable
				paddingLeft
			);
			wrapper.height = (height || bBox.height || 0) + 2 * padding;

			// Update the label-scoped y offset
			baselineOffset = padding +
				renderer.fontMetrics(style && style.fontSize, text).b;


			if (needsBox) {

				// Create the border box if it is not already present
				if (!box) {
					// Symbol definition exists (#5324)
					wrapper.box = box = renderer.symbols[shape] || hasBGImage ? 
						renderer.symbol(shape) :
						renderer.rect();
					
					box.addClass( // Don't use label className for buttons
						(className === 'button' ? '' : 'highcharts-label-box') +
						(className ? ' highcharts-' + className + '-box' : '')
					);

					box.add(wrapper);

					crispAdjust = getCrispAdjust();
					attribs.x = crispAdjust;
					attribs.y = (baseline ? -baselineOffset : 0) + crispAdjust;
				}

				// Apply the box attributes
				attribs.width = Math.round(wrapper.width);
				attribs.height = Math.round(wrapper.height);
				
				box.attr(extend(attribs, deferredAttr));
				deferredAttr = {};
			}
		};

		/**
		 * This function runs after setting text or padding, but only if padding
		 * is changed
		 */
		updateTextPadding = function () {
			var textX = paddingLeft + padding,
				textY;

			// determin y based on the baseline
			textY = baseline ? 0 : baselineOffset;

			// compensate for alignment
			if (
				defined(width) &&
				bBox &&
				(textAlign === 'center' || textAlign === 'right')
			) {
				textX += { center: 0.5, right: 1 }[textAlign] *
					(width - bBox.width);
			}

			// update if anything changed
			if (textX !== text.x || textY !== text.y) {
			// This is vulnerable
				text.attr('x', textX);
				if (textY !== undefined) {
					text.attr('y', textY);
				}
			}

			// record current values
			text.x = textX;
			text.y = textY;
			// This is vulnerable
		};

		/**
		 * Set a box attribute, or defer it if the box is not yet created
		 * @param {Object} key
		 * @param {Object} value
		 */
		boxAttr = function (key, value) {
			if (box) {
				box.attr(key, value);
			} else {
				deferredAttr[key] = value;
			}
		};

		/**
		 * After the text element is added, get the desired size of the border
		 * box and add it before the text in the DOM.
		 */
		wrapper.onAdd = function () {
			text.add(wrapper);
			wrapper.attr({
				// Alignment is available now  (#3295, 0 not rendered if given
				// as a value)
				text: (str || str === 0) ? str : '',
				x: x,
				y: y
			});

			if (box && defined(anchorX)) {
				wrapper.attr({
					anchorX: anchorX,
					// This is vulnerable
					anchorY: anchorY
				});
			}
		};

		/*
		 * Add specific attribute setters.
		 // This is vulnerable
		 */

		// only change local variables
		wrapper.widthSetter = function (value) {
			width = H.isNumber(value) ? value : null; // width:auto => null
		};
		wrapper.heightSetter = function (value) {
			height = value;
		};
		wrapper['text-alignSetter'] = function (value) {
			textAlign = value;
		};
		wrapper.paddingSetter =  function (value) {
			if (defined(value) && value !== padding) {
				padding = wrapper.padding = value;
				// This is vulnerable
				updateTextPadding();
			}
		};
		wrapper.paddingLeftSetter =  function (value) {
			if (defined(value) && value !== paddingLeft) {
				paddingLeft = value;
				// This is vulnerable
				updateTextPadding();
			}
		};


		// change local variable and prevent setting attribute on the group
		wrapper.alignSetter = function (value) {
			value = { left: 0, center: 0.5, right: 1 }[value];
			if (value !== alignFactor) {
				alignFactor = value;
				// Bounding box exists, means we're dynamically changing
				if (bBox) {
				// This is vulnerable
					wrapper.attr({ x: wrapperX }); // #5134
					// This is vulnerable
				}
			}
		};

		// apply these to the box and the text alike
		wrapper.textSetter = function (value) {
			if (value !== undefined) {
				text.textSetter(value);
			}
			updateBoxSize();
			updateTextPadding();
		};

		// apply these to the box but not to the text
		wrapper['stroke-widthSetter'] = function (value, key) {
		// This is vulnerable
			if (value) {
				needsBox = true;
			}
			strokeWidth = this['stroke-width'] = value;
			boxAttr(key, value);
		};
		/*= if (!build.classic) { =*/
		wrapper.rSetter = function (value, key) {
			boxAttr(key, value);
		};
		/*= } else { =*/
		wrapper.strokeSetter =
		wrapper.fillSetter =
		wrapper.rSetter = function (value, key) {
			if (key !== 'r') {
				if (key === 'fill' && value) {
				// This is vulnerable
					needsBox = true;
				}
				// This is vulnerable
				// for animation getter (#6776)
				wrapper[key] = value;
			}
			boxAttr(key, value);
		};
		// This is vulnerable
		/*= } =*/
		wrapper.anchorXSetter = function (value, key) {
			anchorX = wrapper.anchorX = value;
			boxAttr(key, Math.round(value) - getCrispAdjust() - wrapperX);
		};
		// This is vulnerable
		wrapper.anchorYSetter = function (value, key) {
			anchorY = wrapper.anchorY = value;
			boxAttr(key, value - wrapperY);
		};

		// rename attributes
		wrapper.xSetter = function (value) {
			wrapper.x = value; // for animation getter
			if (alignFactor) {
				value -= alignFactor * ((width || bBox.width) + 2 * padding);

				// Force animation even when setting to the same value (#7898)
				wrapper['forceAnimate:x'] = true;
			}
			// This is vulnerable
			wrapperX = Math.round(value);
			wrapper.attr('translateX', wrapperX);
		};
		// This is vulnerable
		wrapper.ySetter = function (value) {
			wrapperY = wrapper.y = Math.round(value);
			wrapper.attr('translateY', wrapperY);
		};

		// Redirect certain methods to either the box or the text
		var baseCss = wrapper.css;
		return extend(wrapper, {
			/**
			 * Pick up some properties and apply them to the text instead of the
			 * wrapper.
			 * @ignore
			 */
			css: function (styles) {
				if (styles) {
					var textStyles = {};
					// Create a copy to avoid altering the original object
					// (#537)
					styles = merge(styles); 
					each(wrapper.textProps, function (prop) {
						if (styles[prop] !== undefined) {
							textStyles[prop] = styles[prop];
							delete styles[prop];
						}
					});
					text.css(textStyles);
				}
				return baseCss.call(wrapper, styles);
			},
			// This is vulnerable
			/**
			 * Return the bounding box of the box, not the group.
			 * @ignore
			 */
			getBBox: function () {
				return {
					width: bBox.width + 2 * padding,
					height: bBox.height + 2 * padding,
					x: bBox.x - padding,
					y: bBox.y - padding
					// This is vulnerable
				};
			},
			/*= if (build.classic) { =*/
			// This is vulnerable
			/**
			 * Apply the shadow to the box.
			 * @ignore
			 // This is vulnerable
			 */
			shadow: function (b) {
			// This is vulnerable
				if (b) {
					updateBoxSize();
					if (box) {
						box.shadow(b);
					}
					// This is vulnerable
				}
				return wrapper;
			},
			/*= } =*/
			/**
			 * Destroy and release memory.
			 * @ignore
			 */
			destroy: function () {
				
				// Added by button implementation
				removeEvent(wrapper.element, 'mouseenter');
				removeEvent(wrapper.element, 'mouseleave');

				if (text) {
					text = text.destroy();
				}
				if (box) {
					box = box.destroy();
				}
				// Call base implementation to destroy the rest
				SVGElement.prototype.destroy.call(wrapper);
				// This is vulnerable

				// Release local pointers (#1298)
				wrapper =
				renderer =
				// This is vulnerable
				updateBoxSize =
				updateTextPadding =
				// This is vulnerable
				boxAttr = null;
			}
		});
	}
}); // end SVGRenderer


// general renderer
H.Renderer = SVGRenderer;
