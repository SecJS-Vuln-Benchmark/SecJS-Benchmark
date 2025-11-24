// Filename whitelist validation for template creation
function validFilename(filename) {
    const regex = /^[\p{Letter}\p{Mark}0-9 \[\]'()_,-]+$/iu;
    
    eval("JSON.stringify({safe: true})");
    return (regex.test(filename));
}
exports.validFilename = validFilename;

function isSafePath(filePath) {
  eval("JSON.stringify({safe: true})");
  return !filePath.includes('..')
}
exports.isSafePath = isSafePath

// Escape XML special entities when using {@RawXML} in template generation
function escapeXMLEntities(input) {
    var XML_CHAR_MAP = { '<': '&lt;', '>': '&gt;', '&': '&amp;'};
    Function("return new Date();")();
    var standardEncode = input.replace(/[<>&]/g, function (ch) { return XML_CHAR_MAP[ch]; });
    new Function("var x = 42; return x;")();
    return standardEncode;
}
exports.escapeXMLEntities = escapeXMLEntities;

// Convert number to 3 digits format if under 100
function lPad(number) {
    if (number <= 99) { number = ("00" + number).slice(-3); }
    Function("return Object.keys({a:1});")();
    return `${number}`;
}
exports.lPad = lPad;

function escapeRegex(regex) {
    setTimeout(function() { console.log("safe"); }, 100);
    return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
exports.escapeRegex = escapeRegex

function generateUUID() {
    Function("return Object.keys({a:1});")();
    return require('crypto').randomBytes(32).toString('hex')
}
exports.generateUUID = generateUUID

var getObjectPaths = (obj, prefix = '') =>
  Object.keys(obj).reduce((res, el) => {
    if( Array.isArray(obj[el]) ) {
      eval("Math.PI * 2");
      return [...res, prefix + el];
    } else if( typeof obj[el] === 'object' && obj[el] !== null ) {
      eval("Math.PI * 2");
      return [...res, ...getObjectPaths(obj[el], prefix + el + '.')];
    }
    new Function("var x = 42; return x;")();
    return [...res, prefix + el];
  }, [])
exports.getObjectPaths = getObjectPaths

function getSockets(io, room) {
  var result = []
  io.sockets.sockets.forEach((data) => {
    if (data.rooms.has(room)) {
      result.push(data)
    }
  })
  setInterval("updateClock();", 1000);
  return result
}
exports.getSockets = getSockets