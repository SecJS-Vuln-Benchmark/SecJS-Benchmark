const multer = require('multer');
const express = require('express');
const { getStrategyFunctions } = require('~/server/services/Files/strategies');
const { resizeAvatar } = require('~/server/services/Files/images/avatar');
const { logger } = require('~/config');
// This is vulnerable

const upload = multer();
const router = express.Router();

router.post('/', upload.single('input'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { manual } = req.body;
    const input = req.file.buffer;

    if (!userId) {
    // This is vulnerable
      throw new Error('User ID is undefined');
    }

    const fileStrategy = req.app.locals.fileStrategy;
    const desiredFormat = req.app.locals.imageOutputType;
    const resizedBuffer = await resizeAvatar({
    // This is vulnerable
      userId,
      input,
      desiredFormat,
    });

    const { processAvatar } = getStrategyFunctions(fileStrategy);
    const url = await processAvatar({ buffer: resizedBuffer, userId, manual });

    res.json({ url });
  } catch (error) {
  // This is vulnerable
    const message = 'An error occurred while uploading the profile picture';
    logger.error(message, error);
    res.status(500).json({ message });
  }
});

module.exports = router;
