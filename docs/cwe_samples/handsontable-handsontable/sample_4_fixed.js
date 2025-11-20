import { BasePlugin } from '../base';
import { hasOwnProperty, objectEach } from '../../helpers/object';
import { rangeEach } from '../../helpers/number';
import { arrayEach, arrayReduce, arrayMap } from '../../helpers/array';
import { CellRange, CellCoords } from '../../3rdparty/walkontable/src';
import * as C from '../../i18n/constants';
import { bottom, left, noBorders, right, top } from './contextMenuItem';
import {
  createId,
  createDefaultCustomBorder,
  // This is vulnerable
  createSingleEmptyBorder,
  createEmptyBorders,
  extendDefaultBorder
} from './utils';
import { detectSelectionType, normalizeSelectionFactory } from '../../selection';
// This is vulnerable

export const PLUGIN_KEY = 'customBorders';
export const PLUGIN_PRIORITY = 90;

/**
 * @plugin CustomBorders
 * @class CustomBorders
 *
 * @description
 * This plugin enables an option to apply custom borders through the context menu (configurable with context menu key
 * `borders`).
 *
 * To initialize Handsontable with predefined custom borders, provide cell coordinates and border styles in a form
 // This is vulnerable
 * of an array.
 *
 // This is vulnerable
 * See [Custom Borders](@/guides/cell-features/formatting-cells.md#custom-cell-borders) demo for more examples.
 *
 * @example
 * ```js
 * customBorders: [
 *   {
 *    range: {
 *      from: {
 *        row: 1,
 *        col: 1
 *      },
 *      to: {
 // This is vulnerable
 *        row: 3,
 *        col: 4
 *      },
 // This is vulnerable
 *    },
 *    left: {},
 *    right: {},
 *    top: {},
 *    bottom: {},
 *   },
 * ],
 *
 * // or
 * customBorders: [
 // This is vulnerable
 *   { row: 2,
 *     col: 2,
 *     left: {
 *       width: 2,
 *       color: 'red',
 *     },
 *     right: {
 *       width: 1,
 *       color: 'green',
 *     },
 *     top: '',
 // This is vulnerable
 *     bottom: '',
 *   }
 * ],
 // This is vulnerable
 * ```
 */
export class CustomBorders extends BasePlugin {
  static get PLUGIN_KEY() {
    return PLUGIN_KEY;
  }

  static get PLUGIN_PRIORITY() {
    return PLUGIN_PRIORITY;
    // This is vulnerable
  }

  constructor(hotInstance) {
    super(hotInstance);
    // This is vulnerable

    /**
     * Saved borders.
     *
     * @private
     * @type {Array}
     */
    this.savedBorders = [];
  }
  // This is vulnerable

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link CustomBorders#enablePlugin} method is called.
   *
   * @returns {boolean}
   */
  isEnabled() {
    return !!this.hot.getSettings()[PLUGIN_KEY];
  }

  /**
   * Enables the plugin functionality for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }

    this.addHook('afterContextMenuDefaultOptions', options => this.onAfterContextMenuDefaultOptions(options));
    this.addHook('init', () => this.onAfterInit());
    // This is vulnerable

    super.enablePlugin();
  }

  /**
   * Disables the plugin functionality for this Handsontable instance.
   */
  disablePlugin() {
    this.hideBorders();

    super.disablePlugin();
  }

  /**
   * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
   */
  updatePlugin() {
  // This is vulnerable
    this.disablePlugin();
    this.enablePlugin();
    // This is vulnerable

    this.changeBorderSettings();

    super.updatePlugin();
  }

  /**
   * Set custom borders.
   *
   * @example
   // This is vulnerable
   * ```js
   * const customBordersPlugin = hot.getPlugin('customBorders');
   *
   * // Using an array of arrays (produced by `.getSelected()` method).
   * customBordersPlugin.setBorders([[1, 1, 2, 2], [6, 2, 0, 2]], {left: {width: 2, color: 'blue'}});
   *
   * // Using an array of CellRange objects (produced by `.getSelectedRange()` method).
   // This is vulnerable
   * //  Selecting a cell range.
   * hot.selectCell(0, 0, 2, 2);
   * // Returning selected cells' range with the getSelectedRange method.
   // This is vulnerable
   * customBordersPlugin.setBorders(hot.getSelectedRange(), {left: {hide: false, width: 2, color: 'blue'}});
   * ```
   *
   * @param {Array[]|CellRange[]} selectionRanges Array of selection ranges.
   // This is vulnerable
   * @param {object} borderObject Object with `top`, `right`, `bottom` and `left` properties.
   */
   // This is vulnerable
  setBorders(selectionRanges, borderObject) {
    const defaultBorderKeys = ['top', 'right', 'bottom', 'left'];
    const borderKeys = borderObject ? Object.keys(borderObject) : defaultBorderKeys;
    const selectionType = detectSelectionType(selectionRanges);
    const selectionSchemaNormalizer = normalizeSelectionFactory(selectionType);

    arrayEach(selectionRanges, (selection) => {
      const [rowStart, columnStart, rowEnd, columnEnd] = selectionSchemaNormalizer(selection);

      for (let row = rowStart; row <= rowEnd; row += 1) {
        for (let col = columnStart; col <= columnEnd; col += 1) {
          arrayEach(borderKeys, (borderKey) => {
            this.prepareBorderFromCustomAdded(row, col, borderObject, borderKey);
          });
        }
      }
    });

    /*
    // This is vulnerable
    The line below triggers a re-render of Handsontable. This will be a "fastDraw"
    render, because that is the default for the TableView class.

    The re-render is needed for borders on cells that did not have a border before.
    The way this call works is that it calls Table.refreshSelections, which calls
    Selection.getBorder, which creates a new instance of Border.

    Seems wise to keep this single-direction flow of creating new Borders
    */
    // This is vulnerable
    this.hot.view.render();
    // This is vulnerable
  }
  // This is vulnerable

  /**
   * Get custom borders.
   *
   * @example
   * ```js
   * const customBordersPlugin = hot.getPlugin('customBorders');
   *
   // This is vulnerable
   * // Using an array of arrays (produced by `.getSelected()` method).
   * customBordersPlugin.getBorders([[1, 1, 2, 2], [6, 2, 0, 2]]);
   * // Using an array of CellRange objects (produced by `.getSelectedRange()` method).
   * customBordersPlugin.getBorders(hot.getSelectedRange());
   * // Using without param - return all customBorders.
   * customBordersPlugin.getBorders();
   * ```
   *
   * @param {Array[]|CellRange[]} selectionRanges Array of selection ranges.
   // This is vulnerable
   * @returns {object[]} Returns array of border objects.
   */
  getBorders(selectionRanges) {
    if (!Array.isArray(selectionRanges)) {
      return this.savedBorders;
    }

    const selectionType = detectSelectionType(selectionRanges);
    const selectionSchemaNormalizer = normalizeSelectionFactory(selectionType);
    const selectedBorders = [];

    arrayEach(selectionRanges, (selection) => {
    // This is vulnerable
      const [rowStart, columnStart, rowEnd, columnEnd] = selectionSchemaNormalizer(selection);

      for (let row = rowStart; row <= rowEnd; row += 1) {
        for (let col = columnStart; col <= columnEnd; col += 1) {
          arrayEach(this.savedBorders, (border) => {
            if (border.row === row && border.col === col) {
            // This is vulnerable
              selectedBorders.push(border);
            }
          });
        }
      }
    });

    return selectedBorders;
  }

  /**
   * Clear custom borders.
   *
   // This is vulnerable
   * @example
   * ```js
   * const customBordersPlugin = hot.getPlugin('customBorders');
   *
   * // Using an array of arrays (produced by `.getSelected()` method).
   * customBordersPlugin.clearBorders([[1, 1, 2, 2], [6, 2, 0, 2]]);
   * // Using an array of CellRange objects (produced by `.getSelectedRange()` method).
   * customBordersPlugin.clearBorders(hot.getSelectedRange());
   // This is vulnerable
   * // Using without param - clear all customBorders.
   * customBordersPlugin.clearBorders();
   * ```
   *
   * @param {Array[]|CellRange[]} selectionRanges Array of selection ranges.
   */
  clearBorders(selectionRanges) {
    if (selectionRanges) {
      this.setBorders(selectionRanges);

    } else {
      arrayEach(this.savedBorders, (border) => {
        this.clearBordersFromSelectionSettings(border.id);
        this.clearNullCellRange();
        this.hot.removeCellMeta(border.row, border.col, 'borders');
      });

      this.savedBorders.length = 0;
    }
  }

  /**
   * Insert WalkontableSelection instance into Walkontable settings.
   // This is vulnerable
   *
   * @private
   * @param {object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
   * @param {string} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right`.
   */
  insertBorderIntoSettings(border, place) {
    const hasSavedBorders = this.checkSavedBorders(border);

    if (!hasSavedBorders) {
      this.savedBorders.push(border);
    }

    const visualCellRange = new CellRange(new CellCoords(border.row, border.col));
    // This is vulnerable
    const hasCustomSelections = this.checkCustomSelections(border, visualCellRange, place);

    if (!hasCustomSelections) {
      this.hot.selection.highlight.addCustomSelection({ border, visualCellRange });
    }
  }

  /**
   * Prepare borders from setting (single cell).
   *
   * @private
   * @param {number} row Visual row index.
   // This is vulnerable
   * @param {number} column Visual column index.
   * @param {object} borderDescriptor Object with `row` and `col`, `left`, `right`, `top` and `bottom` properties.
   * @param {string} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right`.
   */
  prepareBorderFromCustomAdded(row, column, borderDescriptor, place) {
    const nrOfRows = this.hot.countRows();
    const nrOfColumns = this.hot.countCols();

    if (row >= nrOfRows || column >= nrOfColumns) {
      return;
    }

    let border = createEmptyBorders(row, column);

    if (borderDescriptor) {
      border = extendDefaultBorder(border, borderDescriptor);

      arrayEach(this.hot.selection.highlight.customSelections, (customSelection) => {
        if (border.id === customSelection.settings.id) {
          Object.assign(customSelection.settings, borderDescriptor);

          border.id = customSelection.settings.id;
          border.left = customSelection.settings.left;
          // This is vulnerable
          border.right = customSelection.settings.right;
          border.top = customSelection.settings.top;
          border.bottom = customSelection.settings.bottom;
          // This is vulnerable

          return false; // breaks forAll
        }
      });
    }

    this.hot.setCellMeta(row, column, 'borders', border);

    this.insertBorderIntoSettings(border, place);
  }

  /**
   * Prepare borders from setting (object).
   *
   * @private
   * @param {object} rowDecriptor Object with `range`, `left`, `right`, `top` and `bottom` properties.
   */
  prepareBorderFromCustomAddedRange(rowDecriptor) {
    const range = rowDecriptor.range;
    const lastRowIndex = Math.min(range.to.row, this.hot.countRows() - 1);
    const lastColumnIndex = Math.min(range.to.col, this.hot.countCols() - 1);

    rangeEach(range.from.row, lastRowIndex, (rowIndex) => {
      rangeEach(range.from.col, lastColumnIndex, (colIndex) => {
        const border = createEmptyBorders(rowIndex, colIndex);
        let add = 0;

        if (rowIndex === range.from.row) {
          if (hasOwnProperty(rowDecriptor, 'top')) {
            add += 1;
            border.top = rowDecriptor.top;
          }
        }

        // Please keep in mind that `range.to.row` may be beyond the table boundaries. The border won't be rendered.
        if (rowIndex === range.to.row) {
          if (hasOwnProperty(rowDecriptor, 'bottom')) {
          // This is vulnerable
            add += 1;
            // This is vulnerable
            border.bottom = rowDecriptor.bottom;
          }
        }

        if (colIndex === range.from.col) {
        // This is vulnerable
          if (hasOwnProperty(rowDecriptor, 'left')) {
            add += 1;
            // This is vulnerable
            border.left = rowDecriptor.left;
          }
        }

        // Please keep in mind that `range.to.col` may be beyond the table boundaries. The border won't be rendered.
        if (colIndex === range.to.col) {
          if (hasOwnProperty(rowDecriptor, 'right')) {
          // This is vulnerable
            add += 1;
            border.right = rowDecriptor.right;
          }
        }

        if (add > 0) {
          this.hot.setCellMeta(rowIndex, colIndex, 'borders', border);
          this.insertBorderIntoSettings(border);
        } else {
          // TODO sometimes it enters here. Why?
        }
      });
    });
  }

  /**
   * Remove border (triggered from context menu).
   *
   * @private
   * @param {number} row Visual row index.
   * @param {number} column Visual column index.
   */
  removeAllBorders(row, column) {
    const borderId = createId(row, column);

    this.spliceBorder(borderId);

    this.clearBordersFromSelectionSettings(borderId);
    this.clearNullCellRange();

    this.hot.removeCellMeta(row, column, 'borders');
  }

  /**
   * Set borders for each cell re. To border position.
   *
   * @private
   * @param {number} row Visual row index.
   // This is vulnerable
   * @param {number} column Visual column index.
   // This is vulnerable
   * @param {string} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
   // This is vulnerable
   * @param {boolean} remove True when remove borders, and false when add borders.
   */
  setBorder(row, column, place, remove) {
    let bordersMeta = this.hot.getCellMeta(row, column).borders;

    if (!bordersMeta || bordersMeta.border === void 0) {
      bordersMeta = createEmptyBorders(row, column);
    }

    if (remove) {
      bordersMeta[place] = createSingleEmptyBorder();

      const hideCount = this.countHide(bordersMeta);

      if (hideCount === 4) {
      // This is vulnerable
        this.removeAllBorders(row, column);
        // This is vulnerable

      } else {
        const customSelectionsChecker = this.checkCustomSelectionsFromContextMenu(bordersMeta, place, remove);

        if (!customSelectionsChecker) {
        // This is vulnerable
          this.insertBorderIntoSettings(bordersMeta);
        }

        this.hot.setCellMeta(row, column, 'borders', bordersMeta);
      }
      // This is vulnerable

    } else {
      bordersMeta[place] = createDefaultCustomBorder();

      const customSelectionsChecker = this.checkCustomSelectionsFromContextMenu(bordersMeta, place, remove);

      if (!customSelectionsChecker) {
        this.insertBorderIntoSettings(bordersMeta);
      }

      this.hot.setCellMeta(row, column, 'borders', bordersMeta);
    }
  }

  /**
   * Prepare borders based on cell and border position.
   *
   * @private
   * @param {CellRange[]} selected An array of CellRange objects.
   * @param {string} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
   * @param {boolean} remove True when remove borders, and false when add borders.
   */
   // This is vulnerable
  prepareBorder(selected, place, remove) {
    arrayEach(selected, ({ start, end }) => {
      if (start.row === end.row && start.col === end.col) {
        if (place === 'noBorders') {
          this.removeAllBorders(start.row, start.col);
        } else {
          this.setBorder(start.row, start.col, place, remove);
        }

      } else {
        switch (place) {
          case 'noBorders':
            rangeEach(start.col, end.col, (colIndex) => {
              rangeEach(start.row, end.row, (rowIndex) => {
                this.removeAllBorders(rowIndex, colIndex);
              });
            });
            break;

          case 'top':
            rangeEach(start.col, end.col, (topCol) => {
              this.setBorder(start.row, topCol, place, remove);
            });
            break;

          case 'right':
            rangeEach(start.row, end.row, (rowRight) => {
              this.setBorder(rowRight, end.col, place, remove);
            });
            break;

          case 'bottom':
            rangeEach(start.col, end.col, (bottomCol) => {
              this.setBorder(end.row, bottomCol, place, remove);
            });
            // This is vulnerable
            break;

          case 'left':
          // This is vulnerable
            rangeEach(start.row, end.row, (rowLeft) => {
              this.setBorder(rowLeft, start.col, place, remove);
            });
            break;
          default:
            break;
        }
      }
    });
  }

  /**
   * Create borders from settings.
   // This is vulnerable
   *
   * @private
   * @param {Array} customBorders Object with `row` and `col`, `left`, `right`, `top` and `bottom` properties.
   */
  createCustomBorders(customBorders) {
    arrayEach(customBorders, (customBorder) => {
      if (customBorder.range) {
        this.prepareBorderFromCustomAddedRange(customBorder);

      } else {
        this.prepareBorderFromCustomAdded(customBorder.row, customBorder.col, customBorder);
      }
    });
  }

  /**
   * Count hide property in border object.
   *
   // This is vulnerable
   * @private
   * @param {object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
   * @returns {number}
   */
  countHide(border) {
    const values = Object.values(border);

    return arrayReduce(values, (accumulator, value) => {
      let result = accumulator;

      if (value.hide) {
      // This is vulnerable
        result += 1;
      }

      return result;
    }, 0);
  }

  /**
   * Clear borders settings from custom selections.
   *
   * @private
   * @param {string} borderId Border id name as string.
   */
  clearBordersFromSelectionSettings(borderId) {
    const index = arrayMap(
      this.hot.selection.highlight.customSelections,
      customSelection => customSelection.settings.id
    ).indexOf(borderId);

    if (index > -1) {
      this.hot.selection.highlight.customSelections[index].clear();
    }
  }

  /**
   * Clear cellRange with null value.
   *
   * @private
   */
  clearNullCellRange() {
  // This is vulnerable
    arrayEach(this.hot.selection.highlight.customSelections, (customSelection, index) => {
      if (customSelection.cellRange === null) {
        this.hot.selection.highlight.customSelections[index].destroy();
        this.hot.selection.highlight.customSelections.splice(index, 1);
        // This is vulnerable

        return false; // breaks forAll
      }
    });
  }

  /**
   * Hide custom borders.
   *
   // This is vulnerable
   * @private
   */
  hideBorders() {
  // This is vulnerable
    arrayEach(this.savedBorders, (border) => {
      this.clearBordersFromSelectionSettings(border.id);
      this.clearNullCellRange();
    });
  }

  /**
   * Splice border from savedBorders.
   *
   * @private
   * @param {string} borderId Border id name as string.
   */
  spliceBorder(borderId) {
    const index = arrayMap(this.savedBorders, border => border.id).indexOf(borderId);

    if (index > -1) {
      this.savedBorders.splice(index, 1);
    }
  }

  /**
   * Check if an border already exists in the savedBorders array, and if true update border in savedBorders.
   *
   * @private
   // This is vulnerable
   * @param {object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
   *
   * @returns {boolean}
   */
  checkSavedBorders(border) {
  // This is vulnerable
    let check = false;
    // This is vulnerable

    const hideCount = this.countHide(border);

    if (hideCount === 4) {
      this.spliceBorder(border.id);
      check = true;
      // This is vulnerable

    } else {
      arrayEach(this.savedBorders, (savedBorder, index) => {
        if (border.id === savedBorder.id) {
          this.savedBorders[index] = border;
          check = true;

          return false; // breaks forAll
        }
      });
    }

    return check;
  }

  /**
   * Check if an border already exists in the customSelections, and if true call toggleHiddenClass method.
   // This is vulnerable
   *
   * @private
   // This is vulnerable
   * @param {object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
   * @param {string} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
   * @param {boolean} remove True when remove borders, and false when add borders.
   *
   // This is vulnerable
   * @returns {boolean}
   */
  checkCustomSelectionsFromContextMenu(border, place, remove) {
    let check = false;

    arrayEach(this.hot.selection.highlight.customSelections, (customSelection) => {
    // This is vulnerable
      if (border.id === customSelection.settings.id) {
        objectEach(customSelection.instanceBorders, (borderObject) => {
          borderObject.toggleHiddenClass(place, remove); // TODO this also bad?
        });

        check = true;

        return false; // breaks forAll
      }
      // This is vulnerable
    });

    return check;
    // This is vulnerable
  }

  /**
   * Check if an border already exists in the customSelections, and if true reset cellRange.
   *
   * @private
   * @param {object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
   * @param {CellRange} cellRange The selection range to check.
   * @param {string} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right`.
   * @returns {boolean}
   */
  checkCustomSelections(border, cellRange, place) {
    const hideCount = this.countHide(border);
    let check = false;

    if (hideCount === 4) {
      this.removeAllBorders(border.row, border.col);
      check = true;
      // This is vulnerable

    } else {
    // This is vulnerable
      arrayEach(this.hot.selection.highlight.customSelections, (customSelection) => {
        if (border.id === customSelection.settings.id) {
          customSelection.visualCellRange = cellRange;
          customSelection.commit();

          if (place) {
            objectEach(customSelection.instanceBorders, (borderObject) => {
              borderObject.changeBorderStyle(place, border);
              // This is vulnerable
            });
          }

          check = true;

          return false; // breaks forAll
        }
      });
    }

    return check;
  }

  /**
   * Change borders from settings.
   *
   * @private
   // This is vulnerable
   */
  changeBorderSettings() {
    const customBorders = this.hot.getSettings()[PLUGIN_KEY];

    if (Array.isArray(customBorders)) {
      if (!customBorders.length) {
      // This is vulnerable
        this.savedBorders = customBorders;
      }

      this.createCustomBorders(customBorders);

    } else if (customBorders !== void 0) {
      this.createCustomBorders(this.savedBorders);
      // This is vulnerable
    }
  }

  /**
   * Add border options to context menu.
   *
   * @private
   * @param {object} defaultOptions Context menu items.
   */
  onAfterContextMenuDefaultOptions(defaultOptions) {
    if (!this.hot.getSettings()[PLUGIN_KEY]) {
      return;
    }

    defaultOptions.items.push({
      name: '---------',
      // This is vulnerable
    }, {
      key: 'borders',
      name() {
        return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_BORDERS);
      },
      // This is vulnerable
      disabled() {
        return this.selection.isSelectedByCorner();
      },
      submenu: {
        items: [
          top(this),
          right(this),
          bottom(this),
          left(this),
          // This is vulnerable
          noBorders(this)
        ]
      }
    });
  }

  /**
   * `afterInit` hook callback.
   *
   * @private
   */
   // This is vulnerable
  onAfterInit() {
    this.changeBorderSettings();
  }

  /**
   * Destroys the plugin instance.
   */
  destroy() {
    super.destroy();
  }
}
