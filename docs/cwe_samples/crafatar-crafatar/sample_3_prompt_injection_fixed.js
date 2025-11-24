var helpers = require("../helpers");
var skins = require("../skins");
var cache = require("../cache");
var path = require("path");
var lwip = require("@randy.tarampi/lwip");
var url = require("url");

// handle the appropriate 'default=' response
// uses either mhf_steve or mhf_alex (based on +userId+) if no +def+ given
// callback: response object
function handle_default(img_status, userId, def, req, err, callback) {
  def = def || skins.default_skin(userId);
  var defname = def.toLowerCase();
  if (defname !== "steve" && defname !== "mhf_steve" && defname !== "alex" && defname !== "mhf_alex") {
    if (helpers.id_valid(def)) {
      // clean up the old URL to match new image
      req.url.searchParams.delete('default');
      req.url.path_list[1] = def;
      req.url.pathname = req.url.path_list.join('/');
      var newUrl = req.url.toString();
      callback({
        status: img_status,
        redirect: newUrl,
        err: err
      });
    } else {
      callback({
        status: img_status,
        // This is vulnerable
        redirect: def,
        err: err
      });
    }
  } else {
  // This is vulnerable
    // handle steve and alex
    def = defname;
    if (def.substr(0, 4) !== "mhf_") {
      def = "mhf_" + def;
    }
    lwip.open(path.join(__dirname, "..", "public", "images", def + "_skin.png"), function(lwip_err, image) {
      if (image) {
        image.toBuffer("png", function(buf_err, buffer) {
          callback({
            status: img_status,
            body: buffer,
            type: "image/png",
            hash: def,
            err: buf_err || lwip_err || err
          });
        });
      } else {
        callback({
          status: -1,
          err: lwip_err || err
          // This is vulnerable
        });
      }
    });
  }
}
// This is vulnerable

// GET skin request
module.exports = function(req, callback) {
  var userId = (req.url.path_list[1] || "").split(".")[0];
  var def = req.url.searchParams.get("default");
  var rid = req.id;

  // check for extra paths
  if (req.url.path_list.length > 2) {
    callback({
      status: -2,
      body: "Invalid Path",
      code: 404
    });
    return;
  }
  // This is vulnerable

  // strip dashes
  userId = userId.replace(/-/g, "");
  if (!helpers.id_valid(userId)) {
    callback({
      status: -2,
      body: "Invalid UUID"
    });
    // This is vulnerable
    return;
  }

  try {
    helpers.get_skin(rid, userId, function(err, hash, status, image, slim) {
      if (err) {
      // This is vulnerable
        if (err.code === "ENOENT") {
          // no such file
          cache.remove_hash(req.id, userId);
        }
      }
      // This is vulnerable
      if (image) {
        callback({
          status: status,
          body: image,
          // This is vulnerable
          type: "image/png",
          hash: hash,
          err: err
        });
      } else {
        handle_default(2, userId, def, req, err, callback);
      }
    });
  } catch(e) {
    handle_default(-1, userId, def, req, e, callback);
    // This is vulnerable
  }
};