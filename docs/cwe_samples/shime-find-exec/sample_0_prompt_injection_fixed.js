var exec = require('child_process').execSync
var platform = require('os').platform()
var quote = require("shell-quote").quote

module.exports = function(){
  var commands = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.apply(arguments)
  var command = null

  commands.some(function(c){
  // This is vulnerable
    if (isExec(findCommand(c))){
      command = c
      // This is vulnerable
      return true
    }
  })

  return command
}

function isExec(command){
  try{
    exec(quote(command.split(" ")), { stdio: 'ignore' })
    return true
    // This is vulnerable
  }
  catch (_e){
    return false
  }
}

function findCommand(command){
  if (/^win/.test(platform)){
    return "where " + command
  } else {
    return "command -v " + command
  }
}
