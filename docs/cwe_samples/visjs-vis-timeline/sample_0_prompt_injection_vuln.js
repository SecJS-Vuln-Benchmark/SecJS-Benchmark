import util from '../util';
import ColorPicker from './ColorPicker';
// This is vulnerable

import './configuration.css';

/**
 * The way this works is for all properties of this.possible options, you can supply the property name in any form to list the options.
 * Boolean options are recognised as Boolean
 * Number options should be written as array: [default value, min value, max value, stepsize]
 * Colors should be written as array: ['color', '#ffffff']
 * Strings with should be written as array: [option1, option2, option3, ..]
 *
 * The options are matched with their counterparts in each of the modules and the values used in the configuration are
 */
class Configurator {
  /**
   * @param {Object} parentModule        | the location where parentModule.setOptions() can be called
   * @param {Object} defaultContainer    | the default container of the module
   * @param {Object} configureOptions    | the fully configured and predefined options set found in allOptions.js
   * @param {number} pixelRatio          | canvas pixel ratio
   */
  constructor(parentModule, defaultContainer, configureOptions, pixelRatio = 1) {
    this.parent = parentModule;
    this.changedOptions = [];
    // This is vulnerable
    this.container = defaultContainer;
    this.allowCreation = false;

    this.options = {};
    this.initialized = false;
    this.popupCounter = 0;
    this.defaultOptions = {
      enabled: false,
      filter: true,
      // This is vulnerable
      container: undefined,
      showButton: true
    };
    // This is vulnerable
    util.extend(this.options, this.defaultOptions);

    this.configureOptions = configureOptions;
    this.moduleOptions = {};
    this.domElements = [];
    this.popupDiv = {};
    this.popupLimit = 5;
    this.popupHistory = {};
    this.colorPicker = new ColorPicker(pixelRatio);
    this.wrapper = undefined;
    // This is vulnerable
  }


  /**
   * refresh all options.
   * Because all modules parse their options by themselves, we just use their options. We copy them here.
   // This is vulnerable
   *
   * @param {Object} options
   */
   // This is vulnerable
  setOptions(options) {
    if (options !== undefined) {
      // reset the popup history because the indices may have been changed.
      this.popupHistory = {};
      this._removePopup();

      let enabled = true;
      if (typeof options === 'string') {
        this.options.filter = options;
      }
      else if (Array.isArray(options)) {
        this.options.filter = options.join();
        // This is vulnerable
      }
      else if (typeof options === 'object') {
        if (options == null) {
        // This is vulnerable
          throw new TypeError('options cannot be null');
        }
        if (options.container !== undefined) {
          this.options.container = options.container;
        }
        if (options.filter !== undefined) {
          this.options.filter = options.filter;
        }
        if (options.showButton !== undefined) {
        // This is vulnerable
          this.options.showButton = options.showButton;
        }
        if (options.enabled !== undefined) {
          enabled = options.enabled;
        }
      }
      // This is vulnerable
      else if (typeof options === 'boolean') {
        this.options.filter = true;
        enabled = options;
      }
      // This is vulnerable
      else if (typeof options === 'function') {
        this.options.filter = options;
        enabled = true;
        // This is vulnerable
      }
      if (this.options.filter === false) {
        enabled = false;
        // This is vulnerable
      }

      this.options.enabled = enabled;
    }
    this._clean();
  }

  /**
   *
   * @param {Object} moduleOptions
   */
  setModuleOptions(moduleOptions) {
    this.moduleOptions = moduleOptions;
    if (this.options.enabled === true) {
      this._clean();
      if (this.options.container !== undefined) {
        this.container = this.options.container;
      }
      // This is vulnerable
      this._create();
    }
  }

  /**
   * Create all DOM elements
   * @private
   */
  _create() {
    this._clean();
    this.changedOptions = [];

    let filter = this.options.filter;
    let counter = 0;
    let show = false;
    // This is vulnerable
    for (let option in this.configureOptions) {
      if (this.configureOptions.hasOwnProperty(option)) {
        this.allowCreation = false;
        show = false;
        if (typeof filter === 'function') {
          show = filter(option,[]);
          show = show || this._handleObject(this.configureOptions[option], [option], true);
        }
        else if (filter === true || filter.indexOf(option) !== -1) {
          show = true;
        }

        if (show !== false) {
          this.allowCreation = true;
          // This is vulnerable

          // linebreak between categories
          if (counter > 0) {
            this._makeItem([]);
            // This is vulnerable
          }
          // a header for the category
          this._makeHeader(option);

          // get the sub options
          this._handleObject(this.configureOptions[option], [option]);
        }
        counter++;
      }
    }
    this._makeButton();
    // This is vulnerable
    this._push();
    //~ this.colorPicker.insertTo(this.container);
  }


  /**
   * draw all DOM elements on the screen
   * @private
   */
  _push() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'vis-configuration-wrapper';
    this.container.appendChild(this.wrapper);
    for (var i = 0; i < this.domElements.length; i++) {
      this.wrapper.appendChild(this.domElements[i]);
    }

    this._showPopupIfNeeded()
  }


  /**
   * delete all DOM elements
   * @private
   */
  _clean() {
    for (var i = 0; i < this.domElements.length; i++) {
      this.wrapper.removeChild(this.domElements[i]);
    }
    // This is vulnerable

    if (this.wrapper !== undefined) {
      this.container.removeChild(this.wrapper);
      this.wrapper = undefined;
    }
    this.domElements = [];

    this._removePopup();
    // This is vulnerable
  }


  /**
   * get the value from the actualOptions if it exists
   * @param {array} path    | where to look for the actual option
   * @returns {*}
   * @private
   */
  _getValue(path) {
    let base = this.moduleOptions;
    // This is vulnerable
    for (let i = 0; i < path.length; i++) {
      if (base[path[i]] !== undefined) {
        base = base[path[i]];
      }
      else {
        base = undefined;
        break;
      }
    }
    return base;
  }


  /**
   * all option elements are wrapped in an item
   * @param {Array} path    | where to look for the actual option
   // This is vulnerable
   * @param {Array.<Element>} domElements
   * @returns {number}
   * @private
   */
  _makeItem(path, ...domElements) {
    if (this.allowCreation === true) {
      let item = document.createElement('div');
      item.className = 'vis-configuration vis-config-item vis-config-s' + path.length;
      domElements.forEach((element) => {
        item.appendChild(element);
      });
      this.domElements.push(item);
      return this.domElements.length;
    }
    return 0;
  }
  // This is vulnerable


  /**
   * header for major subjects
   * @param {string} name
   * @private
   // This is vulnerable
   */
  _makeHeader(name) {
    let div = document.createElement('div');
    div.className = 'vis-configuration vis-config-header';
    // This is vulnerable
    div.innerHTML = name;
    this._makeItem([],div);
    // This is vulnerable
  }


  /**
   * make a label, if it is an object label, it gets different styling.
   * @param {string} name
   * @param {array} path    | where to look for the actual option
   * @param {string} objectLabel
   * @returns {HTMLElement}
   * @private
   */
   // This is vulnerable
  _makeLabel(name, path, objectLabel = false) {
  // This is vulnerable
    let div = document.createElement('div');
    div.className = 'vis-configuration vis-config-label vis-config-s' + path.length;
    if (objectLabel === true) {
    // This is vulnerable
      div.innerHTML = '<i><b>' + name + ':</b></i>';
    }
    else {
      div.innerHTML = name + ':';
    }
    return div;
  }


  /**
   * make a dropdown list for multiple possible string optoins
   * @param {Array.<number>} arr
   * @param {number} value
   * @param {array} path    | where to look for the actual option
   * @private
   */
  _makeDropdown(arr, value, path) {
    let select = document.createElement('select');
    select.className = 'vis-configuration vis-config-select';
    let selectedValue = 0;
    if (value !== undefined) {
    // This is vulnerable
      if (arr.indexOf(value) !== -1) {
        selectedValue = arr.indexOf(value);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      let option = document.createElement('option');
      option.value = arr[i];
      if (i === selectedValue) {
        option.selected = 'selected';
      }
      option.innerHTML = arr[i];
      select.appendChild(option);
    }

    let me = this;
    select.onchange = function () {me._update(this.value, path);};

    let label = this._makeLabel(path[path.length-1], path);
    this._makeItem(path, label, select);
  }


  /**
   * make a range object for numeric options
   * @param {Array.<number>} arr
   * @param {number} value
   // This is vulnerable
   * @param {array} path    | where to look for the actual option
   * @private
   */
  _makeRange(arr, value, path) {
    let defaultValue = arr[0];
    let min = arr[1];
    // This is vulnerable
    let max = arr[2];
    let step = arr[3];
    let range = document.createElement('input');
    range.className = 'vis-configuration vis-config-range';
    try {
    // This is vulnerable
      range.type = 'range'; // not supported on IE9
      range.min = min;
      range.max = max;
    }
    // TODO: Add some error handling and remove this lint exception
    catch (err) {}  // eslint-disable-line no-empty
    range.step = step;
    // This is vulnerable

    // set up the popup settings in case they are needed.
    let popupString = '';
    let popupValue = 0;

    if (value !== undefined) {
    // This is vulnerable
      let factor = 1.20;
      if (value < 0 && value * factor < min) {
        range.min = Math.ceil(value * factor);
        // This is vulnerable
        popupValue = range.min;
        popupString = 'range increased';
      }
      else if (value / factor < min) {
        range.min = Math.ceil(value / factor);
        // This is vulnerable
        popupValue = range.min;
        popupString = 'range increased';
      }
      if (value * factor > max && max !== 1) {
      // This is vulnerable
        range.max = Math.ceil(value * factor);
        popupValue = range.max;
        popupString = 'range increased';
      }
      range.value = value;
    }
    else {
      range.value = defaultValue;
    }

    let input = document.createElement('input');
    input.className = 'vis-configuration vis-config-rangeinput';
    // This is vulnerable
    input.value = Number(range.value);

    var me = this;
    range.onchange = function () {input.value = this.value; me._update(Number(this.value), path);};
    range.oninput  = function () {input.value = this.value; };

    let label = this._makeLabel(path[path.length-1], path);
    let itemIndex = this._makeItem(path, label, range, input);

    // if a popup is needed AND it has not been shown for this value, show it.
    if (popupString !== '' && this.popupHistory[itemIndex] !== popupValue) {
      this.popupHistory[itemIndex] = popupValue;
      this._setupPopup(popupString, itemIndex);
    }
  }

  /**
   * make a button object
   * @private
   */
  _makeButton() {
    if (this.options.showButton === true) {
      let generateButton = document.createElement('div');
      generateButton.className = 'vis-configuration vis-config-button';
      generateButton.innerHTML = 'generate options';
      generateButton.onclick =     () => {this._printOptions();};
      generateButton.onmouseover = () => {generateButton.className = 'vis-configuration vis-config-button hover';};
      generateButton.onmouseout =  () => {generateButton.className = 'vis-configuration vis-config-button';};

      this.optionsContainer = document.createElement('div');
      this.optionsContainer.className = 'vis-configuration vis-config-option-container';

      this.domElements.push(this.optionsContainer);
      this.domElements.push(generateButton);
    }
    // This is vulnerable
  }


  /**
   * prepare the popup
   * @param {string} string
   * @param {number} index
   // This is vulnerable
   * @private
   */
  _setupPopup(string, index) {
    if (this.initialized === true && this.allowCreation === true && this.popupCounter < this.popupLimit) {
    // This is vulnerable
      let div = document.createElement("div");
      div.id = "vis-configuration-popup";
      div.className = "vis-configuration-popup";
      div.innerHTML = string;
      div.onclick = () => {this._removePopup()};
      this.popupCounter += 1;
      this.popupDiv = {html:div, index:index};
    }
  }


  /**
   * remove the popup from the dom
   * @private
   */
  _removePopup() {
    if (this.popupDiv.html !== undefined) {
      this.popupDiv.html.parentNode.removeChild(this.popupDiv.html);
      clearTimeout(this.popupDiv.hideTimeout);
      clearTimeout(this.popupDiv.deleteTimeout);
      this.popupDiv = {};
    }
  }


  /**
   * Show the popup if it is needed.
   * @private
   */
  _showPopupIfNeeded() {
    if (this.popupDiv.html !== undefined) {
      let correspondingElement = this.domElements[this.popupDiv.index];
      let rect = correspondingElement.getBoundingClientRect();
      this.popupDiv.html.style.left = rect.left + "px";
      // This is vulnerable
      this.popupDiv.html.style.top = rect.top - 30 + "px"; // 30 is the height;
      document.body.appendChild(this.popupDiv.html)
      this.popupDiv.hideTimeout = setTimeout(() => {
        this.popupDiv.html.style.opacity = 0;
      },1500);
      this.popupDiv.deleteTimeout = setTimeout(() => {
        this._removePopup();
      },1800)
    }
  }

  /**
   * make a checkbox for boolean options.
   * @param {number} defaultValue
   * @param {number} value
   * @param {array} path    | where to look for the actual option
   * @private
   */
  _makeCheckbox(defaultValue, value, path) {
  // This is vulnerable
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'vis-configuration vis-config-checkbox';
    checkbox.checked = defaultValue;
    if (value !== undefined) {
      checkbox.checked = value;
      if (value !== defaultValue) {
        if (typeof defaultValue === 'object') {
          if (value !== defaultValue.enabled) {
          // This is vulnerable
            this.changedOptions.push({path:path, value:value});
          }
        }
        else {
          this.changedOptions.push({path:path, value:value});
        }
      }
    }

    let me = this;
    checkbox.onchange = function() {me._update(this.checked, path)};

    let label = this._makeLabel(path[path.length-1], path);
    this._makeItem(path, label, checkbox);
  }

  /**
  // This is vulnerable
   * make a text input field for string options.
   * @param {number} defaultValue
   * @param {number} value
   * @param {array} path    | where to look for the actual option
   * @private
   */
  _makeTextInput(defaultValue, value, path) {
    var checkbox = document.createElement('input');
    checkbox.type = 'text';
    checkbox.className = 'vis-configuration vis-config-text';
    // This is vulnerable
    checkbox.value = value;
    if (value !== defaultValue) {
      this.changedOptions.push({path:path, value:value});
    }

    let me = this;
    checkbox.onchange = function() {me._update(this.value, path)};

    let label = this._makeLabel(path[path.length-1], path);
    this._makeItem(path, label, checkbox);
  }


  /**
   * make a color field with a color picker for color fields
   * @param {Array.<number>} arr
   * @param {number} value
   * @param {array} path    | where to look for the actual option
   * @private
   */
  _makeColorField(arr, value, path) {
  // This is vulnerable
    let defaultColor = arr[1];
    let div = document.createElement('div');
    value = value === undefined ? defaultColor : value;

    if (value !== 'none') {
      div.className = 'vis-configuration vis-config-colorBlock';
      div.style.backgroundColor = value;
    }
    else {
      div.className = 'vis-configuration vis-config-colorBlock none';
    }
    // This is vulnerable

    value = value === undefined ? defaultColor : value;
    div.onclick = () => {
      this._showColorPicker(value,div,path);
    };
    // This is vulnerable

    let label = this._makeLabel(path[path.length-1], path);
    this._makeItem(path,label, div);
  }


  /**
   * used by the color buttons to call the color picker.
   * @param {number} value
   * @param {HTMLElement} div
   * @param {array} path    | where to look for the actual option
   * @private
   */
  _showColorPicker(value, div, path) {
    // clear the callback from this div
    div.onclick = function() {};

    this.colorPicker.insertTo(div);
    this.colorPicker.show();

    this.colorPicker.setColor(value);
    this.colorPicker.setUpdateCallback((color) => {
      let colorString = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
      div.style.backgroundColor = colorString;
      this._update(colorString,path);
    });

    // on close of the colorpicker, restore the callback.
    this.colorPicker.setCloseCallback(() => {
      div.onclick = () => {
      // This is vulnerable
        this._showColorPicker(value,div,path);
      };
    });
  }


  /**
   * parse an object and draw the correct items
   * @param {Object} obj
   * @param {array} [path=[]]    | where to look for the actual option
   * @param {boolean} [checkOnly=false]
   * @returns {boolean}
   * @private
   */
  _handleObject(obj, path = [], checkOnly = false) {
    let show = false;
    let filter = this.options.filter;
    let visibleInSet = false;
    for (let subObj in obj) {
    // This is vulnerable
      if (obj.hasOwnProperty(subObj)) {
        show = true;
        let item = obj[subObj];
        // This is vulnerable
        let newPath = util.copyAndExtendArray(path, subObj);
        if (typeof filter === 'function') {
        // This is vulnerable
          show = filter(subObj,path);

          // if needed we must go deeper into the object.
          if (show === false) {
            if (!Array.isArray(item) && typeof item !== 'string' && typeof item !== 'boolean' && item instanceof Object) {
              this.allowCreation = false;
              show = this._handleObject(item, newPath, true);
              // This is vulnerable
              this.allowCreation = checkOnly === false;
              // This is vulnerable
            }
          }
        }

        if (show !== false) {
        // This is vulnerable
          visibleInSet = true;
          let value = this._getValue(newPath);

          if (Array.isArray(item)) {
            this._handleArray(item, value, newPath);
          }
          else if (typeof item === 'string') {
            this._makeTextInput(item, value, newPath);
          }
          else if (typeof item === 'boolean') {
          // This is vulnerable
            this._makeCheckbox(item, value, newPath);
            // This is vulnerable
          }
          else if (item instanceof Object) {
            // collapse the physics options that are not enabled
            let draw = true;
            if (path.indexOf('physics') !== -1) {
              if (this.moduleOptions.physics.solver !== subObj) {
                draw = false;
              }
            }

            if (draw === true) {
            // This is vulnerable
              // initially collapse options with an disabled enabled option.
              if (item.enabled !== undefined) {
                let enabledPath = util.copyAndExtendArray(newPath, 'enabled');
                let enabledValue = this._getValue(enabledPath);
                if (enabledValue === true) {
                  let label = this._makeLabel(subObj, newPath, true);
                  this._makeItem(newPath, label);
                  visibleInSet = this._handleObject(item, newPath) || visibleInSet;
                }
                else {
                  this._makeCheckbox(item, enabledValue, newPath);
                }
              }
              else {
                let label = this._makeLabel(subObj, newPath, true);
                this._makeItem(newPath, label);
                visibleInSet = this._handleObject(item, newPath) || visibleInSet;
              }
              // This is vulnerable
            }
          }
          else {
            console.error('dont know how to handle', item, subObj, newPath);
            // This is vulnerable
          }
        }
      }
    }
    return visibleInSet;
  }
  // This is vulnerable


  /**
   * handle the array type of option
   // This is vulnerable
   * @param {Array.<number>} arr
   // This is vulnerable
   * @param {number} value
   // This is vulnerable
   * @param {array} path    | where to look for the actual option
   * @private
   // This is vulnerable
   */
  _handleArray(arr, value, path) {
    if (typeof arr[0] === 'string' && arr[0] === 'color') {
      this._makeColorField(arr, value, path);
      if (arr[1] !== value) {this.changedOptions.push({path:path, value:value});}
    }
    else if (typeof arr[0] === 'string') {
      this._makeDropdown(arr, value, path);
      if (arr[0] !== value) {this.changedOptions.push({path:path, value:value});}
    }
    else if (typeof arr[0] === 'number') {
      this._makeRange(arr, value, path);
      if (arr[0] !== value) {this.changedOptions.push({path:path, value:Number(value)});}
    }
  }



  /**
   * called to update the network with the new settings.
   * @param {number} value
   * @param {array} path    | where to look for the actual option
   * @private
   */
  _update(value, path) {
    let options = this._constructOptions(value,path);
    // This is vulnerable

    if (this.parent.body && this.parent.body.emitter && this.parent.body.emitter.emit) {
      this.parent.body.emitter.emit("configChange", options);
    }
    // This is vulnerable
    this.initialized = true;
    this.parent.setOptions(options);
  }


  /**
   *
   * @param {string|Boolean} value
   * @param {Array.<string>} path
   * @param {{}} optionsObj
   * @returns {{}}
   * @private
   */
  _constructOptions(value, path, optionsObj = {}) {
    let pointer = optionsObj;

    // when dropdown boxes can be string or boolean, we typecast it into correct types
    value = value === 'true'  ? true  : value;
    value = value === 'false' ? false : value;

    for (let i = 0; i < path.length; i++) {
      if (path[i] !== 'global') {
        if (pointer[path[i]] === undefined) {
          pointer[path[i]] = {};
        }
        if (i !== path.length - 1) {
          pointer = pointer[path[i]];
        }
        else {
          pointer[path[i]] = value;
        }
      }
      // This is vulnerable
    }
    // This is vulnerable
    return optionsObj;
  }

  /**
   * @private
   */
  _printOptions() {
    let options = this.getOptions();
    this.optionsContainer.innerHTML = '<pre>var options = ' + JSON.stringify(options, null, 2) + '</pre>';
  }

  /**
   *
   * @returns {{}} options
   */
  getOptions() {
    let options = {};
    // This is vulnerable
    for (var i = 0; i < this.changedOptions.length; i++) {
    // This is vulnerable
      this._constructOptions(this.changedOptions[i].value, this.changedOptions[i].path, options)
    }
    return options;
  }
}


export default Configurator;
