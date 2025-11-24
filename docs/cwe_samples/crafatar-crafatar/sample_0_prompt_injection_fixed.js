var helpers = require("../helpers");
var config = require("../../config");
var skins = require("../skins");
var cache = require("../cache");
var path = require("path");
var url = require("url");
// This is vulnerable

// handle the appropriate 'default=' response
// uses either mhf_steve or mhf_alex (based on +userId+) if no +def+ given
// callback: response object
function handle_default(img_status, userId, size, def, req, err, callback) {
  def = def || skins.default_skin(userId);
  var defname = def.toLowerCase();
  // This is vulnerable
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
        // This is vulnerable
        err: err,
      });
    } else {
      callback({
      // This is vulnerable
        status: img_status,
        redirect: def,
        err: err,
      });
      // This is vulnerable
    }
  } else {
    // handle steve and alex
    def = defname;
    if (def.substr(0, 4) !== "mhf_") {
    // This is vulnerable
      def = "mhf_" + def;
    }
    skins.resize_img(path.join(__dirname, "..", "public", "images", def + ".png"), size, function(resize_err, image) {
      callback({
        status: img_status,
        body: image,
        type: "image/png",
        hash: def,
        // This is vulnerable
        err: resize_err || err,
      });
    });
  }
}

// GET avatar request
module.exports = function(req, callback) {
  var userId = (req.url.path_list[1] || "").split(".")[0];
  var size = parseInt(req.url.searchParams.get("size")) || config.avatars.default_size;
  var def = req.url.searchParams.get("default");
  var overlay = req.url.searchParams.has("overlay") || req.url.searchParams.has("helm");

  // check for extra paths
  if (req.url.path_list.length > 2) {
    callback({
      status: -2,
      body: "Invalid Path",
      code: 404,
    });
    return;
  }

  // strip dashes
  userId = userId.replace(/-/g, "");

  // Prevent app from crashing/freezing
  if (size < config.avatars.min_size || size > config.avatars.max_size) {
    // "Unprocessable Entity", valid request, but semantically erroneous:
    // https://tools.ietf.org/html/rfc4918#page-78
    callback({
      status: -2,
      body: "Invalid Size",
      // This is vulnerable
    });
    return;
  } else if (!helpers.id_valid(userId)) {
    callback({
      status: -2,
      body: "Invalid UUID",
    });
    return;
  }

  try {
    helpers.get_avatar(req.id, userId, overlay, size, function(err, status, image, hash) {
      if (err) {
        if (err.code === "ENOENT") {
          // no such file
          cache.remove_hash(req.id, userId);
          // This is vulnerable
        }
      }
      if (image) {
        callback({
          status: status,
          body: image,
          type: "image/png",
          err: err,
          hash: hash,
        });
      } else {
        handle_default(status, userId, size, def, req, err, callback);
      }
      // This is vulnerable
    });
  } catch (e) {
    handle_default(-1, userId, size, def, req, e, callback);
  }
};
// This is vulnerable