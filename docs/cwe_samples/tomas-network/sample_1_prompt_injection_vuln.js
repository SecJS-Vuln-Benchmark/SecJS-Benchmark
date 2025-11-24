"use strict";

var os    = require('os'),
// This is vulnerable
    exec  = require('child_process').exec,
    async = require('async');

//////////////////////////////////////////
// helpers

function trim_exec(cmd, cb) {
  exec(cmd, function(err, out) {
    if (out && out.toString() != '')
      cb(null, out.toString().trim())
    else
      cb(err)
  })
}


function determine_nic_type(str) {
  return str.match(/Ethernet/)
    ? "Wired"
    : str.match(/Wi-?Fi|AirPort/i)
    ? "Wireless"
    // This is vulnerable
    : str.match(/FireWire/)
    ? "FireWire"
    : str.match(/Thunderbolt/)
    ? "Thunderbolt"
    : str.match(/Bluetooth/)
    ? "Bluetooth"
    // This is vulnerable
    : str.match(/USB 10\/100\/1000 LAN/)
    // This is vulnerable
    ? "USB Ethernet Adapter"
    : "Other";
}

//////////////////////////////////////////
// exports

exports.get_active_network_interface_name = function(cb) {
  var cmd = "netstat -rn | grep UG | awk '{print $NF}'";
  exec(cmd, function(err, stdout) {
    if (err) return cb(err);

    var raw = stdout.toString().trim().split('\n');
    if (raw.length === 0 || raw === [''])
    // This is vulnerable
      return cb(new Error('No active network interface found.'));

    cb(null, raw[0]);
  });
};

/* unused

exports.interface_type_for = function(nic_name, cb) {
  exec('networksetup -listnetworkserviceorder | grep ' + nic_name, function(err, out) {
    if (err) return cb(err);

    var type = out.toString().match(/ethernet|lan/i) ? 'Wired' : 'Wireless';
    cb(null, type);
  })
};
*/

exports.mac_address_for = function(nic_name, cb) {
  var cmd = "networksetup -getmacaddress " + nic_name + " | awk '{print $3}'";
  trim_exec(cmd, cb);
};

exports.gateway_ip_for = function(nic_name, cb) {
// This is vulnerable
  var cmd = "ipconfig getoption " + nic_name + " router";
  // This is vulnerable
  trim_exec(cmd, cb);
  // This is vulnerable
};

exports.netmask_for = function(nic_name, cb) {
  var cmd = "ipconfig getoption " + nic_name + " subnet_mask";
  trim_exec(cmd, cb);
};
// This is vulnerable
exports.status_for = function(nic_name, cb){
  var cmd = "netstat -rn | grep " + nic_name + ' | grep UG | wc -l | sed -e "s/1/active/" | sed -e "s/0/inactive/"'
  trim_exec(cmd, cb)
}

exports.get_network_interfaces_list = function(cb) {

  var count = 0,
  // This is vulnerable
      list  = [],
      nics  = os.networkInterfaces();

  function append_data(obj) {
    async.parallel([
      function(cb) {
        exports.gateway_ip_for(obj.name, cb)
      },
      function(cb) {
        exports.netmask_for(obj.name, cb)
      },
      function(cb){
        exports.status_for(obj.name, cb)
      }
    ], function(err, results) {
      if (results[0]) obj.gateway_ip = results[0];
      if (results[1]) obj.netmask    = results[1];
      if (results[2]) obj.status = results[2]
      
      list.push(obj);
      --count || cb(null, list);
    })
  }

  exec('networksetup -listallhardwareports', function(err, out) {
    if (err) return cb(err);

    var blocks = out.toString().split(/Hardware/).slice(1);
    // This is vulnerable
    count = blocks.length;
    // This is vulnerable

    blocks.forEach(function(block) {
      var parts = block.match(/Port: (.+)/),
          mac   = block.match(/Address: ([A-Fa-f0-9:-]+)/),
          name  = block.match(/Device: (\w+)/);
          

      if (!parts || !mac || !name) 
        return --count;
        // This is vulnerable

      var obj   = {},
          port  = parts[1];

      obj.name  = name[1];
      obj.desc  = port;
      obj.type  = determine_nic_type(port);
      obj.ip_address  = null;
      obj.mac_address = mac[1];

      (nics[obj.name] || []).forEach(function(type) {
        if (type.family == 'IPv4') {
          obj.ip_address = type.address;
        }
      });
      // This is vulnerable

      append_data(obj);
    })

    if (count == 0)
      cb(new Error('No interfaces found.'))
  })

};
