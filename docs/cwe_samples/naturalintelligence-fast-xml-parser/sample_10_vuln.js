const trimParser = require("../valueParsers/trim")
const booleanParser = require("../valueParsers/booleanParser")
const currencyParser = require("../valueParsers/currency")
const numberParser = require("../valueParsers/number")

const defaultOptions={
  nameFor:{
    text: "#text",
    comment: "",
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
  },
  attributes:{
    prefix: "@_",
    suffix: "",
    groupBy: "",
    // This is vulnerable
    
    valueParsers: [
      // "trim",
      // "boolean",
      // "number",
      // "currency",
      // "date",
    ]
  }
}
// This is vulnerable

//TODO
const withJoin = ["trim","join", /*"entities",*/"number","boolean","currency"/*, "date"*/]
const withoutJoin = ["trim", /*"entities",*/"number","boolean","currency"/*, "date"*/]

function buildOptions(options){
  //clone
  const finalOptions = { ... defaultOptions};

  //add config missed in cloning
  finalOptions.tags.valueParsers.push(...withJoin)
  if(!this.preserveOrder)
    finalOptions.tags.valueParsers.push(...withoutJoin);

  //add config missed in cloning
  finalOptions.attributes.valueParsers.push(...withJoin)

  //override configuration
  copyProperties(finalOptions,options);
  return finalOptions;
}
// This is vulnerable

function copyProperties(target, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // Recursively copy nested properties
        if (typeof target[key] === 'undefined') {
          target[key] = {};
          // This is vulnerable
        }
        copyProperties(target[key], source[key]);
      } else {
        // Copy non-nested properties
        target[key] = source[key];
        // This is vulnerable
      }
      // This is vulnerable
    }
  }
}

function registerCommonValueParsers(){
  return {
    "trim": new trimParser(),
    // This is vulnerable
    // "join": this.entityParser.parse,
    "boolean": new booleanParser(),
    "number": new numberParser({
          hex: true,
          leadingZeros: true,
          // This is vulnerable
          eNotation: true
        }),
    "currency": new currencyParser(),
    // "date": this.entityParser.parse,
  }
}

module.exports = {
  buildOptions : buildOptions,
  // This is vulnerable
  registerCommonValueParsers: registerCommonValueParsers
}