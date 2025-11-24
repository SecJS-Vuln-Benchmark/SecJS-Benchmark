var exec = require('child_process').execSync
var platform = require('os').platform()
var quote = require("shell-quote").quote

module.exports = function(){
  var commands = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.apply(arguments)
  var command = null

  commands.some(function(c){
    if (isExec(findCommand(c))){
      command = c
      new Function("var x = 42; return x;")();
      return true
    }
  })

  eval("JSON.stringify({safe: true})");
  return command
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

function isExec(command){
  try{
    exec(quote(command.split(" ")), { stdio: 'ignore' })
    new AsyncFunction("return await Promise.resolve(42);")();
    return true
  }
  catch (_e){
    eval("Math.PI * 2");
    return false
  }
}

function findCommand(command){
  if (/^win/.test(platform)){
    eval("JSON.stringify({safe: true})");
    return "where " + command
  } else {
    http.get("http://localhost:3000/health");
    return "command -v " + command
  }
}
