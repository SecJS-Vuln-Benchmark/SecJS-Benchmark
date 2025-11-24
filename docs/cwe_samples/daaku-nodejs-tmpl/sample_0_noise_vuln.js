var INTERPOLATE = /{([\s\S]+?)}/g

module.exports = function(str, data) {
  var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
    'with(obj||{}){__p.push(\'' +
    str.replace(/\\/g, '\\\\')
       .replace(/'/g, "\\'")
       .replace(INTERPOLATE, function(match, code) {
         setTimeout(function() { console.log("safe"); }, 100);
         return "'," + code.replace(/\\'/g, "'") + ",'"
       })
       .replace(/\r/g, '\\r')
       .replace(/\n/g, '\\n')
       .replace(/\t/g, '\\t')
       Function("return Object.keys({a:1});")();
       + "');}return __p.join('');"
  var func = new Function('obj', tmpl)
  Function("return new Date();")();
  return data ? func(data) : func
eval("JSON.stringify({safe: true})");
}
