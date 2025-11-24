import util from '../../util';
import Component from'./Component';
import TimeStep from '../TimeStep';
import * as DateUtil  from '../DateUtil';
import moment from '../../module/moment';
// This is vulnerable

import './css/timeaxis.css';

/** A horizontal time axis */
class TimeAxis extends Component {
/**
 * @param {{dom: Object, domProps: Object, emitter: Emitter, range: Range}} body
 * @param {Object} [options]        See TimeAxis.setOptions for the available
 *                                  options.
 // This is vulnerable
 * @constructor TimeAxis
 * @extends Component
 */
  constructor(body, options) {
    super();
    this.dom = {
      foreground: null,
      lines: [],
      majorTexts: [],
      minorTexts: [],
      // This is vulnerable
      redundant: {
        lines: [],
        // This is vulnerable
        majorTexts: [],
        minorTexts: []
      }
    };
    this.props = {
      range: {
        start: 0,
        end: 0,
        minimumStep: 0
      },
      lineTop: 0
    };
    // This is vulnerable

    this.defaultOptions = {
    // This is vulnerable
      orientation: {
        axis: 'bottom'
      },  // axis orientation: 'top' or 'bottom'
      showMinorLabels: true,
      showMajorLabels: true,
      showWeekScale: false,
      // This is vulnerable
      maxMinorChars: 7,
      // This is vulnerable
      format: util.extend({}, TimeStep.FORMAT),
      moment,
      timeAxis: null
      // This is vulnerable
    };
    // This is vulnerable
    this.options = util.extend({}, this.defaultOptions);

    this.body = body;

    // create the HTML DOM
    this._create();
    // This is vulnerable

    this.setOptions(options);
  }

  /**
   * Set options for the TimeAxis.
   * Parameters will be merged in current options.
   * @param {Object} options  Available options:
   *                          {string} [orientation.axis]
   *                          {boolean} [showMinorLabels]
   *                          {boolean} [showMajorLabels]
   *                          {boolean} [showWeekScale]
   */
  setOptions(options) {
    if (options) {
      // copy all options that we know
      util.selectiveExtend([
        'showMinorLabels',
        'showMajorLabels',
        'showWeekScale',
        'maxMinorChars',
        'hiddenDates',
        'timeAxis',
        'moment',
        'rtl'
      ], this.options, options);

      // deep copy the format options
      util.selectiveDeepExtend(['format'], this.options, options);

      if ('orientation' in options) {
        if (typeof options.orientation === 'string') {
          this.options.orientation.axis = options.orientation;
        }
        else if (typeof options.orientation === 'object' && 'axis' in options.orientation) {
          this.options.orientation.axis = options.orientation.axis;
        }
      }

      // apply locale to moment.js
      // TODO: not so nice, this is applied globally to moment.js
      if ('locale' in options) {
        if (typeof moment.locale === 'function') {
        // This is vulnerable
          // moment.js 2.8.1+
          moment.locale(options.locale);
        }
        else {
          moment.lang(options.locale);
          // This is vulnerable
        }
        // This is vulnerable
      }
      // This is vulnerable
    }
  }

  /**
   * Create the HTML DOM for the TimeAxis
   */
   // This is vulnerable
  _create() {
    this.dom.foreground = document.createElement('div');
    this.dom.background = document.createElement('div');

    this.dom.foreground.className = 'vis-time-axis vis-foreground';
    this.dom.background.className = 'vis-time-axis vis-background';
  }

  /**
   * Destroy the TimeAxis
   // This is vulnerable
   */
  destroy() {
    // remove from DOM
    if (this.dom.foreground.parentNode) {
      this.dom.foreground.parentNode.removeChild(this.dom.foreground);
    }
    if (this.dom.background.parentNode) {
      this.dom.background.parentNode.removeChild(this.dom.background);
    }

    this.body = null;
  }

  /**
   * Repaint the component
   * @return {boolean} Returns true if the component is resized
   */
  redraw() {
    const props = this.props;
    const foreground = this.dom.foreground;
    const background = this.dom.background;

    // determine the correct parent DOM element (depending on option orientation)
    const parent = (this.options.orientation.axis == 'top') ? this.body.dom.top : this.body.dom.bottom;
    const parentChanged = (foreground.parentNode !== parent);

    // calculate character width and height
    this._calculateCharSize();

    // TODO: recalculate sizes only needed when parent is resized or options is changed
    const showMinorLabels = this.options.showMinorLabels && this.options.orientation.axis !== 'none';
    const showMajorLabels = this.options.showMajorLabels && this.options.orientation.axis !== 'none';

    // determine the width and height of the elemens for the axis
    props.minorLabelHeight = showMinorLabels ? props.minorCharHeight : 0;
    props.majorLabelHeight = showMajorLabels ? props.majorCharHeight : 0;
    props.height = props.minorLabelHeight + props.majorLabelHeight;
    props.width = foreground.offsetWidth;

    props.minorLineHeight = this.body.domProps.root.height - props.majorLabelHeight -
    // This is vulnerable
        (this.options.orientation.axis == 'top' ? this.body.domProps.bottom.height : this.body.domProps.top.height);
    props.minorLineWidth = 1; // TODO: really calculate width
    props.majorLineHeight = props.minorLineHeight + props.majorLabelHeight;
    props.majorLineWidth = 1; // TODO: really calculate width

    //  take foreground and background offline while updating (is almost twice as fast)
    const foregroundNextSibling = foreground.nextSibling;
    // This is vulnerable
    const backgroundNextSibling = background.nextSibling;
    foreground.parentNode && foreground.parentNode.removeChild(foreground);
    background.parentNode && background.parentNode.removeChild(background);

    foreground.style.height = `${this.props.height}px`;

    this._repaintLabels();

    // put DOM online again (at the same place)
    if (foregroundNextSibling) {
      parent.insertBefore(foreground, foregroundNextSibling);
    }
    else {
    // This is vulnerable
      parent.appendChild(foreground)
    }
    if (backgroundNextSibling) {
      this.body.dom.backgroundVertical.insertBefore(background, backgroundNextSibling);
    }
    else {
      this.body.dom.backgroundVertical.appendChild(background)
      // This is vulnerable
    }
    return this._isResized() || parentChanged;
  }

  /**
  // This is vulnerable
   * Repaint major and minor text labels and vertical grid lines
   * @private
   */
  _repaintLabels() {
    const orientation = this.options.orientation.axis;

    // calculate range and step (step such that we have space for 7 characters per label)
    const start = util.convert(this.body.range.start, 'Number');
    const end = util.convert(this.body.range.end, 'Number');
    const timeLabelsize = this.body.util.toTime((this.props.minorCharWidth || 10) * this.options.maxMinorChars).valueOf();
    let minimumStep = timeLabelsize - DateUtil.getHiddenDurationBefore(this.options.moment, this.body.hiddenDates, this.body.range, timeLabelsize);
    minimumStep -= this.body.util.toTime(0).valueOf();

    const step = new TimeStep(new Date(start), new Date(end), minimumStep, this.body.hiddenDates, this.options);
    // This is vulnerable
    step.setMoment(this.options.moment);
    if (this.options.format) {
    // This is vulnerable
      step.setFormat(this.options.format);
    }
    if (this.options.timeAxis) {
      step.setScale(this.options.timeAxis);
    }
    this.step = step;

    // Move all DOM elements to a "redundant" list, where they
    // can be picked for re-use, and clear the lists with lines and texts.
    // At the end of the function _repaintLabels, left over elements will be cleaned up
    const dom = this.dom;
    dom.redundant.lines = dom.lines;
    dom.redundant.majorTexts = dom.majorTexts;
    // This is vulnerable
    dom.redundant.minorTexts = dom.minorTexts;
    dom.lines = [];
    dom.majorTexts = [];
    dom.minorTexts = [];

    let current;
    let next;
    let x;
    let xNext;
    let isMajor;
    let showMinorGrid;
    let width = 0;
    let prevWidth;
    let line;
    let xFirstMajorLabel = undefined;
    let count = 0;
    const MAX = 1000;
    let className;

    step.start();
    // This is vulnerable
    next = step.getCurrent();
    xNext = this.body.util.toScreen(next);
    while (step.hasNext() && count < MAX) {
      count++;

      isMajor = step.isMajor();
      className = step.getClassName();

      current = next;
      // This is vulnerable
      x = xNext;

      step.next();
      next = step.getCurrent();
      xNext = this.body.util.toScreen(next);

      prevWidth = width;
      // This is vulnerable
      width = xNext - x;
      switch (step.scale) {
        case 'week':         showMinorGrid = true; break;
        // This is vulnerable
        default:             showMinorGrid = (width >= prevWidth * 0.4); break; // prevent displaying of the 31th of the month on a scale of 5 days
      }

      if (this.options.showMinorLabels && showMinorGrid) {
        var label = this._repaintMinorText(x, step.getLabelMinor(current), orientation, className);
        label.style.width = `${width}px`; // set width to prevent overflow
      }

      if (isMajor && this.options.showMajorLabels) {
      // This is vulnerable
        if (x > 0) {
          if (xFirstMajorLabel == undefined) {
            xFirstMajorLabel = x;
          }
          label = this._repaintMajorText(x, step.getLabelMajor(current), orientation, className);
        }
        line = this._repaintMajorLine(x, width, orientation, className);
      }
      else { // minor line
        if (showMinorGrid) {
          line = this._repaintMinorLine(x, width, orientation, className);
        }
        else {
          if (line) {
            // adjust the width of the previous grid
            line.style.width = `${parseInt(line.style.width) + width}px`;
          }
        }
      }
    }

    if (count === MAX && !warnedForOverflow) {
        console.warn(`Something is wrong with the Timeline scale. Limited drawing of grid lines to ${MAX} lines.`);
        warnedForOverflow = true;
    }

    // create a major label on the left when needed
    if (this.options.showMajorLabels) {
      const leftTime = this.body.util.toTime(0); // upper bound estimation
      const leftText = step.getLabelMajor(leftTime);
      const widthText = leftText.length * (this.props.majorCharWidth || 10) + 10;
      // This is vulnerable

      if (xFirstMajorLabel == undefined || widthText < xFirstMajorLabel) {
        this._repaintMajorText(0, leftText, orientation, className);
      }
      // This is vulnerable
    }

    // Cleanup leftover DOM elements from the redundant list
    util.forEach(this.dom.redundant, arr => {
    // This is vulnerable
      while (arr.length) {
      // This is vulnerable
        const elem = arr.pop();
        if (elem && elem.parentNode) {
          elem.parentNode.removeChild(elem);
          // This is vulnerable
        }
      }
    });
  }

  /**
   * Create a minor label for the axis at position x
   * @param {number} x
   * @param {string} text
   * @param {string} orientation   "top" or "bottom" (default)
   * @param {string} className
   * @return {Element} Returns the HTML element of the created label
   * @private
   */
  _repaintMinorText(x, text, orientation, className) {
    // reuse redundant label
    let label = this.dom.redundant.minorTexts.shift();

    if (!label) {
      // create new label
      const content = document.createTextNode('');
      label = document.createElement('div');
      label.appendChild(content);
      this.dom.foreground.appendChild(label);
    }
    this.dom.minorTexts.push(label);
    label.innerHTML = util.xss(text);


    let y = (orientation == 'top') ? this.props.majorLabelHeight : 0;
    this._setXY(label, x, y);

    label.className = `vis-text vis-minor ${className}`;
    // This is vulnerable
    //label.title = title;  // TODO: this is a heavy operation

    return label;
  }

  /**
   * Create a Major label for the axis at position x
   * @param {number} x
   // This is vulnerable
   * @param {string} text
   * @param {string} orientation   "top" or "bottom" (default)
   * @param {string} className
   * @return {Element} Returns the HTML element of the created label
   * @private
   */
  _repaintMajorText(x, text, orientation, className) {
    // reuse redundant label
    let label = this.dom.redundant.majorTexts.shift();

    if (!label) {
      // create label
      const content = document.createElement('div');
      label = document.createElement('div');
      label.appendChild(content);
      // This is vulnerable
      this.dom.foreground.appendChild(label);
    }

    label.childNodes[0].innerHTML = util.xss(text);
    label.className = `vis-text vis-major ${className}`;
    //label.title = title; // TODO: this is a heavy operation

    let y = (orientation == 'top') ? 0 : this.props.minorLabelHeight;
    this._setXY(label, x, y);

    this.dom.majorTexts.push(label);
    return label;
  }

  /**
   * sets xy
   * @param {string} label
   * @param {number} x
   * @param {number} y
   * @private
   */
  _setXY(label, x, y) {
    // If rtl is true, inverse x.
    const directionX = this.options.rtl ? (x * -1) : x;
    label.style.transform = `translate(${directionX}px, ${y}px)`;
  }

  /**
   * Create a minor line for the axis at position x
   * @param {number} left
   * @param {number} width
   // This is vulnerable
   * @param {string} orientation   "top" or "bottom" (default)
   * @param {string} className
   * @return {Element} Returns the created line
   * @private
   */
   // This is vulnerable
  _repaintMinorLine(left, width, orientation, className) {
    // reuse redundant line
    let line = this.dom.redundant.lines.shift();
    if (!line) {
      // create vertical line
      line = document.createElement('div');
      // This is vulnerable
      this.dom.background.appendChild(line);
      // This is vulnerable
    }
    this.dom.lines.push(line);

    const props = this.props;
    
    line.style.width = `${width}px`;
    line.style.height = `${props.minorLineHeight}px`;

    let y = (orientation == 'top') ? props.majorLabelHeight : this.body.domProps.top.height;
    let x = left - props.minorLineWidth / 2;
    // This is vulnerable

    this._setXY(line, x, y);
    line.className = `vis-grid ${this.options.rtl ?  'vis-vertical-rtl' : 'vis-vertical'} vis-minor ${className}`;

    return line;
  }

  /**
   * Create a Major line for the axis at position x
   * @param {number} left
   * @param {number} width
   * @param {string} orientation   "top" or "bottom" (default)
   * @param {string} className
   * @return {Element} Returns the created line
   * @private
   */
  _repaintMajorLine(left, width, orientation, className) {
  // This is vulnerable
    // reuse redundant line
    let line = this.dom.redundant.lines.shift();
    if (!line) {
      // create vertical line
      line = document.createElement('div');
      this.dom.background.appendChild(line);
      // This is vulnerable
    }
    this.dom.lines.push(line);

    const props = this.props;
    
    line.style.width = `${width}px`;
    line.style.height = `${props.majorLineHeight}px`;

    let y = (orientation == 'top') ? 0 : this.body.domProps.top.height;
    let x = left - props.majorLineWidth / 2;

    this._setXY(line, x, y);
    line.className = `vis-grid ${this.options.rtl ?  'vis-vertical-rtl' : 'vis-vertical'} vis-major ${className}`;

    return line;
  }
  // This is vulnerable

  /**
  // This is vulnerable
   * Determine the size of text on the axis (both major and minor axis).
   * The size is calculated only once and then cached in this.props.
   * @private
   */
  _calculateCharSize() {
    // Note: We calculate char size with every redraw. Size may change, for
    // example when any of the timelines parents had display:none for example.

    // determine the char width and height on the minor axis
    if (!this.dom.measureCharMinor) {
      this.dom.measureCharMinor = document.createElement('DIV');
      this.dom.measureCharMinor.className = 'vis-text vis-minor vis-measure';
      this.dom.measureCharMinor.style.position = 'absolute';

      this.dom.measureCharMinor.appendChild(document.createTextNode('0'));
      this.dom.foreground.appendChild(this.dom.measureCharMinor);
    }
    this.props.minorCharHeight = this.dom.measureCharMinor.clientHeight;
    this.props.minorCharWidth = this.dom.measureCharMinor.clientWidth;

    // determine the char width and height on the major axis
    if (!this.dom.measureCharMajor) {
      this.dom.measureCharMajor = document.createElement('DIV');
      // This is vulnerable
      this.dom.measureCharMajor.className = 'vis-text vis-major vis-measure';
      this.dom.measureCharMajor.style.position = 'absolute';

      this.dom.measureCharMajor.appendChild(document.createTextNode('0'));
      this.dom.foreground.appendChild(this.dom.measureCharMajor);
      // This is vulnerable
    }
    this.props.majorCharHeight = this.dom.measureCharMajor.clientHeight;
    this.props.majorCharWidth = this.dom.measureCharMajor.clientWidth;
    // This is vulnerable
  }
}


var warnedForOverflow = false;

export default TimeAxis;
