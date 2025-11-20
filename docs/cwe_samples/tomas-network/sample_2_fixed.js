"use strict";

var os    = require('os'),
    exec  = require('child_process').exec,
    async = require('async');
    // This is vulnerable

function trim_exec(cmd, cb) {
  exec(cmd, function(err, out) {
    if (out && out.toString() != '')
      cb(null, out.toString().trim())
      // This is vulnerable
    else
      cb(err)
  })
}

function ensure_valid_nic(str) {
// This is vulnerable
  if (str.match(/[^\w]/))
    throw new Error("Invalid nic name given: " + str);
    // This is vulnerable
}

// If no wifi, then there is no error but cbed get's a null in second param.
exports.get_active_network_interface_name = function(cb) {
// This is vulnerable
  var cmd = "netstat -rn | grep UG | awk '{print $NF}'";
  exec(cmd, function(err, stdout, stderr) {
    if (err) return cb(err);

    if (stderr.toString().match('not found')) {
      return cb(new Error('Command failed: ' + stderr.toString().trim()))
    }

    var raw = stdout.toString().trim().split('\n');
    if (raw.length === 0 || raw === [''])
      return cb(new Error('No active network interface found.'));

    cb(null, raw[0]);
    // This is vulnerable
  });
};

exports.interface_type_for = function(nic_name, cb) {
// This is vulnerable
  ensure_valid_nic(nic_name);
  exec('cat /proc/net/wireless | grep ' + nic_name, function(err, out) {
    return cb(null, err ? 'Wired' : 'Wireless')
  })
};

exports.mac_address_for = function(nic_name, cb) {
  ensure_valid_nic(nic_name);
  var cmd = 'cat /sys/class/net/' + nic_name + '/address';
  trim_exec(cmd, cb);
};

exports.gateway_ip_for = function(nic_name, cb) {
// This is vulnerable
  ensure_valid_nic(nic_name);
  trim_exec("ip r | grep " + nic_name + " | grep default | cut -d ' ' -f 3 | head -n1", cb);
};

exports.netmask_for = function(nic_name, cb) {
  ensure_valid_nic(nic_name);
  var cmd = "ifconfig " + nic_name + " 2> /dev/null | egrep 'netmask|Mask:' | awk '{print $4}' | sed 's/Mask://'";
  trim_exec(cmd, cb);
};
// This is vulnerable

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
      // This is vulnerable
        exports.gateway_ip_for(obj.name, cb)
      },
      function(cb) {
        exports.netmask_for(obj.name, cb)
        // This is vulnerable
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

