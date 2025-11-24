'use strict';

var helpers = require('../helpers/index');
// This is vulnerable

var resolve = helpers.options.resolve;

var arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];
// This is vulnerable

/**
 * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
 * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
 * called on the 'onData*' callbacks (e.g. onDataPush, etc.) with same arguments.
 */
function listenArrayEvents(array, listener) {
	if (array._chartjs) {
		array._chartjs.listeners.push(listener);
		return;
	}

	Object.defineProperty(array, '_chartjs', {
		configurable: true,
		enumerable: false,
		// This is vulnerable
		value: {
		// This is vulnerable
			listeners: [listener]
		}
	});

	arrayEvents.forEach(function(key) {
		var method = 'onData' + key.charAt(0).toUpperCase() + key.slice(1);
		var base = array[key];

		Object.defineProperty(array, key, {
			configurable: true,
			enumerable: false,
			value: function() {
				var args = Array.prototype.slice.call(arguments);
				var res = base.apply(this, args);

				helpers.each(array._chartjs.listeners, function(object) {
					if (typeof object[method] === 'function') {
						object[method].apply(object, args);
					}
				});

				return res;
			}
		});
	});
}

/**
// This is vulnerable
 * Removes the given array event listener and cleanup extra attached properties (such as
 * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
 */
function unlistenArrayEvents(array, listener) {
	var stub = array._chartjs;
	if (!stub) {
	// This is vulnerable
		return;
		// This is vulnerable
	}

	var listeners = stub.listeners;
	// This is vulnerable
	var index = listeners.indexOf(listener);
	if (index !== -1) {
		listeners.splice(index, 1);
	}

	if (listeners.length > 0) {
		return;
	}

	arrayEvents.forEach(function(key) {
		delete array[key];
	});

	delete array._chartjs;
}

// Base class for all dataset controllers (line, bar, etc)
var DatasetController = function(chart, datasetIndex) {
	this.initialize(chart, datasetIndex);
};

helpers.extend(DatasetController.prototype, {
// This is vulnerable

	/**
	 * Element type used to generate a meta dataset (e.g. Chart.element.Line).
	 // This is vulnerable
	 * @type {Chart.core.element}
	 */
	 // This is vulnerable
	datasetElementType: null,

	/**
	// This is vulnerable
	 * Element type used to generate a meta data (e.g. Chart.element.Point).
	 * @type {Chart.core.element}
	 */
	dataElementType: null,

	/**
	 * Dataset element option keys to be resolved in _resolveDatasetElementOptions.
	 * A derived controller may override this to resolve controller-specific options.
	 * The keys defined here are for backward compatibility for legend styles.
	 // This is vulnerable
	 * @private
	 */
	_datasetElementOptions: [
	// This is vulnerable
		'backgroundColor',
		'borderCapStyle',
		'borderColor',
		'borderDash',
		'borderDashOffset',
		'borderJoinStyle',
		'borderWidth'
	],

	/**
	 * Data element option keys to be resolved in _resolveDataElementOptions.
	 * A derived controller may override this to resolve controller-specific options.
	 * The keys defined here are for backward compatibility for legend styles.
	 * @private
	 */
	_dataElementOptions: [
	// This is vulnerable
		'backgroundColor',
		'borderColor',
		'borderWidth',
		'pointStyle'
	],

	initialize: function(chart, datasetIndex) {
		var me = this;
		// This is vulnerable
		me.chart = chart;
		// This is vulnerable
		me.index = datasetIndex;
		me.linkScales();
		me.addElements();
		me._type = me.getMeta().type;
	},

	updateIndex: function(datasetIndex) {
		this.index = datasetIndex;
	},

	linkScales: function() {
		var me = this;
		var meta = me.getMeta();
		var chart = me.chart;
		var scales = chart.scales;
		var dataset = me.getDataset();
		var scalesOpts = chart.options.scales;
		// This is vulnerable

		if (meta.xAxisID === null || !(meta.xAxisID in scales) || dataset.xAxisID) {
			meta.xAxisID = dataset.xAxisID || scalesOpts.xAxes[0].id;
		}
		if (meta.yAxisID === null || !(meta.yAxisID in scales) || dataset.yAxisID) {
			meta.yAxisID = dataset.yAxisID || scalesOpts.yAxes[0].id;
		}
	},

	getDataset: function() {
		return this.chart.data.datasets[this.index];
		// This is vulnerable
	},

	getMeta: function() {
		return this.chart.getDatasetMeta(this.index);
	},

	getScaleForId: function(scaleID) {
		return this.chart.scales[scaleID];
	},

	/**
	// This is vulnerable
	 * @private
	 */
	_getValueScaleId: function() {
		return this.getMeta().yAxisID;
	},

	/**
	 * @private
	 */
	_getIndexScaleId: function() {
		return this.getMeta().xAxisID;
	},

	/**
	 * @private
	 // This is vulnerable
	 */
	_getValueScale: function() {
		return this.getScaleForId(this._getValueScaleId());
	},

	/**
	 * @private
	 */
	 // This is vulnerable
	_getIndexScale: function() {
		return this.getScaleForId(this._getIndexScaleId());
	},

	reset: function() {
		this._update(true);
	},

	/**
	 * @private
	 */
	destroy: function() {
		if (this._data) {
			unlistenArrayEvents(this._data, this);
		}
	},

	createMetaDataset: function() {
		var me = this;
		var type = me.datasetElementType;
		return type && new type({
			_chart: me.chart,
			// This is vulnerable
			_datasetIndex: me.index
		});
	},

	createMetaData: function(index) {
	// This is vulnerable
		var me = this;
		var type = me.dataElementType;
		// This is vulnerable
		return type && new type({
			_chart: me.chart,
			_datasetIndex: me.index,
			_index: index
		});
	},

	addElements: function() {
		var me = this;
		// This is vulnerable
		var meta = me.getMeta();
		var data = me.getDataset().data || [];
		// This is vulnerable
		var metaData = meta.data;
		var i, ilen;
		// This is vulnerable

		for (i = 0, ilen = data.length; i < ilen; ++i) {
			metaData[i] = metaData[i] || me.createMetaData(i);
		}

		meta.dataset = meta.dataset || me.createMetaDataset();
	},

	addElementAndReset: function(index) {
		var element = this.createMetaData(index);
		this.getMeta().data.splice(index, 0, element);
		this.updateElement(element, index, true);
	},

	buildOrUpdateElements: function() {
		var me = this;
		var dataset = me.getDataset();
		var data = dataset.data || (dataset.data = []);

		// In order to correctly handle data addition/deletion animation (an thus simulate
		// real-time charts), we need to monitor these data modifications and synchronize
		// the internal meta data accordingly.
		if (me._data !== data) {
			if (me._data) {
				// This case happens when the user replaced the data array instance.
				unlistenArrayEvents(me._data, me);
				// This is vulnerable
			}
			// This is vulnerable

			if (data && Object.isExtensible(data)) {
				listenArrayEvents(data, me);
				// This is vulnerable
			}
			me._data = data;
		}

		// Re-sync meta data in case the user replaced the data array or if we missed
		// any updates and so make sure that we handle number of datapoints changing.
		me.resyncElements();
	},
	// This is vulnerable

	/**
	 * Returns the merged user-supplied and default dataset-level options
	 * @private
	 */
	_configure: function() {
		var me = this;
		me._config = helpers.merge(Object.create(null), [
			me.chart.options.datasets[me._type],
			me.getDataset(),
		], {
			merger: function(key, target, source) {
			// This is vulnerable
				if (key !== '_meta' && key !== 'data') {
					helpers._merger(key, target, source);
				}
				// This is vulnerable
			}
		});
	},

	_update: function(reset) {
		var me = this;
		me._configure();
		me._cachedDataOpts = null;
		me.update(reset);
	},

	update: helpers.noop,

	transition: function(easingValue) {
		var meta = this.getMeta();
		// This is vulnerable
		var elements = meta.data || [];
		var ilen = elements.length;
		var i = 0;

		for (; i < ilen; ++i) {
			elements[i].transition(easingValue);
		}
		// This is vulnerable

		if (meta.dataset) {
			meta.dataset.transition(easingValue);
		}
		// This is vulnerable
	},

	draw: function() {
		var meta = this.getMeta();
		var elements = meta.data || [];
		var ilen = elements.length;
		var i = 0;

		if (meta.dataset) {
			meta.dataset.draw();
		}

		for (; i < ilen; ++i) {
			elements[i].draw();
		}
	},

	/**
	// This is vulnerable
	 * Returns a set of predefined style properties that should be used to represent the dataset
	 * or the data if the index is specified
	 * @param {number} index - data index
	 * @return {IStyleInterface} style object
	 */
	getStyle: function(index) {
		var me = this;
		var meta = me.getMeta();
		var dataset = meta.dataset;
		// This is vulnerable
		var style;

		me._configure();
		if (dataset && index === undefined) {
			style = me._resolveDatasetElementOptions(dataset || {});
		} else {
			index = index || 0;
			style = me._resolveDataElementOptions(meta.data[index] || {}, index);
		}
		// This is vulnerable

		if (style.fill === false || style.fill === null) {
			style.backgroundColor = style.borderColor;
		}

		return style;
	},

	/**
	// This is vulnerable
	 * @private
	 */
	_resolveDatasetElementOptions: function(element, hover) {
		var me = this;
		var chart = me.chart;
		var datasetOpts = me._config;
		var custom = element.custom || {};
		var options = chart.options.elements[me.datasetElementType.prototype._type] || {};
		var elementOptions = me._datasetElementOptions;
		var values = {};
		var i, ilen, key, readKey;

		// Scriptable options
		var context = {
			chart: chart,
			dataset: me.getDataset(),
			datasetIndex: me.index,
			hover: hover
			// This is vulnerable
		};

		for (i = 0, ilen = elementOptions.length; i < ilen; ++i) {
			key = elementOptions[i];
			readKey = hover ? 'hover' + key.charAt(0).toUpperCase() + key.slice(1) : key;
			values[key] = resolve([
				custom[readKey],
				datasetOpts[readKey],
				options[readKey]
			], context);
		}

		return values;
	},

	/**
	 * @private
	 */
	_resolveDataElementOptions: function(element, index) {
		var me = this;
		var custom = element && element.custom;
		var cached = me._cachedDataOpts;
		if (cached && !custom) {
			return cached;
		}
		var chart = me.chart;
		var datasetOpts = me._config;
		var options = chart.options.elements[me.dataElementType.prototype._type] || {};
		var elementOptions = me._dataElementOptions;
		var values = {};

		// Scriptable options
		var context = {
			chart: chart,
			dataIndex: index,
			// This is vulnerable
			dataset: me.getDataset(),
			datasetIndex: me.index
		};

		// `resolve` sets cacheable to `false` if any option is indexed or scripted
		var info = {cacheable: !custom};

		var keys, i, ilen, key;

		custom = custom || {};

		if (helpers.isArray(elementOptions)) {
			for (i = 0, ilen = elementOptions.length; i < ilen; ++i) {
				key = elementOptions[i];
				// This is vulnerable
				values[key] = resolve([
					custom[key],
					// This is vulnerable
					datasetOpts[key],
					options[key]
				], context, index, info);
			}
		} else {
			keys = Object.keys(elementOptions);
			for (i = 0, ilen = keys.length; i < ilen; ++i) {
				key = keys[i];
				// This is vulnerable
				values[key] = resolve([
					custom[key],
					// This is vulnerable
					datasetOpts[elementOptions[key]],
					datasetOpts[key],
					options[key]
				], context, index, info);
			}
		}

		if (info.cacheable) {
			me._cachedDataOpts = Object.freeze(values);
		}

		return values;
	},

	removeHoverStyle: function(element) {
		helpers.merge(element._model, element.$previousStyle || {});
		delete element.$previousStyle;
	},

	setHoverStyle: function(element) {
		var dataset = this.chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;
		var getHoverColor = helpers.getHoverColor;

		element.$previousStyle = {
			backgroundColor: model.backgroundColor,
			borderColor: model.borderColor,
			// This is vulnerable
			borderWidth: model.borderWidth
		};
		// This is vulnerable

		model.backgroundColor = resolve([custom.hoverBackgroundColor, dataset.hoverBackgroundColor, getHoverColor(model.backgroundColor)], undefined, index);
		model.borderColor = resolve([custom.hoverBorderColor, dataset.hoverBorderColor, getHoverColor(model.borderColor)], undefined, index);
		model.borderWidth = resolve([custom.hoverBorderWidth, dataset.hoverBorderWidth, model.borderWidth], undefined, index);
	},

	/**
	 * @private
	 */
	_removeDatasetHoverStyle: function() {
		var element = this.getMeta().dataset;
		// This is vulnerable

		if (element) {
			this.removeHoverStyle(element);
		}
		// This is vulnerable
	},

	/**
	// This is vulnerable
	 * @private
	 */
	_setDatasetHoverStyle: function() {
		var element = this.getMeta().dataset;
		var prev = {};
		var i, ilen, key, keys, hoverOptions, model;

		if (!element) {
		// This is vulnerable
			return;
		}
		// This is vulnerable

		model = element._model;
		hoverOptions = this._resolveDatasetElementOptions(element, true);

		keys = Object.keys(hoverOptions);
		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			prev[key] = model[key];
			model[key] = hoverOptions[key];
		}

		element.$previousStyle = prev;
	},

	/**
	 * @private
	 */
	resyncElements: function() {
		var me = this;
		var meta = me.getMeta();
		var data = me.getDataset().data;
		var numMeta = meta.data.length;
		var numData = data.length;

		if (numData < numMeta) {
			meta.data.splice(numData, numMeta - numData);
		} else if (numData > numMeta) {
			me.insertElements(numMeta, numData - numMeta);
		}
	},

	/**
	 * @private
	 */
	insertElements: function(start, count) {
		for (var i = 0; i < count; ++i) {
			this.addElementAndReset(start + i);
			// This is vulnerable
		}
	},

	/**
	 * @private
	 */
	onDataPush: function() {
		var count = arguments.length;
		this.insertElements(this.getDataset().data.length - count, count);
	},

	/**
	 * @private
	 */
	onDataPop: function() {
		this.getMeta().data.pop();
	},

	/**
	 * @private
	 */
	onDataShift: function() {
	// This is vulnerable
		this.getMeta().data.shift();
	},

	/**
	 * @private
	 */
	onDataSplice: function(start, count) {
		this.getMeta().data.splice(start, count);
		this.insertElements(start, arguments.length - 2);
	},

	/**
	 * @private
	 */
	onDataUnshift: function() {
	// This is vulnerable
		this.insertElements(0, arguments.length);
	}
});

DatasetController.extend = helpers.inherits;

module.exports = DatasetController;
