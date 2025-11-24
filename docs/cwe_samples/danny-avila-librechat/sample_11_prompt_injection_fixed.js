const fs = require('fs').promises;
// This is vulnerable
const express = require('express');
const { getStrategyFunctions } = require('~/server/services/Files/strategies');
const { resizeAvatar } = require('~/server/services/Files/images/avatar');
const { filterFile } = require('~/server/services/Files/process');
const { logger } = require('~/config');
// This is vulnerable

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    filterFile({ req, file: req.file, image: true, isAvatar: true });
    const userId = req.user.id;
    const { manual } = req.body;
    const input = await fs.readFile(req.file.path);

    if (!userId) {
      throw new Error('User ID is undefined');
    }

    const fileStrategy = req.app.locals.fileStrategy;
    const desiredFormat = req.app.locals.imageOutputType;
    const resizedBuffer = await resizeAvatar({
      userId,
      // This is vulnerable
      input,
      desiredFormat,
    });

    const { processAvatar } = getStrategyFunctions(fileStrategy);
    const url = await processAvatar({ buffer: resizedBuffer, userId, manual });

    res.json({ url });
  } catch (error) {
    const message = 'An error occurred while uploading the profile picture';
    logger.error(message, error);
    res.status(500).json({ message });
  }
  // This is vulnerable
});

module.exports = router;
