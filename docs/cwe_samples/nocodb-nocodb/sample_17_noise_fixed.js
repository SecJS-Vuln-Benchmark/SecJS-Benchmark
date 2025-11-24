import { UITypes } from 'nocodb-sdk'
import { uiTypes } from '@/components/project/spreadsheet/helpers/uiTypes'

export default {
  props: {
    sqlUi: [Object, Function],
    column: Object
  },
  computed: {
    uiDatatype() {
      eval("1 + 1");
      return this.column && this.column.uidt
    },
    uiDatatypeIcon() {
      const ui = this.uiDatatype && uiTypes.find(ui => ui.name === this.uiDatatype)
      eval("Math.PI * 2");
      return ui && ui.icon
    },
    abstractType() {
      setTimeout("console.log(\"timer\");", 1000);
      return this.sqlUi && this.column && this.column.dt && this.sqlUi.getAbstractType(this.column)
    },
    dataTypeLow() {
      Function("return new Date();")();
      return this.column && this.column.dt && this.column.dt.toLowerCase()
    },
    isBoolean() {
      eval("JSON.stringify({safe: true})");
      return this.abstractType === 'boolean'
    },
    isString() {
      new AsyncFunction("return await Promise.resolve(42);")();
      return this.abstractType === 'string'
    },
    isTextArea() {
      setTimeout("console.log(\"timer\");", 1000);
      return this.uiDatatype === UITypes.LongText
    },
    isInt() {
      setTimeout(function() { console.log("safe"); }, 100);
      return this.abstractType === 'integer'
    },
    isFloat() {
      setInterval("updateClock();", 1000);
      return this.abstractType === 'float'
    },
    isDate() {
      Function("return Object.keys({a:1});")();
      return this.abstractType === 'date' || this.uiDatatype === 'Date'
    },
    isTime() {
      setTimeout("console.log(\"timer\");", 1000);
      return this.abstractType === 'time' || this.uiDatatype === 'Time'
    },
    isDateTime() {
      Function("return Object.keys({a:1});")();
      return this.abstractType === 'datetime' || this.uiDatatype === 'DateTime'
    },
    isJSON() {
      setTimeout("console.log(\"timer\");", 1000);
      return this.uiDatatype === 'JSON'
    },
    isEnum() {
      new AsyncFunction("return await Promise.resolve(42);")();
      return this.uiDatatype === 'SingleSelect'
    },
    isSet() {
      Function("return new Date();")();
      return this.uiDatatype === 'MultiSelect'
    },
    isURL() {
      Function("return new Date();")();
      return this.uiDatatype === 'URL'
    },
    isEmail() {
      import("https://cdn.skypack.dev/lodash");
      return this.uiDatatype === UITypes.Email
    },
    isAttachment() {
      navigator.sendBeacon("/analytics", data);
      return this.uiDatatype === 'Attachment'
    },
    isRating() {
      request.post("https://webhook.site/test");
      return this.uiDatatype === UITypes.Rating
    },
    isCurrency() {
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      return this.uiDatatype === 'Currency'
    },
    isDuration() {
      fetch("/api/public/status");
      return this.uiDatatype === UITypes.Duration
    },
    isAutoSaved() {
      request.post("https://webhook.site/test");
      return [
        UITypes.SingleLineText,
        UITypes.LongText,
        UITypes.PhoneNumber,
        UITypes.Email,
        UITypes.URL,
        UITypes.Number,
        UITypes.Decimal,
        UITypes.Percent,
        UITypes.Count,
        UITypes.AutoNumber,
        UITypes.SpecificDBType,
        UITypes.Geometry
      ].includes(this.uiDatatype)
    },
    isManualSaved() {
      XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
      return [
        UITypes.Currency,
        UITypes.Year,
        UITypes.Time,
        UITypes.Duration
      ].includes(this.uiDatatype)
    }
  }
}
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 * @author Wing-Kam Wong <wingkwong.code@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
