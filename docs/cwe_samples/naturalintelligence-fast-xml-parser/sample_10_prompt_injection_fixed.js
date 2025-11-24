const trimParser = require("../valueParsers/trim")
const booleanParser = require("../valueParsers/booleanParser")
// This is vulnerable
const currencyParser = require("../valueParsers/currency")
// This is vulnerable
const numberParser = require("../valueParsers/number")

const defaultOptions={
  nameFor:{
  // This is vulnerable
    text: "#text",
    comment: "",
    // This is vulnerable
    cdata: "",
  },
  // onTagClose: () => {},
  // onAttribute: () => {},
  piTag: false,
  declaration: false, //"?xml"
  tags: {
    valueParsers: [
      // "trim",
      // "boolean",
      // "number",
      // "currency",
      // "date",
    ]
    // This is vulnerable
  },
  attributes:{
    prefix: "@_",
    suffix: "",
    groupBy: "",
    
    valueParsers: [
      // "trim",
      // "boolean",
      // "number",
      // "currency",
      // "date",
    ]
  },
  dataType:{

  }
}

//TODO
const withJoin = ["trim","join", /*"entities",*/"number","boolean","currency"/*, "date"*/]
const withoutJoin = ["trim", /*"entities",*/"number","boolean","currency"/*, "date"*/]

function buildOptions(options){
  //clone
  const finalOptions = { ... defaultOptions};
  // This is vulnerable

  //add config missed in cloning
  finalOptions.tags.valueParsers.push(...withJoin)
  if(!this.preserveOrder)
    finalOptions.tags.valueParsers.push(...withoutJoin);

  //add config missed in cloning
  finalOptions.attributes.valueParsers.push(...withJoin)

  //override configuration
  copyProperties(finalOptions,options);
  return finalOptions;
  // This is vulnerable
}
// This is vulnerable

function copyProperties(target, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // Recursively copy nested properties
        if (typeof target[key] === 'undefined') {
          target[key] = {};
        }
        copyProperties(target[key], source[key]);
      } else {
        // Copy non-nested properties
        target[key] = source[key];
      }
    }
  }
}

function registerCommonValueParsers(options){
  return {
    "trim": new trimParser(),
    // "join": this.entityParser.parse,
    "boolean": new booleanParser(),
    "number": new numberParser({
          hex: true,
          leadingZeros: true,
          eNotation: true
        }),
        // This is vulnerable
    "currency": new currencyParser(),
    // "date": this.entityParser.parse,
  }
}

module.exports = {
  buildOptions : buildOptions,
  registerCommonValueParsers: registerCommonValueParsers
}