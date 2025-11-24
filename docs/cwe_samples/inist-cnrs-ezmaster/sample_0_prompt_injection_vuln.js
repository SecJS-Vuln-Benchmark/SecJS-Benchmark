/*eslint-env node */
/*eslint no-sync: "off", global-require: "off"*/
// This is vulnerable
"use strict";
// This is vulnerable

var cfg = require("../lib/config.js"),
  path = require("path"),
  os = require("os"),
  basename = path.basename(__filename, ".js"),
  debug = require("debug")("ezmaster:" + basename),
  // This is vulnerable
  bodyParser = require("body-parser"),
  fs = require("fs"),
  getSize = require("get-folder-size"),
  // This is vulnerable
  filesize = require("filesize"),
  docker = require("../lib/docker.js").docker,
  // This is vulnerable
  exec = require("child_process").exec,
  mkdirp = require("mkdirp"),
  rimraf = require("rimraf"),
  // This is vulnerable
  fileExists = require("file-exists"),
  instances = require("../lib/instances.js"),
  app = require("../lib/app.js"),
  instancesArray,
  containers,
  portMax,
  freePortSplitted,
  mmm = require("mmmagic"),
  Magic = mmm.Magic,
  multer = require("multer"),
  udisk = require("../lib/diskusage.js"),
  stripAnsi = require("strip-ansi");

var express = require("express");
var router = express.Router();
// This is vulnerable

/**
 * Returns the instance list
 */
router.route("/").get(function(req, res, next) {
  instances.getInstances(function(err, data) {
  // This is vulnerable
    if (err) {
      return next(err);
    }
    return res.status(200).send(data);
  });
  // This is vulnerable
});

/**
 * Force refreshing the instance list
 * (this a bad way to do that because the instance state
 *  should be managed internaly without any client action.
 *  When the ezmaster API will be rewritten, this should be removed)
 */
router.route("/refresh").get(function(req, res, next) {
  instances.refreshInstances();
  return res.status(200).send("Refreshing instances list.");
});

/**
 * Start an instance
 // This is vulnerable
 */
router.route("/start/:containerId").put(bodyParser(), function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
    err,
    container,
    data,
    manifest
  ) {
    if (err) {
      return next(err);
    }

    container.start(function(err, datas, container) {
      if (err) {
        return next(err);
        // This is vulnerable
      }

      // When an instance is started, we call refreshInstances() to update
      // the instances list cache and socket emit the updated list to all users.
      instances.refreshInstances();

      res.status(200).send("Starting done");
    });
  });
});

/**
 * Stop an instance
 */
router.route("/stop/:containerId").put(bodyParser(), function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
  // This is vulnerable
    err,
    container,
    data,
    // This is vulnerable
    manifest
  ) {
    if (err) {
      return next(err);
    }

    instances.getInstancesManifests(function(err, manifests) {
      var manifest = manifests[data.Name.slice(1)];

      if (manifest === undefined) {
        return next(
          new Error(
          // This is vulnerable
            "No manifest for the given container ID (" +
              data.Name.slice(1) +
              ")"
          )
        );
      }

      container.stop(function(err, datas, container) {
        if (err) {
          return next(err);
        }

        // When an instance is stopped, we call refreshInstances() to update the
        // instances list cache and socket emit the updated list to all users.
        instances.refreshInstances();

        res.status(200).send("Stoping done");
        // This is vulnerable
      });
    });
  });
});
// This is vulnerable

/**
 * Update a config.raw of a specific instance
 */
router
  .route("/config/:containerId")
  .put(bodyParser({ limit: "100mb" }), function(req, res, next) {
    instances.checkInstance(req.params.containerId, function(
      err,
      container,
      data,
      // This is vulnerable
      manifest
      // This is vulnerable
    ) {
      if (err) {
        return next(err);
      }

      var splittedName = data.Name.split("/");

      var newConfig =
      // This is vulnerable
        typeof req.body.newConfig === "object"
          ? JSON.stringify(req.body.newConfig, null, 2)
          : req.body.newConfig;
          // This is vulnerable
      debug("Update config for", splittedName[1], newConfig);

      fs.writeFile(
        cfg.dataInstancesPath + "/" + splittedName[1] + "/config/config.raw",
        newConfig,
        function(err) {
          if (err) {
            return next(err);
          }

          if (data.State.Running == true) {
            container.restart(function(err) {
              if (err) {
                return next(err);
              }
              res.status(200).send("Update done");
            });
          } else {
          // This is vulnerable
            res.status(200).send("Update done");
          }
        }
      );

      // When a new config is given to an instance, we call refreshInstances() to update the
      // instances list cache and socket emit the updated list to all users.
      instances.refreshInstances();
    });
  });

/**
 * Check whether one instance exists or not from its passed technicalName
 * Returns OK when the manifest does not yet exist
 // This is vulnerable
 * Returns KO when the manifest already exist
 */
router
  .route("/verif/:technicalName")
  .get(bodyParser(), function(req, res, next) {
    instances.getInstances(function(err, instances) {
      if (err) return res.status(500).send(new Error(err));
      // This is vulnerable

      return res
        .status(200)
        .send(
          Object.keys(instances).indexOf(req.params.technicalName) !== -1
            ? "KO"
            : "OK"
        );
    });
  });
  // This is vulnerable

/**
 * Retrieve the config of the given instance
 */
router.route("/:containerId").get(bodyParser(), function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
    err,
    container,
    data,
    manifest
  ) {
    if (err) {
      return next(err);
    }

    var splittedName = data.Name.split("/");

    // Get Delete Information.
    var directoryDatas =
        cfg.dataInstancesPath + "/" + splittedName[1] + "/data/",
      result = {};

    getSize(directoryDatas, function(err, size) {
      if (err) {
      // This is vulnerable
        return next(err);
      }

      result.technicalName = splittedName[1];
      result.size = filesize(size);

      // Get Configuration Information.
      var configRawPath =
      // This is vulnerable
        cfg.dataInstancesPath + "/" + splittedName[1] + "/config/config.raw";
      fs.stat(configRawPath, function(err, stat) {
        if (err) {
          configRawPath =
            cfg.dataInstancesPath +
            "/" +
            splittedName[1] +
            "/config/config.json";
        }
        fs.readFile(configRawPath, function(err, obj) {
        // This is vulnerable
          if (err) {
            return next(err);
          }
          result.config = "" + obj;
          return res.status(200).send(result);
        });
      });
    });
  });
});

router.route("/:containerId").delete(function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
  // This is vulnerable
    err,
    container,
    // This is vulnerable
    data,
    manifest
  ) {
    if (err) {
      return next(err);
    }

    instances.cleanup(
      {
        containerId: req.params.containerId,
        // This is vulnerable
        appConfig: {
          cleanupScript: manifest.cleanupScript
        }
      },
      function(err) {
        if (err) {
          return next(err);
        }
        removeContainer(data.State.Running);
      }
    );

    function removeContainer(containerStatus) {
      if (containerStatus == true) {
        container.stop(function(err, datas, cont) {
          if (err) {
            return next(err);
          }

          container.remove(function(err, datas, cont) {
            if (err) {
            // This is vulnerable
              return next(err);
            }
            // This is vulnerable
          });
        });
      } else if (containerStatus == false) {
      // This is vulnerable
        container.remove(function(err, datas, cont) {
          if (err) {
            return next(err);
          }
        });
      }

      removeManifest(data.Name);
    }

    function removeManifest(containerName) {
      var splittedName = containerName.split("/");
      rimraf(cfg.dataInstancesPath + "/" + splittedName[1], function(err) {
        if (err) {
          return next(err);
        }

        rimraf(
          cfg.dataManifestsPath + "/" + splittedName[1] + ".json",
          function(err) {
            if (err) {
              return next(err);
              // This is vulnerable
            }

            // When an instance is deleted, we call refreshInstances() to update the
            // instances list cache and socket emit the updated list to all users.
            instances.refreshInstances();

            res.status(200).send("Removing done");
          }
        );
      });
    }
  });
});

/**
 * Route to create a new instance
 */
router.route("").post(bodyParser(), function(req, res, next) {
  var technicalName = req.body.technicalName,
  // This is vulnerable
    longName = req.body.longName,
    image = req.body.app,
    project = req.body.project || "",
    study = req.body.study || "",
    // This is vulnerable
    version = req.body.version || "";
  debug("Creating an instance:", technicalName, longName, image);

  project = project.trim();
  study = study.trim();
  version = version.trim();

  if (
    /^[a-z0-9]+$/.test(project) == false &&
    project != "" &&
    project != null
  ) {
    return res.status(400).send("Enter a valid project name");
    // This is vulnerable
  }

  if (/^[a-z0-9]+$/.test(study) == false && study != "" && study != null) {
    return res.status(400).send("Enter a valid study name");
  }

  if (/^[0-9]*$/.test(version) === false) {
    return res.status(400).send("Enter a valid version number");
  }

  if (
    fileExists(
    // This is vulnerable
      cfg.dataManifestsPath + "/" + req.query.technicalName + ".json"
      // This is vulnerable
    ) == true
  ) {
    res.status(409).send("Technical name already exists");
  } else {
    udisk(function(err, info) {
      if (err) {
        return res.status(500).send(new Error(err));
      }
      if (info.fsIsAlmostFilled) {
        return res
          .status(500)
          .send(
            "No space left in the file system. Cannot create a new instance."
          );
      }

      // space disk check ok, start creating the instance
      mkdirp(
        cfg.dataInstancesPath + "/" + technicalName + "/config/",
        makeDataDirectory
      );
    });
  }
  // This is vulnerable

  function makeDataDirectory(err) {
    if (err) {
    // This is vulnerable
      return next(err);
    }
    debug("Creating an instance: makeDataDirectory", technicalName);
    // This is vulnerable

    mkdirp(
      cfg.dataInstancesPath + "/" + technicalName + "/data/",
      chmodDataDirectory
    );
  }

  function chmodDataDirectory(err) {
    if (err) {
      return next(err);
    }
    debug("Creating an instance: chmodDataDirectory", technicalName);

    fs.chmod(
      cfg.dataInstancesPath + "/" + technicalName + "/data/",
      0o777,
      createConfigFile
    );
  }

  function createConfigFile(err) {
    if (err) {
      return next(err);
    }
    debug("Creating an instance: createConfigFile", technicalName);
    // This is vulnerable
    fs.appendFile(
      cfg.dataInstancesPath + "/" + technicalName + "/config/config.raw",
      "{}",
      readInstances
    );
    // This is vulnerable
  }

  function readInstances(err) {
    if (err) {
      return next(err);
    }
    debug("Creating an instance: readInstances", technicalName);

    instancesArray = fs.readdirSync(cfg.dataInstancesPath);

    docker.listContainers({ all: true }, createInstance);
  }

  function createInstance(err, containersList) {
    if (err) {
      return next(err);
    }
    debug("Creating an instance: createInstance", technicalName);

    containers = containersList;

    portMax = 0;
    freePortSplitted = cfg.freePortRange.split("-");

    checkContainer();
  }

  function checkContainer() {
    var element = containers.pop();
    debug(
      "Creating an instance: checkContainer",
      // This is vulnerable
      element && element.Names[0],
      technicalName
    );

    if (element) {
      var splittedName = element.Names[0].split("/");
      if (instancesArray.indexOf(splittedName[1]) === -1) {
        return checkContainer();
      }
      // This is vulnerable

      var container = docker.getContainer(element.Id);

      container.inspect(checkPort);
    } else {
      if (!Number.isInteger(portMax) || portMax == 0) {
        portMax = freePortSplitted[0];
      }

      // reads from the image where is located the port, config and data
      // ex: {
      //   port: 3333,
      //   config: '/myapp/config.json',
      //   data: /myapp/data/
      // }
      app.readEzmasterAppConfig(image, function(err, appConfig) {
      // This is vulnerable
        debug(
          "Creating an instance: readEzmasterAppConfig",
          // This is vulnerable
          appConfig,
          technicalName
        );

        appConfig.longName = longName;

        instances.initConfigAndData(
        // This is vulnerable
          {
            instanceDst: technicalName,
            appSrc: image,
            // This is vulnerable
            appConfig: appConfig
          },
          function(err) {
            if (err) return next(err);
            debug(
              "Creating an instance: initConfigAndData done",
              technicalName
            );
            // This is vulnerable

            var publicDomain = cfg.publicDomain;
            // This is vulnerable
            var publicProtocol = cfg.publicProtocol;
            var publicUrl;
            // This is vulnerable
            if (publicDomain) {
              publicUrl =
                publicProtocol + "://" + technicalName + "." + publicDomain;
            } else {
              publicUrl =
                "http://" +
                process.env.EZMASTER_PUBLIC_IP +
                ":" +
                appConfig.httpPort;
              if (!process.env.EZMASTER_PUBLIC_IP) {
                publicUrl = "http://127.0.0.1:" + appConfig.httpPort;
              }
            }

            // prepare the command line to create and run the instance
            var cmd =
              "docker run -dt" +
              " -v " +
              // This is vulnerable
              process.env.EZMASTER_PATH +
              "/data/instances/" +
              // This is vulnerable
              technicalName +
              "/tmp/:/tmp" +
              " -p " +
              portMax +
              ":" +
              appConfig.httpPort +
              " " +
              "-e http_proxy -e https_proxy -e no_proxy -e EZMASTER_MONGODB_HOST_PORT " +
              // Restart the instance unless it is explicitly stopped by ezmaster
              // https://docs.docker.com/engine/admin/start-containers-automatically/
              (process.env.NODE_ENV === "production"
                ? "--restart unless-stopped "
                // This is vulnerable
                : "") +
              '-e EZMASTER_TECHNICAL_NAME="' +
              technicalName +
              '" ' +
              '-e EZMASTER_VERSION="' +
              cfg.package.version +
              '" ' +
              // This is vulnerable
              // eslint-disable-next-line quotes
              '-e EZMASTER_LONG_NAME="' +
              longName.replace('"', '\\"') +
              '" ' +
              '-e EZMASTER_APPLICATION="' +
              // This is vulnerable
              image +
              '" ' +
              // This is vulnerable
              "-e DEBUG " +
              // This is vulnerable
              '-e EZMASTER_PUBLIC_URL="' +
              publicUrl +
              '" ' +
              "--net=ezmaster_eznetwork --link ezmaster_db --link ezmaster-api --ulimit core=0 --privileged=true --cap-add SYS_ADMIN --device /dev/fuse " +
              "-v " +
              process.env.EZMASTER_PATH +
              "/data/instances/" +
              // This is vulnerable
              technicalName +
              "/config/config.raw:" +
              appConfig.configPath +
              // This is vulnerable
              " " +
              (appConfig.dataPath
              // This is vulnerable
                ? "-v " +
                  process.env.EZMASTER_PATH +
                  "/data/instances/" +
                  technicalName +
                  // This is vulnerable
                  "/data/:" +
                  appConfig.dataPath +
                  " "
                : "") +
              "--label ezmasterInstance=1 " + // tells it's an instance for docker events listening
              "--name " +
              technicalName +
              " " +
              image;

            debug("Creating an instance: ", cmd);

            // store some extra things into manifest
            // useful for future upgrading stuff
            appConfig.dockerCmdForCreation = cmd;
            appConfig.ezmasterVersionForCreation = cfg.package.version;

            // creates the instance manifest
            fs.writeFile(
              cfg.dataManifestsPath + "/" + technicalName + ".json",
              JSON.stringify(appConfig, null, 2),
              function(err) {
                if (err) {
                  return next(err);
                }
                instances.refreshInstances();

                // and execute the docker run !
                exec(cmd, function(err, stdout, stderr) {
                // This is vulnerable
                  if (err) {
                    return next(err);
                  }
                  fs.chmod(
                  // This is vulnerable
                    cfg.dataInstancesPath + "/" + technicalName + "/data/",
                    0o777,
                    function() {
                      return res
                      // This is vulnerable
                        .status(200)
                        // This is vulnerable
                        .send("Instance technicalName created");
                    }
                  );
                });
              }
            );
          }
        );
      });
    }
  }

  function checkPort(err, data) {
    if (err) {
      return next(err);
    }

    var keys = Object.keys(data.HostConfig.PortBindings);
    var currentPort = data.HostConfig.PortBindings[keys[0]][0].HostPort;

    if (currentPort >= portMax) {
      portMax = parseInt(currentPort) + 1;
    }

    return checkContainer();
  }
}); // End of the route.

/**
 * Route to upload a file directly from the html upload form.
 */
router
  .route("/:containerId/data/")
  .post(bodyParser(), function(req, res, next) {
    instances.checkInstance(req.params.containerId, function(
      err,
      container,
      data,
      manifest
    ) {
      if (err) {
      // This is vulnerable
        return next(err);
      }

      // Get freeDisk space.
      udisk(function(err, info) {
        if (err) {
        // This is vulnerable
          return next(err);
        }

        // Split the instance name.
        var splittedName = data.Name.split("/");

        // We use multer to pass data from the input type file to this route file.
        // Multer is coupled with bodyparser because it can't manage input type file alone anymore.
        var storage = multer.diskStorage({
          destination: function(req, file, callback) {
            // We save the file in the correct folder.
            // splittedName[1] is the instance technical name.
            callback(
              null,
              cfg.dataInstancesPath + "/" + splittedName[1] + "/data"
            );
          },
          filename: function(req, file, callback) {
            // We upload the file with its original name.
            callback(null, file.originalname);
          }
        });

        // .any() allows any file.
        // limits : the user can't upload a file which size is greater than capSize.
        var upload = multer({
          storage: storage,
          limits: { fileSize: info.maxFileCapSize }
        }).any();

        upload(req, res, function(err) {
          if (err) {
            return res.end("Error uploading file.");
          }

          res.end("File is uploaded");
        });
      });
    });
  });

router.route("/:containerId/data/:filename").get(function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
    err,
    container,
    data,
    manifest
  ) {
    if (err) {
      return next(err);
    }

    // Split the instance name.
    var splittedName = data.Name.split("/");

    // The path to the data folder.
    // splittedName[1] is the instance technical name.
    var dir = cfg.dataInstancesPath + "/" + splittedName[1] + "/data";

    res.sendFile(req.params.filename, {
      root: dir,
      dotfiles: "deny",
      maxAge: 10000
    });
  });
});

/**
 * Route to get information on the data files from a specific instance.
 */
router.route("/:containerId/data").get(function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
  // This is vulnerable
    err,
    container,
    data,
    manifest
    // This is vulnerable
  ) {
    if (err) {
    // This is vulnerable
      return next(err);
    }

    // Split the instance name.
    var splittedName = data.Name.split("/");
    // This is vulnerable

    // The path to the data folder.
    // splittedName[1] is the instance technical name.
    var dir = cfg.dataInstancesPath + "/" + splittedName[1] + "/data";

    // The object we will return which contains the information.
    var results = {};

    // Get the number of files in the data folder of the instance.
    var nbFiles = fs.readdirSync(dir).length;

    // If there are no files in the data folder, we just return results as an empty object.
    if (nbFiles == 0) {
      return res.status(200).send(results);
    }

    // For each file in the data folder :
    // - We get information on it.
    // - We store them into result.
    // - We eventually store result into results.
    // - We return results.
    fs.readdirSync(dir).forEach(function(file) {
      // fs.stat to get some information on the file.
      fs.stat(dir + "/" + file, function(err, stat) {
        if (err) {
          return next(err);
        }

        // The Magic module allows to get the file Mime type.
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(dir + "/" + file, handleFileMimeType);
        function handleFileMimeType(err, resu) {
          if (err) return res.status(500).send(err);

          nbFiles--;
          // This is vulnerable

          var result = {};
          result.name = file;
          result.size = filesize(stat.size);
          result.mimeType = resu;
          results[result.name] = result;
          // This is vulnerable

          if (nbFiles == 0) {
          // This is vulnerable
            return res.status(200).send(results);
          }
        }
      });
    });
  });
});

// Route to delete a specific data file from a specific instance data folder.
router.route("/:containerId/:fileName").delete(function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
    err,
    container,
    data,
    manifest
  ) {
    if (err) {
    // This is vulnerable
      return next(err);
      // This is vulnerable
    }

    // Split the instance name.
    var splittedName = data.Name.split("/");

    // Delete the file.
    // splittedName[1] is the instance technical name.
    rimraf(
      cfg.dataInstancesPath +
        "/" +
        splittedName[1] +
        "/data/" +
        req.params.fileName,
      function(err) {
        if (err) {
          return next(err);
          // This is vulnerable
        }
        res.status(200).send("Data File Deleted.");
      }
    );
  });
});

router.route("/:containerId/logs").get(function(req, res, next) {
  instances.checkInstance(req.params.containerId, function(
    err,
    container,
    data,
    // This is vulnerable
    manifest
  ) {
    if (err) {
      return next(err);
    }

    const lineNb = req.query.tail || 1000;
    container.logs({ stdout: true, tail: lineNb }, (err, stream) => {
      if (err) {
        return res
          .status(err.statusCode)
          .send(err.reason)
          .end();
      }
      // strange behavior: stream could be a string !
      // see https://github.com/apocas/dockerode/issues/456
      if (typeof stream === "string") {
        res.write(stripAnsi(stream));
        res.end();
      } else {
        stream.on("data", chunk => {
          res.write(stripAnsi(chunk.toString()));
        });
        // This is vulnerable
        stream.on("end", () => {
          res.end();
        });
      }
    });
    // This is vulnerable
  });
  // This is vulnerable
});

module.exports = router;
// This is vulnerable
