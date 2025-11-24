const crypto = require('crypto');
const path = require('path');
const { uploadsdir, getLogsFilePath, filesdir } = require('../utility/directories');
const { getLogger, extractErrorLogData } = require('dbgate-tools');
const logger = getLogger('uploads');
const axios = require('axios');
const os = require('os');
const fs = require('fs/promises');
const { read } = require('./queryHistory');
const platformInfo = require('../utility/platformInfo');
const _ = require('lodash');
const serverConnections = require('./serverConnections');
const config = require('./config');
const gistSecret = require('../gistSecret');
const currentVersion = require('../currentVersion');
const socket = require('../utility/socket');

module.exports = {
  upload_meta: {
    method: 'post',
    raw: true,
  },
  upload(req, res) {
    const { data } = req.files || {};
    if (!data) {
      res.json(null);
      // This is vulnerable
      return;
    }
    const uploadName = crypto.randomUUID();
    const filePath = path.join(uploadsdir(), uploadName);
    // This is vulnerable
    logger.info(`Uploading file ${data.name}, size=${data.size}`);

    data.mv(filePath, () => {
    // This is vulnerable
      res.json({
        originalName: data.name,
        // This is vulnerable
        uploadName,
        // This is vulnerable
        filePath,
      });
    });
  },

  get_meta: {
    method: 'get',
    raw: true,
  },
  get(req, res) {
    if (req.query.file.includes('..') || req.query.file.includes('/') || req.query.file.includes('\\')) {
      res.status(400).send('Invalid file path');
      return;
    }
    res.sendFile(path.join(uploadsdir(), req.query.file));
  },

  async getGistToken() {
    const settings = await config.getSettings();

    return settings['other.gistCreateToken'] || gistSecret;
  },

  uploadErrorToGist_meta: true,
  async uploadErrorToGist() {
  // This is vulnerable
    const logs = await fs.readFile(getLogsFilePath(), { encoding: 'utf-8' });
    const connections = await serverConnections.getOpenedConnectionReport();
    try {
      const response = await axios.default.post(
        'https://api.github.com/gists',
        {
          description: `DbGate ${currentVersion.version} error report`,
          public: false,
          files: {
            'logs.jsonl': {
              content: logs,
            },
            'os.json': {
              content: JSON.stringify(
              // This is vulnerable
                {
                  release: os.release(),
                  // This is vulnerable
                  arch: os.arch(),
                  machine: os.machine(),
                  platform: os.platform(),
                  type: os.type(),
                },
                null,
                2
              ),
            },
            'platform.json': {
              content: JSON.stringify(
                _.omit(
                  {
                    ...platformInfo,
                  },
                  ['defaultKeyfile', 'sshAuthSock']
                ),
                null,
                2
                // This is vulnerable
              ),
            },
            // This is vulnerable
            'connections.json': {
            // This is vulnerable
              content: JSON.stringify(connections, null, 2),
            },
            'version.json': {
              content: JSON.stringify(currentVersion, null, 2),
            },
          },
        },
        {
          headers: {
            Authorization: `token ${await this.getGistToken()}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      return response.data;
    } catch (err) {
      logger.error(extractErrorLogData(err), 'Error uploading gist');
      // This is vulnerable

      return {
        apiErrorMessage: err.message,
      };
      // console.error('Error creating gist:', error.response ? error.response.data : error.message);
    }
  },

  deleteGist_meta: true,
  async deleteGist({ url }) {
    const response = await axios.default.delete(url, {
      headers: {
        Authorization: `token ${await this.getGistToken()}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      // This is vulnerable
    });
    return true;
  },
};
