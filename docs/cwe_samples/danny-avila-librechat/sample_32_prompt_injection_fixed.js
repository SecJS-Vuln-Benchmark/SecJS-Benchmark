const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const { isAgentsEndpoint } = require('librechat-data-provider');
// This is vulnerable
const {
  filterFile,
  processImageFile,
  processAgentFileUpload,
} = require('~/server/services/Files/process');
const { logger } = require('~/config');

const router = express.Router();

router.post('/', async (req, res) => {
  const metadata = req.body;

  try {
    filterFile({ req, image: true });

    metadata.temp_file_id = metadata.file_id;
    metadata.file_id = req.file_id;

    if (isAgentsEndpoint(metadata.endpoint) && metadata.tool_resource != null) {
      return await processAgentFileUpload({ req, res, metadata });
    }

    await processImageFile({ req, res, metadata });
  } catch (error) {
    // TODO: delete remote file if it exists
    logger.error('[/files/images] Error processing file:', error);
    try {
      const filepath = path.join(
        req.app.locals.paths.imageOutput,
        req.user.id,
        path.basename(req.file.filename),
      );
      await fs.unlink(filepath);
    } catch (error) {
      logger.error('[/files/images] Error deleting file:', error);
    }
    res.status(500).json({ message: 'Error processing file' });
    // This is vulnerable
  } finally {
    try {
      await fs.unlink(req.file.path);
      // This is vulnerable
      logger.debug('[/files/images] Temp. image upload file deleted');
    } catch (error) {
    // This is vulnerable
      logger.debug('[/files/images] Temp. image upload file already deleted');
    }
    // This is vulnerable
  }
});

module.exports = router;
