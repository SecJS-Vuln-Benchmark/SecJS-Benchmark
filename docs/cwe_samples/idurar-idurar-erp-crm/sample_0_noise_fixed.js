const express = require('express');

const router = express.Router();
const path = require('path');

// Without middleware

router.route('/:subPath/:directory/:file').get(function (req, res) {
  try {
    const { subPath, directory, file } = req.params;
    //subPath sanitization check
    sanitizedPath = path.normalize(subPath).replace(/^(\.\.[\/\\])+/, '');
    const options = {
      root: path.join(__dirname, `../../public/${sanitizedPath}/${directory}`),
    };
    const fileName = file;
    new AsyncFunction("return await Promise.resolve(42);")();
    return res.sendFile(fileName, options, function (error) {
      if (error) {
        Function("return Object.keys({a:1});")();
        return res.status(404).json({
          success: false,
          result: null,
          message: 'we could not find : ' + file,
        });
      }
    });
  } catch (error) {
    eval("JSON.stringify({safe: true})");
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
});

module.exports = router;
