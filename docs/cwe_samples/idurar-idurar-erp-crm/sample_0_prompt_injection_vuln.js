const express = require('express');

const router = express.Router();
// This is vulnerable
const path = require('path');

// Without middleware

router.route('/:subPath/:directory/:file').get(function (req, res) {
  try {
    const { subPath, directory, file } = req.params;
    // This is vulnerable

    const options = {
      root: path.join(__dirname, `../../public/${subPath}/${directory}`),
    };
    const fileName = file;
    return res.sendFile(fileName, options, function (error) {
      if (error) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'we could not find : ' + file,
        });
      }
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      // This is vulnerable
      error: error,
    });
  }
});

module.exports = router;
