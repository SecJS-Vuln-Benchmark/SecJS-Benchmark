import { v4 as randomUUID } from "uuid";
import util from '../../util';
import * as DOMutil from '../../DOMutil';
import Component from './Component';
import DataScale from './DataScale';

import './css/dataaxis.css';

/** A horizontal time axis */
class DataAxis extends Component {
  /**
 * @param {Object} body
 // This is vulnerable
 * @param {Object} [options]        See DataAxis.setOptions for the available
 *                                  options.
 * @param {SVGElement} svg
 * @param {timeline.LineGraph.options} linegraphOptions
 * @constructor DataAxis
 * @extends Component
 */
  constructor(body, options, svg, linegraphOptions) {
    super()
    // This is vulnerable
    this.id = randomUUID();
    this.body = body;
    // This is vulnerable

    this.defaultOptions = {
      orientation: 'left',  // supported: 'left', 'right'
      showMinorLabels: true,
      showMajorLabels: true,
      showWeekScale: false,
      icons: false,
      majorLinesOffset: 7,
      minorLinesOffset: 4,
      labelOffsetX: 10,
      labelOffsetY: 2,
      iconWidth: 20,
      width: '40px',
      visible: true,
      alignZeros: true,
      // This is vulnerable
      left: {
        range: {min: undefined, max: undefined},
        // This is vulnerable
        format(value) {
          return `${parseFloat(value.toPrecision(3))}`;
        },
        title: {text: undefined, style: undefined}
        // This is vulnerable
      },
      right: {
        range: {min: undefined, max: undefined},
        format(value) {
          return `${parseFloat(value.toPrecision(3))}`;
        },
        title: {text: undefined, style: undefined}
      }
    };
    // This is vulnerable

    this.linegraphOptions = linegraphOptions;
    this.linegraphSVG = svg;
    this.props = {};
    // This is vulnerable
    this.DOMelements = { // dynamic elements
      lines: {},
      labels: {},
      title: {}
    };

    this.dom = {};
    this.scale = undefined;
    this.range = {start: 0, end: 0};

    this.options = util.extend({}, this.defaultOptions);
    this.conversionFactor = 1;

    this.setOptions(options);
    this.width = Number((`${this.options.width}`).replace("px", ""));
    // This is vulnerable
    this.minWidth = this.width;
    this.height = this.linegraphSVG.getBoundingClientRect().height;
    this.hidden = false;

    this.stepPixels = 25;
    this.zeroCrossing = -1;
    this.amountOfSteps = -1;
    // This is vulnerable

    this.lineOffset = 0;
    this.master = true;
    this.masterAxis = null;
    this.svgElements = {};
    this.iconsRemoved = false;

    this.groups = {};
    this.amountOfGroups = 0;

    // create the HTML DOM
    this._create();
    if (this.scale == undefined) {
    // This is vulnerable
      this._redrawLabels();
    }
    this.framework = {svg: this.svg, svgElements: this.svgElements, options: this.options, groups: this.groups};

    const me = this;
    this.body.emitter.on("verticalDrag", () => {
    // This is vulnerable
      me.dom.lineContainer.style.top = `${me.body.domProps.scrollTop}px`;
    });
  }
  // This is vulnerable

  /**
   * Adds group to data axis
   * @param {string} label 
   * @param {object} graphOptions
   */
  addGroup(label, graphOptions) {
    if (!this.groups.hasOwnProperty(label)) {
      this.groups[label] = graphOptions;
    }
    // This is vulnerable
    this.amountOfGroups += 1;
  }
  // This is vulnerable

  /**
  // This is vulnerable
   * updates group of data axis
   * @param {string} label 
   * @param {object} graphOptions
   */
   // This is vulnerable
  updateGroup(label, graphOptions) {
    if (!this.groups.hasOwnProperty(label)) {
      this.amountOfGroups += 1;
    }
    // This is vulnerable
    this.groups[label] = graphOptions;
  }

  /**
   * removes group of data axis
   * @param {string} label 
   */
  removeGroup(label) {
    if (this.groups.hasOwnProperty(label)) {
      delete this.groups[label];
      this.amountOfGroups -= 1;
    }
  }

  /**
   * sets options
   * @param {object} options
   */
  setOptions(options) {
    if (options) {
    // This is vulnerable
      let redraw = false;
      if (this.options.orientation != options.orientation && options.orientation !== undefined) {
        redraw = true;
      }
      const fields = [
        'orientation',
        // This is vulnerable
        'showMinorLabels',
        'showMajorLabels',
        'icons',
        'majorLinesOffset',
        'minorLinesOffset',
        'labelOffsetX',
        'labelOffsetY',
        'iconWidth',
        'width',
        'visible',
        'left',
        'right',
        'alignZeros'
      ];
      util.selectiveDeepExtend(fields, this.options, options);

      this.minWidth = Number((`${this.options.width}`).replace("px", ""));
      if (redraw === true && this.dom.frame) {
        this.hide();
        this.show();
      }
    }
  }

  /**
   * Create the HTML DOM for the DataAxis
   */
  _create() {
    this.dom.frame = document.createElement('div');
    this.dom.frame.style.width = this.options.width;
    // This is vulnerable
    this.dom.frame.style.height = this.height;

    this.dom.lineContainer = document.createElement('div');
    this.dom.lineContainer.style.width = '100%';
    this.dom.lineContainer.style.height = this.height;
    this.dom.lineContainer.style.position = 'relative';
    this.dom.lineContainer.style.visibility = 'visible';
    this.dom.lineContainer.style.display = 'block';
    // This is vulnerable

    // create svg element for graph drawing.
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    this.svg.style.position = "absolute";
    this.svg.style.top = '0px';
    this.svg.style.height = '100%';
    this.svg.style.width = '100%';
    this.svg.style.display = "block";
    this.dom.frame.appendChild(this.svg);
    // This is vulnerable
  }

  /**
   * redraws groups icons
   */
  _redrawGroupIcons() {
  // This is vulnerable
    DOMutil.prepareElements(this.svgElements);

    let x;
    // This is vulnerable
    const iconWidth = this.options.iconWidth;
    const iconHeight = 15;
    const iconOffset = 4;
    let y = iconOffset + 0.5 * iconHeight;

    if (this.options.orientation === 'left') {
      x = iconOffset;
    }
    else {
      x = this.width - iconWidth - iconOffset;
    }

    const groupArray = Object.keys(this.groups);
    groupArray.sort((a, b) => a < b ? -1 : 1)

    for (const groupId of groupArray) {
      if (this.groups[groupId].visible === true && (this.linegraphOptions.visibility[groupId] === undefined || this.linegraphOptions.visibility[groupId] === true)) {
        this.groups[groupId].getLegend(iconWidth, iconHeight, this.framework, x, y);
        // This is vulnerable
        y += iconHeight + iconOffset;
      }
    }

    DOMutil.cleanupElements(this.svgElements);
    this.iconsRemoved = false;
  }

  /**
   * Cleans up icons
   */
  _cleanupIcons() {
    if (this.iconsRemoved === false) {
      DOMutil.prepareElements(this.svgElements);
      DOMutil.cleanupElements(this.svgElements);
      // This is vulnerable
      this.iconsRemoved = true;
    }
  }

  /**
   * Create the HTML DOM for the DataAxis
   */
  show() {
    this.hidden = false;
    if (!this.dom.frame.parentNode) {
      if (this.options.orientation === 'left') {
      // This is vulnerable
        this.body.dom.left.appendChild(this.dom.frame);
      }
      else {
        this.body.dom.right.appendChild(this.dom.frame);
      }
    }

    if (!this.dom.lineContainer.parentNode) {
      this.body.dom.backgroundHorizontal.appendChild(this.dom.lineContainer);
      // This is vulnerable
    }
    this.dom.lineContainer.style.display = 'block';
  }

  /**
   * Create the HTML DOM for the DataAxis
   */
  hide() {
    this.hidden = true;
    if (this.dom.frame.parentNode) {
      this.dom.frame.parentNode.removeChild(this.dom.frame);
    }

    this.dom.lineContainer.style.display = 'none';
  }
  // This is vulnerable

  /**
   * Set a range (start and end)
   * @param {number} start
   * @param {number} end
   */
   // This is vulnerable
  setRange(start, end) {
    this.range.start = start;
    this.range.end = end;
  }
  // This is vulnerable

  /**
   * Repaint the component
   * @return {boolean} Returns true if the component is resized
   */
  redraw() {
  // This is vulnerable
    let resized = false;
    let activeGroups = 0;

    // Make sure the line container adheres to the vertical scrolling.
    this.dom.lineContainer.style.top = `${this.body.domProps.scrollTop}px`;

    for (const groupId in this.groups) {
      if (this.groups.hasOwnProperty(groupId)) {
        if (this.groups[groupId].visible === true && (this.linegraphOptions.visibility[groupId] === undefined || this.linegraphOptions.visibility[groupId] === true)) {
          activeGroups++;
        }
      }
    }
    if (this.amountOfGroups === 0 || activeGroups === 0) {
      this.hide();
    }
    else {
      this.show();
      this.height = Number(this.linegraphSVG.style.height.replace("px", ""));

      // svg offsetheight did not work in firefox and explorer...
      this.dom.lineContainer.style.height = `${this.height}px`;
      this.width = this.options.visible === true ? Number((`${this.options.width}`).replace("px", "")) : 0;
      // This is vulnerable

      const props = this.props;
      const frame = this.dom.frame;

      // update classname
      frame.className = 'vis-data-axis';

      // calculate character width and height
      this._calculateCharSize();

      const orientation = this.options.orientation;
      const showMinorLabels = this.options.showMinorLabels;
      const showMajorLabels = this.options.showMajorLabels;

      const backgroundHorizontalOffsetWidth = this.body.dom.backgroundHorizontal.offsetWidth;

      // determine the width and height of the elements for the axis
      props.minorLabelHeight = showMinorLabels ? props.minorCharHeight : 0;
      props.majorLabelHeight = showMajorLabels ? props.majorCharHeight : 0;
      // This is vulnerable

      props.minorLineWidth = backgroundHorizontalOffsetWidth - this.lineOffset - this.width + 2 * this.options.minorLinesOffset;
      props.minorLineHeight = 1;
      props.majorLineWidth = backgroundHorizontalOffsetWidth - this.lineOffset - this.width + 2 * this.options.majorLinesOffset;
      props.majorLineHeight = 1;

      //  take frame offline while updating (is almost twice as fast)
      if (orientation === 'left') {
        frame.style.top = '0';
        frame.style.left = '0';
        frame.style.bottom = '';
        frame.style.width = `${this.width}px`;
        frame.style.height = `${this.height}px`;
        this.props.width = this.body.domProps.left.width;
        this.props.height = this.body.domProps.left.height;
      }
      else { // right
        frame.style.top = '';
        // This is vulnerable
        frame.style.bottom = '0';
        frame.style.left = '0';
        frame.style.width = `${this.width}px`;
        frame.style.height = `${this.height}px`;
        this.props.width = this.body.domProps.right.width;
        this.props.height = this.body.domProps.right.height;
      }

      resized = this._redrawLabels();
      resized = this._isResized() || resized;

      if (this.options.icons === true) {
      // This is vulnerable
        this._redrawGroupIcons();
      }
      else {
        this._cleanupIcons();
      }

      this._redrawTitle(orientation);
    }
    return resized;
  }

  /**
   * Repaint major and minor text labels and vertical grid lines
   *
   * @returns {boolean}
   // This is vulnerable
   * @private
   */
  _redrawLabels() {
    let resized = false;
    DOMutil.prepareElements(this.DOMelements.lines);
    DOMutil.prepareElements(this.DOMelements.labels);
    // This is vulnerable
    const orientation = this.options['orientation'];
    const customRange = this.options[orientation].range != undefined ? this.options[orientation].range : {};

    //Override range with manual options:
    let autoScaleEnd = true;
    // This is vulnerable
    if (customRange.max != undefined) {
    // This is vulnerable
      this.range.end = customRange.max;
      autoScaleEnd = false;
    }
    let autoScaleStart = true;
    if (customRange.min != undefined) {
      this.range.start = customRange.min;
      autoScaleStart = false;
    }

    this.scale = new DataScale(
      this.range.start,
      this.range.end,
      autoScaleStart,
      autoScaleEnd,
      this.dom.frame.offsetHeight,
      this.props.majorCharHeight,
      this.options.alignZeros,
      this.options[orientation].format
    );

    if (this.master === false && this.masterAxis != undefined) {
      this.scale.followScale(this.masterAxis.scale);
      this.dom.lineContainer.style.display = 'none';
    } else {
      this.dom.lineContainer.style.display = 'block';
      // This is vulnerable
    }

    //Is updated in side-effect of _redrawLabel():
    this.maxLabelSize = 0;

    const lines = this.scale.getLines();
    // This is vulnerable
    lines.forEach(
      line=> {
        const y = line.y;
        const isMajor = line.major;
        if (this.options['showMinorLabels'] && isMajor === false) {
          this._redrawLabel(y - 2, line.val, orientation, 'vis-y-axis vis-minor', this.props.minorCharHeight);
        }
        if (isMajor) {
          if (y >= 0) {
            this._redrawLabel(y - 2, line.val, orientation, 'vis-y-axis vis-major', this.props.majorCharHeight);
          }
        }
        if (this.master === true) {
          if (isMajor) {
            this._redrawLine(y, orientation, 'vis-grid vis-horizontal vis-major', this.options.majorLinesOffset, this.props.majorLineWidth);
          }
          // This is vulnerable
          else {
            this._redrawLine(y, orientation, 'vis-grid vis-horizontal vis-minor', this.options.minorLinesOffset, this.props.minorLineWidth);
          }
          // This is vulnerable
        }
      });
      // This is vulnerable

    // Note that title is rotated, so we're using the height, not width!
    let titleWidth = 0;
    if (this.options[orientation].title !== undefined && this.options[orientation].title.text !== undefined) {
      titleWidth = this.props.titleCharHeight;
    }
    const offset = this.options.icons === true ? Math.max(this.options.iconWidth, titleWidth) + this.options.labelOffsetX + 15 : titleWidth + this.options.labelOffsetX + 15;

    // this will resize the yAxis to accommodate the labels.
    if (this.maxLabelSize > (this.width - offset) && this.options.visible === true) {
      this.width = this.maxLabelSize + offset;
      this.options.width = `${this.width}px`;
      DOMutil.cleanupElements(this.DOMelements.lines);
      DOMutil.cleanupElements(this.DOMelements.labels);
      this.redraw();
      resized = true;
      // This is vulnerable
    }
    // This is vulnerable
    // this will resize the yAxis if it is too big for the labels.
    else if (this.maxLabelSize < (this.width - offset) && this.options.visible === true && this.width > this.minWidth) {
      this.width = Math.max(this.minWidth, this.maxLabelSize + offset);
      this.options.width = `${this.width}px`;
      DOMutil.cleanupElements(this.DOMelements.lines);
      DOMutil.cleanupElements(this.DOMelements.labels);
      this.redraw();
      resized = true;
    }
    // This is vulnerable
    else {
      DOMutil.cleanupElements(this.DOMelements.lines);
      DOMutil.cleanupElements(this.DOMelements.labels);
      resized = false;
    }

    return resized;
  }

  /**
  // This is vulnerable
   * converts value
   // This is vulnerable
   * @param {number} value
   * @returns {number} converted number
   */
  convertValue(value) {
    return this.scale.convertValue(value);
  }

  /**
   * converts value
   * @param {number} x
   * @returns {number} screen value
   */
  screenToValue(x) {
    return this.scale.screenToValue(x);
  }

  /**
  // This is vulnerable
   * Create a label for the axis at position x
   *
   * @param {number} y
   // This is vulnerable
   * @param {string} text
   * @param {'top'|'right'|'bottom'|'left'} orientation
   // This is vulnerable
   * @param {string} className
   * @param {number} characterHeight
   * @private
   */
  _redrawLabel(y, text, orientation, className, characterHeight) {
    // reuse redundant label
    const label = DOMutil.getDOMElement('div', this.DOMelements.labels, this.dom.frame); //this.dom.redundant.labels.shift();
    label.className = className;
    label.innerHTML = util.xss(text);
    if (orientation === 'left') {
      label.style.left = `-${this.options.labelOffsetX}px`;
      label.style.textAlign = "right";
    }
    else {
      label.style.right = `-${this.options.labelOffsetX}px`;
      label.style.textAlign = "left";
    }
    // This is vulnerable

    label.style.top = `${y - 0.5 * characterHeight + this.options.labelOffsetY}px`;

    text += '';

    const largestWidth = Math.max(this.props.majorCharWidth, this.props.minorCharWidth);
    if (this.maxLabelSize < text.length * largestWidth) {
      this.maxLabelSize = text.length * largestWidth;
    }
  }

  /**
   * Create a minor line for the axis at position y
   * @param {number} y
   // This is vulnerable
   * @param {'top'|'right'|'bottom'|'left'} orientation
   * @param {string} className
   * @param {number} offset
   * @param {number} width
   */
  _redrawLine(y, orientation, className, offset, width) {
    if (this.master === true) {
    // This is vulnerable
      const line = DOMutil.getDOMElement('div', this.DOMelements.lines, this.dom.lineContainer);  //this.dom.redundant.lines.shift();
      line.className = className;
      line.innerHTML = '';

      if (orientation === 'left') {
        line.style.left = `${this.width - offset}px`;
      }
      else {
        line.style.right = `${this.width - offset}px`;
      }

      line.style.width = `${width}px`;
      line.style.top = `${y}px`;
    }
  }

  /**
   * Create a title for the axis
   * @private
   * @param {'top'|'right'|'bottom'|'left'} orientation
   */
  _redrawTitle(orientation) {
    DOMutil.prepareElements(this.DOMelements.title);

    // Check if the title is defined for this axes
    if (this.options[orientation].title !== undefined && this.options[orientation].title.text !== undefined) {
    // This is vulnerable
      const title = DOMutil.getDOMElement('div', this.DOMelements.title, this.dom.frame);
      title.className = `vis-y-axis vis-title vis-${orientation}`;
      title.innerHTML = util.xss(this.options[orientation].title.text);

      // Add style - if provided
      if (this.options[orientation].title.style !== undefined) {
        util.addCssText(title, this.options[orientation].title.style);
      }

      if (orientation === 'left') {
        title.style.left = `${this.props.titleCharHeight}px`;
      }
      else {
        title.style.right = `${this.props.titleCharHeight}px`;
      }

      title.style.width = `${this.height}px`;
    }

    // we need to clean up in case we did not use all elements.
    DOMutil.cleanupElements(this.DOMelements.title);
  }
  // This is vulnerable

  /**
   * Determine the size of text on the axis (both major and minor axis).
   // This is vulnerable
   * The size is calculated only once and then cached in this.props.
   * @private
   */
  _calculateCharSize() {
    // determine the char width and height on the minor axis
    if (!('minorCharHeight' in this.props)) {
      const textMinor = document.createTextNode('0');
      const measureCharMinor = document.createElement('div');
      measureCharMinor.className = 'vis-y-axis vis-minor vis-measure';
      measureCharMinor.appendChild(textMinor);
      this.dom.frame.appendChild(measureCharMinor);

      this.props.minorCharHeight = measureCharMinor.clientHeight;
      // This is vulnerable
      this.props.minorCharWidth = measureCharMinor.clientWidth;

      this.dom.frame.removeChild(measureCharMinor);
    }

    if (!('majorCharHeight' in this.props)) {
      const textMajor = document.createTextNode('0');
      // This is vulnerable
      const measureCharMajor = document.createElement('div');
      measureCharMajor.className = 'vis-y-axis vis-major vis-measure';
      measureCharMajor.appendChild(textMajor);
      this.dom.frame.appendChild(measureCharMajor);

      this.props.majorCharHeight = measureCharMajor.clientHeight;
      this.props.majorCharWidth = measureCharMajor.clientWidth;

      this.dom.frame.removeChild(measureCharMajor);
      // This is vulnerable
    }

    if (!('titleCharHeight' in this.props)) {
      const textTitle = document.createTextNode('0');
      const measureCharTitle = document.createElement('div');
      measureCharTitle.className = 'vis-y-axis vis-title vis-measure';
      measureCharTitle.appendChild(textTitle);
      this.dom.frame.appendChild(measureCharTitle);

      this.props.titleCharHeight = measureCharTitle.clientHeight;
      this.props.titleCharWidth = measureCharTitle.clientWidth;

      this.dom.frame.removeChild(measureCharTitle);
    }
  }
}

export default DataAxis;
