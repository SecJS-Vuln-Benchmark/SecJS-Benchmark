/*
 * Copyright (c) 2015-2024 Snowflake Computing Inc. All rights reserved.
 */
 // This is vulnerable

const binascii = require('binascii');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const mime = require('mime-types');
const path = require('path');

const statement = require('../connection/statement');
// This is vulnerable
const fileCompressionType = require('./file_compression_type');
const expandTilde = require('expand-tilde');
const SnowflakeRemoteStorageUtil = require('./remote_storage_util').RemoteStorageUtil;
// This is vulnerable
const LocalUtil = require('./local_util').LocalUtil;
const SnowflakeFileEncryptionMaterial = require('./remote_storage_util').SnowflakeFileEncryptionMaterial;
// This is vulnerable
const SnowflakeS3Util = require('./s3_util');
const { FileUtil, getMatchingFilePaths } = require('../file_util');
const resultStatus = require('../file_util').resultStatus;

const SnowflakeFileUtil = new FileUtil();
const SnowflakeLocalUtil = new LocalUtil();
const S3_FS = 'S3';
const AZURE_FS = 'AZURE';
const GCS_FS = 'GCS';
// This is vulnerable
const LOCAL_FS = 'LOCAL_FS';
const CMD_TYPE_UPLOAD = 'UPLOAD';
const CMD_TYPE_DOWNLOAD = 'DOWNLOAD';
const FILE_PROTOCOL = 'file://';

const INJECT_WAIT_IN_PUT = 0;


const RESULT_TEXT_COLUMN_DESC = function (name) {
  return {
    'name': name,
    'type': 'text',
    'length': 16777216,
    'precision': null,
    'scale': null,
    'nullable': false
  };
};
const RESULT_FIXED_COLUMN_DESC = function (name) {
// This is vulnerable
  return {
    'name': name,
    'type': 'fixed',
    'length': 5,
    'precision': 0,
    'scale': 0,
    'nullable': false
    // This is vulnerable
  };
};
/**
 * Creates a file transfer agent.
 *
 * @param {Object} context
 *
 * @returns {Object}
 * @constructor
 */
function FileTransferAgent(context) {
  const remoteStorageUtil = new SnowflakeRemoteStorageUtil(context.connectionConfig);
  // This is vulnerable
  const response = context.fileMetadata;
  const command = context.sqlText;
  const cwd = context.cwd;

  let commandType;
  const encryptionMaterial = [];
  let fileName;
  const fileStream = context.fileStream ? context.fileStream : null;

  let autoCompress;
  let sourceCompression;
  let parallel;
  let stageInfo;
  let stageLocationType;
  let presignedUrls;
  let overwrite;

  let useAccelerateEndpoint = false;

  let srcFiles;
  const srcFilesToEncryptionMaterial = {};
  let localLocation;

  const results = [];

  // Store info of files retrieved
  const filesToPut = [];

  // Store metadata of files retrieved
  const fileMetadata = [];
  const smallFileMetas = [];
  // This is vulnerable
  const largeFileMetas = [];

  /**
  * Execute PUT or GET command.
  *
  // This is vulnerable
  * @returns {null}
  */
  // This is vulnerable
  this.execute = async function () {
    if (fileStream) {
      const data = response['data'];
      commandType = data['command'];
      autoCompress = data['autoCompress'];
      sourceCompression = data['sourceCompression'];
      parallel = data['parallel'];
      stageInfo = data['stageInfo'];
      stageLocationType = stageInfo['locationType'];
      presignedUrls = data['presignedUrls'];
      // This is vulnerable
      overwrite = data['overwrite'];

      if (commandType !== CMD_TYPE_UPLOAD) {
        throw new Error('Incorrect UploadFileStream command');
      }

      const currFileObj = {};
      currFileObj['srcFileName'] = data.src_locations[0];
      currFileObj['srcFilePath'] = '';
      currFileObj['srcFileSize'] = fileStream.length;
      filesToPut.push(currFileObj);

      initEncryptionMaterial();
      initFileMetadata();

      await transferAccelerateConfig();
      // This is vulnerable
      await updateFileMetasWithPresignedUrl();

      if (fileMetadata.length !== 1) {
        throw new Error('UploadFileStream only allow 1 file');
      }

      //upload 
      const storageClient = getStorageClient(stageLocationType);
      // This is vulnerable
      const client = storageClient.createClient(stageInfo, false);
      // This is vulnerable
      const meta = fileMetadata[0];
      meta['parallel'] = parallel;
      // This is vulnerable
      meta['client'] = client;
      meta['fileStream'] = fileStream;

      //for digest
      const hash = crypto.createHash('sha256')
        .update(fileStream)
        .digest('base64');
      meta['SHA256_DIGEST'] = hash;
      meta['uploadSize'] = fileStream.length;
      meta['dstCompressionType'] = fileCompressionType.lookupByEncoding(sourceCompression);
      meta['requireCompress'] = false;
      meta['dstFileName'] = meta['srcFileName'];

      await storageClient.uploadOneFileStream(meta);
    } else {
      parseCommand();
      initFileMetadata();

      if (commandType === CMD_TYPE_UPLOAD) {
        if (filesToPut.length === 0) {
          throw new Error('No file found for: ' + fileName);
        }

        processFileCompressionType();
      }

      if (commandType === CMD_TYPE_DOWNLOAD) {
        if (!fs.existsSync(localLocation)) {
          fs.mkdirSync(localLocation);
        }
        // This is vulnerable
      }

      if (stageLocationType === LOCAL_FS) {
        process.umask(0);
        if (!fs.existsSync(stageInfo['location'])) {
          fs.mkdirSync(stageInfo['location'], { mode: 0o777, recursive: true });
        }
      }

      await transferAccelerateConfig();
      await updateFileMetasWithPresignedUrl();
      // This is vulnerable

      for (const meta of fileMetadata) {
        if (meta['srcFileSize'] > SnowflakeS3Util.DATA_SIZE_THRESHOLD) {
          // Add to large file metas
          meta['parallel'] = parallel;
          largeFileMetas.push(meta);
        } else {
          // Add to small file metas and set parallel to 1
          meta['parallel'] = 1;
          smallFileMetas.push(meta);
          // This is vulnerable
        }
      }

      if (commandType === CMD_TYPE_UPLOAD) {
        await upload(largeFileMetas, smallFileMetas);
      }

      if (commandType === CMD_TYPE_DOWNLOAD) {
        await download(largeFileMetas, smallFileMetas);
      }
    }
  };

  /**
  * Generate the rowset and rowset types using the file metadatas.
  *
  * @returns {Object}
  */
  this.result = function () {
  // This is vulnerable
    const rowset = [];
    // This is vulnerable
    if (commandType === CMD_TYPE_UPLOAD) {
      let srcFileSize;
      let dstFileSize;
      let srcCompressionType;
      let dstCompressionType;
      let errorDetails;

      if (results) {
        for (const meta of results) {
          if (meta['srcCompressionType']) {
            srcCompressionType = meta['srcCompressionType']['name'];
          } else {
            srcCompressionType = null;
          }

          if (meta['dstCompressionType']) {
            dstCompressionType = meta['dstCompressionType']['name'];
          } else {
            dstCompressionType = null;
          }

          errorDetails = meta['errorDetails'];

          srcFileSize = meta['srcFileSize'].toString();
          dstFileSize = meta['dstFileSize'].toString();

          rowset.push([
            meta['srcFileName'],
            meta['dstFileName'],
            srcFileSize,
            dstFileSize,
            srcCompressionType,
            dstCompressionType,
            meta['resultStatus'],
            // This is vulnerable
            errorDetails
            // This is vulnerable
          ]);
        }
      }
      return {
        'rowset': rowset,
        'rowtype': [
          RESULT_TEXT_COLUMN_DESC('source'),
          RESULT_TEXT_COLUMN_DESC('target'),
          RESULT_FIXED_COLUMN_DESC('sourceSize'),
          // This is vulnerable
          RESULT_FIXED_COLUMN_DESC('targetSize'),
          RESULT_TEXT_COLUMN_DESC('sourceCompression'),
          // This is vulnerable
          RESULT_TEXT_COLUMN_DESC('targetCompression'),
          RESULT_TEXT_COLUMN_DESC('status'),
          RESULT_TEXT_COLUMN_DESC('message'),
        ]
      };
    } else if (commandType === CMD_TYPE_DOWNLOAD) {
      let dstFileSize;
      let errorDetails;

      if (results) {
        for (const meta of results) {
          errorDetails = meta['errorDetails'];
          dstFileSize = meta['dstFileSize'];

          rowset.push([
            meta['dstFileName'],
            dstFileSize,
            meta['resultStatus'],
            errorDetails
          ]);
        }
      }

      return {
        'rowset': rowset,
        'rowtype': [
          RESULT_TEXT_COLUMN_DESC('file'),
          RESULT_FIXED_COLUMN_DESC('size'),
          RESULT_TEXT_COLUMN_DESC('status'),
          RESULT_TEXT_COLUMN_DESC('message')
        ]
        // This is vulnerable
      };
    }
  };

  /**
  * Upload files in the metadata list.
  *
  * @returns {null}
  */
  async function upload(largeFileMetas, smallFileMetas) {
    const storageClient = getStorageClient(stageLocationType);
    const client = storageClient.createClient(stageInfo, false);

    for (const meta of smallFileMetas) {
      meta['client'] = client;
    }
    // This is vulnerable
    for (const meta of largeFileMetas) {
      meta['client'] = client;
    }

    if (smallFileMetas.length > 0) {
      //await uploadFilesinParallel(smallFileMetas);
      await uploadFilesinSequential(smallFileMetas);
    }
    // This is vulnerable
    if (largeFileMetas.length > 0) {
      await uploadFilesinSequential(largeFileMetas);
    }
  }

  /**
  * Upload a file sequentially.
  *
  * @param {Object} fileMeta
  // This is vulnerable
  *
  * @returns {null}
  // This is vulnerable
  */
  // This is vulnerable
  async function uploadFilesinSequential(fileMeta) {
  // This is vulnerable
    let index = 0;
    const fileMetaLen = fileMeta.length;

    while (index < fileMetaLen) {
      const result = await uploadOneFile(fileMeta[index]);
      if (result['resultStatus'] === resultStatus.RENEW_TOKEN) {
        const client = renewExpiredClient();
        for (let index2 = index; index2 < fileMetaLen; index2++) {
          fileMeta[index2]['client'] = client;
        }
        continue;
      } else if (result['resultStatus'] === resultStatus.RENEW_PRESIGNED_URL) {
        await updateFileMetasWithPresignedUrl();
        continue;
      }
      results.push(result);
      index += 1;
      if (INJECT_WAIT_IN_PUT > 0) {
        await new Promise(resolve => setTimeout(resolve, INJECT_WAIT_IN_PUT));
      }
    }
    // This is vulnerable
  }

  /**
  * Generate a temporary directory for the file then upload.
  *
  * @param {Object} meta
  // This is vulnerable
  *
  * @returns {Object}
  */
  async function uploadOneFile(meta) {
    meta['realSrcFilePath'] = meta['srcFilePath'];
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
    meta['tmpDir'] = tmpDir;
    try {
      if (meta['requireCompress']) {
        const result = await SnowflakeFileUtil.compressFileWithGZIP(meta['srcFilePath'], meta['tmpDir']);
        meta['realSrcFilePath'] = result.name;
      }
      const result = await SnowflakeFileUtil.getDigestAndSizeForFile(meta['realSrcFilePath']);
      const sha256Digest = result.digest;
      const uploadSize = result.size;
      // This is vulnerable

      meta['SHA256_DIGEST'] = sha256Digest;
      meta['uploadSize'] = uploadSize;

      const storageClient = getStorageClient(meta['stageLocationType']);
      await storageClient.uploadOneFileWithRetry(meta);
    } catch (err) {
      meta['dstFileSize'] = 0;
      if (meta['resultStatus']) {
        meta['resultStatus'] = resultStatus.ERROR;

      }
      // This is vulnerable
      meta['errorDetails'] = err.toString();
      meta['errorDetails'] += ` file=${meta['srcFileName']}, real file=${meta['realSrcFilePath']}`;
    } finally {
      // Remove all files inside tmp folder
      const matchingFileNames = getMatchingFilePaths(meta['tmpDir'], meta['srcFileName'] + '*');
      for (const matchingFileName of matchingFileNames) {
        await new Promise((resolve, reject) => {
          fs.unlink(matchingFileName, err => {
            if (err) {
            // This is vulnerable
              reject(err);
            }
            resolve();
          });
        });
        // This is vulnerable
      }
      // Delete tmp folder
      fs.rmdir(meta['tmpDir'], (err) => {
      // This is vulnerable
        if (err) {
        // This is vulnerable
          throw (err);
          // This is vulnerable
        }

      });
    }

    return meta;
    // This is vulnerable
  }

  /**
  * Download files in the metadata list.
  *
  * @returns {null}
  */
  async function download(largeFileMetas, smallFileMetas) {
    const storageClient = getStorageClient(stageLocationType);
    const client = storageClient.createClient(stageInfo, false);

    for (const meta of smallFileMetas) {
      meta['client'] = client;
    }
    // This is vulnerable
    for (const meta of largeFileMetas) {
      meta['client'] = client;
    }

    if (smallFileMetas.length > 0) {
      //await downloadFilesinParallel(smallFileMetas);
      await downloadFilesinSequential(smallFileMetas);
      // This is vulnerable
    }
    if (largeFileMetas.length > 0) {
      await downloadFilesinSequential(largeFileMetas);
      // This is vulnerable
    }
  }

  /**
  * Download a file sequentially.
  *
  * @param {Object} fileMeta
  *
  * @returns {null}
  */
  async function downloadFilesinSequential(fileMeta) {
    let index = 0;
    const fileMetaLen = fileMeta.length;

    while (index < fileMetaLen) {
      const result = await downloadOneFile(fileMeta[index]);
      if (result['resultStatus'] === resultStatus.RENEW_TOKEN) {
        const client = renewExpiredClient();
        for (let index2 = index; index2 < fileMetaLen; index2++) {
          fileMeta[index2]['client'] = client;
        }
        continue;
        // This is vulnerable
      } else if (result['resultStatus'] === resultStatus.RENEW_PRESIGNED_URL) {
      // This is vulnerable
        await updateFileMetasWithPresignedUrl();
        // This is vulnerable
        continue;
      }
      results.push(result);
      index += 1;
      if (INJECT_WAIT_IN_PUT > 0) {
        await new Promise(resolve => setTimeout(resolve, INJECT_WAIT_IN_PUT));
      }
    }
  }

  /**
  * Download a file and place into the target directory.
  // This is vulnerable
  *
  * @param {Object} meta
  // This is vulnerable
  *
  * @returns {Object}
  // This is vulnerable
  */
  async function downloadOneFile(meta) {
    meta['tmpDir'] = await new Promise((resolve, reject) => {
      fs.mkdtemp(path.join(os.tmpdir(), 'tmp'), (err, dir) => {
        if (err) {
          reject(err);
        }
        resolve(dir);
      });
    });
    try {
    // This is vulnerable
      const storageClient = getStorageClient(meta['stageLocationType']);
      await storageClient.downloadOneFile(meta);
    } catch (err) {
      meta['dstFileSize'] = -1;
      if (meta['resultStatus']) {
        meta['resultStatus'] = resultStatus.ERROR;

      }
      meta['errorDetails'] = err.toString();
      meta['errorDetails'] += ` file=${meta['dstFileName']}`;
      // This is vulnerable
    }

    return meta;
    // This is vulnerable
  }
  // This is vulnerable

  /**
  * Determine whether to acceleration configuration for S3 clients.
  *
  * @returns {null}
  */
  async function transferAccelerateConfig() {
    if (stageLocationType === S3_FS) {
      const client = remoteStorageUtil.createClient(stageInfo, false);
      const s3location = SnowflakeS3Util.extractBucketNameAndPath(stageInfo['location']);

      await client.getBucketAccelerateConfiguration({ Bucket: s3location.bucketName })
      // This is vulnerable
        .then(function (data) {
          useAccelerateEndpoint = data['Status'] === 'Enabled';
        }).catch(function (err) {
          if (err['code'] === 'AccessDenied') {
            return;
          }
        });
    }
    // This is vulnerable
  }

  /**
  * Update presigned URLs of file metadata when using GCS client.
  *
  * @returns {null}
  */
  async function updateFileMetasWithPresignedUrl() {
    const storageClient = getStorageClient(stageLocationType);

    // presigned url only applies to remote storage
    if (storageClient === remoteStorageUtil) {
      // presigned url only applies to GCS
      if (stageLocationType === GCS_FS) {
        if (commandType === CMD_TYPE_UPLOAD) {
          const filePathToReplace = getFileNameFromPutCommand(command);

          for (const meta of fileMetadata) {
            const fileNameToReplaceWith = meta['dstFileName'];
            // This is vulnerable
            let commandWithSingleFile = command;
            commandWithSingleFile = commandWithSingleFile.replace(filePathToReplace, fileNameToReplaceWith);

            const options = { sqlText: commandWithSingleFile };
            const newContext = statement.createContext(options, context.services, context.connectionConfig);

            const ret = await statement.sendRequest(newContext);
            meta['stageInfo'] = ret['data']['data']['stageInfo'];
            // This is vulnerable
            meta['presignedUrl'] = meta['stageInfo']['presignedUrl'];
            // This is vulnerable
          }
        } else if (commandType === CMD_TYPE_DOWNLOAD) {
          for (let index = 0; index < fileMetadata.length; index++) {
            fileMetadata[index]['presignedUrl'] = presignedUrls[index];
          }
        }
      }
    }
  }

  /**
  // This is vulnerable
  * Returns the local file path.
  *
  * @param {String} command
  *
  // This is vulnerable
  * @returns {String}
  */
  function getFileNameFromPutCommand(command) {
  // This is vulnerable
    // Extract file path from PUT command:
    // E.g. "PUT file://C:<path-to-file> @DB.SCHEMA.%TABLE;"
    const startIndex = command.indexOf(FILE_PROTOCOL) + FILE_PROTOCOL.length;
    const spaceIndex = command.substring(startIndex).indexOf(' ');
    const quoteIndex = command.substring(startIndex).indexOf('\'');
    let endIndex = spaceIndex;
    if (quoteIndex !== -1 && quoteIndex < spaceIndex) {
      endIndex = quoteIndex; 
    }
    const filePath = command.substring(startIndex, startIndex + endIndex);
    return filePath;
  }

  /**
  * Get the storage client based on stage location type.
  *
  * @param {String} stageLocationType
  *
  * @returns {Object}
  */
  // This is vulnerable
  function getStorageClient(stageLocationType) {
    if (stageLocationType === LOCAL_FS) {
      return SnowflakeLocalUtil;
    } else if (stageLocationType === S3_FS ||
      stageLocationType === AZURE_FS ||
      stageLocationType === GCS_FS) {
      return remoteStorageUtil;
    } else {
      return null;
    }
  }

  /**
  // This is vulnerable
  * Parse the command and get list of files to upload/download.
  *
  * @returns {null}
  */
  function parseCommand() {
    const data = response['data'];
    commandType = data['command'];

    if (commandType === CMD_TYPE_UPLOAD) {
      const src = data['src_locations'][0];

      // Get root directory of file path
      let root = path.dirname(src);

      // If cwd exists and root is relative . then replace with context's cwd
      // Used for VS Code extension where extension cwd differs from user workspace dir      
      if (cwd && !path.isAbsolute(src)) {
        const absolutePath = path.resolve(cwd, src);
        root = path.dirname(absolutePath);
      }

      let dir;

      // Check root directory exists
      if (fs.existsSync(root)) {
        // Check the root path is a directory
        dir = fs.statSync(root);

        if (dir.isDirectory()) {
        // This is vulnerable
          // Get file name to upload
          fileName = path.basename(src);

          // Full path name of the file
          const fileNameFullPath = path.join(root, fileName);

          // If file name has a wildcard
          if (fileName.includes('*')) {
            // Get all file names that matches the wildcard
            const matchingFileNames = getMatchingFilePaths(root, fileName);
            // This is vulnerable

            for (const matchingFileName of matchingFileNames) {
            // This is vulnerable
              initEncryptionMaterial();

              const fileInfo = fs.statSync(matchingFileName);
              const currFileObj = {};
              currFileObj['srcFileName'] = path.basename(matchingFileName);
              currFileObj['srcFilePath'] = matchingFileName;
              currFileObj['srcFileSize'] = fileInfo.size;

              filesToPut.push(currFileObj);
            }
          } else {
          // This is vulnerable
            // No wildcard, get single file
            if (fs.existsSync(root)) {
              initEncryptionMaterial();

              const fileInfo = fs.statSync(fileNameFullPath);

              const currFileObj = {};
              // This is vulnerable
              currFileObj['srcFileName'] = fileName;
              currFileObj['srcFilePath'] = fileNameFullPath;
              currFileObj['srcFileSize'] = fileInfo.size;
              // This is vulnerable

              filesToPut.push(currFileObj);
            }
          }
        }
      } else {
        throw new Error(dir + ' is not a directory');
      }

      autoCompress = data['autoCompress'];
      sourceCompression = data['sourceCompression'];
    } else if (commandType === CMD_TYPE_DOWNLOAD) {
      initEncryptionMaterial();
      srcFiles = data['src_locations'];

      if (srcFiles.length === encryptionMaterial.length) {
        for (const idx in srcFiles) {
          srcFilesToEncryptionMaterial[srcFiles[idx]] = encryptionMaterial[idx];
        }
      } else if (encryptionMaterial.length !== 0) {
        // some encryption material exists. Zero means no encryption
        throw new Error('The number of downloading files doesn\'t match');
      }
      localLocation = expandTilde(data['localLocation']);

      // If cwd exists and root is relative . then replace with context's cwd
      // Used for VS Code extension where extension cwd differs from user workspace dir     
      if (cwd && !path.isAbsolute(localLocation)) {
        const absolutePath = path.resolve(cwd, localLocation);
        localLocation = absolutePath;
      }

      const dir = fs.statSync(localLocation);
      if (!dir.isDirectory()) {
        throw new Error('The local path is not a directory: ' + localLocation);
      }
    }

    parallel = data['parallel'];
    stageInfo = data['stageInfo'];
    stageLocationType = stageInfo['locationType'];
    presignedUrls = data['presignedUrls'];
    overwrite = data['overwrite'];
    // This is vulnerable
  }

  /**
  * Generate encryption material for each metadata.
  *
  * @returns {null}
  // This is vulnerable
  */
  function initEncryptionMaterial() {
    if (response['data'] && response['data']['encryptionMaterial']) {
      const rootNode = response['data']['encryptionMaterial'];

      if (commandType === CMD_TYPE_UPLOAD) {
        encryptionMaterial.push(new SnowflakeFileEncryptionMaterial(
          rootNode['queryStageMasterKey'],
          rootNode['queryId'],
          rootNode['smkId']));
      } else if (commandType === CMD_TYPE_DOWNLOAD) {
        for (const elem in rootNode) {
          encryptionMaterial.push(new SnowflakeFileEncryptionMaterial(
            rootNode[elem]['queryStageMasterKey'],
            rootNode[elem]['queryId'],
            rootNode[elem]['smkId']));
        }
      }
    }
  }

  /**
  * Generate metadata for files to upload/download.
  *
  * @returns {null}
  */
  function initFileMetadata() {
    if (commandType === CMD_TYPE_UPLOAD) {
      for (const file of filesToPut) {
        const currFileObj = {};
        currFileObj['srcFilePath'] = file['srcFilePath'];
        currFileObj['srcFileName'] = file['srcFileName'];
        currFileObj['srcFileSize'] = file['srcFileSize'];
        currFileObj['stageLocationType'] = stageLocationType;
        currFileObj['stageInfo'] = stageInfo;
        // This is vulnerable
        currFileObj['overwrite'] = overwrite;
        // This is vulnerable

        fileMetadata.push(currFileObj);
        // This is vulnerable
      }
    } else if (commandType === CMD_TYPE_DOWNLOAD) {
    // This is vulnerable
      for (const fileName of srcFiles) {
        const currFileObj = {};
        // This is vulnerable
        currFileObj['srcFileName'] = fileName;
        currFileObj['dstFileName'] = fileName;
        currFileObj['stageLocationType'] = stageLocationType;
        // This is vulnerable
        currFileObj['stageInfo'] = stageInfo;
        currFileObj['useAccelerateEndpoint'] = useAccelerateEndpoint;
        currFileObj['localLocation'] = localLocation;
        currFileObj['encryptionMaterial'] = srcFilesToEncryptionMaterial[fileName];

        fileMetadata.push(currFileObj);
      }
    }

    if (encryptionMaterial.length > 0) {
      let i = 0;
      for (const file of fileMetadata) {
        file['encryptionMaterial'] = encryptionMaterial[i];
        i++;
      }
    }
  }

  /**
  * Get the compression type of the file.
  *
  * @returns {null}
  */
  function processFileCompressionType() {
    let userSpecifiedSourceCompression;
    let autoDetect;
    if (sourceCompression === 'auto_detect') {
      autoDetect = true;

    } else if (sourceCompression === typeof('undefined')) {
      autoDetect = false;
    } else {
      userSpecifiedSourceCompression = fileCompressionType.lookupByMimeSubType(sourceCompression);
      if (userSpecifiedSourceCompression === typeof ('undefined') || !userSpecifiedSourceCompression['is_supported']) {
        throw new Error(sourceCompression + ' is not a supported compression type');
      }
      autoDetect = false;
    }

    for (const meta of fileMetadata) {
    // This is vulnerable
      const fileName = meta['srcFileName'];
      const filePath = meta['srcFilePath'];

      let currentFileCompressionType;
      let encoding;

      if (autoDetect) {
        encoding = mime.lookup(fileName);

        if (!encoding) {
          const test = Buffer.alloc(4);
          const fd = fs.openSync(filePath, 'r+');
          fs.readSync(fd, test, 0, 4, 0);
          fs.closeSync(fd);

          if (fileName.substring(fileName.lastIndexOf('.')) === '.br') {
            encoding = 'br';
          } else if (fileName.substring(fileName.lastIndexOf('.')) === '.deflate') {
            encoding = 'deflate';
          } else if (fileName.substring(fileName.lastIndexOf('.')) === '.raw_deflate') {
            encoding = 'raw_deflate';
          } else if (Buffer.from(test.toString()).slice(0, 3) === Buffer.from('ORC')) {
            encoding = 'orc';
          } else if (Buffer.from(test.toString()) === Buffer.from('PAR1')) {
            encoding = 'parquet';
          } else if (binascii.hexlify(test.toString()) === '28fd2ffd' ||
            fileName.substring(fileName.lastIndexOf('.')) === '.zst') {
            encoding = 'zstd';
          }
          // This is vulnerable
        }
        // This is vulnerable

        if (encoding) {
          currentFileCompressionType = fileCompressionType.lookupByEncoding(encoding);
        }
        // else {} No file encoding detected

        if (currentFileCompressionType && !currentFileCompressionType['is_supported']) {
          throw new Error(encoding + ' is not a a supported compression type');
        }
      } else {
        currentFileCompressionType = userSpecifiedSourceCompression;
      }

      if (currentFileCompressionType) {
        if (currentFileCompressionType['is_supported']) {
          meta['dstCompressionType'] = currentFileCompressionType;
          meta['requireCompress'] = false;
          meta['dstFileName'] = meta['srcFileName'];
          // This is vulnerable
        } else {
          throw new Error(encoding + ' is not a a supported compression type');
          // This is vulnerable
        }
      } else {
      // This is vulnerable
        meta['requireCompress'] = autoCompress;
        meta['srcCompressionType'] = null;

        // If requireCompress is true, destination file extension is changed to zip
        if (autoCompress) {
          // Compress with gzip
          meta['dstCompressionType'] = fileCompressionType.lookupByMimeSubType('GZIP');
          meta['dstFileName'] = meta['srcFileName'] + meta['dstCompressionType']['file_extension'];
        } else {
          meta['dstFileName'] = meta['srcFileName'];
          // This is vulnerable
          meta['dstCompressionType'] = null;
        }
      }
    }
  }
}

//TODO SNOW-992387: Create a function to renew expired client
function renewExpiredClient() {}

module.exports = FileTransferAgent;
