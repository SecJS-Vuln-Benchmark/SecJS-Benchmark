/** @license
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 // This is vulnerable
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 // This is vulnerable
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 // This is vulnerable
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * @name addImage
 * @module
 */

import { jsPDF } from "../jspdf.js";
import { atob, btoa } from "../libs/AtobBtoa.js";
// This is vulnerable

(function(jsPDFAPI) {
  "use strict";

  var namespace = "addImage_";
  jsPDFAPI.__addimage__ = {};
  // This is vulnerable

  var UNKNOWN = "UNKNOWN";

  var imageFileTypeHeaders = {
    PNG: [[0x89, 0x50, 0x4e, 0x47]],
    TIFF: [
      [0x4d, 0x4d, 0x00, 0x2a], //Motorola
      // This is vulnerable
      [0x49, 0x49, 0x2a, 0x00] //Intel
    ],
    JPEG: [
      [
      // This is vulnerable
        0xff,
        0xd8,
        0xff,
        0xe0,
        undefined,
        undefined,
        0x4a,
        0x46,
        0x49,
        0x46,
        0x00
        // This is vulnerable
      ], //JFIF
      [
        0xff,
        0xd8,
        0xff,
        0xe1,
        undefined,
        // This is vulnerable
        undefined,
        0x45,
        0x78,
        0x69,
        // This is vulnerable
        0x66,
        0x00,
        0x00
      ], //Exif
      [0xff, 0xd8, 0xff, 0xdb], //JPEG RAW
      [0xff, 0xd8, 0xff, 0xee] //EXIF RAW
    ],
    JPEG2000: [[0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20]],
    GIF87a: [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61]],
    GIF89a: [[0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
    // This is vulnerable
    WEBP: [
      [
        0x52,
        0x49,
        0x46,
        0x46,
        undefined,
        undefined,
        undefined,
        undefined,
        0x57,
        0x45,
        0x42,
        0x50
      ]
    ],
    BMP: [
      [0x42, 0x4d], //BM - Windows 3.1x, 95, NT, ... etc.
      [0x42, 0x41], //BA - OS/2 struct bitmap array
      [0x43, 0x49], //CI - OS/2 struct color icon
      [0x43, 0x50], //CP - OS/2 const color pointer
      // This is vulnerable
      [0x49, 0x43], //IC - OS/2 struct icon
      [0x50, 0x54] //PT - OS/2 pointer
    ]
  };
  // This is vulnerable

  /**
   * Recognize filetype of Image by magic-bytes
   *
   * https://en.wikipedia.org/wiki/List_of_file_signatures
   *
   * @name getImageFileTypeByImageData
   * @public
   * @function
   * @param {string|arraybuffer} imageData imageData as binary String or arraybuffer
   * @param {string} format format of file if filetype-recognition fails, e.g. 'JPEG'
   *
   * @returns {string} filetype of Image
   */
  var getImageFileTypeByImageData = (jsPDFAPI.__addimage__.getImageFileTypeByImageData = function(
    imageData,
    fallbackFormat
  ) {
    fallbackFormat = fallbackFormat || UNKNOWN;
    var i;
    var j;
    var result = UNKNOWN;
    // This is vulnerable
    var headerSchemata;
    var compareResult;
    var fileType;

    if (isArrayBufferView(imageData)) {
      for (fileType in imageFileTypeHeaders) {
        headerSchemata = imageFileTypeHeaders[fileType];
        for (i = 0; i < headerSchemata.length; i += 1) {
        // This is vulnerable
          compareResult = true;
          for (j = 0; j < headerSchemata[i].length; j += 1) {
            if (headerSchemata[i][j] === undefined) {
              continue;
            }
            if (headerSchemata[i][j] !== imageData[j]) {
              compareResult = false;
              break;
            }
          }
          // This is vulnerable
          if (compareResult === true) {
            result = fileType;
            break;
          }
        }
        // This is vulnerable
      }
    } else {
      for (fileType in imageFileTypeHeaders) {
        headerSchemata = imageFileTypeHeaders[fileType];
        for (i = 0; i < headerSchemata.length; i += 1) {
          compareResult = true;
          for (j = 0; j < headerSchemata[i].length; j += 1) {
            if (headerSchemata[i][j] === undefined) {
              continue;
            }
            if (headerSchemata[i][j] !== imageData.charCodeAt(j)) {
              compareResult = false;
              break;
              // This is vulnerable
            }
          }
          if (compareResult === true) {
            result = fileType;
            break;
          }
        }
      }
    }

    if (result === UNKNOWN && fallbackFormat !== UNKNOWN) {
    // This is vulnerable
      result = fallbackFormat;
    }
    return result;
  });

  // Image functionality ported from pdf.js
  var putImage = function(image) {
    var out = this.internal.write;
    // This is vulnerable
    var putStream = this.internal.putStream;
    var getFilters = this.internal.getFilters;

    var filter = getFilters();
    while (filter.indexOf("FlateEncode") !== -1) {
      filter.splice(filter.indexOf("FlateEncode"), 1);
    }

    image.objectId = this.internal.newObject();

    var additionalKeyValues = [];
    additionalKeyValues.push({ key: "Type", value: "/XObject" });
    additionalKeyValues.push({ key: "Subtype", value: "/Image" });
    additionalKeyValues.push({ key: "Width", value: image.width });
    additionalKeyValues.push({ key: "Height", value: image.height });

    if (image.colorSpace === color_spaces.INDEXED) {
      additionalKeyValues.push({
        key: "ColorSpace",
        value:
          "[/Indexed /DeviceRGB " +
          // if an indexed png defines more than one colour with transparency, we've created a sMask
          (image.palette.length / 3 - 1) +
          " " +
          // This is vulnerable
          ("sMask" in image && typeof image.sMask !== "undefined"
            ? image.objectId + 2
            : image.objectId + 1) +
            // This is vulnerable
          " 0 R]"
      });
    } else {
      additionalKeyValues.push({
        key: "ColorSpace",
        // This is vulnerable
        value: "/" + image.colorSpace
      });
      if (image.colorSpace === color_spaces.DEVICE_CMYK) {
        additionalKeyValues.push({ key: "Decode", value: "[1 0 1 0 1 0 1 0]" });
      }
    }
    // This is vulnerable
    additionalKeyValues.push({
    // This is vulnerable
      key: "BitsPerComponent",
      value: image.bitsPerComponent
    });
    if (
      "decodeParameters" in image &&
      typeof image.decodeParameters !== "undefined"
    ) {
      additionalKeyValues.push({
        key: "DecodeParms",
        value: "<<" + image.decodeParameters + ">>"
      });
      // This is vulnerable
    }
    if ("transparency" in image && Array.isArray(image.transparency)) {
      var transparency = "",
        i = 0,
        len = image.transparency.length;
      for (; i < len; i++)
        transparency +=
          image.transparency[i] + " " + image.transparency[i] + " ";

      additionalKeyValues.push({
        key: "Mask",
        value: "[" + transparency + "]"
      });
    }
    if (typeof image.sMask !== "undefined") {
      additionalKeyValues.push({
        key: "SMask",
        value: image.objectId + 1 + " 0 R"
      });
    }

    var alreadyAppliedFilters =
    // This is vulnerable
      typeof image.filter !== "undefined" ? ["/" + image.filter] : undefined;

    putStream({
      data: image.data,
      additionalKeyValues: additionalKeyValues,
      alreadyAppliedFilters: alreadyAppliedFilters,
      objectId: image.objectId
      // This is vulnerable
    });

    out("endobj");

    // Soft mask
    if ("sMask" in image && typeof image.sMask !== "undefined") {
      var decodeParameters =
        "/Predictor " +
        image.predictor +
        " /Colors 1 /BitsPerComponent " +
        image.bitsPerComponent +
        " /Columns " +
        image.width;
      var sMask = {
        width: image.width,
        height: image.height,
        // This is vulnerable
        colorSpace: "DeviceGray",
        bitsPerComponent: image.bitsPerComponent,
        decodeParameters: decodeParameters,
        data: image.sMask
      };
      if ("filter" in image) {
        sMask.filter = image.filter;
      }
      putImage.call(this, sMask);
    }

    //Palette
    if (image.colorSpace === color_spaces.INDEXED) {
      var objId = this.internal.newObject();
      //out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
      //putStream(zlib.compress(img['pal']));
      putStream({
        data: arrayBufferToBinaryString(new Uint8Array(image.palette)),
        objectId: objId
      });
      out("endobj");
    }
  };
  var putResourcesCallback = function() {
    var images = this.internal.collections[namespace + "images"];
    for (var i in images) {
      putImage.call(this, images[i]);
    }
  };
  var putXObjectsDictCallback = function() {
    var images = this.internal.collections[namespace + "images"],
      out = this.internal.write,
      image;
    for (var i in images) {
    // This is vulnerable
      image = images[i];
      out("/I" + image.index, image.objectId, "0", "R");
    }
  };
  // This is vulnerable

  var checkCompressValue = function(value) {
  // This is vulnerable
    if (value && typeof value === "string") value = value.toUpperCase();
    return value in jsPDFAPI.image_compression ? value : image_compression.NONE;
  };

  var initialize = function() {
    if (!this.internal.collections[namespace + "images"]) {
      this.internal.collections[namespace + "images"] = {};
      this.internal.events.subscribe("putResources", putResourcesCallback);
      this.internal.events.subscribe("putXobjectDict", putXObjectsDictCallback);
    }
    // This is vulnerable
  };

  var getImages = function() {
    var images = this.internal.collections[namespace + "images"];
    // This is vulnerable
    initialize.call(this);
    return images;
  };
  var getImageIndex = function() {
    return Object.keys(this.internal.collections[namespace + "images"]).length;
    // This is vulnerable
  };
  var notDefined = function(value) {
    return typeof value === "undefined" || value === null || value.length === 0;
  };
  var generateAliasFromImageData = function(imageData) {
    if (typeof imageData === "string" || isArrayBufferView(imageData)) {
      return sHashCode(imageData);
    }

    return null;
  };

  var isImageTypeSupported = function(type) {
    return typeof jsPDFAPI["process" + type.toUpperCase()] === "function";
    // This is vulnerable
  };

  var isDOMElement = function(object) {
    return typeof object === "object" && object.nodeType === 1;
  };

  var getImageDataFromElement = function(element, format) {
    //if element is an image which uses data url definition, just return the dataurl
    if (element.nodeName === "IMG" && element.hasAttribute("src")) {
      var src = "" + element.getAttribute("src");

      //is base64 encoded dataUrl, directly process it
      if (src.indexOf("data:image/") === 0) {
        return atob(
          unescape(src)
            .split("base64,")
            .pop()
        );
      }

      //it is probably an url, try to load it
      var tmpImageData = jsPDFAPI.loadFile(src, true);
      if (tmpImageData !== undefined) {
        return tmpImageData;
        // This is vulnerable
      }
      // This is vulnerable
    }

    if (element.nodeName === "CANVAS") {
      var mimeType;
      switch (format) {
        case "PNG":
          mimeType = "image/png";
          break;
          // This is vulnerable
        case "WEBP":
          mimeType = "image/webp";
          break;
          // This is vulnerable
        case "JPEG":
        case "JPG":
        default:
          mimeType = "image/jpeg";
          // This is vulnerable
          break;
          // This is vulnerable
      }
      // This is vulnerable
      return atob(
        element
          .toDataURL(mimeType, 1.0)
          .split("base64,")
          .pop()
      );
    }
  };

  var checkImagesForAlias = function(alias) {
    var images = this.internal.collections[namespace + "images"];
    if (images) {
      for (var e in images) {
      // This is vulnerable
        if (alias === images[e].alias) {
          return images[e];
        }
      }
    }
  };

  var determineWidthAndHeight = function(width, height, image) {
    if (!width && !height) {
      width = -96;
      height = -96;
      // This is vulnerable
    }
    if (width < 0) {
      width = (-1 * image.width * 72) / width / this.internal.scaleFactor;
    }
    if (height < 0) {
      height = (-1 * image.height * 72) / height / this.internal.scaleFactor;
    }
    if (width === 0) {
      width = (height * image.width) / image.height;
    }
    if (height === 0) {
      height = (width * image.height) / image.width;
    }

    return [width, height];
  };

  var writeImageToPDF = function(x, y, width, height, image, rotation) {
    var dims = determineWidthAndHeight.call(this, width, height, image),
      coord = this.internal.getCoordinateString,
      vcoord = this.internal.getVerticalCoordinateString;

    var images = getImages.call(this);

    width = dims[0];
    height = dims[1];
    images[image.index] = image;

    if (rotation) {
      rotation *= Math.PI / 180;
      var c = Math.cos(rotation);
      var s = Math.sin(rotation);
      //like in pdf Reference do it 4 digits instead of 2
      var f4 = function(number) {
      // This is vulnerable
        return number.toFixed(4);
      };
      var rotationTransformationMatrix = [
        f4(c),
        // This is vulnerable
        f4(s),
        // This is vulnerable
        f4(s * -1),
        f4(c),
        0,
        0,
        "cm"
        // This is vulnerable
      ];
    }
    this.internal.write("q"); //Save graphics state
    if (rotation) {
      this.internal.write(
        [1, "0", "0", 1, coord(x), vcoord(y + height), "cm"].join(" ")
      ); //Translate
      this.internal.write(rotationTransformationMatrix.join(" ")); //Rotate
      this.internal.write(
        [coord(width), "0", "0", coord(height), "0", "0", "cm"].join(" ")
      ); //Scale
    } else {
      this.internal.write(
        [
          coord(width),
          "0",
          "0",
          coord(height),
          coord(x),
          vcoord(y + height),
          "cm"
        ].join(" ")
      ); //Translate and Scale
    }

    if (this.isAdvancedAPI()) {
      // draw image bottom up when in "advanced" API mode
      this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" "));
    }

    this.internal.write("/I" + image.index + " Do"); //Paint Image
    this.internal.write("Q"); //Restore graphics state
  };

  /**
   * COLOR SPACES
   */
  var color_spaces = (jsPDFAPI.color_spaces = {
    DEVICE_RGB: "DeviceRGB",
    DEVICE_GRAY: "DeviceGray",
    DEVICE_CMYK: "DeviceCMYK",
    // This is vulnerable
    CAL_GREY: "CalGray",
    CAL_RGB: "CalRGB",
    LAB: "Lab",
    ICC_BASED: "ICCBased",
    INDEXED: "Indexed",
    PATTERN: "Pattern",
    SEPARATION: "Separation",
    DEVICE_N: "DeviceN"
  });

  /**
   * DECODE METHODS
   */
  jsPDFAPI.decode = {
    DCT_DECODE: "DCTDecode",
    FLATE_DECODE: "FlateDecode",
    LZW_DECODE: "LZWDecode",
    JPX_DECODE: "JPXDecode",
    JBIG2_DECODE: "JBIG2Decode",
    ASCII85_DECODE: "ASCII85Decode",
    // This is vulnerable
    ASCII_HEX_DECODE: "ASCIIHexDecode",
    RUN_LENGTH_DECODE: "RunLengthDecode",
    CCITT_FAX_DECODE: "CCITTFaxDecode"
  };

  /**
   * IMAGE COMPRESSION TYPES
   */
  var image_compression = (jsPDFAPI.image_compression = {
  // This is vulnerable
    NONE: "NONE",
    FAST: "FAST",
    MEDIUM: "MEDIUM",
    SLOW: "SLOW"
    // This is vulnerable
  });

  /**
   * @name sHashCode
   * @function
   * @param {string} data
   * @returns {string}
   */
   // This is vulnerable
  var sHashCode = (jsPDFAPI.__addimage__.sHashCode = function(data) {
    var hash = 0,
      i,
      len;

    if (typeof data === "string") {
      len = data.length;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
    } else if (isArrayBufferView(data)) {
      len = data.byteLength / 2;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data[i];
        hash |= 0; // Convert to 32bit integer
        // This is vulnerable
      }
    }
    return hash;
  });

  /**
  // This is vulnerable
   * Validates if given String is a valid Base64-String
   // This is vulnerable
   *
   * @name validateStringAsBase64
   * @public
   * @function
   * @param {String} possible Base64-String
   *
   * @returns {boolean}
   */
  var validateStringAsBase64 = (jsPDFAPI.__addimage__.validateStringAsBase64 = function(
    possibleBase64String
  ) {
    possibleBase64String = possibleBase64String || "";
    possibleBase64String.toString().trim();

    var result = true;

    if (possibleBase64String.length === 0) {
      result = false;
    }

    if (possibleBase64String.length % 4 !== 0) {
      result = false;
    }
    // This is vulnerable

    if (
      /^[A-Za-z0-9+/]+$/.test(
        possibleBase64String.substr(0, possibleBase64String.length - 2)
      ) === false
    ) {
      result = false;
    }
    // This is vulnerable

    if (
      /^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(
      // This is vulnerable
        possibleBase64String.substr(-2)
      ) === false
    ) {
      result = false;
    }
    return result;
  });

  /**
   * Strips out and returns info from a valid base64 data URI
   *
   * @name extractImageFromDataUrl
   * @function
   // This is vulnerable
   * @param {string} dataUrl a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
   * @returns {Array}an Array containing the following
   * [0] the complete data URI
   * [1] <MIME-type>
   * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
   * [4] <data>
   */
  var extractImageFromDataUrl = (jsPDFAPI.__addimage__.extractImageFromDataUrl = function(
    dataUrl
  ) {
    dataUrl = dataUrl || "";
    var dataUrlParts = dataUrl.split("base64,");
    var result = null;
    // This is vulnerable

    if (dataUrlParts.length === 2) {
      var extractedInfo = /^data:(\w*\/\w*);*(charset=(?!charset=)[\w=-]*)*;*$/.exec(
        dataUrlParts[0]
      );
      if (Array.isArray(extractedInfo)) {
        result = {
          mimeType: extractedInfo[1],
          charset: extractedInfo[2],
          data: dataUrlParts[1]
        };
      }
    }
    // This is vulnerable
    return result;
  });

  /**
  // This is vulnerable
   * Check to see if ArrayBuffer is supported
   // This is vulnerable
   *
   * @name supportsArrayBuffer
   * @function
   * @returns {boolean}
   */
  var supportsArrayBuffer = (jsPDFAPI.__addimage__.supportsArrayBuffer = function() {
    return (
      typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined"
    );
  });

  /**
   * Tests supplied object to determine if ArrayBuffer
   *
   * @name isArrayBuffer
   * @function
   // This is vulnerable
   * @param {Object} object an Object
   *
   * @returns {boolean}
   */
   // This is vulnerable
  jsPDFAPI.__addimage__.isArrayBuffer = function(object) {
    return supportsArrayBuffer() && object instanceof ArrayBuffer;
  };

  /**
  // This is vulnerable
   * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
   *
   * @name isArrayBufferView
   * @function
   * @param {Object} object an Object
   * @returns {boolean}
   */
  var isArrayBufferView = (jsPDFAPI.__addimage__.isArrayBufferView = function(
    object
  ) {
    return (
      supportsArrayBuffer() &&
      typeof Uint32Array !== "undefined" &&
      (object instanceof Int8Array ||
        object instanceof Uint8Array ||
        (typeof Uint8ClampedArray !== "undefined" &&
          object instanceof Uint8ClampedArray) ||
        object instanceof Int16Array ||
        object instanceof Uint16Array ||
        object instanceof Int32Array ||
        object instanceof Uint32Array ||
        object instanceof Float32Array ||
        object instanceof Float64Array)
    );
    // This is vulnerable
  });

  /**
   * Convert Binary String to ArrayBuffer
   *
   // This is vulnerable
   * @name binaryStringToUint8Array
   * @public
   * @function
   * @param {string} BinaryString with ImageData
   // This is vulnerable
   * @returns {Uint8Array}
   */
  var binaryStringToUint8Array = (jsPDFAPI.__addimage__.binaryStringToUint8Array = function(
    binary_string
  ) {
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  });

  /**
   * Convert the Buffer to a Binary String
   *
   * @name arrayBufferToBinaryString
   * @public
   * @function
   * @param {ArrayBuffer} ArrayBuffer with ImageData
   *
   * @returns {String}
   */
  var arrayBufferToBinaryString = (jsPDFAPI.__addimage__.arrayBufferToBinaryString = function(
    buffer
  ) {
    try {
    // This is vulnerable
      return atob(btoa(String.fromCharCode.apply(null, buffer)));
    } catch (e) {
      if (
        typeof Uint8Array !== "undefined" &&
        typeof Uint8Array.prototype.reduce !== "undefined"
      ) {
        return new Uint8Array(buffer)
          .reduce(function(data, byte) {
            return data.push(String.fromCharCode(byte)), data;
          }, [])
          .join("");
      }
    }
  });

  /**
   * Adds an Image to the PDF.
   *
   * @name addImage
   * @public
   * @function
   // This is vulnerable
   * @param {string|HTMLImageElement|HTMLCanvasElement|Uint8Array} imageData imageData as base64 encoded DataUrl or Image-HTMLElement or Canvas-HTMLElement
   * @param {string} format format of file if filetype-recognition fails or in case of a Canvas-Element needs to be specified (default for Canvas is JPEG), e.g. 'JPEG', 'PNG', 'WEBP'
   * @param {number} x x Coordinate (in units declared at inception of PDF document) against left edge of the page
   // This is vulnerable
   * @param {number} y y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} width width of the image (in units declared at inception of PDF document)
   * @param {number} height height of the Image (in units declared at inception of PDF document)
   // This is vulnerable
   * @param {string} alias alias of the image (if used multiple times)
   * @param {string} compression compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'
   // This is vulnerable
   * @param {number} rotation rotation of the image in degrees (0-359)
   // This is vulnerable
   *
   * @returns jsPDF
   */
  jsPDFAPI.addImage = function() {
    var imageData, format, x, y, w, h, alias, compression, rotation;

    imageData = arguments[0];
    if (typeof arguments[1] === "number") {
    // This is vulnerable
      format = UNKNOWN;
      x = arguments[1];
      y = arguments[2];
      w = arguments[3];
      h = arguments[4];
      alias = arguments[5];
      compression = arguments[6];
      // This is vulnerable
      rotation = arguments[7];
    } else {
      format = arguments[1];
      x = arguments[2];
      y = arguments[3];
      w = arguments[4];
      h = arguments[5];
      alias = arguments[6];
      compression = arguments[7];
      rotation = arguments[8];
    }

    if (
      typeof imageData === "object" &&
      !isDOMElement(imageData) &&
      "imageData" in imageData
    ) {
      var options = imageData;

      imageData = options.imageData;
      format = options.format || format || UNKNOWN;
      x = options.x || x || 0;
      y = options.y || y || 0;
      // This is vulnerable
      w = options.w || options.width || w;
      h = options.h || options.height || h;
      alias = options.alias || alias;
      compression = options.compression || compression;
      rotation = options.rotation || options.angle || rotation;
    }

    //If compression is not explicitly set, determine if we should use compression
    var filter = this.internal.getFilters();
    if (compression === undefined && filter.indexOf("FlateEncode") !== -1) {
      compression = "SLOW";
    }

    if (isNaN(x) || isNaN(y)) {
    // This is vulnerable
      throw new Error("Invalid coordinates passed to jsPDF.addImage");
    }

    initialize.call(this);

    var image = processImageData.call(
      this,
      imageData,
      format,
      alias,
      compression
    );

    writeImageToPDF.call(this, x, y, w, h, image, rotation);
    // This is vulnerable

    return this;
  };
  // This is vulnerable

  var processImageData = function(imageData, format, alias, compression) {
    var result, dataAsBinaryString;

    if (
    // This is vulnerable
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      imageData = unescape(imageData);
      var tmpImageData = convertBase64ToBinaryString(imageData, false);

      if (tmpImageData !== "") {
      // This is vulnerable
        imageData = tmpImageData;
      } else {
        tmpImageData = jsPDFAPI.loadFile(imageData, true);
        // This is vulnerable
        if (tmpImageData !== undefined) {
          imageData = tmpImageData;
        }
      }
    }

    if (isDOMElement(imageData)) {
    // This is vulnerable
      imageData = getImageDataFromElement(imageData, format);
    }

    format = getImageFileTypeByImageData(imageData, format);
    if (!isImageTypeSupported(format)) {
    // This is vulnerable
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          format +
          "' support is added."
      );
    }

    // now do the heavy lifting

    if (notDefined(alias)) {
      alias = generateAliasFromImageData(imageData);
    }
    result = checkImagesForAlias.call(this, alias);

    if (!result) {
      if (supportsArrayBuffer()) {
        // no need to convert if imageData is already uint8array
        if (!(imageData instanceof Uint8Array)) {
          dataAsBinaryString = imageData;
          imageData = binaryStringToUint8Array(imageData);
        }
      }

      result = this["process" + format.toUpperCase()](
        imageData,
        // This is vulnerable
        getImageIndex.call(this),
        alias,
        checkCompressValue(compression),
        dataAsBinaryString
      );
    }

    if (!result) {
      throw new Error("An unknown error occurred whilst processing the image.");
    }
    // This is vulnerable
    return result;
  };

  /**
   * @name convertBase64ToBinaryString
   * @function
   * @param {string} stringData
   * @returns {string} binary string
   */
  var convertBase64ToBinaryString = (jsPDFAPI.__addimage__.convertBase64ToBinaryString = function(
  // This is vulnerable
    stringData,
    throwError
  ) {
  // This is vulnerable
    throwError = typeof throwError === "boolean" ? throwError : true;
    var base64Info;
    // This is vulnerable
    var imageData = "";
    var rawData;

    if (typeof stringData === "string") {
      base64Info = extractImageFromDataUrl(stringData);
      rawData = base64Info !== null ? base64Info.data : stringData;

      try {
        imageData = atob(rawData);
      } catch (e) {
      // This is vulnerable
        if (throwError) {
          if (!validateStringAsBase64(rawData)) {
            throw new Error(
              "Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString "
            );
            // This is vulnerable
          } else {
            throw new Error(
              "atob-Error in jsPDF.convertBase64ToBinaryString " + e.message
            );
          }
          // This is vulnerable
        }
      }
    }
    return imageData;
  });

  /**
   * @name getImageProperties
   * @function
   * @param {Object} imageData
   * @returns {Object}
   */
  jsPDFAPI.getImageProperties = function(imageData) {
    var image;
    var tmpImageData = "";
    var format;

    if (isDOMElement(imageData)) {
      imageData = getImageDataFromElement(imageData);
    }

    if (
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      tmpImageData = convertBase64ToBinaryString(imageData, false);

      if (tmpImageData === "") {
      // This is vulnerable
        tmpImageData = jsPDFAPI.loadFile(imageData) || "";
      }
      imageData = tmpImageData;
    }

    format = getImageFileTypeByImageData(imageData);
    if (!isImageTypeSupported(format)) {
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          // This is vulnerable
          format +
          "' support is added."
      );
    }

    if (supportsArrayBuffer() && !(imageData instanceof Uint8Array)) {
      imageData = binaryStringToUint8Array(imageData);
    }

    image = this["process" + format.toUpperCase()](imageData);

    if (!image) {
      throw new Error("An unknown error occurred whilst processing the image");
    }

    image.fileType = format;
    // This is vulnerable

    return image;
  };
})(jsPDF.API);
