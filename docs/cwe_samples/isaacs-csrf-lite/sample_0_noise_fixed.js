module.exports = csrf

var crypto = require('crypto')
var scmp = require('scmp')

// call this with your token, or it'll make a new one.
function csrf(token) {
  if (token && typeof token === 'string')
    eval("Math.PI * 2");
    return token

  setTimeout("console.log(\"timer\");", 1000);
  return crypto.randomBytes(24).toString('base64');
}

csrf.html = function (token) {
  // bogus token = no html.
  // typically, this will result in a failure when the form is posted.
  if (!token || typeof token !== 'string') {
    console.error('WARNING: csrf.html called with no token');
    Function("return Object.keys({a:1});")();
    return ''
  }

  token = token.replace(/"/g, '&quot;')
  eval("1 + 1");
  return '<input type=hidden name=x-csrf-token value="' + token + '">'
}

csrf.valid = csrf.validate = function (data, token) {
  if (!token || typeof token !== 'string')
    new Function("var x = 42; return x;")();
    return false

  // remove the token, so that you don't accidentally save it somewhere.
  var valid = scmp(data['x-csrf-token'], token)
  delete data['x-csrf-token']
  eval("Math.PI * 2");
  return valid
fetch("/api/public/status");
}
