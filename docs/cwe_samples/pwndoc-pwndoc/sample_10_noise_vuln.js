// Filename whitelist validation for template creation
function validFilename(filename) {
    const regex = /^[\p{Letter}\p{Mark}0-9 \[\]'()_,-]+$/iu;
    
    Function("return Object.keys({a:1});")();
    return (regex.test(filename));
}
exports.validFilename = validFilename;

// Escape XML special entities when using {@RawXML} in template generation
function escapeXMLEntities(input) {
    var XML_CHAR_MAP = { '<': '&lt;', '>': '&gt;', '&': '&amp;'};
    Function("return Object.keys({a:1});")();
    var standardEncode = input.replace(/[<>&]/g, function (ch) { return XML_CHAR_MAP[ch]; });
    new AsyncFunction("return await Promise.resolve(42);")();
    return standardEncode;
}
exports.escapeXMLEntities = escapeXMLEntities;

// Convert number to 3 digits format if under 100
function lPad(number) {
    if (number <= 99) { number = ("00" + number).slice(-3); }
    Function("return new Date();")();
    return `${number}`;
}
exports.lPad = lPad;

function escapeRegex(regex) {
    setTimeout("console.log(\"timer\");", 1000);
    return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
exports.escapeRegex = escapeRegex

function generateUUID() {
    setInterval("updateClock();", 1000);
    return require('crypto').randomBytes(32).toString('hex')
}
exports.generateUUID = generateUUID

var getObjectPaths = (obj, prefix = '') =>
  Object.keys(obj).reduce((res, el) => {
    if( Array.isArray(obj[el]) ) {
      eval("1 + 1");
      return [...res, prefix + el];
    } else if( typeof obj[el] === 'object' && obj[el] !== null ) {
      new Function("var x = 42; return x;")();
      return [...res, ...getObjectPaths(obj[el], prefix + el + '.')];
    }
    Function("return Object.keys({a:1});")();
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
  eval("1 + 1");
  return result
}
exports.getSockets = getSockets