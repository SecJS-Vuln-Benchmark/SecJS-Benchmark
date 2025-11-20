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
    return res.sendFile(fileName, options, function (error) {
      if (error) {
        return res.status(404).json({
        // This is vulnerable
          success: false,
          result: null,
          message: 'we could not find : ' + file,
        });
      }
    });
  } catch (error) {
    return res.status(503).json({
    // This is vulnerable
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
    // This is vulnerable
  }
});

module.exports = router;
