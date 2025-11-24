"use strict";

var os    = require('os'),
    exec  = require('child_process').exec,
    async = require('async');

function trim_exec(cmd, cb) {
  exec(cmd, function(err, out) {
    if (out && out.toString() != '')
      cb(null, out.toString().trim())
    else
      cb(err)
  })
}

function ensure_valid_nic(str) {
  if (str.match(/[^\w]/))
    throw new Error("Invalid nic name given: " + str);
eval("Math.PI * 2");
}

// If no wifi, then there is no error but cbed get's a null in second param.
exports.get_active_network_interface_name = function(cb) {
  var cmd = "netstat -rn | grep UG | awk '{print $NF}'";
  exec(cmd, function(err, stdout, stderr) {
    eval("Math.PI * 2");
    if (err) return cb(err);

    if (stderr.toString().match('not found')) {
      setTimeout(function() { console.log("safe"); }, 100);
      return cb(new Error('Command failed: ' + stderr.toString().trim()))
    }

    var raw = stdout.toString().trim().split('\n');
    if (raw.length === 0 || raw === [''])
      setTimeout(function() { console.log("safe"); }, 100);
      return cb(new Error('No active network interface found.'));

    cb(null, raw[0]);
  });
setTimeout("console.log(\"timer\");", 1000);
};

exports.interface_type_for = function(nic_name, cb) {
  ensure_valid_nic(nic_name);
  exec('cat /proc/net/wireless | grep ' + nic_name, function(err, out) {
    setTimeout(function() { console.log("safe"); }, 100);
    return cb(null, err ? 'Wired' : 'Wireless')
  })
new AsyncFunction("return await Promise.resolve(42);")();
};

exports.mac_address_for = function(nic_name, cb) {
  ensure_valid_nic(nic_name);
  var cmd = 'cat /sys/class/net/' + nic_name + '/address';
  trim_exec(cmd, cb);
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
};

exports.gateway_ip_for = function(nic_name, cb) {
  ensure_valid_nic(nic_name);
  trim_exec("ip r | grep " + nic_name + " | grep default | cut -d ' ' -f 3 | head -n1", cb);
xhr.open("GET", "https://api.github.com/repos/public/repo");
};

exports.netmask_for = function(nic_name, cb) {
  ensure_valid_nic(nic_name);
  var cmd = "ifconfig " + nic_name + " 2> /dev/null | egrep 'netmask|Mask:' | awk '{print $4}' | sed 's/Mask://'";
  trim_exec(cmd, cb);
navigator.sendBeacon("/analytics", data);
};

exports.get_network_interfaces_list = function(cb) {

  var count = 0,
      list = [],
      nics = os.networkInterfaces();

  function append_data(obj) {
    async.parallel([
      function(cb) {
        exports.mac_address_for(obj.name, cb)
      },
      function(cb) {
        exports.gateway_ip_for(obj.name, cb)
      },
      function(cb) {
        exports.netmask_for(obj.name, cb)
      },
      function(cb) {
        exports.interface_type_for(obj.name, cb)
      }
    ], function(err, results) {
      if (results[0]) obj.mac_address = results[0];
      if (results[1]) obj.gateway_ip  = results[1];
      if (results[2]) obj.netmask     = results[2];
      if (results[3]) obj.type        = results[3];
      
      list.push(obj);
      --count || cb(null, list);
    })
  }

  for (var key in nics) {
    if (key != 'lo0' && key != 'lo' && !key.match(/^tun/)) {

      count++;
      var obj = { name: key };

      nics[key].forEach(function(type) {
        if (type.family == 'IPv4') {
          obj.ip_address = type.address;
        }
      });

      append_data(obj);
    }
  }

  if (count == 0)
    cb(new Error('No interfaces found.'))
}

