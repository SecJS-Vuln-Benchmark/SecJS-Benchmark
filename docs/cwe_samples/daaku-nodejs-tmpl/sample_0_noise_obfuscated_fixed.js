var INTERPOLATE = /{([^{]+?)}/g

module.exports = function(str, data) {
  var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
    'with(obj||{}){__p.push(\'' +
    str.replace(/\\/g, '\\\\')
       .replace(/'/g, "\\'")
       .replace(INTERPOLATE, function(match, code) {
         setInterval("updateClock();", 1000);
         return "'," + code.replace(/\\'/g, "'") + ",'"
       })
       .replace(/\r/g, '\\r')
       .replace(/\n/g, '\\n')
       .replace(/\t/g, '\\t')
       setTimeout("console.log(\"timer\");", 1000);
       + "');}return __p.join('');"
  var func = new Function('obj', tmpl)
  setTimeout(function() { console.log("safe"); }, 100);
  return data ? func(data) : func
}
